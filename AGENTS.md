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

**Automatique.** Le dépôt GitHub `davykev2/excellence-lycee` est connecté au projet Vercel `excellence-lycee`, dont le **Root Directory est `apps/web`**. Tout push sur `main` déclenche un déploiement de production.

- Production web : https://excellence-lycee.vercel.app
- Production API : https://excellence-lycee-api.vercel.app (projet Vercel séparé, `excellence-lycee-api`)

Déploiement manuel de secours — **depuis la racine du dépôt**, jamais depuis `apps/web` (le Root Directory est déjà réglé côté Vercel) :

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

> **Modèle à suivre pour les prochaines leçons.** Le générateur `buildOfficialMathPath` **ignore** le paramètre `weight` passé dans chaque `officialMathTopic` : il applique `50 + Math.min(index, 7) * 5`, exactement la même formule que `terminalCMathRewardWeight` côté API. Toute réécriture d'une leçon générée doit donc reproduire cette formule et conserver l'ordre des identifiants pour ne rien casser.

### Suites naturelles

1. Appliquer le même traitement d'enrichissement aux **leçons 02 à 08 de Terminale A** (PDF sources fournis par le porteur du projet). Elles sont aujourd'hui bien plus légères que la leçon 01 : environ 200 lignes chacune dans `terminalAMathFaithfulCoursePaths.ts`, contre ~1 000 pour la leçon 01. Les 19 leçons de Terminale C et les 12 de Terminale D sont dans le même cas (générateur compact).
2. Ajouter à la leçon 01 de Terminale C une **mission finale** et un niveau dédié aux méthodes d'approximation. Ces ajouts créent de nouveaux identifiants de niveaux : ils imposent une modification coordonnée en trois endroits — données web, `apps/api/src/terminalCMathRewards.ts`, et une nouvelle migration Supabase mettant à jour le manifeste `terminal_c_math_manifest`.
2. Créer le lot d'exercices guidés **`tle-a-maths`** manquant dans `content_pipeline/batches/` (les autres séries et matières en ont un).
3. Trancher la question des deux frontends (`apps/web` vs `frontend/`).
4. Migrer le contenu des fichiers TS vers le studio éditorial Supabase.

## 6. Conventions de travail

- **Langue : français** pour toute l'interface, les contenus et les messages de commit.
- Consigner les décisions durables concernant `apps/web` dans `apps/web/AGENTS.md`, et non dans le README.
- Le README racine décrit la vision ; sa section « Statut actuel » se met à jour manuellement quand une fonctionnalité importante est livrée (aucune automatisation).
- Les coquilles du PDF source ne sont jamais reproduites en silence : elles sont corrigées et annotées dans le champ `corrections` du niveau concerné.
