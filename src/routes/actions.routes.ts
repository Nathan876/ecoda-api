import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimitActions } from "../middlewares/rate-limit.middleware";
import { validate } from "../controllers/action.controller";
import {registry} from "../openapi/registry";
import {validateActionRequestSchema, validateActionResponseSchema} from "../schemas/action.schema";
import {errorResponseSchema} from "../schemas/common.schemas";

const router = Router();

router.post("/", authenticate, rateLimitActions, validate);
registry.registerPath({
    method: "post",
    path: "/actions",
    summary: "Valider un défi pour aujourd'hui",
    description:
        "Valide le défi indiqué pour l'utilisateur connecté (identifié par son token). " +
        "Limité à 10 requêtes par minute et par utilisateur (Redis).",
    tags: ["Actions"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: { "application/json": { schema: validateActionRequestSchema } },
        },
    },
    responses: {
        201: {
            description: "Défi validé",
            content: { "application/json": { schema: validateActionResponseSchema } },
        },
        400: {
            description: "Payload invalide (challengeId doit être un entier positif)",
            content: { "application/json": { schema: errorResponseSchema } },
        },
        401: {
            description: "Token absent, invalide, expiré ou révoqué",
            content: { "application/json": { schema: errorResponseSchema } },
        },
        404: {
            description: "Défi introuvable",
            content: { "application/json": { schema: errorResponseSchema } },
        },
        409: {
            description: "Défi déjà validé aujourd'hui",
            content: { "application/json": { schema: errorResponseSchema } },
        },
        429: {
            description: "Trop de requêtes (10 par minute et par utilisateur)",
            content: { "application/json": { schema: errorResponseSchema } },
        },
    },
});
export default router;