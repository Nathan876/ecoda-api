import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "../openapi/registry";

// Imports en effet de bord : chaque fichier de route appelle
// registry.registerPath(...) à son chargement. Les importer ici garantit
// que le registre est peuplé avant la génération, quel que soit l'ordre
// d'import ailleurs dans l'application.
import "../routes/health.routes";
import "../routes/auth.routes";

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openapiSpec = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "Ecoda API",
        version: "0.1.0",
        description:
            "API publique de la plateforme Ecoda (utilisateurs, objectifs, défis, actions, badges). " +
            "Cette documentation est générée automatiquement à partir des schémas Zod déclarés dans " +
            "src/schemas/ et enregistrés via registry.registerPath(...) dans chaque fichier de route " +
            "(src/routes/*.ts) : le même schéma sert à la fois à valider les requêtes et à documenter " +
            "l'API, sans YAML à écrire à la main.",
    },
    servers: [{ url: "http://localhost:3000" }],
});
