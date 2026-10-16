import { Router } from "express";
import {login, logout} from "../controllers/auth.controller";
import { registry } from "../openapi/registry";
import { loginRequestSchema, loginResponseSchema } from "../schemas/auth.schemas";
import { errorResponseSchema } from "../schemas/common.schemas";
import {authenticate} from "../middlewares/auth.middleware";
import { z } from "zod";

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

registry.registerPath({
    method: "post",
    path: "/auth/logout",
    summary: "Révoque le token courant (blacklist Redis)",
    description:
        "Ajoute le token à une blacklist Redis jusqu'à son expiration naturelle (claim exp). " +
        "Toute requête ultérieure avec ce token renvoie 401 Token has been revoked.",
    tags: ["Authentification"],
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "Déconnexion réussie",
            content: { "application/json": { schema: z.object({ message: z.string() }) } },
        },
        401: {
            description: "Token absent, invalide, expiré ou déjà révoqué",
            content: { "application/json": { schema: errorResponseSchema } },
        },
    },
});

// À coder : POST /auth/logout (révocation du token via blacklist Redis).
router.post("/logout", authenticate, logout);

export default router;
