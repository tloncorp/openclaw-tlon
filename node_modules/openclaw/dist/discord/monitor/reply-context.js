import { formatAgentEnvelope } from "../../auto-reply/envelope.js";
import { resolveTimestampMs } from "./format.js";
import { resolveDiscordSenderIdentity } from "./sender-identity.js";
export function resolveReplyContext(message, resolveDiscordMessageText, options) {
    const referenced = message.referencedMessage;
    if (!referenced?.author) {
        return null;
    }
    const referencedText = resolveDiscordMessageText(referenced, {
        includeForwarded: true,
    });
    if (!referencedText) {
        return null;
    }
    const sender = resolveDiscordSenderIdentity({
        author: referenced.author,
        pluralkitInfo: null,
    });
    const fromLabel = referenced.author ? buildDirectLabel(referenced.author, sender.tag) : "Unknown";
    const body = `${referencedText}\n[discord message id: ${referenced.id} channel: ${referenced.channelId} from: ${sender.tag ?? sender.label} user id:${sender.id}]`;
    return formatAgentEnvelope({
        channel: "Discord",
        from: fromLabel,
        timestamp: resolveTimestampMs(referenced.timestamp),
        body,
        envelope: options?.envelope,
    });
}
export function buildDirectLabel(author, tagOverride) {
    const username = tagOverride?.trim() || resolveDiscordSenderIdentity({ author, pluralkitInfo: null }).tag;
    return `${username ?? "unknown"} user id:${author.id}`;
}
export function buildGuildLabel(params) {
    const { guild, channelName, channelId } = params;
    return `${guild?.name ?? "Guild"} #${channelName} channel id:${channelId}`;
}
