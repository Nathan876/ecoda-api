import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimitActions } from "../middlewares/rate-limit.middleware";
import { validate } from "../controllers/action.controller";

const router = Router();

router.post("/", authenticate, rateLimitActions, validate);

export default router;