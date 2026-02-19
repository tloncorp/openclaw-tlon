import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
import { logWebSelfId, sendMessageWhatsApp } from "../channels/web/index.js";
import { sendMessageDiscord } from "../discord/send.js";
import { sendMessageIMessage } from "../imessage/send.js";
import { sendMessageSignal } from "../signal/send.js";
import { sendMessageSlack } from "../slack/send.js";
import { sendMessageTelegram } from "../telegram/send.js";
export type CliDeps = {
    sendMessageWhatsApp: typeof sendMessageWhatsApp;
    sendMessageTelegram: typeof sendMessageTelegram;
    sendMessageDiscord: typeof sendMessageDiscord;
    sendMessageSlack: typeof sendMessageSlack;
    sendMessageSignal: typeof sendMessageSignal;
    sendMessageIMessage: typeof sendMessageIMessage;
};
export declare function createDefaultDeps(): CliDeps;
export declare function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps;
export { logWebSelfId };
