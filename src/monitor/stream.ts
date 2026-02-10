import type { TlonPokeApi } from "../urbit/send.js";
import { editGroupMessage, sendGroupMessage } from "../urbit/send.js";
import { scot, da } from "@urbit/aura";

const DEFAULT_THROTTLE_MS = 500;
const MIN_CHARS_FOR_INITIAL = 20;

export type TlonStreamHandle = {
  update: (text: string) => void;
  flush: () => Promise<void>;
  stop: () => void;
};

export type TlonStreamParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  replyToId?: string | null;
  throttleMs?: number;
  log?: (message: string) => void;
  warn?: (message: string) => void;
};

/**
 * Create a streaming message handler for Tlon group channels.
 * Sends an initial message on first update, then edits it as content grows.
 * 
 * Note: Only works for group channels. DMs don't support editing.
 */
export function createTlonStream(params: TlonStreamParams): TlonStreamHandle {
  const throttleMs = Math.max(100, params.throttleMs ?? DEFAULT_THROTTLE_MS);

  let lastSentText = "";
  let lastSentAt = 0;
  let pendingText = "";
  let inFlight = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  // Track the message we're editing
  let sentMessageId: string | null = null;
  let sentTimestamp: number | null = null;

  const sendOrEdit = async (text: string) => {
    if (stopped) {return;}
    
    const trimmed = text.trimEnd();
    if (!trimmed) {return;}
    if (trimmed === lastSentText) {return;}

    lastSentText = trimmed;
    lastSentAt = Date.now();

    try {
      if (!sentMessageId) {
        // First message - send new post
        const now = Date.now();
        await sendGroupMessage({
          api: params.api,
          fromShip: params.fromShip,
          hostShip: params.hostShip,
          channelName: params.channelName,
          text: trimmed,
          replyToId: params.replyToId,
        });
        
        // Convert unix timestamp to @ud format for editing
        sentTimestamp = now;
        sentMessageId = scot("ud", da.fromUnix(now));
        
        params.log?.(`tlon stream: sent initial message (id=${sentMessageId})`);
      } else {
        // Edit existing message
        await editGroupMessage({
          api: params.api,
          fromShip: params.fromShip,
          hostShip: params.hostShip,
          channelName: params.channelName,
          postId: sentMessageId,
          sentAt: sentTimestamp!,
          text: trimmed,
          replyToId: params.replyToId,
        });
        params.log?.(`tlon stream: edited message (id=${sentMessageId})`);
      }
    } catch (err) {
      stopped = true;
      params.warn?.(
        `tlon stream failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const flush = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (inFlight) {
      schedule();
      return;
    }
    const text = pendingText;
    const trimmed = text.trim();
    if (!trimmed) {
      if (pendingText === text) {
        pendingText = "";
      }
      if (pendingText) {
        schedule();
      }
      return;
    }
    pendingText = "";
    inFlight = true;
    try {
      await sendOrEdit(text);
    } finally {
      inFlight = false;
    }
    if (pendingText) {
      schedule();
    }
  };

  const schedule = () => {
    if (timer) {return;}
    const delay = Math.max(0, throttleMs - (Date.now() - lastSentAt));
    timer = setTimeout(() => {
      void flush();
    }, delay);
  };

  const update = (text: string) => {
    if (stopped) {return;}
    
    // Wait for minimum content before sending initial message
    if (!sentMessageId && text.trim().length < MIN_CHARS_FOR_INITIAL) {
      pendingText = text;
      return;
    }
    
    pendingText = text;
    if (inFlight) {
      schedule();
      return;
    }
    if (!timer && Date.now() - lastSentAt >= throttleMs) {
      void flush();
      return;
    }
    schedule();
  };

  const stop = () => {
    stopped = true;
    pendingText = "";
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  params.log?.(
    `tlon stream ready (throttleMs=${throttleMs})`
  );

  return { update, flush, stop };
}
