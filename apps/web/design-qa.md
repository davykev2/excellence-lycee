# Design QA — Excellence Lycée

## Comparison target

- Source visual truth: `C:\Users\krouk\.codex\generated_images\019f79f3-f9e2-7ac2-a42e-6760f726faed\exec-6741aa02-ea73-4133-9a2a-aae1fcaf269c.png`
- User-supplied brand truth: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\src\assets\logo-excellence-officiel.png`
- Browser-rendered implementation: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\implementation-home-final.png`
- Full-view comparison evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\comparison-final.png`
- Focused hero comparison evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\comparison-hero-final.png`
- Viewport: 1440 × 1024 CSS pixels.
- State: desktop, accueil actif, Seconde C, Mathématiques, progression initiale à 68 %, aucun dialogue ouvert.

## Findings

No actionable P0, P1, or P2 mismatch remains.

- [P3] Le graphe interactif est légèrement plus grand que celui de la maquette et n’affiche pas les pointes de flèche sur les axes.
  - Location: `MathPreviewChart` dans le héros.
  - Evidence: la comparaison focalisée montre une courbe occupant davantage de largeur dans l’implémentation, tandis que la hiérarchie et les points remarquables restent fidèles.
  - Impact: mineur; la lisibilité et l’intention pédagogique sont préservées, et le graphe est désormais réellement interactif.
  - Follow-up: réduire l’échelle du domaine de 5 à 8 % et ajouter des terminaisons d’axes via une fonctionnalité native de la bibliothèque si nécessaire.

- [P3] Les lignes abstraites sous les actions rapides ont été remplacées par de vraies informations de progression.
  - Location: rangée « Objectif du jour » / « Révisions à faire ».
  - Evidence: la source utilise des barres décoratives; l’implémentation affiche « 2/3 étapes terminées » et « 2 notions à revoir ».
  - Impact: différence visuelle mineure, mais meilleure compréhension produit.
  - Follow-up: ajouter plus tard une barre de progression réelle si les données de suivi sont disponibles.

## Required fidelity surfaces

- Fonts and typography: Nunito Sans Variable reproduit le caractère arrondi et très lisible de la maquette. Les graisses, tailles, hauteurs de ligne et retours du titre principal ont été ajustés pour conserver exactement deux lignes à 1440 px. Les textes restent lisibles à 390 px.
- Spacing and layout rhythm: la grille desktop reprend une barre latérale de 258 px, un en-tête aéré, un héros dominant et une rangée secondaire. Les rayons, marges, hauteurs de CTA et espacements ont été vérifiés au même viewport. Aucun débordement horizontal à 390 ou 768 px.
- Colors and visual tokens: bleu nuit, ivoire, orange et vert sont centralisés en variables CSS. Les états actifs, focus et surfaces secondaires gardent un contraste suffisant. Aucun dégradé CSS ne remplace un asset.
- Image quality and asset fidelity: le logo officiel fourni par l’utilisateur est utilisé directement. Les deux décors raster ont été générés à partir de la direction choisie, nettoyés avec transparence réelle puis intégrés. Les icônes viennent de Phosphor; le graphe et l’anneau de progression viennent de Recharts. Aucun dessin CSS, SVG artisanal, emoji ou placeholder n’est utilisé.
- Copy and content: les libellés français importants de la maquette sont conservés. Les ajouts sont des contenus réalistes utiles au prototype, sans faux texte.
- Icons: navigation, objectif, calendrier, aide et actions utilisent une même famille Phosphor avec poids cohérents. Les tailles et alignements ont été vérifiés sur desktop et mobile.
- States and interactions: états hover/focus/actif présents. Le sélecteur de classe, la reprise de leçon, le curseur mathématique, le succès, le tuteur, les objectifs, les révisions et les retours fonctionnent.
- Accessibility: structure sémantique, noms accessibles, boutons natifs, select natif, focus visibles, fermeture par Échap, mode réduction des animations, absence de défilement horizontal.

## Comparison history

### Iteration 1 — blocked

- Earlier findings:
  - [P1] Le titre « Fonctions du second degré » passait sur trois lignes au lieu de deux.
  - [P2] La page affichait une barre de défilement à 1440 × 1024 et la rangée secondaire était trop basse.
- Fixes made:
  - rééquilibrage des colonnes du héros;
  - réduction mesurée de la taille maximale du titre;
  - ajustement des hauteurs du héros et de la rangée secondaire;
  - augmentation du CTA pour correspondre au rythme de la source.
- Post-fix evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\implementation-home-v3.png`.

### Iteration 2 — blocked

- Earlier findings:
  - [P2] L’anneau Recharts affichait un cercle entièrement vert au lieu de 68 %.
  - [P2] Le décor orange/vert du héros était perdu à cause du recadrage.
- Fixes made:
  - remplacement du RadialBar par un Pie à deux segments, sans animation;
  - affichage du décor transparent en `object-fit: contain` au-dessus du graphe.
- Post-fix evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\implementation-home-v4.png`.

### Iteration 3 — passed

- Post-fix visual evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\comparison-final.png` et `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\comparison-hero-final.png`.
- All previous P1/P2 findings are resolved.

## Browser verification

- Browser-rendered implementation screenshot captured at 1440 × 1024.
- Responsive captures:
  - `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\tablet-home-768x1024.png`
  - `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\mobile-home-390x844.png`
- Primary interactions tested:
  - reprendre la leçon;
  - modifier le coefficient de la parabole de 0,42 à 0,65;
  - terminer l’étape et confirmer la progression à 72 %;
  - changer la classe vers Terminale D et restaurer Seconde C;
  - ouvrir le tuteur, révéler l’étape suivante et fermer;
  - ouvrir les détails de l’objectif et des révisions;
  - activer la navigation « Parcours » et vérifier le message d’état.
- Responsive metrics:
  - 390 px: client width 375, scroll width 375;
  - 768 px: client width 753, scroll width 753.
- Browser console errors and warnings: none.

## Follow-up polish

- Ajouter des pointes d’axe natives au graphe si une prochaine itération le demande.
- Compresser ou dériver une version web optimisée du logo officiel sans altérer son identité.

## Post-build update — niveau et matière séparés

- User requirement: le niveau et la série sont choisis à l’inscription; ils ne doivent pas être modifiables depuis l’accueil. Le choix de la matière est indépendant.
- Intentional source deviation: le sélecteur combiné de la maquette a été remplacé par deux zones visuellement distinctes.
- Desktop evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\implementation-context-selectors-final.png`.
- Mobile evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\mobile-context-selectors-final.png`.
- Functional evidence:
  - « Seconde C » est rendu comme contexte statique avec le nom accessible « Niveau et série définis à l’inscription : Seconde C »;
  - la page contient un seul élément `select`, nommé « Matière »;
  - Mathématiques est sélectionné;
  - les futures matières sont visibles et désactivées avec le suffixe « bientôt »;
  - aucun débordement horizontal à 390 px;
  - chargement propre dans un nouvel onglet: aucune erreur ni alerte console.
- Result: no P0/P1/P2 finding introduced by this update.

## Post-build update — emplacement photo de profil

- User requirement: réserver une place pour la future photo de profil à proximité immédiate du nom de l’élève.
- Implementation: composant réutilisable `ProfileAvatar` placé à droite de « Bonjour, Aïcha ».
- Empty state: icône utilisateur Phosphor neutre avec le nom accessible « Photo de profil de Aïcha non renseignée »; aucun faux portrait ou placeholder raster n’est utilisé.
- Future state: le même composant accepte déjà `photoUrl` et remplace l’icône par l’image réelle sans changer la structure de l’en-tête.
- Registration rule confirmed: la photo est facultative; `learnerPhotoUrl` reste optionnel dans le modèle du tableau de bord et l’état sans photo est le comportement par défaut.
- Desktop evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\implementation-profile-avatar.png`.
- Mobile evidence: `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\mobile-profile-avatar.png`.
- Responsive evidence: client width et scroll width sont tous deux de 375 px à 390 × 844; aucun débordement horizontal.
- Browser evidence: chargement propre dans un nouvel onglet, avatar présent dans l’arbre accessible et aucune erreur/alerte console.
- Result: no P0/P1/P2 finding introduced by this update.

## Post-build update — premier parcours réel de Mathématiques

- User requirement: construire le premier véritable parcours de Mathématiques, flexible pour les évolutions futures.
- Curriculum source: programme éducatif de Mathématiques Seconde C publié par la DPFC, thème 2 « Fonctions », leçon 1 « Généralités sur les fonctions ».
- Implementation:
  - écran « Parcours » complet relié à la navigation principale;
  - 3 modules, 7 leçons et 330 XP au total;
  - statuts terminée, disponible et verrouillée calculés depuis la progression;
  - lecteur de leçon en 3 étapes : explication, exercice avec retour immédiat, réussite;
  - laboratoire graphique manipulable pour la lecture d’une courbe;
  - validation d’une leçon, mise à jour de la progression et déverrouillage de la suivante;
  - reprise depuis l’accueil synchronisée sur la première leçon inachevée;
  - contenu et composants séparés pour permettre l’ajout de nouveaux parcours sans reconstruire l’interface.
- Desktop evidence:
  - `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\math-path-desktop-viewport.png`;
  - `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\math-lesson-desktop.png`.
- Mobile evidence:
  - `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\math-path-mobile.png`;
  - `C:\Users\krouk\Dev\EXCELLENCE LYCEE APP GPT\apps\web\.audit\math-lesson-mobile.png`.
- Interaction evidence:
  - navigation vers « Parcours »;
  - ouverture de la leçon disponible;
  - manipulation du graphique;
  - sélection d’une mauvaise réponse et affichage de l’indice;
  - nouvelle tentative, bonne réponse et validation;
  - progression de 43 % à 57 %;
  - déverrouillage de la leçon 5;
  - ouverture directe de la leçon suivante.
- Responsive evidence: aucun débordement horizontal à 390 × 844 (`clientWidth = scrollWidth = 390` pendant la leçon; `scrollWidth = clientWidth = 375` sur la page défilante).
- Build evidence: `npm run typecheck` et `npm run build` passent; le seul avertissement restant concerne la taille du bundle principal et ne bloque pas le prototype.
- Result: no P0/P1/P2 finding introduced by this update.

final result: passed
