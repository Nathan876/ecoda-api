import { z } from "zod";

export const errorResponseSchema = z
    .object({
        error: z.string(),
    })
    .meta({ id: "ErrorResponse" });

export const healthResponseSchema = z
    .object({
        status: z.enum(["ok", "degraded"]).meta({ example: "ok" }),
        dependencies: z
            .object({
                postgres: z.enum(["ok", "error"]).meta({ example: "ok" }),
                redis: z.enum(["ok", "error"]).meta({ example: "ok" }),
            })
            .meta({ id: "HealthDependencies" }),
    })
    .meta({ id: "HealthResponse" });
