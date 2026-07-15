# EXCELLENCE LYCÉE

Application web (et mobile Android) d'entraînement pour les élèves du lycée en
Côte d'Ivoire, de la **Seconde à la Terminale**. Portée par la structure
**EXCELLENCE** (« Leader de la formation aux concours d'entrée à l'INP-HB et à
l'ESATIC »).

Les élèves révisent dans toutes les matières de leur classe et de leur série,
dans un esprit compétitif : résumés de cours, quiz à correction immédiate,
quiz rapide, devoirs chronométrés, duels 1 contre 1, classements, badges et
gamification.

🔗 **Application en ligne : [excellence-lycee.vercel.app](https://excellence-lycee.vercel.app)**

---

## ✨ Fonctionnalités

- **Résumés de cours** par leçon, rendus en Markdown + formules mathématiques
  (KaTeX), alignés sur les progressions officielles DPFC 2025-2026.
- **Exercices** — quiz par chapitre à **feedback immédiat** : QCM et questions
  à saisie libre, correction et justification détaillée à chaque réponse,
  déblocage progressif.
- **Quiz rapide** — questions en continu par matière, points, séries (streaks)
  et justifications.
- **Devoirs** — mode examen chronométré, noté sur 20, tentatives limitées.
- **Duels 1 contre 1** entre élèves de la même classe.
- **Classements** par matière, par classe et par établissement.
- **Badges & gamification** : niveaux d'expérience, missions quotidiennes,
  célébrations, retour audio.
- **Communauté** : chat de classe et messagerie privée (temps réel).
- **Back-office admin** : gestion des contenus, des utilisateurs, des
  signalements, matrice de couverture éditoriale.
- **Application Android** empaquetée avec Capacitor.

## 🧱 Stack technique

| Côté | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Zustand |
| Contenu | react-markdown, KaTeX, remark/rehype |
| Mobile | Capacitor 8 (Android) |
| Backend | Supabase (PostgreSQL, Auth, RLS, fonctions RPC, Realtime, Storage) |
| Hébergement | Vercel (frontend) · Supabase Cloud (base) |
| Lint | oxlint |

## 📁 Structure du dépôt

```
.
├── frontend/            # Application React (Vite)
│   ├── src/
│   │   ├── pages/       # Écrans (Dashboard, Quiz, Résumés, Admin, …)
│   │   ├── components/  # UI, quiz, gamification, layout…
│   │   ├── store/       # Zustand (auth, présence, réglages, audio)
│   │   └── lib/         # Client Supabase, utilitaires
│   └── android/         # Projet Capacitor (généré)
├── supabase/
│   ├── schema.sql       # Schéma complet (source de vérité, idempotent)
│   ├── migrations/      # Évolutions successives de la base
│   └── resumes/         # Contenus de résumés (Markdown source)
└── content_pipeline/    # Scripts de préparation de contenu
```

## 🚀 Démarrage

### 1. Base de données

Créer un projet sur [supabase.com](https://supabase.com), puis dans le
**SQL Editor** exécuter `supabase/schema.sql`, puis les fichiers de
`supabase/migrations/` dans l'ordre de leur nom.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

### 3. Compte administrateur

S'inscrire dans l'application, puis dans le SQL Editor :

```sql
update public.profiles set is_admin = true, approuve = true
where username = 'ton_pseudo';
```

## 🔒 Sécurité

- Row Level Security (RLS) sur toutes les tables sensibles.
- Les bonnes réponses ne transitent jamais vers le client avant soumission :
  correction et attribution des points passent par des fonctions RPC
  `SECURITY DEFINER` côté serveur.
- Aucune clé secrète n'est versionnée (`.env` ignoré par git).

## 📝 Licence

Propriété de la structure **EXCELLENCE**. Usage interne.
