/**
 * OpenResponses API Zod Schemas
 *
 * Zod schemas for the OpenResponses `/v1/responses` endpoint.
 * This module is isolated from gateway imports to enable future codegen and prevent drift.
 *
 * @see https://www.open-responses.com/
 */
import { z } from "zod";
export declare const InputTextContentPartSchema: z.ZodObject<{
    type: z.ZodLiteral<"input_text">;
    text: z.ZodString;
}, z.core.$strict>;
export declare const OutputTextContentPartSchema: z.ZodObject<{
    type: z.ZodLiteral<"output_text">;
    text: z.ZodString;
}, z.core.$strict>;
export declare const InputImageSourceSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"url">;
    url: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"base64">;
    media_type: z.ZodEnum<{
        "image/jpeg": "image/jpeg";
        "image/png": "image/png";
        "image/webp": "image/webp";
        "image/gif": "image/gif";
    }>;
    data: z.ZodString;
}, z.core.$strip>], "type">;
export declare const InputImageContentPartSchema: z.ZodObject<{
    type: z.ZodLiteral<"input_image">;
    source: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"url">;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"base64">;
        media_type: z.ZodEnum<{
            "image/jpeg": "image/jpeg";
            "image/png": "image/png";
            "image/webp": "image/webp";
            "image/gif": "image/gif";
        }>;
        data: z.ZodString;
    }, z.core.$strip>], "type">;
}, z.core.$strict>;
export declare const InputFileSourceSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"url">;
    url: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"base64">;
    media_type: z.ZodString;
    data: z.ZodString;
    filename: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "type">;
export declare const InputFileContentPartSchema: z.ZodObject<{
    type: z.ZodLiteral<"input_file">;
    source: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"url">;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"base64">;
        media_type: z.ZodString;
        data: z.ZodString;
        filename: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "type">;
}, z.core.$strict>;
export declare const ContentPartSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"input_text">;
    text: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"output_text">;
    text: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"input_image">;
    source: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"url">;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"base64">;
        media_type: z.ZodEnum<{
            "image/jpeg": "image/jpeg";
            "image/png": "image/png";
            "image/webp": "image/webp";
            "image/gif": "image/gif";
        }>;
        data: z.ZodString;
    }, z.core.$strip>], "type">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"input_file">;
    source: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"url">;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"base64">;
        media_type: z.ZodString;
        data: z.ZodString;
        filename: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "type">;
}, z.core.$strict>], "type">;
export type ContentPart = z.infer<typeof ContentPartSchema>;
export declare const MessageItemRoleSchema: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
    system: "system";
    developer: "developer";
}>;
export type MessageItemRole = z.infer<typeof MessageItemRoleSchema>;
export declare const MessageItemSchema: z.ZodObject<{
    type: z.ZodLiteral<"message">;
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
        system: "system";
        developer: "developer";
    }>;
    content: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"input_text">;
        text: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"output_text">;
        text: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"input_image">;
        source: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"url">;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"base64">;
            media_type: z.ZodEnum<{
                "image/jpeg": "image/jpeg";
                "image/png": "image/png";
                "image/webp": "image/webp";
                "image/gif": "image/gif";
            }>;
            data: z.ZodString;
        }, z.core.$strip>], "type">;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"input_file">;
        source: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"url">;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"base64">;
            media_type: z.ZodString;
            data: z.ZodString;
            filename: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "type">;
    }, z.core.$strict>], "type">>]>;
}, z.core.$strict>;
export declare const FunctionCallItemSchema: z.ZodObject<{
    type: z.ZodLiteral<"function_call">;
    id: z.ZodOptional<z.ZodString>;
    call_id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    arguments: z.ZodString;
}, z.core.$strict>;
export declare const FunctionCallOutputItemSchema: z.ZodObject<{
    type: z.ZodLiteral<"function_call_output">;
    call_id: z.ZodString;
    output: z.ZodString;
}, z.core.$strict>;
export declare const ReasoningItemSchema: z.ZodObject<{
    type: z.ZodLiteral<"reasoning">;
    content: z.ZodOptional<z.ZodString>;
    encrypted_content: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ItemReferenceItemSchema: z.ZodObject<{
    type: z.ZodLiteral<"item_reference">;
    id: z.ZodString;
}, z.core.$strict>;
export declare const ItemParamSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"message">;
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
        system: "system";
        developer: "developer";
    }>;
    content: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"input_text">;
        text: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"output_text">;
        text: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"input_image">;
        source: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"url">;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"base64">;
            media_type: z.ZodEnum<{
                "image/jpeg": "image/jpeg";
                "image/png": "image/png";
                "image/webp": "image/webp";
                "image/gif": "image/gif";
            }>;
            data: z.ZodString;
        }, z.core.$strip>], "type">;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"input_file">;
        source: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"url">;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"base64">;
            media_type: z.ZodString;
            data: z.ZodString;
            filename: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "type">;
    }, z.core.$strict>], "type">>]>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"function_call">;
    id: z.ZodOptional<z.ZodString>;
    call_id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    arguments: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"function_call_output">;
    call_id: z.ZodString;
    output: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"reasoning">;
    content: z.ZodOptional<z.ZodString>;
    encrypted_content: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"item_reference">;
    id: z.ZodString;
}, z.core.$strict>], "type">;
export type ItemParam = z.infer<typeof ItemParamSchema>;
export declare const FunctionToolDefinitionSchema: z.ZodObject<{
    type: z.ZodLiteral<"function">;
    function: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
}, z.core.$strict>;
export declare const ToolDefinitionSchema: z.ZodObject<{
    type: z.ZodLiteral<"function">;
    function: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
}, z.core.$strict>;
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
export declare const ToolChoiceSchema: z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"none">, z.ZodLiteral<"required">, z.ZodObject<{
    type: z.ZodLiteral<"function">;
    function: z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>]>;
export declare const CreateResponseBodySchema: z.ZodObject<{
    model: z.ZodString;
    input: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"message">;
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
            system: "system";
            developer: "developer";
        }>;
        content: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"input_text">;
            text: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"output_text">;
            text: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"input_image">;
            source: z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"url">;
                url: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"base64">;
                media_type: z.ZodEnum<{
                    "image/jpeg": "image/jpeg";
                    "image/png": "image/png";
                    "image/webp": "image/webp";
                    "image/gif": "image/gif";
                }>;
                data: z.ZodString;
            }, z.core.$strip>], "type">;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"input_file">;
            source: z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"url">;
                url: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"base64">;
                media_type: z.ZodString;
                data: z.ZodString;
                filename: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>], "type">;
        }, z.core.$strict>], "type">>]>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"function_call">;
        id: z.ZodOptional<z.ZodString>;
        call_id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        arguments: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"function_call_output">;
        call_id: z.ZodString;
        output: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"reasoning">;
        content: z.ZodOptional<z.ZodString>;
        encrypted_content: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"item_reference">;
        id: z.ZodString;
    }, z.core.$strict>], "type">>]>;
    instructions: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>;
    }, z.core.$strict>>>;
    tool_choice: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"none">, z.ZodLiteral<"required">, z.ZodObject<{
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
            name: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>]>>;
    stream: z.ZodOptional<z.ZodBoolean>;
    max_output_tokens: z.ZodOptional<z.ZodNumber>;
    max_tool_calls: z.ZodOptional<z.ZodNumber>;
    user: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    store: z.ZodOptional<z.ZodBoolean>;
    previous_response_id: z.ZodOptional<z.ZodString>;
    reasoning: z.ZodOptional<z.ZodObject<{
        effort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        summary: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            concise: "concise";
            detailed: "detailed";
        }>>;
    }, z.core.$strip>>;
    truncation: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        auto: "auto";
    }>>;
}, z.core.$strict>;
export type CreateResponseBody = z.infer<typeof CreateResponseBodySchema>;
export declare const ResponseStatusSchema: z.ZodEnum<{
    failed: "failed";
    completed: "completed";
    cancelled: "cancelled";
    in_progress: "in_progress";
    incomplete: "incomplete";
}>;
export type ResponseStatus = z.infer<typeof ResponseStatusSchema>;
export declare const OutputItemSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"message">;
    id: z.ZodString;
    role: z.ZodLiteral<"assistant">;
    content: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"output_text">;
        text: z.ZodString;
    }, z.core.$strict>>;
    status: z.ZodOptional<z.ZodEnum<{
        completed: "completed";
        in_progress: "in_progress";
    }>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"function_call">;
    id: z.ZodString;
    call_id: z.ZodString;
    name: z.ZodString;
    arguments: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        completed: "completed";
        in_progress: "in_progress";
    }>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"reasoning">;
    id: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "type">;
export type OutputItem = z.infer<typeof OutputItemSchema>;
export declare const UsageSchema: z.ZodObject<{
    input_tokens: z.ZodNumber;
    output_tokens: z.ZodNumber;
    total_tokens: z.ZodNumber;
}, z.core.$strip>;
export type Usage = z.infer<typeof UsageSchema>;
export declare const ResponseResourceSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodLiteral<"response">;
    created_at: z.ZodNumber;
    status: z.ZodEnum<{
        failed: "failed";
        completed: "completed";
        cancelled: "cancelled";
        in_progress: "in_progress";
        incomplete: "incomplete";
    }>;
    model: z.ZodString;
    output: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"message">;
        id: z.ZodString;
        role: z.ZodLiteral<"assistant">;
        content: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"output_text">;
            text: z.ZodString;
        }, z.core.$strict>>;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            in_progress: "in_progress";
        }>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"function_call">;
        id: z.ZodString;
        call_id: z.ZodString;
        name: z.ZodString;
        arguments: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            in_progress: "in_progress";
        }>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"reasoning">;
        id: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">>;
    usage: z.ZodObject<{
        input_tokens: z.ZodNumber;
        output_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, z.core.$strip>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ResponseResource = z.infer<typeof ResponseResourceSchema>;
export declare const ResponseCreatedEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.created">;
    response: z.ZodObject<{
        id: z.ZodString;
        object: z.ZodLiteral<"response">;
        created_at: z.ZodNumber;
        status: z.ZodEnum<{
            failed: "failed";
            completed: "completed";
            cancelled: "cancelled";
            in_progress: "in_progress";
            incomplete: "incomplete";
        }>;
        model: z.ZodString;
        output: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"message">;
            id: z.ZodString;
            role: z.ZodLiteral<"assistant">;
            content: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"output_text">;
                text: z.ZodString;
            }, z.core.$strict>>;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"function_call">;
            id: z.ZodString;
            call_id: z.ZodString;
            name: z.ZodString;
            arguments: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"reasoning">;
            id: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            summary: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
        usage: z.ZodObject<{
            input_tokens: z.ZodNumber;
            output_tokens: z.ZodNumber;
            total_tokens: z.ZodNumber;
        }, z.core.$strip>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ResponseInProgressEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.in_progress">;
    response: z.ZodObject<{
        id: z.ZodString;
        object: z.ZodLiteral<"response">;
        created_at: z.ZodNumber;
        status: z.ZodEnum<{
            failed: "failed";
            completed: "completed";
            cancelled: "cancelled";
            in_progress: "in_progress";
            incomplete: "incomplete";
        }>;
        model: z.ZodString;
        output: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"message">;
            id: z.ZodString;
            role: z.ZodLiteral<"assistant">;
            content: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"output_text">;
                text: z.ZodString;
            }, z.core.$strict>>;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"function_call">;
            id: z.ZodString;
            call_id: z.ZodString;
            name: z.ZodString;
            arguments: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"reasoning">;
            id: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            summary: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
        usage: z.ZodObject<{
            input_tokens: z.ZodNumber;
            output_tokens: z.ZodNumber;
            total_tokens: z.ZodNumber;
        }, z.core.$strip>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ResponseCompletedEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.completed">;
    response: z.ZodObject<{
        id: z.ZodString;
        object: z.ZodLiteral<"response">;
        created_at: z.ZodNumber;
        status: z.ZodEnum<{
            failed: "failed";
            completed: "completed";
            cancelled: "cancelled";
            in_progress: "in_progress";
            incomplete: "incomplete";
        }>;
        model: z.ZodString;
        output: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"message">;
            id: z.ZodString;
            role: z.ZodLiteral<"assistant">;
            content: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"output_text">;
                text: z.ZodString;
            }, z.core.$strict>>;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"function_call">;
            id: z.ZodString;
            call_id: z.ZodString;
            name: z.ZodString;
            arguments: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"reasoning">;
            id: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            summary: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
        usage: z.ZodObject<{
            input_tokens: z.ZodNumber;
            output_tokens: z.ZodNumber;
            total_tokens: z.ZodNumber;
        }, z.core.$strip>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ResponseFailedEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.failed">;
    response: z.ZodObject<{
        id: z.ZodString;
        object: z.ZodLiteral<"response">;
        created_at: z.ZodNumber;
        status: z.ZodEnum<{
            failed: "failed";
            completed: "completed";
            cancelled: "cancelled";
            in_progress: "in_progress";
            incomplete: "incomplete";
        }>;
        model: z.ZodString;
        output: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"message">;
            id: z.ZodString;
            role: z.ZodLiteral<"assistant">;
            content: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"output_text">;
                text: z.ZodString;
            }, z.core.$strict>>;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"function_call">;
            id: z.ZodString;
            call_id: z.ZodString;
            name: z.ZodString;
            arguments: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                in_progress: "in_progress";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"reasoning">;
            id: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            summary: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
        usage: z.ZodObject<{
            input_tokens: z.ZodNumber;
            output_tokens: z.ZodNumber;
            total_tokens: z.ZodNumber;
        }, z.core.$strip>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const OutputItemAddedEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.output_item.added">;
    output_index: z.ZodNumber;
    item: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"message">;
        id: z.ZodString;
        role: z.ZodLiteral<"assistant">;
        content: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"output_text">;
            text: z.ZodString;
        }, z.core.$strict>>;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            in_progress: "in_progress";
        }>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"function_call">;
        id: z.ZodString;
        call_id: z.ZodString;
        name: z.ZodString;
        arguments: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            in_progress: "in_progress";
        }>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"reasoning">;
        id: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">;
}, z.core.$strip>;
export declare const OutputItemDoneEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.output_item.done">;
    output_index: z.ZodNumber;
    item: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"message">;
        id: z.ZodString;
        role: z.ZodLiteral<"assistant">;
        content: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"output_text">;
            text: z.ZodString;
        }, z.core.$strict>>;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            in_progress: "in_progress";
        }>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"function_call">;
        id: z.ZodString;
        call_id: z.ZodString;
        name: z.ZodString;
        arguments: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            in_progress: "in_progress";
        }>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"reasoning">;
        id: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">;
}, z.core.$strip>;
export declare const ContentPartAddedEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.content_part.added">;
    item_id: z.ZodString;
    output_index: z.ZodNumber;
    content_index: z.ZodNumber;
    part: z.ZodObject<{
        type: z.ZodLiteral<"output_text">;
        text: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const ContentPartDoneEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.content_part.done">;
    item_id: z.ZodString;
    output_index: z.ZodNumber;
    content_index: z.ZodNumber;
    part: z.ZodObject<{
        type: z.ZodLiteral<"output_text">;
        text: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const OutputTextDeltaEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.output_text.delta">;
    item_id: z.ZodString;
    output_index: z.ZodNumber;
    content_index: z.ZodNumber;
    delta: z.ZodString;
}, z.core.$strip>;
export declare const OutputTextDoneEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"response.output_text.done">;
    item_id: z.ZodString;
    output_index: z.ZodNumber;
    content_index: z.ZodNumber;
    text: z.ZodString;
}, z.core.$strip>;
export type StreamingEvent = z.infer<typeof ResponseCreatedEventSchema> | z.infer<typeof ResponseInProgressEventSchema> | z.infer<typeof ResponseCompletedEventSchema> | z.infer<typeof ResponseFailedEventSchema> | z.infer<typeof OutputItemAddedEventSchema> | z.infer<typeof OutputItemDoneEventSchema> | z.infer<typeof ContentPartAddedEventSchema> | z.infer<typeof ContentPartDoneEventSchema> | z.infer<typeof OutputTextDeltaEventSchema> | z.infer<typeof OutputTextDoneEventSchema>;
