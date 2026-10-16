-- ============================================================================
-- Ecoda — Schéma relationnel (gestion des utilisateurs et des défis)
-- ============================================================================
-- Ce schéma sert de source de données à l'API : utilisateurs, objectifs
-- écologiques, défis, journal d'actions et badges.
--
-- La vérification des mots de passe (au-delà de la route POST /login fournie),
-- la révocation de tokens et le rate limiting ne font pas partie de ce schéma :
-- ils sont pris en charge côté Redis, à votre charge.
-- ============================================================================

CREATE TYPE challenge_difficulty AS ENUM ('facile', 'moyen', 'ambitieux');
CREATE TYPE challenge_action_status AS ENUM ('proposed', 'validated', 'to_retry');

-- ----------------------------------------------------------------------------
-- Utilisateurs
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Objectifs écologiques (catalogue) — US3.1
-- ----------------------------------------------------------------------------
CREATE TABLE ecological_goals (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(50) NOT NULL UNIQUE,
    label       VARCHAR(150) NOT NULL,
    description TEXT
);

-- Objectif(s) suivi(s) par un utilisateur — US3.1
CREATE TABLE user_goals (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id          INTEGER NOT NULL REFERENCES ecological_goals(id) ON DELETE RESTRICT,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    progress_percent SMALLINT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, goal_id)
);

CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);

-- ----------------------------------------------------------------------------
-- Défis (catalogue) — US4.1, Epic 4 "Exemples de défis et récompenses"
-- ----------------------------------------------------------------------------
CREATE TABLE challenges (
    id          SERIAL PRIMARY KEY,
    goal_id     INTEGER NOT NULL REFERENCES ecological_goals(id) ON DELETE RESTRICT,
    title       VARCHAR(255) NOT NULL,
    difficulty  challenge_difficulty NOT NULL,
    points      SMALLINT NOT NULL CHECK (points > 0),
    description TEXT
);

CREATE INDEX idx_challenges_goal_id ON challenges(goal_id);

-- Défi proposé/validé/raté pour un utilisateur, un jour donné — US4.2, US4.3, US6.1
CREATE TABLE challenge_actions (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE RESTRICT,
    action_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    status       challenge_action_status NOT NULL DEFAULT 'proposed',
    validated_at TIMESTAMPTZ,
    UNIQUE (user_id, challenge_id, action_date)
);

CREATE INDEX idx_challenge_actions_user_id ON challenge_actions(user_id);
CREATE INDEX idx_challenge_actions_user_date ON challenge_actions(user_id, action_date);

-- ----------------------------------------------------------------------------
-- Badges (catalogue et déblocages) — US5.2, "Exemples de badges"
-- ----------------------------------------------------------------------------
CREATE TABLE badges (
    id                    SERIAL PRIMARY KEY,
    code                  VARCHAR(50) NOT NULL UNIQUE,
    label                 VARCHAR(150) NOT NULL,
    condition_description TEXT NOT NULL
);

CREATE TABLE user_badges (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id    INTEGER NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
