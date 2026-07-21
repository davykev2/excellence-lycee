# Catalogue de l’archive pédagogique

Audit du dossier `content_sources/archive_20260713` effectué le 13 juillet 2026.

## Verdict

- 206 PDF physiques, soit 2 415 pages et 97,16 MiB.
- 136 objets uniques par SHA-256, soit 1 561 pages et 68,10 MiB.
- 70 copies redondantes (33,98 % des fichiers) réparties dans 45 groupes; la déduplication économise 29,06 MiB.
- 0 PDF scanné suspect et 0 erreur de lecture. Une extraction directe suffit; un OCR global serait inutile.
- 1 doublon sémantique hors hash exact: les SVT TA L4 et L8 ont un texte extrait strictement identique.

## Répartition des fichiers physiques

| Série | Matière | PDF |
|---|---|---:|
| TA | Histoire-géographie | 15 |
| TA | Mathématiques | 8 |
| TA | Philosophie | 10 |
| TA | Espagnol | 30 |
| TA | SVT | 8 |
| TC | Histoire-géographie | 15 |
| TC | Mathématiques | 19 |
| TC | Philosophie | 10 |
| TC | Physique-chimie | 20 |
| TD | Histoire-géographie | 15 |
| TD | Mathématiques | 12 |
| TD | Philosophie | 10 |
| TD | Physique-chimie | 20 |
| TD | SVT | 14 |

## Objets pédagogiques uniques

Les documents communs ne sont comptés qu’une fois et reçoivent plusieurs séries cibles.

| Séries cibles | Matière | Sous-discipline | Leçons uniques |
|---|---|---|---:|
| TA | Mathématiques | — | 8 |
| TA | Espagnol | — | 30 |
| TA | SVT | — | 8 |
| TA/TC/TD | Histoire-géographie | Géographie | 6 |
| TA/TC/TD | Histoire-géographie | Histoire | 9 |
| TA/TC/TD | Philosophie | — | 10 |
| TC | Mathématiques | — | 19 |
| TC/TD | Physique-chimie | Chimie | 12 |
| TC/TD | Physique-chimie | Physique | 8 |
| TD | Mathématiques | — | 12 |
| TD | SVT | — | 14 |

Total: **136 leçons uniques par hash**.

## Doublons exacts

- Histoire-géographie: 15 hashes, chacun copié dans TA, TC et TD.
- Philosophie: 10 hashes, chacun copié dans TA, TC et TD.
- Physique-chimie: 20 hashes, chacun copié dans TC et TD (12 en chimie, 8 en physique).
- Espagnol, mathématiques et SVT: aucun doublon binaire entre dossiers.
- Les chemins de chaque groupe figurent dans `lessons[].all_paths` du rapport JSON.

## Extraction texte et scans

La totalité des 1 561 pages uniques a été testée avec pypdf 6.10.0.

- 1 529 pages ont au moins 30 caractères alphanumériques extractibles, soit 97,95 %.
- 28 pages contiennent de 1 à 29 caractères et 4 pages n’en contiennent aucun.
- Ces 4 pages sont des fins de documents blanches ou illustrées; elles appartiennent à trois PDF par ailleurs fortement textuels.
- 543 pages contiennent au moins un objet image, sans que cela en fasse des scans.
- 118 PDF ont du texte exploitable sur toutes leurs pages; aucun document ne satisfait le critère de scan suspect.

### Échantillon représentatif

Pages testées: première, médiane et dernière. Le nombre indiqué correspond aux caractères alphanumériques extraits.

| Échantillon | Séries | Matière | Leçon | Pages | Caractères | Résultat |
|---|---|---|---|---|---|---|
| ta_spanish | TA | Espagnol | L1 — Espagne-réalités sociolinguistiques | 1, 2, 3 | 1331, 1246, 1306 | text_native |
| all_geography | TA/TC/TD | Histoire-géographie — Géographie | G1 — Les fondements du developpement économique de la Côte dIvoire | 1, 7, 13 | 1041, 1422, 0 | text_native |
| all_history | TA/TC/TD | Histoire-géographie — Histoire | H1 — LOrganisation des Nations Unies(ONU) | 1, 7, 13 | 1229, 1575, 1158 | text_native |
| ta_mathematics | TA | Mathématiques | L1 — fonctions polynôme et fonctions rationnelles | 1, 15, 28 | 1056, 723, 97 | text_native |
| all_philosophy | TA/TC/TD | Philosophie | L1 — La dissertation philosophique | 1, 4, 7 | 1404, 1010, 761 | text_native |
| ta_svt | TA | SVT | L1 — Les réactions émotionnelles chez lHomme | 1, 7, 12 | 1626, 1225, 191 | text_native |
| tc_mathematics | TC | Mathématiques | L1 — Limite et continuité | 1, 12, 23 | 963, 769, 644 | text_native |
| tc_td_chemistry | TC/TD | Physique-chimie — Chimie | CH1 — Les alcools | 1, 6, 10 | 1134, 594, 727 | text_native |
| tc_td_physics | TC/TD | Physique-chimie — Physique | PHY1 — Cinématique du point | 1, 6, 10 | 1629, 907, 2319 | text_native |
| td_mathematics | TD | Mathématiques | L1 — LIMITES ET CONTINUITE | 1, 12, 23 | 963, 769, 644 | text_native |
| td_svt | TD | SVT | L1 — Le reflexe conditionnel | 1, 8, 15 | 1080, 1199, 0 | text_native |

## Couverture et anomalies

- Géographie toutes séries: G1-G4 et G6-G7; G5 manque.
- Histoire toutes séries: H1-H9, série complète.
- Espagnol TA: L1-L30, série complète.
- Mathématiques: TA L1-L8, TC L1-L19 et TD L1-L12, séries complètes selon les noms de fichiers.
- Philosophie toutes séries: L1-L10, série complète.
- Physique-chimie TC/TD: chimie CH1-CH12 complète; physique PHY1, PHY2, PHY4-PHY6, PHY8-PHY10, donc PHY3 et PHY7 manquent.
- SVT TA: L1-L8, mais L4 et L8 ont le même titre et exactement le même texte extrait malgré deux hashes binaires différents.
- SVT TD: L1-L12, L14-L15; L13 manque.
- Le numéro de fichier est un ordre global. Dans plusieurs PDF, le numéro imprimé redémarre par thème; il faut stocker séparément `lesson_code_from_filename` et le titre.
- Les noms contiennent plusieurs coquilles; utiliser le titre extrait ou normalisé pour l’affichage, tout en conservant le nom original pour la traçabilité.

## Provenance et prudence de réutilisation

Parmi les 136 documents uniques, 123 portent sur leur première page la marque « Côte d’Ivoire — École numérique ». Onze affichent une restriction de vente et deux signalent explicitement une propriété MENETFP. L’archive est très utile pour aligner le programme et la difficulté, mais il ne faut pas republier les PDF ou leur texte intégral sans vérifier les droits.

Pour l’application: conserver le hash, le chemin et la provenance, extraire les notions, puis rédiger des exercices et corrigés originaux.

## Recommandation d’import

1. Importer un seul objet par SHA-256 et créer des associations vers toutes les séries cibles.
2. Mettre en quarantaine SVT TA L8 jusqu’à confirmation de son vrai contenu; L4 et L8 sont textuellement identiques.
3. Signaler les quatre lacunes de séquence: G5, PHY3, PHY7 et SVT TD L13.
4. Utiliser l’extraction texte native; réserver l’OCR aux rares pages illustrées seulement si leur contenu visuel est requis.
5. Conserver les PDF comme sources internes et publier uniquement du contenu pédagogique original.

