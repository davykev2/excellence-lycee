# Reprise du projet — Excellence Lycée

Ce document permet de **reprendre le travail sans contexte préalable** : nouvel outil, nouvel assistant, nouvelle machine ou nouveau développeur. Il décrit l'état réel du dépôt, pas la vision.

- **Vision et cahier des charges complet** → [`README.md`](README.md) (1 700 lignes, sections 1 à 26).
- **Décisions techniques durables du frontend** → [`apps/web/AGENTS.md`](apps/web/AGENTS.md). **À lire avant toute modification de `apps/web`.** Ce fichier fait autorité sur le design, la pédagogie et les contrats techniques.

---

## 1. Quelle application est active ?

Le dépôt contient **deux frontends**. Ne pas se tromper :

| Dossier | Statut | Rôle |
|---|---|---|
| `apps/web` | **ACTIF** — tous les développements récents | Frontend React 19 + TypeScript + Vite. C'est l'app déployée en production. |
| `apps/api` | **ACTIF** | API Fastify + TypeScript. Supabase en production, SQLite en repli local. |
| `frontend/` | **Parallèle, non maintenu récemment** | Ancienne app React/Vite reliée directement à Supabase (+ Android/Capacitor). Aucun commit récent. Ne pas y travailler sans confirmation du porteur du projet. |

Autres dossiers : `supabase/` (schéma canonique + migrations), `content_pipeline/` (lots JSON d'exercices guidés), `scripts/` (audits par série).

## 2. Lancer le projet en local

```bash
cd apps/web && npm install && npm run dev
```

Le serveur Vite démarre **automatiquement l'API** (`apps/api`) sur le port 3333 si elle ne tourne pas déjà — inutile de la lancer à la main. Le port du frontend peut varier (5173 ou 4173 selon la disponibilité).

Vérifications avant de livrer :

```bash
cd apps/web && npx tsc --noEmit   # typage
cd apps/web && npx vite build     # build de production (ce que Vercel exécute)
```

### Aperçu d'un parcours sans compte (mode développement uniquement)

Des paramètres d'URL permettent d'ouvrir une leçon sans authentification. Ils sont **inactifs en production** (`import.meta.env.DEV`) :

```
http://localhost:<port>/?__paths-preview&__path-preview=<pathId>&__level-preview=terminale-a
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

Déploiement manuel de secours du **frontend** — **depuis la racine du dépôt**, jamais depuis `apps/web` (le Root Directory est déjà réglé côté Vercel) :

```bash
npx vercel --prod
```

## 4. Où vit le contenu pédagogique

Le contenu des leçons de mathématiques est **codé en dur dans des fichiers TypeScript** sous `apps/web/src/data/` (`terminalAPolynomialRationalPath.ts`, `terminalCMathPaths*.ts`, `terminalDMathPaths.ts`, etc.).

> **Tension connue et assumée.** Le `README.md` (section 5) exige un référentiel « non codé en dur » et versionné, et un studio éditorial Supabase existe déjà côté admin. Les leçons de maths n'ont pas encore été migrées vers ce studio : il y a donc deux sources de vérité parallèles. Toute migration doit préserver les identifiants de niveaux et les budgets XP (voir ci-dessous).

**Règle critique — ne jamais casser la progression des élèves :** les identifiants de niveaux (`id`) et les budgets XP sont utilisés par le registre XP de l'API et par les progressions déjà enregistrées en base. Enrichir un contenu est sans risque ; **renommer un `id` ou changer un `xp` impose une migration Supabase**. Chaque parcours dispose d'un budget de 10 000 XP réparti automatiquement entre ses niveaux selon leur poids relatif.

## 5. État au 23 juillet 2026

Dernier travail livré et déployé en production :

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

### Suites naturelles

1. Appliquer le même traitement d'enrichissement aux leçons restantes des autres séries. **La Terminale A est terminée : ses 8 leçons sont toutes enrichies.** En Terminale C, les leçons 01 à 03 sont désormais enrichies ; les leçons 04 à 19 et les 12 leçons de Terminale D utilisent encore le générateur compact.
1b. **Appliquer à la base de production Supabase les trois migrations en attente** : `20260723180000_terminal_a_statistics_mission.sql`, `20260723200000_terminal_a_linear_systems_missions.sql` et `20260723220000_terminal_a_primitives_mission.sql` (le déploiement Vercel ne les exécute pas). La migration `20260723160000` des Suites a, elle, été appliquée et vérifiée le 23/07/2026.
2. Créer le lot d'exercices guidés **`tle-a-maths`** manquant dans `content_pipeline/batches/` (les autres séries et matières en ont un).
3. Trancher la question des deux frontends (`apps/web` vs `frontend/`).
4. Migrer le contenu des fichiers TS vers le studio éditorial Supabase.

## 6. Conventions de travail

- **Langue : français** pour toute l'interface, les contenus et les messages de commit.
- Consigner les décisions durables concernant `apps/web` dans `apps/web/AGENTS.md`, et non dans le README.
- Le README racine décrit la vision ; sa section « Statut actuel » se met à jour manuellement quand une fonctionnalité importante est livrée (aucune automatisation).
- Les coquilles du PDF source ne sont jamais reproduites en silence : elles sont corrigées et annotées dans le champ `corrections` du niveau concerné.
