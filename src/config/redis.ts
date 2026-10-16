import Redis from "ioredis";
import config from "./env";

// Connexion uniquement : aucune logique métier ici (blacklist, rate limiting...).
const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    lazyConnect: true,
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

export default redis;
