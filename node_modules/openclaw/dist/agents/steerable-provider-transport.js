import { agentLoop, agentLoopContinue } from "./steerable-agent-loop.js";
export class SteerableProviderTransport {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    getModel(cfg) {
        let model = cfg.model;
        if (this.options.corsProxyUrl && cfg.model.baseUrl) {
            model = {
                ...cfg.model,
                baseUrl: `${this.options.corsProxyUrl}/?url=${encodeURIComponent(cfg.model.baseUrl)}`,
            };
        }
        return model;
    }
    buildContext(messages, cfg) {
        return {
            systemPrompt: cfg.systemPrompt,
            messages,
            tools: cfg.tools,
        };
    }
    buildLoopConfig(model, cfg) {
        return {
            model,
            reasoning: cfg.reasoning,
            getApiKey: this.options.getApiKey,
            getQueuedMessages: cfg.getQueuedMessages,
        };
    }
    async *run(messages, userMessage, cfg, signal) {
        const model = this.getModel(cfg);
        const context = this.buildContext(messages, cfg);
        const pc = this.buildLoopConfig(model, cfg);
        for await (const ev of agentLoop(userMessage, context, pc, signal)) {
            yield ev;
        }
    }
    async *continue(messages, cfg, signal) {
        const model = this.getModel(cfg);
        const context = this.buildContext(messages, cfg);
        const pc = this.buildLoopConfig(model, cfg);
        for await (const ev of agentLoopContinue(context, pc, signal)) {
            yield ev;
        }
    }
}
