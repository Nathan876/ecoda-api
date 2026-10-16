import { Pool } from "pg";
import config from "./env";

const pool = new Pool({ connectionString: config.databaseUrl });

// pg émet 'error' sur le Pool quand un client inactif perd sa connexion
// (ex. Postgres redémarré/arrêté) : sans ce listener, l'erreur n'est pas
// gérée et fait planter tout le process Node.
pool.on("error", (err) => {
    console.error("Postgres pool error:", err.message);
});

export default pool;
