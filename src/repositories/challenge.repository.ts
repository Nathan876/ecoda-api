import db from "../config/db";

export interface ChallengeRecord {
    id: number;
    goalId: number;
    title: string;
    difficulty: "facile" | "moyen" | "ambitieux";
    points: number;
    description: string | null;
}


export async function findChallengeById(id: number): Promise<ChallengeRecord | null> {
    const { rows } = await db.query(
        "SELECT id, goal_id, title, difficulty, points, description FROM challenges WHERE id = $1",
        [id]
    );

    const row = rows[0];
    if (!row) {
        return null;
    }

    return {
        id: row.id,
        goalId: row.goal_id,
        title: row.title,
        difficulty: row.difficulty,
        points: row.points,
        description: row.description,
    };
}