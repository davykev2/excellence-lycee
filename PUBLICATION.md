# Publication de la version validée — 2 novembre 2026

## Périmètre autorisé

Le porteur a demandé la mise en ligne du rendu validé dans le laboratoire : Mes cours et M’entraîner illustrés, Exercices par matière, accueil documentaire et tous les contenus locaux qui alimentent ces vues. Les cours, banques interactives, trois onglets, ateliers philo/français et annales 2025–2026 sont conservés. Devoirs et INP-HB restent verrouillés dans l’interface, sans suppression de copies/notes.

Publication préparée sur une copie Git dédiée, depuis la base `23f4800798dcf25359ee7b1d33aaadc871e9df0f`. L’original et le laboratoire ne sont pas remplacés. Les prototypes de couleurs abandonnés, archives/sources PDF privées, bases locales, identifiants, connexions Vercel et outils d’isolation ne font pas partie du lot publié. Les annales explicitement intégrées au site conservent leurs PDF/pages publics.

## Contrats préservés

- IDs de progression, budgets XP et compteur 10_326 inchangés.
- Pas de migration SQL nécessaire pour ce lot ; le contrat JSON d’exercices est enrichi côté Web/API sans changement de colonne.
- Configuration de production issue du projet original, pas des hôtes/ports de laboratoire.
- Les deux projets Vercel existants sont utilisés : `excellence-lycee` et `excellence-lycee-api`, équipe `excellencelycee`.
- API déployée séparément avant l’activation du nouveau frontend ; vérifier les alias réels et `/api/health`.

## Vérifications

`node scripts/verify-project.mjs` est entièrement vert dans cette copie de publication : audits Web/API sans vulnérabilité, typages, 682 tests répartis dans sept groupes, audits pédagogiques/KaTeX, banques, intégrations messagerie/photo et builds API/Web. Budgets respectés : CSS490_210octets, plus gros chunkJS395_078octets. L’enchaînement des audits probabilités/logarithme/exponentielle TerminaleA a été corrigé en trois appels distincts ; aucun contrôle n’est désactivé pour obtenir ce résultat.

Le lot indexé exclut secrets, `.vercel`, prototypes abandonnés, bases locales et outils de laboratoire. Aucun changement sémantique de configuration production, de migration, de registre XP ou de compteur n’est inclus. Les références originales (1_538 empreintes et statut Git) sont intactes.

Les identifiants de déploiement seront consignés dans la reprise du laboratoire après contrôle des alias. Ce document consigné avant l’envoi ne prouve pas à lui seul une mise en ligne.

L’audit de préparation a identifié les deux alertes API déjà documentées (fast-uri et zod). `npm audit fix` sans option de rupture les a corrigées dans cette copie de publication, avec zéro vulnérabilité annoncé par l’audit API. Les sources du laboratoire restent inchangées.
