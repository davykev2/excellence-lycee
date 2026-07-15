# Migrations Supabase

Ces fichiers font évoluer une base déjà installée. `../schema.sql` représente
l'état complet attendu pour une nouvelle installation.

## Procédure

1. Sauvegarder la base Supabase.
2. Exécuter les migrations dans l'ordre de leur nom.
3. Vérifier que la transaction se termine par `COMMIT` sans erreur.
4. Tester avec un compte élève puis un compte administrateur avant de redéployer le frontend.

## État de déploiement

Le 12 juillet 2026, les effets de `2026071201_security_hardening.sql` ont été
vérifiés sur le projet Supabase `cxcxztiyzprgcjniimuf` : tables, RPC, index,
valeurs par défaut et restrictions de lecture sont actifs.

Le 13 juillet 2026, `2026071405_exercices_guides.sql` a également été appliquée
et vérifiée sur ce même projet. Les quatre tables, les cinq RPC et les cinq
politiques RLS attendues sont présentes. Un test transactionnel du parcours
élève a confirmé que les corrections restent masquées avant validation, sont
révélées après validation et restent accessibles au rechargement. Le test a
ensuite été annulé par `ROLLBACK`, sans fausse progression conservée.

Le premier lot relu de chacune des sept matières a ensuite été importé : 21
packs publiés, 63 exercices et 253 sous-questions. L'audit distant confirme
trois packs et neuf exercices par leçon, aucune correction vide et aucune
validation élève créée artificiellement.

Ces exécutions ayant été faites via le SQL Editor, Supabase ne les affiche pas
dans son historique automatique des migrations.

## Contenu de la migration

`2026071201_security_hardening.sql` :

- sécurise la correction et le score du quiz rapide ;
- masque les réponses des défis et calcule leur temps côté serveur ;
- rend les soumissions de devoir atomiques et impose leur échéance ;
- répare l'identité des signalements ;
- limite le chat global au niveau scolaire de l'utilisateur.

La création de l'index unique sur `reponses(tentative_id, question_id)` s'arrête
si la base contient déjà des doublons. Il faut alors les auditer au lieu de les
supprimer automatiquement.

`2026071405_exercices_guides.sql` :

- crée trois paliers de difficulté : Facile, Moyen et Difficile ;
- impose trois exercices par palier et au moins deux questions par exercice ;
- affiche toutes les questions d'un exercice sur la même page, sans QCM ni
  champ de réponse ;
- masque la correction complète jusqu'à la validation de l'exercice ;
- enregistre uniquement la progression, sans note, XP ni badge ;
- fournit un import JSON atomique et idempotent pour le pipeline de contenu.
