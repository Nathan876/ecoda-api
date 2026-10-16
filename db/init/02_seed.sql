-- ============================================================================
-- Ecoda — Jeu de données de démarrage
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Objectifs écologiques
-- ----------------------------------------------------------------------------
INSERT INTO ecological_goals (slug, label, description) VALUES
    ('carbone',      'Réduire mon empreinte carbone', 'Diminuer l''impact carbone de mes déplacements et de ma consommation d''énergie au quotidien.'),
    ('alimentation', 'Manger plus durable',            'Adopter une alimentation plus locale, plus végétale et moins gaspilleuse.'),
    ('dechets',      'Limiter mes déchets',            'Réduire, trier et réemployer pour produire moins de déchets au quotidien.');

-- ----------------------------------------------------------------------------
-- Catalogue de défis
-- ----------------------------------------------------------------------------
INSERT INTO challenges (goal_id, title, difficulty, points, description) VALUES
    ((SELECT id FROM ecological_goals WHERE slug = 'carbone'),      'Se déplacer à pied, à vélo ou en transport en commun aujourd''hui', 'facile',    10, 'Privilégier un mode de déplacement doux ou collectif plutôt que la voiture individuelle.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'carbone'),      'Éteindre les appareils en veille avant de se coucher',              'facile',    10, 'Couper l''alimentation des appareils électroniques non utilisés pendant la nuit.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'carbone'),      'Faire un trajet en covoiturage',                                    'moyen',     20, 'Partager un trajet habituellement effectué seul en voiture.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'carbone'),      'Passer une journée sans prendre sa voiture',                        'ambitieux', 35, 'Trouver une alternative à la voiture sur une journée complète.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'alimentation'), 'Composer un repas 100 % végétarien',                                'facile',    10, 'Préparer un repas sans viande ni poisson.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'alimentation'), 'Acheter au moins un produit local ou de saison',                    'moyen',     20, 'Privilégier un circuit court ou un produit de saison lors des courses.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'alimentation'), 'Cuisiner un repas avec des restes plutôt que jeter',                'moyen',     20, 'Valoriser un reste de repas précédent plutôt que de le jeter.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'alimentation'), 'Tenir une semaine avec un seul repas carné',                        'ambitieux', 40, 'Limiter sa consommation de viande à un seul repas sur sept jours.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'dechets'),      'Refuser un emballage à usage unique proposé',                       'facile',    10, 'Dire non à un emballage jetable proposé lors d''un achat.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'dechets'),      'Trier et déposer un lot de déchets recyclables',                    'facile',    10, 'Trier ses déchets recyclables et les déposer au bon point de collecte.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'dechets'),      'Réparer ou donner une seconde vie à un objet plutôt que le jeter',  'moyen',     25, 'Réparer, réutiliser ou donner un objet plutôt que de le jeter.'),
    ((SELECT id FROM ecological_goals WHERE slug = 'dechets'),      'Passer une semaine en « zéro déchet non recyclable »',              'ambitieux', 40, 'Éviter toute production de déchet non recyclable sur sept jours.');

-- ----------------------------------------------------------------------------
-- Catalogue de badges
-- ----------------------------------------------------------------------------
INSERT INTO badges (code, label, condition_description) VALUES
    ('premier_pas',       '🌱 Premier pas',            'Valider son tout premier défi'),
    ('streak_3',          '🔥 3 jours de suite',        'Valider au moins un défi par jour, 3 jours consécutifs'),
    ('streak_7',          '🔥🔥 7 jours de suite',      'Valider au moins un défi par jour, 7 jours consécutifs'),
    ('eco_mobilite',      '🚲 Éco-mobilité',            'Valider 5 défis de la catégorie « Réduire mon empreinte carbone »'),
    ('assiette_responsable', '🥦 Assiette responsable', 'Valider 5 défis de la catégorie « Manger plus durable »'),
    ('zero_dechet',       '♻️ Zéro déchet',             'Valider 5 défis de la catégorie « Limiter mes déchets »'),
    ('100_points',        '🏆 100 points',              'Atteindre un cumul de 100 points'),
    ('objectif_atteint',  '🌍 Objectif atteint',        'Atteindre 100 % de progression sur son objectif écologique en cours');

-- ----------------------------------------------------------------------------
-- Utilisateurs de démonstration (personas du backlog)
--
-- Mot de passe en clair pour les deux comptes : EcodaDemo123!
-- (hash bcrypt fourni ci-dessous, généré hors application — l'implémentation
-- de la vérification du mot de passe fait partie du travail attendu)
-- ----------------------------------------------------------------------------
INSERT INTO users (email, password_hash, first_name, created_at) VALUES
    ('lea.martin@ecoda.io',   '$2y$10$LQ1HChCzE8fVQ63s2cJpu.CxTs3WYX8ziMrkjJRB89EWjo1.T07Oe', 'Léa',   now() - interval '2 days'),
    ('karim.benali@ecoda.io', '$2y$10$LQ1HChCzE8fVQ63s2cJpu.CxTs3WYX8ziMrkjJRB89EWjo1.T07Oe', 'Karim', now() - interval '45 days');

-- ----------------------------------------------------------------------------
-- Objectifs suivis
-- ----------------------------------------------------------------------------
-- Léa : nouvelle utilisatrice, vient de choisir son objectif, progression nulle
INSERT INTO user_goals (user_id, goal_id, is_active, progress_percent, started_at)
VALUES (
    (SELECT id FROM users WHERE email = 'lea.martin@ecoda.io'),
    (SELECT id FROM ecological_goals WHERE slug = 'carbone'),
    true, 0, now() - interval '2 days'
);

-- Karim : utilisateur régulier, objectif en cours avec progression avancée
INSERT INTO user_goals (user_id, goal_id, is_active, progress_percent, started_at)
VALUES (
    (SELECT id FROM users WHERE email = 'karim.benali@ecoda.io'),
    (SELECT id FROM ecological_goals WHERE slug = 'alimentation'),
    true, 65, now() - interval '45 days'
);

-- ----------------------------------------------------------------------------
-- Journal de bord — Karim : streak de 7 jours consécutifs (jusqu'à hier)
-- + un défi du jour proposé (non encore traité)
-- ----------------------------------------------------------------------------
INSERT INTO challenge_actions (user_id, challenge_id, action_date, status, validated_at)
SELECT k.id, c.id, d.action_date, 'validated', d.action_date + interval '19 hours'
FROM (VALUES
    (CURRENT_DATE - 7, 'Se déplacer à pied, à vélo ou en transport en commun aujourd''hui'),
    (CURRENT_DATE - 6, 'Éteindre les appareils en veille avant de se coucher'),
    (CURRENT_DATE - 5, 'Composer un repas 100 % végétarien'),
    (CURRENT_DATE - 4, 'Faire un trajet en covoiturage'),
    (CURRENT_DATE - 3, 'Acheter au moins un produit local ou de saison'),
    (CURRENT_DATE - 2, 'Passer une journée sans prendre sa voiture'),
    (CURRENT_DATE - 1, 'Trier et déposer un lot de déchets recyclables')
) AS d(action_date, challenge_title)
CROSS JOIN (SELECT id FROM users WHERE email = 'karim.benali@ecoda.io') AS k
JOIN challenges c ON c.title = d.challenge_title;

-- Défi du jour de Karim, pas encore traité
INSERT INTO challenge_actions (user_id, challenge_id, action_date, status)
SELECT (SELECT id FROM users WHERE email = 'karim.benali@ecoda.io'),
       (SELECT id FROM challenges WHERE title = 'Refuser un emballage à usage unique proposé'),
       CURRENT_DATE, 'proposed';

-- ----------------------------------------------------------------------------
-- Journal de bord — Léa : défi du jour proposé, rien encore validé
-- ----------------------------------------------------------------------------
INSERT INTO challenge_actions (user_id, challenge_id, action_date, status)
SELECT (SELECT id FROM users WHERE email = 'lea.martin@ecoda.io'),
       (SELECT id FROM challenges WHERE title = 'Se déplacer à pied, à vélo ou en transport en commun aujourd''hui'),
       CURRENT_DATE, 'proposed';

-- ----------------------------------------------------------------------------
-- Badges débloqués — Karim a validé 7 défis d'affilée pour un total de 115 pts
-- (10+10+10+20+20+35+10), déclenchant premier_pas, streak_3, streak_7 et 100_points
-- ----------------------------------------------------------------------------
INSERT INTO user_badges (user_id, badge_id, unlocked_at)
SELECT (SELECT id FROM users WHERE email = 'karim.benali@ecoda.io'), b.id, unlocked_at
FROM (VALUES
    ('premier_pas', CURRENT_DATE - 7 + interval '19 hours'),
    ('streak_3',    CURRENT_DATE - 5 + interval '19 hours'),
    ('streak_7',    CURRENT_DATE - 1 + interval '19 hours'),
    ('100_points',  CURRENT_DATE - 2 + interval '19 hours')
) AS d(code, unlocked_at)
JOIN badges b ON b.code = d.code;

-- Léa n'a encore aucun badge débloqué (voir US5.2 : les badges non débloqués
-- doivent rester visibles, grisés, dans l'interface).
