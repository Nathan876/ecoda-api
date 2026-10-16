import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimitActions } from "../middlewares/rate-limit.middleware";

const router = Router();

router.post("/", authenticate, rateLimitActions, (req, res) => {
    res.json({ ok: true });
});

export default router;