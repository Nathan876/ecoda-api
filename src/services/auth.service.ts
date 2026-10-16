import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/env";
import { findUserByEmail } from "../repositories/user.repository";

export interface AuthenticatedUser {
    id: number;
    email: string;
    firstName: string;
}

/**
 * Vérifie les identifiants contre les données seedées et renvoie
 * l'utilisateur correspondant, ou null si email/mot de passe invalide.
 */
export async function verifyCredentials(
    email: string,
    password: string
): Promise<AuthenticatedUser | null> {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) return null;

    return { id: user.id, email: user.email, firstName: user.firstName };
}

/**
 * Signe un JWT pour l'utilisateur donné.
 * Claims du payload : userId, email, exp (ajouté automatiquement par expiresIn).
 */
export function signToken(user: AuthenticatedUser): string {
    return jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
    });
}
