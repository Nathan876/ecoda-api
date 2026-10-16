// Exemple isolé, non branché à l'application : illustre uniquement la syntaxe
// TTL d'ioredis. Ne résout aucun des cas d'usage évalués (blacklist de tokens, rate limiting) — la structure de clé adaptée à chaque cas est à concevoir.
// Lancer avec : npm run redis:example (Redis doit tourner)

import redis from "../src/config/redis";

async function main() {
    await redis.set("example:foo", "bar", "EX", 60); // expire après 60 secondes
    console.log("GET example:foo ->", await redis.get("example:foo"));
    console.log("TTL example:foo ->", await redis.ttl("example:foo"), "secondes restantes");

    await redis.quit();
}

main();
