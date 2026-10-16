import { Router } from "express";
import { registry } from "../openapi/registry";
import { errorResponseSchema } from "../schemas/common.schemas";
import {authenticate} from "../middlewares/auth.middleware";
import {getMe} from "../controllers/user.controller";
import {userProfileSchema} from "../schemas/user.schema";

const router = Router();

registry.registerPath({
    method: "get",
    path: "/users/me",
    summary: "Obtenir ses informations en tant qu'utilisateur",
    tags: ["Utilisateurs"],
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "Données récupérées",
            content: { "application/json": { schema: userProfileSchema }}
        },
        401: {
            description: "Token absent non valide ou révoqué",
            content: { "application/json": { schema: errorResponseSchema }}
        },
        404: {
            description: "Utilisateur introuvable",
            content: { "application/json": { schema: errorResponseSchema } }
        },
    },
});

router.get("/me", authenticate, getMe);

export default router;
