import { z } from "zod";

// Schéma unique servant à la fois à valider le corps de la requête (via .safeParse dans le contrôleur) et à générer la documentation OpenAPI
// (via le registre, voir src/routes/auth.routes.ts) : aucune duplication à maintenir entre validation et documentation.
export const loginRequestSchema = z
    .object({
        email: z.email().meta({ example: "lea.martin@ecoda.io" }),
        password: z.string().min(1).meta({ example: "EcodaDemo123!" }),
    })
    .meta({ id: "LoginRequest" });

export const loginResponseSchema = z
    .object({
        token: z.string().meta({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
    })
    .meta({ id: "LoginResponse" });

export type LoginRequest = z.infer<typeof loginRequestSchema>;
