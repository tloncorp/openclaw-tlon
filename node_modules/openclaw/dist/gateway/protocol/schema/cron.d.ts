export declare const CronScheduleSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"at">;
    atMs: import("@sinclair/typebox").TInteger;
}>, import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"every">;
    everyMs: import("@sinclair/typebox").TInteger;
    anchorMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>, import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"cron">;
    expr: import("@sinclair/typebox").TString;
    tz: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>]>;
export declare const CronPayloadSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
    text: import("@sinclair/typebox").TString;
}>, import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
    message: import("@sinclair/typebox").TString;
    model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
    to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>]>;
export declare const CronPayloadPatchSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
    text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>, import("@sinclair/typebox").TObject<{
    kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
    message: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
    to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>]>;
export declare const CronIsolationSchema: import("@sinclair/typebox").TObject<{
    postToMainPrefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    postToMainMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"summary">, import("@sinclair/typebox").TLiteral<"full">]>>;
    postToMainMaxChars: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>;
export declare const CronJobStateSchema: import("@sinclair/typebox").TObject<{
    nextRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    runningAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    lastRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    lastStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ok">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"skipped">]>>;
    lastError: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    lastDurationMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>;
export declare const CronJobSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    agentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    enabled: import("@sinclair/typebox").TBoolean;
    deleteAfterRun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    createdAtMs: import("@sinclair/typebox").TInteger;
    updatedAtMs: import("@sinclair/typebox").TInteger;
    schedule: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"at">;
        atMs: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"every">;
        everyMs: import("@sinclair/typebox").TInteger;
        anchorMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"cron">;
        expr: import("@sinclair/typebox").TString;
        tz: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>]>;
    sessionTarget: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"main">, import("@sinclair/typebox").TLiteral<"isolated">]>;
    wakeMode: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"next-heartbeat">, import("@sinclair/typebox").TLiteral<"now">]>;
    payload: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
        text: import("@sinclair/typebox").TString;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
        message: import("@sinclair/typebox").TString;
        model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
        to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>]>;
    isolation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        postToMainPrefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        postToMainMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"summary">, import("@sinclair/typebox").TLiteral<"full">]>>;
        postToMainMaxChars: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>>;
    state: import("@sinclair/typebox").TObject<{
        nextRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        runningAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ok">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"skipped">]>>;
        lastError: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        lastDurationMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>;
}>;
export declare const CronListParamsSchema: import("@sinclair/typebox").TObject<{
    includeDisabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export declare const CronStatusParamsSchema: import("@sinclair/typebox").TObject<{}>;
export declare const CronAddParamsSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    agentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    deleteAfterRun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    schedule: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"at">;
        atMs: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"every">;
        everyMs: import("@sinclair/typebox").TInteger;
        anchorMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"cron">;
        expr: import("@sinclair/typebox").TString;
        tz: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>]>;
    sessionTarget: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"main">, import("@sinclair/typebox").TLiteral<"isolated">]>;
    wakeMode: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"next-heartbeat">, import("@sinclair/typebox").TLiteral<"now">]>;
    payload: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
        text: import("@sinclair/typebox").TString;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
        message: import("@sinclair/typebox").TString;
        model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
        to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>]>;
    isolation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        postToMainPrefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        postToMainMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"summary">, import("@sinclair/typebox").TLiteral<"full">]>>;
        postToMainMaxChars: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>>;
}>;
export declare const CronJobPatchSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    agentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    deleteAfterRun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"at">;
        atMs: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"every">;
        everyMs: import("@sinclair/typebox").TInteger;
        anchorMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"cron">;
        expr: import("@sinclair/typebox").TString;
        tz: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>]>>;
    sessionTarget: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"main">, import("@sinclair/typebox").TLiteral<"isolated">]>>;
    wakeMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"next-heartbeat">, import("@sinclair/typebox").TLiteral<"now">]>>;
    payload: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
        text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>, import("@sinclair/typebox").TObject<{
        kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
        message: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
        to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>]>>;
    isolation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        postToMainPrefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        postToMainMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"summary">, import("@sinclair/typebox").TLiteral<"full">]>>;
        postToMainMaxChars: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>>;
    state: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        nextRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        runningAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ok">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"skipped">]>>;
        lastError: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        lastDurationMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>>;
}>;
export declare const CronUpdateParamsSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    patch: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        agentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        deleteAfterRun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"at">;
            atMs: import("@sinclair/typebox").TInteger;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"every">;
            everyMs: import("@sinclair/typebox").TInteger;
            anchorMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"cron">;
            expr: import("@sinclair/typebox").TString;
            tz: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>]>>;
        sessionTarget: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"main">, import("@sinclair/typebox").TLiteral<"isolated">]>>;
        wakeMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"next-heartbeat">, import("@sinclair/typebox").TLiteral<"now">]>>;
        payload: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
            text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
            message: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>]>>;
        isolation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            postToMainPrefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            postToMainMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"summary">, import("@sinclair/typebox").TLiteral<"full">]>>;
            postToMainMaxChars: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>>;
        state: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            nextRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            runningAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            lastRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            lastStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ok">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"skipped">]>>;
            lastError: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lastDurationMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>>;
    }>;
}>, import("@sinclair/typebox").TObject<{
    jobId: import("@sinclair/typebox").TString;
    patch: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        agentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        deleteAfterRun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"at">;
            atMs: import("@sinclair/typebox").TInteger;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"every">;
            everyMs: import("@sinclair/typebox").TInteger;
            anchorMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"cron">;
            expr: import("@sinclair/typebox").TString;
            tz: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>]>>;
        sessionTarget: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"main">, import("@sinclair/typebox").TLiteral<"isolated">]>>;
        wakeMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"next-heartbeat">, import("@sinclair/typebox").TLiteral<"now">]>>;
        payload: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"systemEvent">;
            text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"agentTurn">;
            message: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            thinking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            timeoutSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            deliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TString]>>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            bestEffortDeliver: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>]>>;
        isolation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            postToMainPrefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            postToMainMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"summary">, import("@sinclair/typebox").TLiteral<"full">]>>;
            postToMainMaxChars: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>>;
        state: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            nextRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            runningAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            lastRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            lastStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ok">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"skipped">]>>;
            lastError: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lastDurationMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>>;
    }>;
}>]>;
export declare const CronRemoveParamsSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
}>, import("@sinclair/typebox").TObject<{
    jobId: import("@sinclair/typebox").TString;
}>]>;
export declare const CronRunParamsSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    mode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"due">, import("@sinclair/typebox").TLiteral<"force">]>>;
}>, import("@sinclair/typebox").TObject<{
    jobId: import("@sinclair/typebox").TString;
    mode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"due">, import("@sinclair/typebox").TLiteral<"force">]>>;
}>]>;
export declare const CronRunsParamsSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>, import("@sinclair/typebox").TObject<{
    jobId: import("@sinclair/typebox").TString;
    limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>]>;
export declare const CronRunLogEntrySchema: import("@sinclair/typebox").TObject<{
    ts: import("@sinclair/typebox").TInteger;
    jobId: import("@sinclair/typebox").TString;
    action: import("@sinclair/typebox").TLiteral<"finished">;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ok">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"skipped">]>>;
    error: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    summary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    runAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    durationMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    nextRunAtMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>;
