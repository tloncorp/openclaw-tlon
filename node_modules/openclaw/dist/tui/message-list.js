import crypto from "node:crypto";
import { Container, Markdown, Spacer, Text } from "@mariozechner/pi-tui";
import { theme } from "./theme.js";
export class MessageList extends Container {
    markdownTheme;
    styles;
    assistantById = new Map();
    constructor(markdownTheme, styles) {
        super();
        this.markdownTheme = markdownTheme;
        this.styles = styles;
    }
    clearAll() {
        this.assistantById.clear();
        this.clear();
    }
    addSystem(text) {
        this.addMessage("system", text, this.styles.system);
    }
    addTool(text) {
        this.addMessage("tool", text, this.styles.tool);
    }
    addUser(text) {
        this.addMessage("user", text, this.styles.user);
    }
    addAssistant(text, id) {
        const messageId = id ?? crypto.randomUUID();
        const label = new Text(theme.assistant("clawd"), 1, 0);
        const body = new Markdown(text, 1, 0, this.markdownTheme, this.styles.assistant);
        const group = new Container();
        group.addChild(label);
        group.addChild(body);
        this.addChild(group);
        this.addChild(new Spacer(1));
        this.assistantById.set(messageId, body);
        return messageId;
    }
    updateAssistant(id, text) {
        const component = this.assistantById.get(id);
        if (!component)
            return;
        component.setText(text);
    }
    addMessage(role, text, style) {
        const label = new Text(role === "user"
            ? theme.user("you")
            : role === "system"
                ? theme.system("system")
                : theme.dim("tool"), 1, 0);
        const body = new Markdown(text, 1, 0, this.markdownTheme, style);
        const group = new Container();
        group.addChild(label);
        group.addChild(body);
        this.addChild(group);
        this.addChild(new Spacer(1));
    }
}
