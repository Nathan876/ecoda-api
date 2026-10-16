import db from "../config/db";

export async function awardBadges(userId: number, codes: string[]): Promise<string[]> {
    if (codes.length === 0) return [];

    const { rows } = await db.query(
        `WITH inserted AS (
             INSERT INTO user_badges (user_id, badge_id)
             SELECT $1, b.id FROM badges b WHERE b.code = ANY($2::text[])
             ON CONFLICT (user_id, badge_id) DO NOTHING
             RETURNING badge_id
         )
         SELECT b.code FROM inserted i JOIN badges b ON b.id = i.badge_id`,
        [userId, codes]
    );

    return rows.map((row) => row.code);
}