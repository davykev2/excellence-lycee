# Pipeline des exercices guidés v2

Ce dossier prépare les exercices non notés affichés dans chaque leçon. Un lot
correspond à une leçon publiée et contient exactement neuf exercices :

- 3 exercices **Facile** (`entrainement`) ;
- 3 exercices **Moyen** (`maitrise`) ;
- 3 exercices **Difficile** (`concours`).

Chaque exercice regroupe au moins deux sous-questions, visibles ensemble. Il ne
contient ni QCM, ni champ de réponse. La correction complète est stockée avec le
contenu, mais Supabase ne la renvoie à l'élève qu'après validation de l'exercice.

## Sources

`reports/chapter_source_manifest.json` rattache chaque leçon publiée à son PDF.
Les PDF restent des références de rédaction (`reference_only`) : le lot reformule
les notions et ne republie pas le document source.

`reports/official_sources.json` complète l'archive fournie avec les programmes
institutionnels de la DPFC téléchargés dans `content_sources/official_dpfc/`.
Les sources directes d'une leçon restent prioritaires ; le programme officiel ne
sert de repli que lorsqu'aucun PDF de leçon suffisamment sûr n'est disponible.

Une leçon marquée `no_source` ne doit pas être générée automatiquement à partir
d'hypothèses. Elle attend soit une source ajoutée au corpus, soit une rédaction
éditoriale explicitement identifiée comme telle.

## Créer et contrôler un lot

1. Copier la structure d'un lot v2 existant dans `batches/`.
2. Renseigner la cible avec les identifiants exacts du manifeste.
3. Recalculer le SHA-256 du PDF et le reporter dans `source.sha256`.
4. Rédiger les neuf exercices et leurs corrections, puis faire une relecture
   indépendante du fond et de la progression des difficultés.
5. Marquer le lot `reviewed` uniquement après cette relecture.
6. Exécuter :

   ```powershell
   node content_pipeline/scripts/validate-training-v2.mjs content_pipeline/batches/mon-lot-v2.json
   ```

7. Générer le SQL d'import :

   ```powershell
   node content_pipeline/scripts/build-training-import-sql.mjs content_pipeline/batches/mon-lot-v2.json
   ```

L'import appelle `public.importer_lot_exercices_v2`. Il est transactionnel et
idempotent : réimporter le même lot met à jour son contenu sans créer de doublon.

Pour mesurer la couverture locale et détecter un mauvais chapitre, un doublon
ou un SHA de source incohérent :

```powershell
node content_pipeline/scripts/audit-training-coverage.mjs
```

## Contrôle après import

Pour chaque leçon importée, vérifier dans la base :

- 3 packs publiés, un par difficulté ;
- 3 exercices dans chaque pack ;
- aucune correction vide ;
- aucune correction lisible avant validation par un élève ;
- aucune note, aucun XP et aucun badge créé par ce parcours.
