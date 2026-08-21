# Reprise du projet — Excellence Lycée

Ce document permet de **reprendre le travail sans contexte préalable** : nouvel outil, nouvel assistant, nouvelle machine ou nouveau développeur. Il décrit l'état réel du dépôt, pas la vision.

- **Vision et cahier des charges complet** → [`README.md`](README.md) (1 700 lignes, sections 1 à 26).
- **Décisions techniques durables du frontend** → [`apps/web/AGENTS.md`](apps/web/AGENTS.md). **À lire avant toute modification de `apps/web`.** Ce fichier fait autorité sur le design, la pédagogie et les contrats techniques.

---

## 1. Quelle application est active ?

Le dépôt contient une application Web active et une archive mobile. Ne pas les confondre :

| Dossier | Statut | Rôle |
|---|---|---|
| `apps/web` | **ACTIF** — tous les développements récents | Frontend React 19 + TypeScript + Vite. C'est l'app déployée en production. |
| `apps/api` | **ACTIF** | API Fastify + TypeScript. Supabase en production, SQLite en repli local. |
| `frontend/` | **ARCHIVE MOBILE GELÉE** | Ancienne app React/Vite reliée directement à Supabase. Conservée uniquement parce qu’elle contient encore la coque Android/Capacitor et ses outils de reproduction. |

Autres dossiers : `supabase/` (schéma canonique + migrations), `content_pipeline/` (lots JSON d'exercices guidés), `scripts/` (audits par série).

> **Décision du 17 août 2026.** `apps/web` est l’unique frontend produit et l’unique cible Vercel. Ne jamais ajouter de fonctionnalité, de correction produit ou de nouveau déploiement Web dans `frontend/`. Ce dossier reste consultable pour migrer progressivement la coque Capacitor, le pont natif et les ressources Android vers l’application active. Il pourra être supprimé seulement après une migration Android validée ; voir `frontend/ARCHIVE.md`.

## 2. Lancer le projet en local

```bash
cd apps/web && npm install && npm run dev
```

Le serveur Vite démarre **automatiquement l'API** (`apps/api`) sur le port 3333 si elle ne tourne pas déjà — inutile de la lancer à la main. Le frontend écoute sur le port fixe **4173** (`strictPort: true`).

Vérifications avant de livrer :

```bash
cd apps/web && npx tsc --noEmit   # typage
cd apps/web && npx vite build     # build de production (ce que Vercel exécute)
```

### Aperçu d'un parcours sans compte (mode développement uniquement)

Des paramètres d'URL permettent d'ouvrir une leçon sans authentification. Ils sont **inactifs en production** (`import.meta.env.DEV`) :

```
http://localhost:4173/?__paths-preview&__path-preview=<pathId>&__level-preview=terminale-a
```

## 3. Déploiement

**Automatique pour le FRONTEND seulement.** Le dépôt GitHub `davykev2/excellence-lycee` est connecté au projet Vercel `excellence-lycee` (Root Directory `apps/web`). Tout push sur `main` redéploie **le frontend**.

- Production web : https://excellence-lycee.vercel.app
- Production API : projet Vercel **séparé** `excellence-lycee-api`, aliasé sur https://excellence-lycee-api.vercel.app. Le frontend l'appelle via une réécriture `/api/*` (le point d'entrée serverless est `apps/api/api/index.ts`, qui charge tout `buildApp()`).

> ⚠️ **PIÈGE : un push ne redéploie PAS l'API.** Le projet `excellence-lycee-api` ne se redéploie pas automatiquement sur push. Dès qu'on **modifie du code sous `apps/api/` (nouvelle route, logique serveur…), il faut le déployer à la main**, sinon le frontend appelle une API à l'ancien code (symptôme typique : `Route GET:/… not found` renvoyé par Fastify, alors que `/api/health` répond). Le projet est déjà lié (`apps/api/.vercel/`), donc :
>
> ```bash
> cd apps/api && npx vercel deploy --prod --yes
> ```
>
> (Vérifier ensuite : `curl https://excellence-lycee.vercel.app/api/<route>` doit renvoyer 401 et non 404.)

> **Plusieurs sessions travaillent sur ce dépôt**, parfois simultanément dans le même dossier (Claude et ChatGPT). Avant chaque lot et avant tout commit, relire `git status` : un fichier apparu ou modifié pendant la tâche appartient à la session qui l'a ouvert, sauf coordination explicite. Ne jamais écraser, embarquer dans un commit ou déployer les changements d'une autre session ; signaler immédiatement les fichiers qui se chevauchent et fusionner les ajouts intentionnellement. Chacune ne connaît que ses propres déploiements : **ne jamais déduire l'état de la production depuis l'historique git**, on conclut à un retard qui n'existe pas. La seule source de vérité est l'alias public. Avant de déployer ou de signaler un problème :
>
> ```bash
> node scripts/check-api-deploy.mjs
> ```
>
> Il compare le dernier commit touchant `apps/api/` au déploiement réellement servi par `excellence-lycee-api.vercel.app`, et sort en erreur si l'API est en retard.

Déploiement manuel de secours du **frontend** — **depuis la racine du dépôt**, jamais depuis `apps/web` (le Root Directory est déjà réglé côté Vercel) :

```bash
npx vercel --prod
```

### Migrations Supabase ciblées

L'historique distant n'est pas encore totalement réconcilié avec les anciens
fichiers locaux. Ne jamais lancer directement `supabase db push` depuis le
dépôt. Utiliser `scripts/push-supabase-migrations.mjs` avec une liste explicite
de fichiers : d'abord le mode `--dry-run`, puis le mode `--apply` accompagné de
`--confirm-project=oqvzbaneyvidmrxjtasn` après autorisation du porteur. Le
script isole l'historique distant et refuse toute migration non demandée.

## 4. Où vit le contenu pédagogique

Le contenu pédagogique enrichi est encore **versionné dans des fichiers TypeScript** sous `apps/web/src/data/` : parcours dédiés pour les Mathématiques, la Physique-Chimie et les SVT ; seeds et fabrique `createHumanitiesPath()` pour l'Histoire, la Géographie et la Philosophie. Le catalogue visible vit dans `curriculumCatalog.ts`, le chargement différé dans `learningPathLoader.ts` et le compteur consolidé dans `learningPathMetrics.ts`.

Les décisions détaillées, corrections de sources, poids XP et audits propres à chaque parcours sont consignés dans `apps/web/AGENTS.md`. **Le présent fichier racine doit rester la synthèse de reprise rapide ; ne pas y recopier toute la fiche de chaque leçon.**

> **Tension connue et assumée.** Le `README.md` (section 5) exige un référentiel « non codé en dur » et versionné, et un studio éditorial Supabase existe déjà côté admin. Les parcours pédagogiques enrichis n'ont pas encore été migrés vers ce studio : il y a donc deux sources de vérité parallèles. Toute migration doit préserver les identifiants de niveaux et les budgets XP (voir ci-dessous).

**Règle critique — ne jamais casser la progression des élèves :** les identifiants de niveaux (`id`) et les budgets XP sont utilisés par le registre XP de l'API et par les progressions déjà enregistrées en base. Enrichir un contenu est sans risque ; **renommer un `id` ou changer un `xp` impose une migration Supabase**. Chaque parcours dispose d'un budget de 10 000 XP réparti automatiquement entre ses niveaux selon leur poids relatif.

## 5. État réel au 21 août 2026

> **Reprise express.** Commencer par `git status --short`, lire cette section, puis lire `apps/web/AGENTS.md` avant toute modification du frontend. La branche active est `main`. Lire le dernier commit commun avec `git log -1 --oneline` plutôt que de figer ici un hash qui devient aussitôt périmé. Ne jamais appeler « livré » un fichier seulement présent dans l'arborescence sale et ne jamais déduire l'état de production depuis Git.

### Couverture pédagogique consolidée

| Domaine | État actuel | Suite identifiable |
|---|---|---|
| Mathématiques Terminale A | **8/8 leçons enrichies** | Lot d'exercices guidés `tle-a-maths` encore absent de `content_pipeline/batches/`. |
| Mathématiques Terminale C | **19/19 leçons enrichies** | Maintenance et audits uniquement. |
| Mathématiques Terminale D | Les 12 cartes sont couvertes, principalement par adaptation des parcours C enrichis | Conserver les ids/poids historiques ; auditer contre un PDF propre à D seulement si une divergence de programme est établie. |
| Physique-Chimie Terminales C/D | **Catalogue actuellement référencé entièrement enrichi** depuis le 11/08/2026 | Toute nouvelle carte doit suivre la règle Web/API/migration et vérifier le déploiement séparé de l'API. |
| SVT Terminale A | **7/7 leçons enrichies** | Le fichier transmis comme « L8 » est un doublon de contenu de la L4 : ne pas créer artificiellement une huitième leçon. |
| SVT Terminale C | **11/11 leçons enrichies** | Catalogue complet. L10 et L11 restent des adaptations riches du guide DPFC, pas des restitutions fidèles de PDF complets. |
| SVT Terminale D | **L1 à L10 livrées, soit 10/15 cartes** | Restent seulement L11 à L15. Respecter l'ordre du catalogue même lorsque le numéro imprimé sur le PDF diverge. |
| Histoire Terminale | **H2 à H9 enrichies** et partagées entre A/C/D | Reste H1 ; ne pas confondre avec le lot H2-H9 déclaré terminé. |
| Philosophie Terminale | **Les 10 parcours L1 à L10 sont enrichis** | Maintenance éditoriale uniquement. |
| Géographie Terminale | **G1 à G4, G6 et G7 enrichies** | G5 reste « document à fournir » : ne pas inventer son titre ni son contenu sans source. |

Il reste donc **7 leçons de Terminale identifiables non enrichies** : SVT Terminale D L11 à L15, Histoire H1 et Géographie G5. Cette dernière reste bloquée tant que sa source n’est pas fournie.

Le compteur consolidé du catalogue est **9 719 réponses évaluables** après l’ajout des 90 réponses de SVT Terminale C L11, des 100 réponses de SVT Terminale D L8 et des 110 réponses de SVT Terminale D L9. Un audit de leçon ne doit pas dépendre d'un compteur global figé quand plusieurs enrichissements avancent en parallèle ; le compteur global se verrouille dans l'audit de stabilité après consolidation des lots.

### Travail en cours — ne pas écraser

L'arborescence reste volontairement sale au 21/08/2026 après la consolidation pédagogique. Le lot de cloisonnement BAC et un fichier de configuration extérieur restent indépendants ; relire les diffs hunk par hunk avant leur propre commit.

1. **Cloisonnement après connexion.** Le nouveau contrat `apps/web/src/routing/routeAccess.ts` empêche une URL Terminale conservée avant authentification d'exposer les sujets BAC à une session Seconde/Première ; la carte BAC de l'Arène suit la même règle, avec exception administrateur. Les changements touchent `LearningApp.tsx`, `ArenaScreen.tsx` et les tests. **Lot non commité au relevé ; ne pas le mélanger à un autre lot.**
2. **Fichier extérieur.** `.claude/launch.json` est modifié : le préserver et ne pas l'embarquer sans savoir quelle session le possède.
3. **Déploiements pédagogiques vérifiés le 21/08/2026.** Le frontend public sert les trois nouveaux parcours et le compteur 9 719 ; l’alias `excellence-lycee-api.vercel.app` sert le registre XP du dernier commit avec le fournisseur Supabase. Les migrations ciblées `20260821120000`, `20260821160000`, `20260821180000`, `20260821190000` et `20260821200000` sont appliquées et enregistrées à distance. Toute modification API ou nouvelle migration ultérieure conserve la procédure de déploiement et d’application séparée décrite plus haut.

### Fonctionnalités produit déjà acquises depuis juillet

- Arène : concours BAC & BT 2024 sur 69, suivi admin, sous-notes, zones, export PDF ; annales 2017-2020 et fac-similés 2022-2023 ; ESATIC 2023-2024 interactifs. La session BAC 2018 reste bloquée tant qu'une source authentique n'est pas fournie.
- Boutique « or » : monnaie dérivée de l'XP (`50 XP = 1 or`), achats permanents, crédits administrateur et catalogue synchronisé entre Web/API/migration.
- Plateforme : récupération et changement de mot de passe, notifications e-mail via Resend avec garde-fous, clavier scientifique, niveaux publiés ouverts, chargement différé des parcours, vue éditoriale complète et accueil connecté fiabilisé.
- Social : messagerie mobile, réactions/commentaires administrables, duels avec choix de matière, leçons et adversaire en ligne.

### Règles de continuation de l'enrichissement

- Lire intégralement le PDF source et reconstruire les schémas avec les interactions natives (`schema`, `diagram`, `timeline`, `curve`) ; ne jamais republier les scans.
- Une leçon reconstruite depuis un support complet peut être marquée `faithful` ou `faithful-corrected`. Si seul le programme/guide DPFC est disponible, employer `adapted`, citer exactement les pages utilisées et ne jamais qualifier d’« officiel » un exercice inventé.
- Corriger les erreurs de source explicitement dans `corrections` ou dans un encadré « Correction/Précision » ; ne jamais les reproduire en silence.
- Conserver les ids et poids existants. Pour tout nouveau niveau ou nouveau parcours : synchroniser données Web, registre API et migration Supabase ; normaliser à 10 000 XP ; ajouter un audit dédié.
- Les enrichissements Humanités gardent les 6 ids/poids produits par `createHumanitiesPath()` et ne demandent normalement ni changement API ni migration.
- Après une modification sous `apps/api/`, exécuter `node scripts/check-api-deploy.mjs` avant toute conclusion sur la production. Une migration Supabase reste une opération ciblée et séparée, avec `--dry-run`, liste explicite et confirmation du projet.

### Jalons historiques conservés pour référence

Les éléments ci-dessous expliquent les choix déjà présents dans le code ; ils ne remplacent pas l'état consolidé et la liste de travail en cours ci-dessus.

- Enrichissement de la leçon de Chimie Terminale D « Les acides α-aminés » dans `terminalDAlphaAminoAcidsPath.ts` : 8 niveaux, 104 questions, 164 formules contrôlées, interactions originales et 10 000 XP. Le parcours `terminale-d-chemistry-alpha-amino-acids` occupe le chapitre 21 et reste propre à la Terminale D. Le cours restitue structure, nomenclature, amphion, synthèse/hydrolyse peptidique, Biuret, protéines et tous les exercices officiels. Corrections explicites de l'anion en milieu basique, de la valine tronquée, du terme `2M_N` et de la séquence Val-Ala. Registre API et migration `20260811180000_chemistry_alpha_amino_acids_path.sql` doivent rester synchronisés. **Le catalogue de Physique-Chimie des Terminales C et D actuellement référencé est désormais entièrement enrichi.**

- Enrichissement de la leçon de Chimie Terminale D « Les amines » dans `terminalDAminesPath.ts` : 7 niveaux, 86 questions, interactions originales et 10 000 XP. Le parcours `terminale-d-chemistry-amines` occupe le chapitre 18 et ne doit pas être chargé en Terminale C. La liste source des isomères de `C4H11N` est corrigée de sept à huit, la nomenclature est modernisée et l'intermédiaire alkylammonium des alkylations est explicité. Registre API et migration `20260811170000_chemistry_amines_path.sql` doivent rester synchronisés.

- Création de la **leçon 07 de Physique en Terminale C / leçon 06 en Terminale D** (« Mouvement d’une particule chargée dans un champ magnétique uniforme ») dans `terminalCDChargedParticlePath.ts` : 9 niveaux, 100 réponses évaluables, 253 formules contrôlées, une orbite et sept autres interactions originales. Les quatre activités officielles sont intégrées (déflexion, spectrographe, cyclotron, filtre de Wien) et la mission finale combine sélection de vitesse et séparation isotopique. Le nouveau registre de 10 000 XP est synchronisé Web/API/migration `20260811150000_physics_charged_particle_path.sql` ; le compteur public aligné sur tout le catalogue passe à **6 823**. Corrections explicites du symbole entrant, du faux vecteur accélération constant, du centre de déflexion, du rôle non accélérateur du champ magnétique et de l'ambiguïté passages/tours du cyclotron.

- Refonte de la **leçon 19 de Terminale C** (« Statistique à deux variables ») dans `terminalCStatisticsPath.ts` : 6 identifiants et poids historiques conservés, 83 réponses évaluables issues des 12 pages, un schéma de nuage, trois diagrammes et deux droites interactives. La leçon 11 de Terminale D réutilise ce contenu ; les 77 questions supplémentaires sont donc comptées deux fois et le compteur public passe à 4 922. L’audit dédié protège 314 formules. Corrections explicites de la numérotation interne, des arrondis prématurés, du calcul de l’estimation à 9 ha et de la fin manquante de l’exercice d’hévéa. Aucun changement API ni migration Supabase. **Les 19 leçons de Mathématiques de Terminale C sont désormais toutes enrichies.**

- Refonte de la **leçon 18 de Terminale C** (« Équations différentielles ») dans terminalCDifferentialEquationsPath.ts : 6 identifiants et poids historiques conservés, 106 réponses évaluables issues des 7 pages, cinq diagrammes et une courbe interactive. La leçon 12 de Terminale D réutilise ce contenu ; les 100 questions supplémentaires sont donc comptées deux fois et le compteur public passe à 4 768. L’audit dédié protège 525 formules. Corrections explicites de la numérotation interne, de l’année d’atteinte des 20 millions d’habitants, de la condition initiale du renforcement, de la numérotation du dernier exercice et de la dérivée omise. Aucun changement API ni migration Supabase.

- Refonte de la **leçon 17 de Terminale C** (« Probabilité conditionnelle et variable aléatoire ») dans `terminalCProbabilityPath.ts` : 8 identifiants et poids historiques conservés, 132 réponses évaluables issues des 13 pages, six diagrammes et deux schémas interactifs. La leçon 02 de Terminale D réutilise ce contenu ; les 124 questions supplémentaires sont donc comptées deux fois et le compteur public passe à 4 568. L'audit dédié protège 586 formules. Corrections explicites de l'écart type absent, de la loi d'urne inversée, des probabilités des morceaux, de la phrase tronquée, de la numérotation et de l'hypothèse d'indépendance des jours. Aucun changement API ni migration Supabase.

- Refonte de la **leçon 16 de Terminale C** (« Similitudes directes ») dans `terminalCDirectSimilaritiesPath.ts` : 9 identifiants et poids historiques conservés, 178 réponses évaluables issues des 33 pages, quatre schémas interactifs et restitution des exercices jusqu’à la mission des chevrons. L’audit dédié protège 1 189 formules. Corrections explicites du cercle d’Apollonius, de l’ellipse auxiliaire, de la somme d’aires et de l’énoncé Bac C 1998. Aucun changement API ni migration Supabase ; le compteur public passe à 4 320 exercices.

- Refonte de la **leçon 15 de Terminale C** (« Calcul intégral ») dans `terminalCIntegralCalculusPath.ts` : 8 identifiants et poids historiques conservés, 153 réponses évaluables issues des 16 pages, deux courbes interactives, un schéma de valeur moyenne et correction explicite des erreurs de la source. La leçon 10 de Terminale D réutilise le même contenu ; l’enrichissement ajoute donc 145 questions dans chacune des deux séries. L’audit `audit-terminal-c-integral-calculus-katex.mjs` protège désormais la structure et les 913 formules. Aucun changement API ni migration Supabase ; le compteur public passe à 4 151 exercices.

- Refonte de la **leçon 14 de Terminale C** (« Isométries du plan ») dans `terminalCIsometriesPath.ts` : 8 identifiants et poids historiques conservés, 188 réponses évaluables issues des 23 pages et des exercices 1 à 19, trois schémas interactifs et mission finale du motif de pagne. Aucun changement API ni migration Supabase ; le compteur public passe à 3 861 exercices.

- Refonte de la leçon 01 de Terminale A (« Étude de fonctions polynômes et de fonctions rationnelles ») : 19 niveaux enrichis, tableaux de propriétés et de variations, exemples rédigés, encadrés pédagogiques, situations d'apprentissage retirées.
- Nouvelle interaction **`curve`** dans le moteur de leçons : graphique SVG avec repère gradué, asymptotes en pointillés et point mobile piloté au curseur. Définie dans `apps/web/src/domain/paths.ts`, rendue par `apps/web/src/features/lesson/LessonWorkspace.tsx`, stylée dans `apps/web/src/styles.css`. Douze niveaux l'utilisent.
- Correctifs d'affichage transverses : résumés de niveaux rendus via `MathText`, références sources détachées en pastille, formules clés en mode display, bouton Davy réduit sous 520 px.
- Déploiement continu Vercel réparé (connexion GitHub + Root Directory `apps/web`).

- Refonte de la **leçon 01 de Terminale C** (« Limites et continuité »), sortie du générateur compact `buildOfficialMathPath` vers son propre fichier `terminalCLimitsContinuityPath.ts`, sur le modèle de la leçon 01 de Terminale A. Les **9 identifiants de niveaux et la formule de poids `50 + min(index,7)*5` y sont conservés à l'identique**, si bien que la répartition des 10 000 XP est inchangée et qu'aucune migration Supabase ni modification du registre XP de l'API n'a été nécessaire.

- Mission finale ajoutée à la leçon 01 de Terminale C et D (nouveaux identifiants de niveaux : modification coordonnée données web + `terminalCMathRewards.ts` + migration Supabase du manifeste), puis astuces mémoire de Davy ajoutées dans la leçon 01 de Terminale C.

- Refonte de la **leçon 02 de Terminale A** (« Probabilité »), sortie du générateur compact vers son propre fichier `terminalAProbabilityPath.ts`, sur le modèle de la leçon 01. Les **7 identifiants de niveaux et les poids XP (45/45/55/60/60/75/85, registre `apps/api/src/curriculum.ts`) sont conservés à l'identique** : aucune migration Supabase nécessaire. Les parcours A1 (7 niveaux) et A2 (6 niveaux, sans la partie « Variables aléatoires ») sont bâtis sur les mêmes niveaux et restent câblés dans `terminalMathPaths.ts`. La situation complexe de la kermesse de Mariam sert de mission finale au niveau 7, qui gagne une courbe interactive (fiabilité d'un test de dépistage, règle `rational-linear`). Coquilles du PDF corrigées et annotées dans `corrections` (20 474/20 457 → 20 475 ; conclusion « 17 % » → seuil exact 19/117 ≈ 16,3 %).

- Correctif CSS transverse : les pastilles des étapes de la section Méthode (`.mastery-course-card > ol`) ne fuient plus sur les listes numérotées du markdown des cours — le sélecteur enfant direct est **obligatoire**, sinon toutes les listes `1.` des corps de leçon s'affichent en pastilles tronquées.

- Refonte de la **leçon 03 de Terminale A** (« Fonction logarithme népérien ») dans `terminalANaturalLogPath.ts`. Les **8 identifiants de niveaux et les poids XP (50/55/60/65/75/75/70/75)** sont conservés : aucune migration. La situation d'apprentissage (dépistage de la typhoïde) ne subsiste que comme mission finale du niveau 8, qui intègre aussi l'exercice type Bac. Nouvelle règle de courbe **`affine-plus-log`** (slope·x + intercept + coefficient·ln x, nulle pour x ≤ 0) ajoutée à `domain/paths.ts` et `LessonWorkspace.tsx` : elle trace la courbe de ln (niveau 4) et celle du défi type Bac −2x+1+ln x (niveau 8). Coquilles annotées : inéquation « −6 » résolue comme « +6 » ; exercice 5-e avec ln(−(x−1)²) jamais défini ; trois valeurs fausses dans le tableau type Bac (f(0,25), f(1), f(3)).

- Refonte de la **leçon 04 de Terminale A** (« Fonction exponentielle ») dans `terminalAExponentialPath.ts`. Les **8 identifiants de niveaux et les poids XP (50/55/65/65/75/75/75/80)** sont conservés : aucune migration. La situation d'apprentissage (campagne publicitaire) ne subsiste que comme mission finale du niveau 8 (t = ln 0,1/−0,21 ≈ 10,96 → 11 jours). Nouvelle règle de courbe **`affine-plus-exp`** (slope·x + intercept + coefficient·e^(rate·x)) : elle trace la courbe de e^x (niveau 4) et la courbe de saturation P(t) = 1 − e^(−0,21t) (niveau 8). Coquilles annotées : la solution de l'inéquation 2 recopie « −6 » au lieu de « +6 » ; le signe de B (exercice 8) inclut 0 dans les deux intervalles alors que B(0) = 0.

- Refonte de la **leçon 05 de Terminale A** (« Suites numériques ») dans `terminalASequencesPath.ts`, avec **ajout d'un 9ᵉ niveau** (mission finale). Premier ajout de niveau côté Terminale A : modification coordonnée en trois endroits — données web, nouvelle entrée `["terminale-a-sequences:savings-career-mission", 85]` dans `apps/api/src/curriculum.ts`, et migration `supabase/migrations/20260723160000_terminal_a_sequences_mission.sql` (recalcul des 10 000 XP + réalignement des progressions, sur le modèle de la migration de Terminale C). Les 8 identifiants existants sont conservés. La mission réunit trois problèmes du PDF (épargne de Mme Koffi → géométrique ; deux plans de carrière → comparaison arithmétique/géométrique ; pont ln entre les deux familles). Nombreuses coquilles du PDF annotées dans l'exercice 6 : Vₙ₊₁ = 1,05Vₙ au lieu de 1,045 ; V₄ mal calculé ; U₂₉ = 237 000 (et non 290 000) ; C₁ = 59 220 000 (le PDF affiche 6 876 000) ; conclusion « plan A » qui contredit ses propres calculs (c'est le plan B). Deux courbes `affine-plus-exp` : saturation de la somme géométrique vers 96 (niveau 8) et capital composé de Mme Koffi (niveau 9).

- Refonte de la **leçon 06 de Terminale A** (« Statistique à deux variables ») dans `terminalAStatisticsPath.ts`, avec **ajout d'un 10ᵉ niveau** (mission finale météorologique, poids 90). Les 9 identifiants et poids existants (45/50/50/55/60/65/65/80/75) sont conservés. Modification coordonnée : données web + `apps/api/src/curriculum.ts` + migration `20260723180000_terminal_a_statistics_mission.sql`. Répartition vérifiée : 710/790/790/870/940/1020/1020/1260/1180/1420 = 10 000. Trois courbes `linear` (droite de Mayer, droite de régression pour l'estimation, droite pluviométrie/température). **Coquille majeure annotée** : dans la résolution TA2 du club littéraire (page 11), le PDF utilise 1740 au lieu de 1940 pour octobre — la date corrigée est janvier 2022 (rang 25) et non mars 2022. Également annoté : « V(X) = 4,6 » page 9 contredit le 4,16 calculé page 8, et la formule de b′ y omet le prime sur a.

- Refonte de la **leçon 07 de Terminale A** (« Systèmes linéaires ») dans `terminalALinearSystemsPath.ts`, avec **ajout de deux missions** : `awale-mission` (80) et `cocktail-programming-mission` (90). Les 4 identifiants et poids existants (60/70/65/75) sont conservés. Modification coordonnée : données web + `apps/api/src/curriculum.ts` + migration `20260723200000_terminal_a_linear_systems_missions.sql`. Répartition vérifiée : 1360/1590/1480/1700/1820/2050 = 10 000. Trois courbes `linear` (frontières x+y+1=0, 2x−y+1=0 et 8x+6y=80). **Coquille majeure annotée** : la liste des couples entiers page 9 duplique (4 ; 4) et **omet quatre couples valides** — (0 ; 13), (3 ; 9), (6 ; 5) et (8 ; 2) ; le domaine compte 45 couples et non 41 (vérifié par énumération). Également annoté : la situation d'apprentissage de la page 1 (20 bouteilles, 24 000 F) n'est jamais résolue dans le PDF — la mission finale y répond explicitement (le budget suffit largement, minimum 12 000 F).

- Refonte de la **leçon 02 de Terminale C** (« Barycentre et lignes de niveau ») dans `terminalCBarycenterPath.ts`. Les **8 identifiants existants sont conservés** et un 9ᵉ niveau `barycenter-level-set-mission` réunit la situation complexe et les exercices de synthèse. Le parcours compte 79 questions et distribue 800/880/960/1040/1120/1200/1280/1360/1360 = **10 000 XP**. Modification coordonnée : données web + `apps/api/src/terminalCMathRewards.ts` + migration `20260723213000_terminal_c_barycenter_mission.sql`, appliquée et vérifiée en production le 23/07/2026. Corrections sources annotées : en espace le lieu affine est un plan (pas une droite) ; l'angle au point variable est Mes(MA,MB) ; barycentre du cube amputé recalculé avec masses `(O,8)` et `(K,−1)` ; dans l'exercice de synthèse 5, la première somme vectorielle vaut `MG` et le rayon du lieu est `2IC`.

- Refonte de la **leçon 03 de Terminale C** (« Divisibilité dans ℤ ») dans `terminalCDivisibilityPath.ts`. Les **8 identifiants historiques restent stables** et 4 niveaux sont ajoutés : `divisibility-tests`, `modular-strategy-mission`, `affine-coding-mission`, `exponential-coding-mission`. Le parcours compte **12 niveaux, 114 questions et 10 000 XP** (minimum 570, maximum 970). Modification coordonnée : données web + `apps/api/src/terminalCMathRewards.ts` + migration `20260723230000_terminal_c_divisibility_expansion.sql`, appliquée et vérifiée en production le 23/07/2026. Coquilles importantes annotées : reste de −361 par 23 corrigé à 7 ; module 25 rétabli dans le critère correspondant ; 2419 traité à la place du 2232 hors sujet (`2419=41×59`) ; conclusion de la puissance modulo 11 rétablie ; erreurs de transcription VIWK/VIWIK et TWβTIG/TWβTGI corrigées ; cas nul séparé dans l'emploi du petit théorème de Fermat.

- Refonte de la **leçon 08 de Terminale A** (« Primitives et calcul intégral ») dans `terminalAPrimitivesIntegralsPath.ts`, avec **ajout de la mission finale** `pool-terrace-mission` (90). Les 11 identifiants et poids existants sont conservés. Modification coordonnée : données web + `apps/api/src/curriculum.ts` + migration `20260723220000_terminal_a_primitives_mission.sql`. Répartition vérifiée : 600/660/730/730/730/850/910/910/850/910/1030/1090 = 10 000. Courbes : droite 2x+1 (aire sous une courbe) et parabole −x²+4 (mission). **Coquilles annotées** : le tableau des primitives usuelles page 2 omet le signe moins pour 1/xⁿ (sa dérivée vaut −1/xⁿ) ; la réponse c) donne −3x^(−1/3) pour f(x) = x^(2/3), alors que c'est une primitive de x^(−4/3) — la bonne réponse est (3/5)x^(5/3) ; la situation d'apprentissage de la piscine n'est jamais résolue (la mission la traite : 256/3 ≈ 85,33 m²).

> ✅ **Les 8 leçons de mathématiques de Terminale A sont désormais toutes enrichies** (23/07/2026). Le générateur compact `terminalAMathFaithfulCoursePaths.ts` est **supprimé** : chaque leçon vit dans son propre fichier `terminalA<Nom>Path.ts`, tous câblés dans `terminalMathPaths.ts`.

> **Comment ajouter un niveau (procédure vérifiée).** 1) Ajouter le `OfficialLevelSeed` dans le fichier de données web (le web normalise seul les 10 000 XP via `distributeLessonXp`). 2) Ajouter la paire `["<path-id>:<lesson-id>", poids]` dans `apps/api/src/curriculum.ts` (registre `lessonRewards`). 3) Créer une migration Supabase datée qui insère les poids bruts dans `lesson_rewards`, les normalise à 10 000 XP par tranches de 10, puis réaligne `lesson_progress` sur le meilleur score. **Le déploiement Vercel n'exécute PAS les migrations Supabase** : elles doivent être appliquées à la base de production séparément (voir avec le porteur du projet). Tant que la migration n'est pas appliquée, le frontend affiche déjà la bonne répartition (calcul local), mais l'API/DB continue de servir l'ancien barème pour les XP réellement crédités.

> **Modèle à suivre pour les prochaines leçons.** Le générateur `buildOfficialMathPath` **ignore** le paramètre `weight` passé dans chaque `officialMathTopic` : il applique `50 + Math.min(index, 7) * 5`, exactement la même formule que `terminalCMathRewardWeight` côté API. Toute réécriture d'une leçon générée doit donc reproduire cette formule et conserver l'ordre des identifiants pour ne rien casser.

### Histoire — série complète (26/07/2026)

> ✅ **Les huit leçons d'Histoire du thème 2 et 3 (H2 à H9) sont désormais toutes enrichies et en ligne** : bipolarisation, monde multipolaire, montée des nationalismes, indépendance de la Côte d'Ivoire, indépendance de l'Algérie, Union africaine, valeurs du monde occidental, mutations de la civilisation négro-africaine.

**Patron différent des maths — la fabrique Humanités.** Les leçons d'Histoire, de Géographie et de Philosophie ne sont **pas** des `officialLevel` : elles sont produites par `createHumanitiesPath()` (`apps/web/src/data/humanitiesPathFactory.ts`) à partir d'un `HumanitiesCourseSeed`. Points clés :

- Un seed a **exactement 3 sections** ; la fabrique génère **6 niveaux** (1 aperçu « Les repères essentiels » + 4 niveaux de contenu + 1 mission finale). Une section est scindée en 2 niveaux via `blueprint.splitSectionIndex` (dans `humanitiesAssessmentBlueprints.ts`).
- **Titres des niveaux scindés** : ils sont dérivés des `shortLabel` du `timeline` de la section (premier item → niveau A ; items suivants joints par « et » → niveau B). Pour piloter proprement les titres, on réécrit le `timeline` de la section scindée.
- **Enrichir** = ajouter aux sections un `bodyMarkdown` (cours rédigé en markdown : titres, tableaux, encadrés) et des `extraQuestions` ; pour la section scindée, un `parts: [Partial, Partial]` avec un `bodyMarkdown`/`extraQuestions` dédié par moitié ; pour la mission, `mission.bodyMarkdown` (situation d'évaluation + documents) et `mission.extraQuestions` dans `humanitiesAssessmentBlueprints.ts`.
- **Aucune migration Supabase** : la fabrique **fige les identifiants et les XP** (les 6 poids sont dans `humanitiesMasteryRewards`, déjà au registre API). Enrichir ne touche donc que deux fichiers de données web : `terminalHistoryPaths.ts` et `humanitiesAssessmentBlueprints.ts`.
- **Leçon partagée** : `levelIds: ["terminale-a", "terminale-c", "terminale-d"]` — une seule leçon d'Histoire sert les trois séries de Terminale.
- Les coquilles factuelles du PDF source sont corrigées et annotées dans des encadrés « Correction »/« Précision » (ex. Syrte *décide*/Durban *crée* l'UA ; putsch d'avril 1961 à Alger ; Ahmed Ben Bella ; colonie de peuplement).

**Page éditoriale de l'admin (`EditorialOverview.tsx`).** La couverture est calculée **en direct** depuis le contenu réel (`bodyMarkdown` ou interaction riche). La carte de synthèse auto-générée des leçons Humanités (id en `-overview`) est désormais **comptée comme enrichie** : sans cela, une leçon d'Histoire terminée plafonnait à 5/6 « Partiel ». Rien d'autre n'est à mettre à jour à la main : ajouter du `bodyMarkdown` fait automatiquement passer la leçon à « Complet ».

### Suites naturelles

1. Terminer et livrer séparément le cloisonnement BAC après connexion. Ne pas le mélanger avec `.claude/launch.json` ni avec un enrichissement pédagogique.
2. Continuer la SVT : Terminale C L11 ; Terminale D L8, L9 puis L11 à L15, dans l'ordre du catalogue et uniquement à partir des PDF fournis.
3. En Géographie, traiter G5 seulement lorsque son document et son titre officiel sont disponibles. Les six autres leçons G1-G4/G6-G7 sont enrichies ; les dix leçons de Philosophie sont déjà terminées.
4. Créer le lot d'exercices guidés **`tle-a-maths`** manquant dans `content_pipeline/batches/`.
5. Vérifier l'historique distant avant de considérer une migration comme « en attente ». Les trois migrations de juillet anciennement signalées (`20260723180000`, `20260723200000`, `20260723220000`) ne doivent pas être réappliquées à l'aveugle ; utiliser le script ciblé et l'identifiant de projet confirmé.
6. Migrer progressivement la coque Android/Capacitor archivée sous `frontend/` vers l'application active, puis supprimer l'archive après validation mobile.
7. À plus long terme, migrer le contenu TypeScript vers le studio éditorial Supabase sans changer les ids ni les budgets XP.

## 6. Conventions de travail

- **Langue : français** pour toute l'interface, les contenus et les messages de commit.
- Consigner les décisions durables concernant `apps/web` dans `apps/web/AGENTS.md`, et non dans le README.
- Après chaque lot important livré, mettre à jour dans ce fichier racine la date, le dernier commit commun, le compteur consolidé, la couverture par matière et la section « Travail en cours ». Retirer immédiatement un lot de cette section dès qu'il est commité ou abandonné.
- Le README racine décrit la vision ; sa section « Statut actuel » se met à jour manuellement quand une fonctionnalité importante est livrée (aucune automatisation).
- Les coquilles du PDF source ne sont jamais reproduites en silence : elles sont corrigées et annotées dans le champ `corrections` du niveau concerné.
