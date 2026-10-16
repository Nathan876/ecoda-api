import redis from "../config/redis";

export const ACTIONS_LIMIT = 10;
export const ACTIONS_WINDOW_SECONDS = 60;

export async function hit(userId: number): Promise<number> {
    const key = `rate-limit:${userId}`;
    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, ACTIONS_WINDOW_SECONDS);
    }
    return count;
}