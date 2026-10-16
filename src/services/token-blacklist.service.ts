import redis from "../config/redis";

const PREFIX = "blacklist:";

function keyFor(token: string): string {
    return `${PREFIX}${token}`;
}

export async function revoke(token: string, exp: number): Promise<void> {
    await redis.set(keyFor(token), "1", "EXAT", exp);
}

export async function isRevoked(token: string): Promise<boolean> {
    const count = await redis.exists(keyFor(token));
    return count === 1;
}
