# API Excellence Lycée

Service d’authentification et de persistance du MVP.

## Responsabilités actuelles

- inscription et connexion sécurisées ;
- rotation des sessions avec cookie `HttpOnly` ;
- rôles élève, enseignant, éditeur et administrateur ;
- profil scolaire en lecture seule pour l’utilisateur ;
- consultation des profils et modification administrateur du niveau/série ;
- progression des leçons et attribution d’XP côté serveur ;
- conversations privées, messages non lus, réponses, accusés de lecture, modification, suppression logique, silence et archivage ;
- journal d’audit des actions sensibles.

Supabase Auth et PostgreSQL sont le fournisseur principal. Les profils et la progression sont protégés par Row Level Security, les XP sont attribués par une fonction PostgreSQL contrôlée et le rafraîchissement de session reste dans un cookie `HttpOnly`. SQLite reste disponible comme solution locale de repli lorsque les variables Supabase sont absentes.

## Configuration Supabase

1. Appliquer, dans l’ordre, les migrations de `../../supabase/migrations/` au projet.
2. Définir `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env`.
3. Ne jamais placer une clé `secret` ou `service_role` dans le frontend.

## Variables d’environnement

Copier `.env.example` vers `.env`. En mode Supabase, `JWT_SECRET` n’est utilisé que par le fournisseur SQLite de repli ; la clé Publishable Supabase reste de faible privilège.

## Gestion administrateur des utilisateurs

- `GET /users` liste les profils et leur progression pour un compte `admin`.
- `PATCH /users/:userId/level` valide puis modifie le niveau/série du profil ciblé.

La modification Supabase passe exclusivement par `admin_update_profile_level`, vérifie le rôle dans PostgreSQL et ajoute une entrée à `audit_logs`.

Les routes `POST /users/me/photo` et `DELETE /users/me/photo` permettent à un utilisateur de gérer sa propre photo. Les fichiers JPG, PNG et WebP sont contrôlés côté serveur, limités à 1,5 Mo après optimisation et stockés dans le bucket `profile-photos`; les règles Storage limitent l’écriture au dossier correspondant à l’identifiant du compte.

## Messagerie privée

Les routes authentifiées sous `/messages` permettent de rechercher les destinataires autorisés, créer une conversation, envoyer ou répondre à un message, marquer une conversation comme lue, modifier ou supprimer logiquement son propre message, puis mettre la conversation en sourdine ou l’archiver. En mode Supabase, ces opérations passent exclusivement par les fonctions `message_*` de la migration `20260721153000_secure_messaging.sql`; les tables restent protégées par RLS et ne sont pas exposées directement au frontend.

Le script `npm run test:messages` vérifie le parcours complet avec le fournisseur SQLite local.

## Voix officielle de Davy

La voix clonée de Davy est générée exclusivement côté API. Aucun secret fournisseur, échantillon vocal ni fichier d’autorisation ne doit être placé dans le frontend ou dans les assets publiés.

Préparer un enregistrement fourni et son autorisation :

```bash
npm run voice:prepare -- "chemin/voix.m4a" "chemin/autorisation.m4a"
```

Les fichiers optimisés sont écrits dans `data/voice-private/`, déjà exclu du dépôt. Après avoir configuré `ELEVENLABS_API_KEY` dans `.env`, créer une seule fois la voix :

```bash
npm run voice:create
```

Reporter ensuite l’identifiant affiché dans `DAVY_VOICE_ID`. La route authentifiée `POST /companion/speech` produit l’audio, limite le débit et met en cache les messages répétés. Le frontend revient automatiquement à une voix système masculine si le fournisseur est indisponible.
