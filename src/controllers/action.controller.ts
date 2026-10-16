import { Request, Response } from "express";
import { validateActionRequestSchema } from "../schemas/action.schema";
import { validateChallengeAction } from "../services/action.service";

export async function validate(req: Request, res: Response): Promise<Response> {
    const parseResult = validateActionRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ "error": "challengeId must be a positive integer" });
    }
    const { challengeId } = parseResult.data;

    const result = await validateChallengeAction(res.locals.user.userId, challengeId);

    if (!result.ok) {
        if (result.reason === "challenge_not_found") {
            return res.status(404).json({ "error": "Challenge not found" });
        }
        return res.status(409).json({ "error": "Challenge already validated today" });
    }

    return res.status(201).json({
        id: result.action.id,
        challengeId: result.action.challengeId,
        actionDate: result.action.actionDate,
        status: result.action.status,
        pointsEarned: result.pointsEarned,
        totalScore: result.totalScore,
        newBadges: result.newBadges,
    });
}