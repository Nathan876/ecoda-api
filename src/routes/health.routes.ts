import { Router } from "express";
import { registry } from "../openapi/registry";
import { healthResponseSchema } from "../schemas/common.schemas";
import { getHealthReport } from "../services/health.service";

const router = Router();

registry.registerPath({
    method: "get",
    path: "/health",
    summary: "Vérifie que l'API et ses dépendances (PostgreSQL, Redis) répondent",
    tags: ["Système"],
    responses: {
        200: {
            description: "L'API et ses dépendances sont opérationnelles",
            content: { "application/json": { schema: healthResponseSchema } },
        },
        503: {
            description: "Au moins une dépendance (PostgreSQL ou Redis) est indisponible",
            content: { "application/json": { schema: healthResponseSchema } },
        },
    },
});

// Route publique, non protégée : permet de vérifier que l'environnement tourne.
router.get("/health", async (req, res) => {
    const report = await getHealthReport();
    res.status(report.status === "ok" ? 200 : 503).json(report);
});

export default router;
