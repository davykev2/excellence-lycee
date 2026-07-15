# Design QA — Salle des distinctions Android

- Référence visuelle : `C:\Users\krouk\OneDrive\Desktop\EXCELLENCE LYCEE APP\frontend\design-qa\source-badge-reference.JPG`
- Capture principale : `C:\Users\krouk\OneDrive\Desktop\EXCELLENCE LYCEE APP\frontend\design-qa\android-badges-390x844.png`
- Grand écran : `C:\Users\krouk\OneDrive\Desktop\EXCELLENCE LYCEE APP\frontend\design-qa\android-badges-412x915.png`
- Comparaison complète : `C:\Users\krouk\OneDrive\Desktop\EXCELLENCE LYCEE APP\frontend\design-qa\android-badges-comparison.png`
- Comparaison ciblée chat + dock : `C:\Users\krouk\OneDrive\Desktop\EXCELLENCE LYCEE APP\frontend\design-qa\android-badges-chat-comparison.png`
- Viewport principal : 390 × 844.
- État vérifié : aperçu Android de développement, 6 badges obtenus sur 17 et deux messages globaux réalistes.
- Portée : nouvelle expérience Android uniquement ; la page Badges PC est conservée.

## Full-view comparison evidence

La comparaison commune reprend la structure dominante de la référence : barre d’identité et compteur, grille dense de quatre éléments, distinctions verrouillées, bande de chat globale persistante et dock de cinq entrées. L’univers militaire de la référence a été remplacé par une salle académique originale du Campus Excellence, sans copier ses assets.

## Required fidelity surfaces

- Composition : inventaire vertical compact et défilable, chat et dock toujours visibles.
- États : badges obtenus colorés, badges indisponibles désaturés avec verrou, détail ouvrable au toucher.
- Données : badges et progression issus de Supabase ; aucun plafond local de collection.
- Chat : deux derniers messages de `chat_global`, filtrés par `niveau_id`, avec abonnement aux insertions en temps réel.
- Courrier : l’enveloppe ouvre directement la messagerie privée.
- Image : décor raster original généré pour la salle des distinctions.
- Icônes : famille Phosphor ; aucun emoji, SVG artisanal ou asset militaire copié.
- Accessibilité : focus visible, libellés de navigation, zones sûres Android et réduction des animations.

## Primary interactions covered

- Filtre Compétition sélectionné puis retour à Tous.
- Ouverture et fermeture de la fiche du badge Top 10.
- Lien du chat global vérifié vers `/communaute`.
- Lien Courrier vérifié vers `/communaute?tab=mp`.
- Aucun message d’erreur dans la console pendant le parcours.
- Présentation contrôlée à 390 × 844 et 412 × 915.

## Findings

- P0 : aucun.
- P1 : aucun.
- P2 : aucun après comparaison complète et comparaison ciblée du bas d’écran.
- P3 : le mode d’aperçu utilise des messages fictifs ; en session réelle ils sont remplacés par les messages Supabase du niveau de l’élève.

final result: passed
