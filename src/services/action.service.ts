import { findChallengeById } from "../repositories/challenge.repository";
import { validateAction, ActionRecord } from "../repositories/action.repository";

export type ValidateActionResult =
    | { ok: true; action: ActionRecord; pointsEarned: number }
    | { ok: false; reason: "challenge_not_found" }
    | { ok: false; reason: "already_validated" };


export async function validateChallengeAction(
    userId: number,
    challengeId: number
): Promise<ValidateActionResult> {
    const challenge = await findChallengeById(challengeId);

    if (!challenge) {
        return { ok: false, reason: "challenge_not_found" };
    }

    const action = await validateAction(userId, challengeId);
    if (!action) {
        return { ok: false, reason: "already_validated" };
    }

    return { ok: true, action, pointsEarned: challenge.points };
}