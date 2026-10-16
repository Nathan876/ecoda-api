import { findUserById, UserProfile } from "../repositories/user.repository";

export async function getProfile(userId: number): Promise<UserProfile | null> {
    return findUserById(userId);
}