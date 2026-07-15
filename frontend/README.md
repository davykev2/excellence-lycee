# EXCELLENCE LYCÉE

Application éducative React/Vite reliée à Supabase. Elle propose des cours, résumés, exercices guidés non notés, quiz, devoirs chronométrés, duels et compétitions.

## Atelier éditorial administrateur

L’espace `/admin/contenus` centralise trois éditeurs :

- résumés avec brouillon privé, aperçu Markdown/LaTeX, historique des publications et suivi des commentaires ;
- exercices guidés avec trois difficultés, nombre d’exercices libre, correction complète et conservation intelligente de la progression ;
- devoirs avec nombre de questions libre, versions Publié/Brouillon/Archivé et préservation des anciennes tentatives et corrections.

Les écritures sensibles passent par des RPC Supabase protégées par le rôle administrateur, des contrôles de concurrence et des règles RLS. Les migrations `2026071408`, `2026071409` et `2026071410` décrivent le modèle éditorial courant ; `supabase/schema.sql` reste le schéma canonique pour une installation neuve.

## Approbation des comptes

Les nouveaux comptes sont approuvés automatiquement par le trigger Supabase, sans dépendre des métadonnées envoyées par le navigateur. Dans `/admin/utilisateurs`, un administrateur peut toujours approuver ou désapprouver un compte individuellement, ou utiliser les actions groupées « Tout approuver » et « Tout désapprouver ». Les comptes administrateurs sont exclus de la désapprobation groupée. Ce contrat est défini par `2026071412_auto_approval_bulk.sql`.

## Duels : arène directe ou fantôme

### Expérience élève

Depuis l’arène, l’élève recherche un camarade de sa classe par son nom, choisit une matière et, s’il le souhaite, une à trois leçons. Le catalogue affiche toutes les leçons publiées de la matière ; celles qui ne disposent pas encore de QCM compatible restent visibles mais désactivées. S’il ne sélectionne aucune leçon, le serveur tire jusqu’à trois leçons disponibles dans cette matière. Une invitation reste jouable pendant 48 heures.

Une manche dure 90 secondes. Les deux participants reçoivent exactement les mêmes questions, dans le même ordre. Le bandeau de jeu affiche le profil du joueur à gauche, celui de l’adversaire à droite et le chronomètre au centre. Les compteurs verts et rouges indiquent respectivement les bonnes réponses et les erreurs de chacun. À la fin, l’écran annonce « Victoire », « Défaite » ou « Égalité » et récapitule les points.

- Si les deux élèves sont présents, un compte à rebours `3–2–1` lance le duel direct et les compteurs adverses sont synchronisés pendant la manche.
- Si l’élève défié est absent, le premier participant joue immédiatement. Lors de la seconde manche, les événements déjà enregistrés sont rejoués aux mêmes instants sur le HUD : c’est l’adversaire « fantôme ».
- Tant que la seconde manche n’est pas terminée, le premier joueur voit le statut « En attente de l’adversaire ». Une invitation expirée ne donne ni victoire, ni défaite, ni points.

Le navigateur ne reçoit jamais la bonne réponse ni la correction. Il envoie une réponse à la fois et utilise uniquement le verdict et les compteurs calculés par le serveur.

### Administration et contenus

Il n’existe pas de copie spéciale des questions à maintenir pour les duels. L’administrateur publie les matières, leçons et questions dans les ateliers de contenu habituels ; seules les ressources publiées et compatibles avec la série de l’élève peuvent alimenter une arène. Le réglage global des défis permet de désactiver les nouvelles invitations sans altérer l’historique.

### Garanties serveur

La migration `2026071411_duels_arene_v2.sql` porte le contrat de l’arène v2 et `2026071413_duel_discovery.sql` son catalogue complet et sa recherche bornée. Supabase crée une photographie immuable des questions au lancement afin que les deux manches restent identiques, impose l’expiration à 48 heures et n’accepte qu’une réponse par participant et par question. Les horodatages relatifs servent à la synchronisation directe comme à la relecture fantôme. Le chronomètre, les verdicts, le score et le résultat final sont validés côté serveur ; les RPC sont réservées aux utilisateurs authentifiés et ne publient aucune correction.

## Quiz rapide continu

Le quiz rapide fonctionne sans quota de questions. Sa banque de départ contient 48 QCM expliqués, soit 6 questions pour chacune des 8 matières disponibles. Le serveur privilégie les questions jamais vues, puis recycle celles vues depuis le plus longtemps ; il ne transmet jamais la bonne réponse ni la justification avant la validation. Après chaque réponse acceptée, l’élève voit la correction et une justification pédagogique, puis peut enchaîner avec la question suivante. L’anti-spam reste actif. La migration `2026071414_quiz_rapide_unlimited.sql` porte ce comportement.

Les migrations `2026071412`, `2026071413` et `2026071414` sont intégrées, dans cet ordre, à la fin de `supabase/schema.sql` afin que le schéma canonique reproduise exactement l’état courant après les contenus de démonstration.

## Android

Le projet contient une application Android native emballée avec Capacitor. La procédure de préparation, de compilation, d'installation sur téléphone et les limites de cette première version sont décrites dans [ANDROID.md](ANDROID.md).

L'APK de développement généré se trouve dans `artifacts/Excellence-Lycee-debug.apk`.

## Commandes

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

Les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` doivent être définies dans l’environnement du frontend.
