import { z } from "zod";

export const validateActionRequestSchema = z
    .object({
        challengeId: z.number().int().positive().meta({ example: 3 }),
    })
    .meta({ id: "ValidateActionRequest" });

export type ValidateActionRequest = z.infer<typeof validateActionRequestSchema>;