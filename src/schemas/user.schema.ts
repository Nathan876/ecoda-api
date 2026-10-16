import { z } from "zod";

export const userProfileSchema = z
    .object({
        id: z.number().int().meta({ example: 1 }),
        email: z.string().meta({ example: "lea.martin@ecoda.io" }),
        firstName: z.string().meta({ example: "Léa" }),
        createdAt: z.string().meta({ example: "2026-01-15T10:00:00.000Z" }),
    })
    .meta({ id: "UserProfile" });