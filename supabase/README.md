# Supabase — Excellence Lycée

Le dossier `migrations/` contient le schéma distant reproductible de la plateforme.

La première migration installe :

- les profils liés à `auth.users` ;
- les types de compte élève, parent et enseignant ;
- la progression des leçons ;
- une attribution d’XP contrôlée côté PostgreSQL ;
- les journaux d’audit ;
- les politiques Row Level Security.

La clé publique `anon` ou `publishable` est utilisée exclusivement par l’API Fastify pour les opérations authentifiées au nom de l’utilisateur. Aucune clé `service_role` n’est nécessaire au fonctionnement courant.

## Appliquer une migration de production sans pousser l'historique

L'historique distant antérieur n'est pas encore entièrement réconcilié avec
les fichiers locaux. Il est donc **interdit d'exécuter directement** un
`supabase db push` depuis la racine : le CLI proposerait aussi d'anciennes
migrations déjà appliquées manuellement.

Utiliser exclusivement le garde-fou ciblé :

```bash
# Lecture seule : affiche l'unique migration qui serait envoyée
node scripts/push-supabase-migrations.mjs --dry-run 20260805120000_email_notifications.sql

# Production : le projet doit être confirmé explicitement
node scripts/push-supabase-migrations.mjs --apply \
  --confirm-project=oqvzbaneyvidmrxjtasn \
  20260805120000_email_notifications.sql
```

La commande refuse les chemins, les versions dupliquées, les migrations déjà
enregistrées et toute confirmation visant un autre projet. Elle reconstruit un
projet Supabase temporaire avec l'historique distant, exécute toujours un
dry-run, vérifie que **seuls** les fichiers explicitement autorisés sont
proposés, puis nettoie le dossier temporaire. Sans `--apply`, aucune écriture
distante n'est effectuée. Après une application, l'historique distant est relu
pour confirmer l'enregistrement de chaque version demandée.
