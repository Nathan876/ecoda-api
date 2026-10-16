import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { registry } from "../openapi/registry";
import { loginRequestSchema, loginResponseSchema } from "../schemas/auth.schemas";
import { errorResponseSchema } from "../schemas/common.schemas";

const router = Router();

registry.registerPath({
    method: "post",
    path: "/auth/login",
    summary: "Authentifie un utilisateur et génère un token JWT",
    tags: ["Authentification"],
    request: {
        body: {
            content: { "application/json": { schema: loginRequestSchema } },
        },
    },
    responses: {
        200: {
            description: "Authentification réussie",
            content: { "application/json": { schema: loginResponseSchema } },
        },
        400: {
            description: "Requête invalide (email ou mot de passe manquant/invalide)",
            content: { "application/json": { schema: errorResponseSchema } },
        },
        401: {
            description: "Identifiants invalides",
            content: { "application/json": { schema: errorResponseSchema } },
        },
    },
});

router.post("/login", login);

// À coder : POST /auth/logout (révocation du token via blacklist Redis).

export default router;
