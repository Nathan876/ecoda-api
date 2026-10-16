import { Request, Response, NextFunction } from "express";
import { hit, ACTIONS_LIMIT } from "../services/rate-limit.service";

export async function rateLimitActions(req: Request, res: Response, next: NextFunction) {
    const count = await hit(res.locals.user.userId);

    if (count > ACTIONS_LIMIT) {
        return res.status(429).json({ error: "Too many requests" });
    }
    next();
}