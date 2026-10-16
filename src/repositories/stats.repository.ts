import db from "../config/db";
import { UserStats } from "../services/badge.rules";

export async function getUserStats(userId: number): Promise<UserStats> {
    const { rows } = await db.query(
        `SELECT g.slug,
                COUNT(*)::int        AS validated,
                SUM(c.points)::int   AS points
         FROM challenge_actions ca
         JOIN challenges c       ON c.id = ca.challenge_id
         JOIN ecological_goals g ON g.id = c.goal_id
         WHERE ca.user_id = $1 AND ca.status = 'validated'
         GROUP BY g.slug`,
        [userId]
    );

    const stats: UserStats = {
        totalScore: 0,
        validatedCount: 0,
        validatedByGoal: {}
    };

    for (const row of rows) {
        stats.totalScore += row.points;
        stats.validatedCount += row.validated;
        stats.validatedByGoal[row.slug] = row.validated;
    }

    return stats;
}