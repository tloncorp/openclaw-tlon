export declare const ModelChoiceSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    provider: import("@sinclair/typebox").TString;
    contextWindow: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    reasoning: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export declare const AgentSummarySchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    identity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        theme: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        emoji: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        avatar: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        avatarUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
}>;
export declare const AgentsListParamsSchema: import("@sinclair/typebox").TObject<{}>;
export declare const AgentsListResultSchema: import("@sinclair/typebox").TObject<{
    defaultId: import("@sinclair/typebox").TString;
    mainKey: import("@sinclair/typebox").TString;
    scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"per-sender">, import("@sinclair/typebox").TLiteral<"global">]>;
    agents: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        identity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            theme: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            emoji: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            avatar: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            avatarUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>>;
    }>>;
}>;
export declare const ModelsListParamsSchema: import("@sinclair/typebox").TObject<{}>;
export declare const ModelsListResultSchema: import("@sinclair/typebox").TObject<{
    models: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TString;
        provider: import("@sinclair/typebox").TString;
        contextWindow: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        reasoning: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>>;
}>;
export declare const SkillsStatusParamsSchema: import("@sinclair/typebox").TObject<{}>;
export declare const SkillsBinsParamsSchema: import("@sinclair/typebox").TObject<{}>;
export declare const SkillsBinsResultSchema: import("@sinclair/typebox").TObject<{
    bins: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
}>;
export declare const SkillsInstallParamsSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    installId: import("@sinclair/typebox").TString;
    timeoutMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>;
export declare const SkillsUpdateParamsSchema: import("@sinclair/typebox").TObject<{
    skillKey: import("@sinclair/typebox").TString;
    enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    apiKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    env: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>>;
}>;
