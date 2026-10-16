import { z } from "zod";

export const validateActionRequestSchema = z
    .object({
        challengeId: z.number().int().positive().meta({ example: 3 }),
    })
    .meta({ id: "ValidateActionRequest" });


export const validateActionResponseSchema = z
    .object({
        id: z.number().int().meta({ example: 12 }),
        challengeId: z.number().int().meta({ example: 3 }),
        actionDate: z.string().meta({ example: "2026-10-16" }),
        status: z.literal("validated"),
        pointsEarned: z.number().int().meta({ example: 20 }),
    })
    .meta({ id: "ValidateActionResponse" });

export type ValidateActionRequest = z.infer<typeof validateActionRequestSchema>;