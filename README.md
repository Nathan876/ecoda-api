# Partiel 3 — Socle de départ (API Express/TypeScript + PostgreSQL + Redis)

Ce socle est le **point de départ fourni** pour le Partiel 3. 
Il couvre la plomberie technique (connexion PostgreSQL/Redis, environnement Docker) et la **génération** du token JWT (`POST /auth/login`). 

Il ne contient **aucune logique de vérification, de révocation ou de limitation** : le middleware d'authentification, son intégration à Redis (blacklist) et le rate limiting sont intégralement à votre charge.

## Stack

- **Node.js / TypeScript** (Express 5)
- **PostgreSQL** pour les données (utilisateurs, objectifs, défis, badges)
- **Redis** pour la révocation de tokens et le rate limiting (à implémenter)
- **Vitest** + **Supertest** pour les tests
- **Zod** + **`@asteasolutions/zod-to-openapi`** + **`swagger-ui-express`** pour une documentation générée automatiquement à partir des schémas de validation (aucun YAML à écrire à la main)

## Démarrage

```bash
cp .env.example .env
docker compose up -d      # PostgreSQL + Redis
npm install
npm run dev                # démarre l'API en local avec rechargement à chaud
```

- L'API écoute sur http://localhost:3000
- `GET /health` — route publique, vérifie l'API **et** ses dépendances (PostgreSQL, Redis) :

```json
{ "status": "ok", "dependencies": { "postgres": "ok", "redis": "ok" } }
```
Renvoie `200` si tout est opérationnel, `503` (`status: "degraded"`) si une dépendance ne répond pas. Chaque vérification a un timeout de 1,5s pour ne jamais bloquer la réponse.

- `POST /auth/login` — fourni, voir plus bas
- **Swagger UI** : http://localhost:3000/docs (spec brute en JSON sur `/docs.json`)

Pour repartir d'une base PostgreSQL vierge :

```bash
docker compose down -v
docker compose up -d
```

## Scripts npm

| Commande                | Effet                                                    |
|-------------------------|----------------------------------------------------------|
| `npm run dev`           | Lance l'API en TypeScript direct (rechargement à chaud)  |
| `npm run build`         | Compile TypeScript vers `dist/`                          |
| `npm start`             | Lance la version compilée (`dist/server.js`)             |
| `npm test`              | Exécute les tests Vitest                                 |
| `npm run test:watch`    | Tests en mode watch                                      |
| `npm run redis:example` | Exécute l'exemple isolé de commande Redis avec TTL       |
| `npm run docs:export`   | Exporte la spec OpenAPI générée dans `docs/openapi.json` |

## Documentation API (Swagger)

La documentation n'est **pas** écrite à la main : elle est générée à partir des mêmes schémas **Zod** qui valident les requêtes. 
Chaque ressource définit son schéma une seule fois (`src/schemas/`), utilisé à deux endroits :

1. **Validation** — dans le contrôleur, via `schema.safeParse(req.body)` (voir `src/controllers/auth.controller.ts`)
2. **Documentation** — dans le fichier de routes, via `registry.registerPath({ ... })` qui référence ce même schéma (voir `src/routes/auth.routes.ts`)

`src/config/swagger.ts` assemble ensuite tous les chemins enregistrés dans le `registry` (`src/openapi/registry.ts`) en un document OpenAPI, servi par Swagger UI.

Pour documenter une nouvelle route : 
- définissez son schéma Zod dans `src/schemas/`
- utilisez-le pour valider le payload dans le contrôleur
- puis appelez `registry.registerPath({ ... })` dans le fichier de routes en lui passant ce schéma. 

Aucun YAML à écrire, aucune duplication entre validation et documentation — si vous changez le schéma, la doc suit automatiquement.

Pour produire un fichier statique à joindre à votre livrable final :

```bash
npm run docs:export   # écrit docs/openapi.json
```

## Authentification fournie

`POST /auth/login` vérifie l'email et le mot de passe contre les données seedées dans PostgreSQL (hash bcrypt) et renvoie un JWT :

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lea.martin@ecoda.io","password":"EcodaDemo123!"}'
```

Payload du token (`src/services/auth.service.ts`) :

```json
{ "userId": 1, "email": "lea.martin@ecoda.io", "iat": ..., "exp": ... }
```

- Secret et durée de vie (`1h` par défaut) définis dans `.env` (`JWT_SECRET`, `JWT_EXPIRES_IN`) — la même clé doit être utilisée par votre middleware de vérification.
- Aucune notion de rôle n'est modélisée dans la base fournie : si votre middleware d'autorisation doit distinguer des permissions, la conception du modèle (rôle, propriété de la ressource, etc.) est à votre charge.

Documentation officielle `jsonwebtoken` (régime A) : https://github.com/auth0/node-jsonwebtoken#readme

## Client Redis

`src/config/redis.ts` exporte une connexion `ioredis` déjà instanciée (hôte/port/mot de passe lus depuis `.env`). Aucune logique métier n'y est présente.

Un exemple isolé de syntaxe TTL, non branché à l'application, est disponible dans `examples/redis-ttl-example.ts` :

```bash
npm run redis:example
```

Documentation officielle Redis (régime A) : https://redis.io/docs/latest/

## Structure du projet

```
src/
  config/        env.ts, db.ts, redis.ts, swagger.ts (assemble le document OpenAPI)
  openapi/       registry.ts (fourni) — registre Zod partagé, security scheme bearerAuth
  schemas/       common.schemas.ts, auth.schemas.ts (fournis) — schémas Zod = validation + doc
  repositories/  user.repository.ts (fourni) — seul point d'accès SQL à la table users
  services/      auth.service.ts (fourni) — logique métier (vérif. mot de passe, JWT)
  controllers/   auth.controller.ts (fourni)
  routes/        health.routes.ts, auth.routes.ts (fournis) — enregistrent leur chemin OpenAPI
  middlewares/   vide — à vous de coder la vérification JWT, la blacklist, le rate limiting
tests/           health.test.ts, auth.test.ts (exemples Vitest + Supertest fournis)
examples/        redis-ttl-example.ts
```

Le socle suit un découpage **repository → service → controller → route** : chaque table n'est interrogée en SQL brut que depuis son repository (`src/repositories/`), jamais directement depuis un service ou un contrôleur.
En ajoutant vos propres ressources (`goals`, `challenges`, `actions`, `badges`...), gardez cette séparation : un repository par table/agrégat, le service au-dessus pour la logique, le contrôleur pour le mapping HTTP.

Avec **Express 5**, une route `async` qui rejette (erreur de base de données, etc.) est automatiquement relayée au middleware d'erreur — inutile d'écrire un wrapper `try/catch` ou `asyncHandler` autour de chaque contrôleur, comme c'était nécessaire en Express 4.

### Tests
`tests/auth.test.ts` mocke `src/repositories/user.repository.ts` (`vi.mock`) : 
le test vérifie le comportement HTTP réel du contrôleur et du service (validation Zod, comparaison bcrypt, émission du JWT) sans dépendre d'une vraie base PostgreSQL — `npm test` reste rapide et exécutable sans `docker compose up`. 
Suivez ce modèle (mocker le repository, pas le service) pour vos propres tests de contrôleur.

## Données de démarrage

Le schéma et le jeu de données PostgreSQL sont identiques à ceux utilisés
pour la gestion des utilisateurs et des défis (tables `users`, `ecological_goals`, `user_goals`, `challenges`, `challenge_actions`, `badges`, `user_badges` — voir `db/init/`).

Deux comptes de démonstration, mot de passe en clair commun :
**`EcodaDemo123!`** :

| Utilisateur | Email                   |
|-------------|-------------------------|
| Léa         | `lea.martin@ecoda.io`   |
| Karim       | `karim.benali@ecoda.io` |

