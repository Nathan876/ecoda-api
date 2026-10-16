import db from "../config/db";

export interface UserRecord {
    id: number;
    email: string;
    firstName: string;
    passwordHash: string;
}

export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    createdAt: Date;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
    const { rows } = await db.query(
        "SELECT id, email, first_name, password_hash FROM users WHERE email = $1",
        [email]
    );
    const row = rows[0];
    if (!row) return null;

    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        passwordHash: row.password_hash,
    };
}

export async function findUserById(id: number): Promise<UserProfile | null> {

    const { rows } = await db.query(
        "SELECT id, email, first_name, created_at FROM users WHERE id = $1",
        [id]
    );

    const row = rows[0];

    if (!row) {
        return null;
    }

    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        createdAt: row.created_at,
    };
}