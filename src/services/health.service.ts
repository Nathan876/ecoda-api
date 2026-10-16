import db from "../config/db";
import redis from "../config/redis";

export type DependencyStatus = "ok" | "error";

export interface HealthReport {
    status: "ok" | "degraded";
    dependencies: {
        postgres: DependencyStatus;
        redis: DependencyStatus;
    };
}

const CHECK_TIMEOUT_MS = 1500;

// ioredis retente indéfiniment une connexion perdue par défaut : sans ce
// timeout, une commande en attente peut bloquer la réponse bien au-delà de
// ce qu'on attend d'un endpoint de santé.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("timeout")), ms);
        }),
    ]);
}

async function checkPostgres(): Promise<DependencyStatus> {
    try {
        await withTimeout(db.query("SELECT 1"), CHECK_TIMEOUT_MS);
        return "ok";
    } catch {
        return "error";
    }
}

async function checkRedis(): Promise<DependencyStatus> {
    try {
        await withTimeout(redis.ping(), CHECK_TIMEOUT_MS);
        return "ok";
    } catch {
        return "error";
    }
}

export async function getHealthReport(): Promise<HealthReport> {
    const [postgres, redisStatus] = await Promise.all([checkPostgres(), checkRedis()]);
    const dependencies = { postgres, redis: redisStatus };
    const status = Object.values(dependencies).every((s) => s === "ok") ? "ok" : "degraded";

    return { status, dependencies };
}
