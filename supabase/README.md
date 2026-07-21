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
