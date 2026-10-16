import db from "../config/db";

export type ActionStatus = "proposed" | "validated" | "to_retry";

export interface ActionRecord {
    id: number;
    challengeId: number;
    actionDate: string;
    status: ActionStatus;
    validatedAt: Date | null;
}

export async function validateAction(userId: number, challengeId: number): Promise<ActionRecord | null> {
    const { rows } = await db.query(
        `INSERT INTO challenge_actions (user_id, challenge_id, action_date, status, validated_at)
         VALUES ($1, $2, CURRENT_DATE, 'validated', now())
             ON CONFLICT (user_id, challenge_id, action_date)
         DO UPDATE SET status = 'validated', validated_at = now()
            WHERE challenge_actions.status <> 'validated'
                RETURNING id, challenge_id, action_date::text AS action_date, status, validated_at`,
        [userId, challengeId]
    );
    const row = rows[0];
    if (!row) return null;
    return {
        id: row.id,
        challengeId: row.challenge_id,
        actionDate: row.action_date,
        status: row.status,
        validatedAt: row.validated_at,
    };
}