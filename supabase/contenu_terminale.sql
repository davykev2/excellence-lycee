-- ============================================================================
-- EXCELLENCE LYCÉE — chapitres officiels de Terminale (Maths, Physique-Chimie,
-- SVT, Philosophie, Français — séries A/C/D), à partir des progressions
-- annuelles DPFC 2025-2026. Idempotent : rejouable sans dupliquer.
-- À exécuter APRÈS supabase/schema.sql.
-- ============================================================================

-- ---- Mathématiques — Terminale C et D --------------------------------------
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'Limites et continuité', 'Limites de fonctions, continuité, théorème des valeurs intermédiaires'),
  (2, 'Dérivabilité et étude de fonctions', 'Nombre dérivé, sens de variation, tableaux de variation, tracé de courbes'),
  (3, 'Primitives et équations différentielles', 'Calcul de primitives, résolution d''équations différentielles simples'),
  (4, 'Calcul intégral', 'Intégrale d''une fonction continue, aires, calculs de volumes'),
  (5, 'Suites numériques', 'Suites arithmétiques, géométriques, convergence, limites de suites'),
  (6, 'Fonction logarithme népérien', 'Propriétés algébriques, dérivée, étude de fonctions avec ln'),
  (7, 'Fonction exponentielle', 'Propriétés algébriques, dérivée, croissances comparées'),
  (8, 'Nombres complexes', 'Forme algébrique, forme trigonométrique, équations dans C'),
  (9, 'Probabilités conditionnelles', 'Probabilité conditionnelle, indépendance, arbres pondérés'),
  (10, 'Dénombrement', 'Combinaisons, arrangements, factorielle, applications aux probabilités'),
  (11, 'Statistiques', 'Séries statistiques à deux variables, ajustement affine, corrélation'),
  (12, 'Géométrie dans l''espace', 'Repérage, vecteurs, plans et droites de l''espace')
) as x(ordre, titre, description) on true
where m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- ---- Mathématiques — Terminale A (programme allégé) ------------------------
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'Suites numériques', 'Suites arithmétiques et géométriques, sens de variation'),
  (2, 'Fonctions et limites', 'Étude de fonctions usuelles, limites simples'),
  (3, 'Dérivation', 'Nombre dérivé, tableaux de variation'),
  (4, 'Fonction logarithme népérien', 'Propriétés et utilisation en résolution d''équations'),
  (5, 'Statistiques', 'Séries statistiques, paramètres de position et de dispersion'),
  (6, 'Probabilités', 'Probabilités simples, arbres de probabilité')
) as x(ordre, titre, description) on true
where m.slug = 'maths' and n.nom = 'Terminale' and s.nom = 'A'
on conflict (matiere_id, serie_id, ordre) do nothing;

-- ---- Physique-Chimie — Terminale C et D -------------------------------------
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'Mouvement et forces', 'Cinématique et dynamique du point, lois de Newton'),
  (2, 'Travail et puissance', 'Travail d''une force, puissance, théorème de l''énergie cinétique'),
  (3, 'Énergie mécanique', 'Énergie potentielle, énergie mécanique, conservation'),
  (4, 'Dipôles RC et RL', 'Charge et décharge d''un condensateur, établissement du courant dans une bobine'),
  (5, 'Ondes mécaniques', 'Propagation, célérité, diffraction, ondes progressives périodiques'),
  (6, 'Physique nucléaire', 'Radioactivité, désintégration, réactions nucléaires'),
  (7, 'Avancement d''une réaction chimique', 'Réactif limitant, tableau d''avancement, vitesse de réaction'),
  (8, 'Équilibres acido-basiques', 'pH, couples acide/base, dosages acido-basiques'),
  (9, 'Oxydoréduction', 'Couples oxydant/réducteur, piles, électrolyse'),
  (10, 'Chimie organique', 'Familles de composés organiques, réactions caractéristiques')
) as x(ordre, titre, description) on true
where m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom in ('C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- ---- SVT — Terminale C et D --------------------------------------------------
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'Génétique et hérédité', 'Transmission des caractères, lois de Mendel, croisements'),
  (2, 'Brassage génétique et diversité', 'Méiose, brassage intrachromosomique et interchromosomique'),
  (3, 'Immunologie', 'Réaction immunitaire, antigènes, anticorps, vaccination'),
  (4, 'Système nerveux', 'Organisation, message nerveux, réflexes'),
  (5, 'Reproduction et sexualité', 'Appareils reproducteurs, cycle ovarien, procréation médicalement assistée'),
  (6, 'Écosystèmes et dynamique des populations', 'Chaînes alimentaires, facteurs limitants, équilibres écologiques'),
  (7, 'Tectonique des plaques', 'Dérive des continents, expansion océanique, séismes et volcanisme')
) as x(ordre, titre, description) on true
where m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- ---- Philosophie — Terminale A, C et D --------------------------------------
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'La conscience', 'Conscience de soi, inconscient, identité personnelle'),
  (2, 'Le désir', 'Nature du désir, désir et bonheur, désir et raison'),
  (3, 'La liberté', 'Libre arbitre, déterminisme, liberté et responsabilité'),
  (4, 'Le devoir et la morale', 'Fondements de la morale, devoir kantien, relativisme moral'),
  (5, 'La justice et le droit', 'Justice légale et justice naturelle, droit positif'),
  (6, 'L''État et la société', 'Pouvoir politique, contrat social, autorité de l''État'),
  (7, 'La science et la vérité', 'Méthode scientifique, vérité et démonstration, critique de la science'),
  (8, 'Le langage', 'Fonction du langage, langage et pensée, communication'),
  (9, 'L''art', 'Création artistique, beauté, art et vérité'),
  (10, 'Le bonheur', 'Quête du bonheur, bonheur et vertu, bonheur et société')
) as x(ordre, titre, description) on true
where m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- ---- Français — Terminale A, C et D -----------------------------------------
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'Le roman et ses personnages', 'Techniques narratives, construction des personnages, points de vue'),
  (2, 'La poésie engagée', 'Formes poétiques, poésie africaine engagée, figures de style'),
  (3, 'Le théâtre : comédie et tragédie', 'Genres théâtraux, conflits dramatiques, mise en scène'),
  (4, 'L''argumentation et l''essai', 'Thèse, arguments, exemples, structure argumentative'),
  (5, 'La littérature africaine contemporaine', 'Auteurs ivoiriens et africains, courants littéraires'),
  (6, 'Techniques de la dissertation', 'Problématisation, plan dialectique, rédaction'),
  (7, 'Techniques du commentaire composé', 'Analyse littéraire, axes de lecture, procédés stylistiques')
) as x(ordre, titre, description) on true
where m.slug = 'francais' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;
