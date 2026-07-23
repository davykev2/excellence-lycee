# Excellence Lycée

> **Nom de travail** — plateforme ivoirienne d’apprentissage interactif pour les élèves de la Seconde à la Terminale.

![Statut](https://img.shields.io/badge/statut-prototype%20interactif-2f9e44)
![Programme](https://img.shields.io/badge/programme-C%C3%B4te%20d'Ivoire-orange)
![Priorité](https://img.shields.io/badge/premi%C3%A8re%20mati%C3%A8re-Math%C3%A9matiques-2f80ed)

## Sommaire

- [1. Résumé du projet](#1-résumé-du-projet)
- [2. Vision](#2-vision)
- [3. Positionnement](#3-positionnement)
- [4. Public cible](#4-public-cible)
- [5. Périmètre académique](#5-périmètre-académique)
- [6. Principes pédagogiques](#6-principes-pédagogiques)
- [7. Rôles utilisateurs](#7-rôles-utilisateurs)
- [8. Fonctionnalités de la plateforme cible](#8-fonctionnalités-de-la-plateforme-cible)
- [9. Expérience Mathématiques](#9-expérience-mathématiques)
- [10. Parcours utilisateurs principaux](#10-parcours-utilisateurs-principaux)
- [11. Organisation du contenu](#11-organisation-du-contenu)
- [12. Modèle économique envisagé](#12-modèle-économique-envisagé)
- [13. Architecture fonctionnelle](#13-architecture-fonctionnelle)
- [14. Architecture technique envisagée](#14-architecture-technique-envisagée)
- [15. Modèle de données conceptuel](#15-modèle-de-données-conceptuel)
- [16. Sécurité, vie privée et protection des mineurs](#16-sécurité-vie-privée-et-protection-des-mineurs)
- [17. Accessibilité, performance et faible connectivité](#17-accessibilité-performance-et-faible-connectivité)
- [18. Qualité pédagogique et gouvernance des contenus](#18-qualité-pédagogique-et-gouvernance-des-contenus)
- [19. Mesure de la réussite](#19-mesure-de-la-réussite)
- [20. Roadmap proposée](#20-roadmap-proposée)
- [21. Définition du premier MVP](#21-définition-du-premier-mvp)
- [22. Risques et réponses prévues](#22-risques-et-réponses-prévues)
- [23. Décisions restant à prendre](#23-décisions-restant-à-prendre)
- [24. Fonctionnalités vérifiées dans un compte connecté](#24-fonctionnalités-vérifiées-dans-un-compte-connecté)
- [25. Références](#25-références)
- [26. État du dépôt](#26-état-du-dépôt)

---

## 1. Résumé du projet

**Excellence Lycée** a pour objectif d’aider les lycéens ivoiriens à comprendre leurs cours, progresser régulièrement, préparer leurs devoirs et réussir leurs examens grâce à une expérience interactive, visuelle et motivante.

La plateforme suivra les programmes officiels de la Côte d’Ivoire, de la **Seconde à la Terminale**, en tenant compte des classes et séries concernées. Elle commencera par les **Mathématiques**, puis s’étendra progressivement aux matières suivantes :

1. Mathématiques ;
2. Physique-Chimie ;
3. Français ;
4. Anglais ;
5. Sciences de la Vie et de la Terre (SVT) ;
6. Philosophie ;
7. Histoire-Géographie.

L’expérience s’inspire des grands principes qui rendent Brilliant efficace : apprendre en faisant, manipuler les concepts, recevoir un retour immédiat, avancer par petites étapes, pratiquer régulièrement et visualiser sa progression. Le produit, les contenus, la marque, le code et l’interface d’Excellence Lycée resteront cependant **originaux**.

### Statut actuel

Le projet est entré en phase de **prototype interactif** après le GO explicite du porteur du projet.

- Le premier tableau de bord élève, centré sur les Mathématiques, est disponible dans `apps/web`.
- Le logo officiel de la structure est intégré.
- Les données de programme, matières, niveaux et navigation sont séparées des composants visuels pour faciliter les évolutions.
- La reprise de leçon, le graphe manipulable, le tuteur contextuel et les panneaux d’objectifs/révisions fonctionnent côté frontend.
- Le niveau et la série sont choisis à l’inscription puis affichés comme contexte fixe; le choix de la matière est un contrôle séparé.
- La photo de profil est facultative et peut être ajoutée, remplacée ou retirée à tout moment depuis Profil. L’image est recadrée en carré et optimisée avant son envoi dans le dossier Supabase Storage privé en écriture de l’utilisateur; un avatar neutre reste affiché en son absence.
- Le premier véritable parcours de Mathématiques, **« Généralités sur les fonctions »**, est fonctionnel avec 7 leçons, déverrouillage progressif, exercices corrigés, XP et synchronisation avec l’accueil.
- Le backend dans `apps/api` fournit l’inscription, la connexion, les sessions renouvelables, les rôles, le profil scolaire, la progression persistante et le contenu éditorial versionné.
- La page Admin possède un **studio éditorial complet** : sélection matière/niveau/leçon, collage de texte, mise en forme, KaTeX, tableaux, liens, images et vidéos par URL, exercices à choix ou à réponse courte, barème pondéré, références au document source, aperçu élève instantané, sauvegarde automatique, validation, publication, dépublication et restauration d’une version antérieure.
- La navigation est portée par des URL stables : les sections principales, les parcours, les niveaux ouverts, les sections Admin et le studio restent sur le même écran après actualisation et suivent l’historique précédent/suivant du navigateur.
- Davy propose une première visite guidée vocale et sous-titrée : mise en lumière des espaces principaux, commandes de lecture, pause, répétition et son, mémorisation par compte et possibilité de relancer la visite depuis le profil.
- Sa narration accepte une voix officielle clonée à partir d'un enregistrement autorisé : traitement et synthèse restent côté API, les messages répétés sont mis en cache et une voix système masculine prend automatiquement le relais en cas d'indisponibilité.
- Le cours de Terminale A **« Étude de fonctions polynômes et de fonctions rationnelles »** est désormais structuré en 18 niveaux progressifs et une mission finale. Il conserve le contenu et les exercices du document transmis, ignore les activités conformément à la décision pédagogique et trace les corrections apportées à la source. Son contenu est enrichi au-delà de la source : tableaux de propriétés et de variations, exemples entièrement rédigés en formules centrées, encadrés « Erreur fréquente » et « Astuce mémoire ». Les situations d’apprentissage introductives en sont retirées ; le problème appliqué du COGES ne subsiste que dans la mission finale, comme contexte d’évaluation.
- Le moteur de leçons dispose d’une interaction **courbe interactive** : un graphique tracé par le code, avec repère gradué, asymptotes en pointillés et un point que l’élève déplace au curseur pour lire les coordonnées en direct. Douze niveaux de la leçon de Terminale A l’utilisent pour visualiser limites, asymptotes horizontale/verticale/oblique, extremums, tangente, recherche de racine par dichotomie ou balayage, et optimisation d’un bénéfice.
- La leçon 02 de Terminale A **« Probabilité »** suit le même modèle enrichi : sept niveaux fidèles au cours officiel (six pour la série A2), tableaux de vocabulaire et de propriétés, exercices de fixation entièrement rédigés, encadrés « Erreur fréquente » et « Astuce mémoire de Davy », mission finale de la kermesse et courbe interactive sur la fiabilité d’un test de dépistage. Les identifiants de niveaux et les budgets XP existants sont conservés à l’identique.
- Chaque leçon interactive représente exactement **10 000 XP**, répartis automatiquement entre ses niveaux par tranches de 10 XP en conservant leur poids relatif. Un score de 20/20 donne la totalité du niveau, un score de 10 à 19/20 en donne la moitié, et les progressions déjà enregistrées sont recalculées au nouveau barème par migration Supabase.
- Supabase conserve séparément le brouillon courant et le dernier instantané publié. Les élèves ne peuvent jamais lire un brouillon ou une version en validation.
- La rubrique Messages est reliée à Supabase et au backend local : conversations privées selon le rôle et la classe, recherche de destinataire, réponses, modification et suppression logique, états envoyé/lu, compteur de non-lus, sourdine, archivage et actualisation automatique.
- Ce document continue de décrire la vision complète et le chemin réaliste pour la construire.

### Premier parcours de Mathématiques livré

Le parcours **« Généralités sur les fonctions »** cible la **Seconde C** et suit le thème 2 du programme éducatif ivoirien publié par la Direction de la Pédagogie et de la Formation Continue (DPFC).

Il comprend trois modules et sept leçons :

1. comprendre une fonction comme une machine ;
2. déterminer un ensemble de définition ;
3. distinguer images et antécédents ;
4. lire une fonction sur une courbe interactive ;
5. déterminer l’image d’un intervalle ;
6. interpréter les variations, maxima et minima ;
7. résoudre un défi de synthèse.

Chaque leçon contient une explication courte, une notation à retenir, un exemple, un exercice à choix, un retour immédiat et une récompense en XP. Une bonne réponse valide la leçon et déverrouille automatiquement la suivante. La progression du parcours alimente aussi le contenu de reprise affiché sur l’accueil.

Source pédagogique principale : [Programme éducatif de Mathématiques — Seconde C (DPFC)](https://dpfc-ci.net/dpfc/programmes/maths/06.Prog%20Educt%20maths%202C%20CND%200923.pdf).

---

## 2. Vision

### Ambition

Construire la plateforme d’apprentissage secondaire de référence en Côte d’Ivoire : claire, exigeante, accessible sur mobile et capable de donner à chaque élève l’impression d’avoir un professeur patient disponible à tout moment.

### Problèmes à résoudre

De nombreux élèves rencontrent une ou plusieurs difficultés :

- cours perçus comme trop abstraits ;
- accumulation de lacunes non identifiées ;
- mémorisation de formules sans compréhension ;
- manque d’exercices progressifs et corrigés ;
- difficulté à savoir quoi réviser en priorité ;
- absence de retour immédiat lorsqu’une erreur est commise ;
- manque de motivation ou de régularité ;
- ressources peu adaptées au programme et aux séries ivoiriennes ;
- connexion Internet irrégulière ou forfait de données limité ;
- manque de visibilité des parents et enseignants sur le travail réel effectué.

### Promesse centrale

> **Comprendre, pratiquer, progresser et réussir — une étape à la fois.**

### Objectifs à long terme

- Couvrir l’intégralité des matières annoncées de la Seconde à la Terminale.
- Proposer un parcours adapté au niveau, à la série, aux objectifs et aux lacunes de chaque élève.
- Permettre aux enseignants d’utiliser la plateforme en classe, comme devoir, soutien ou enrichissement.
- Donner aux parents une vue simple et respectueuse de la progression de leurs enfants.
- Préparer efficacement les évaluations, compositions, examens blancs et épreuves du Baccalauréat.
- Faire fonctionner l’expérience correctement sur des téléphones modestes et des connexions lentes.

---

## 3. Positionnement

### Ce que le produit doit être

- Une plateforme d’**apprentissage actif** et non une simple bibliothèque de vidéos.
- Un complément structuré aux cours, manuels et enseignants.
- Un produit centré sur la compréhension, la résolution de problèmes et la maîtrise durable.
- Une expérience suffisamment ludique pour encourager la régularité, sans transformer l’apprentissage en jeu vide.
- Un référentiel académique versionné et traçable, aligné sur les publications officielles ivoiriennes.

### Ce que le produit ne doit pas être

- Une copie visuelle ou technique de Brilliant.
- Une reproduction de contenus, illustrations, textes, exercices ou marques appartenant à Brilliant.
- Un chatbot généraliste qui donne directement les réponses.
- Un réseau social public destiné aux mineurs.
- Un remplacement des enseignants ou des établissements scolaires.
- Une promesse automatique de réussite sans travail régulier de l’élève.

### Différenciation ivoirienne

- Alignement sur les programmes et progressions de la **DPFC**.
- Organisation par classe, série, matière, compétence, thème et leçon.
- Situations d’apprentissage contextualisées pour la Côte d’Ivoire et l’Afrique de l’Ouest.
- Préparation aux formats d’évaluation utilisés dans les établissements ivoiriens.
- Interface en français, avec prise en charge spécifique de l’anglais comme matière.
- Mode faible consommation de données et continuité partielle hors connexion.
- Paiements et offres adaptés au marché local à étudier ultérieurement.

---

## 4. Public cible

### Public principal

- Élèves de Seconde ;
- élèves de Première ;
- élèves de Terminale ;
- élèves de toutes les séries officiellement prises en charge par le référentiel chargé dans la plateforme.

### Public secondaire

- Parents et responsables légaux ;
- professeurs ;
- répétiteurs et tuteurs ;
- établissements scolaires ;
- équipes pédagogiques et inspecteurs autorisés ;
- auteurs, correcteurs et validateurs de contenus.

### Contextes d’utilisation

- apprentissage autonome à domicile ;
- révision après un cours ;
- rattrapage d’une notion mal comprise ;
- entraînement régulier ;
- devoir donné par un professeur ;
- activité d’introduction en classe ;
- préparation d’un contrôle ou d’une composition ;
- préparation intensive au Baccalauréat ;
- enrichissement pour les élèves avancés.

---

## 5. Périmètre académique

### Référentiel officiel

Le contenu doit être construit à partir des documents officiels disponibles auprès de la **Direction de la Pédagogie et de la Formation Continue (DPFC)** et des textes applicables pour l’année scolaire concernée.

Le référentiel ne doit pas être codé en dur. Il doit être versionné afin de pouvoir gérer :

- les changements de programme ;
- les nouvelles progressions annuelles ;
- les différences entre classes et séries ;
- les leçons communes à plusieurs séries ;
- les volumes horaires ;
- les compétences, thèmes, habiletés et contenus ;
- les corrections ou décisions pédagogiques internes.

### Hiérarchie académique

```text
Pays
└── Année scolaire / version du programme
    └── Niveau
        └── Série
            └── Matière
                └── Compétence
                    └── Thème
                        └── Leçon
                            └── Objectif pédagogique
                                └── Activité interactive
                                    └── Exercice / évaluation
```

### Matières prévues

| Priorité | Matière | Statut produit |
|---:|---|---|
| 1 | Mathématiques | Première matière à concevoir et développer |
| 2 | Physique-Chimie | Extension future |
| 3 | Français | Extension future |
| 4 | Anglais | Extension future |
| 5 | SVT | Extension future |
| 6 | Philosophie | Extension future |
| 7 | Histoire-Géographie | Extension future |

### Approche par Compétences

Le modèle pédagogique devra respecter l’esprit de l’**Approche par Compétences (APC)** présente dans les programmes ivoiriens :

- partir d’une situation d’apprentissage ;
- mobiliser des connaissances et habiletés ;
- faire agir et raisonner l’apprenant ;
- observer une production ou une résolution ;
- apporter une remédiation adaptée ;
- vérifier le transfert dans une nouvelle situation.

---

## 6. Principes pédagogiques

### 6.1 Apprendre en faisant

Chaque notion importante doit amener l’élève à manipuler, choisir, tracer, déplacer, classer, calculer, expliquer ou résoudre. Les longs blocs de texte et les vidéos passives ne doivent pas constituer le cœur de l’expérience.

### 6.2 Progression par petites étapes

Une leçon complexe est découpée en micro-objectifs. Chaque étape doit être suffisamment courte pour produire une réussite visible, tout en maintenant une exigence réelle.

### 6.3 Compréhension avant mémorisation

La plateforme doit faire comprendre le sens d’une formule ou d’une méthode avant d’en demander l’application répétée.

### 6.4 Retour immédiat

Après chaque action, l’élève reçoit un retour utile :

- réponse correcte ou incorrecte ;
- explication de l’erreur probable ;
- indice gradué ;
- visualisation ou contre-exemple ;
- question intermédiaire ;
- proposition de révision d’un prérequis.

### 6.5 Maîtrise plutôt que simple complétion

Terminer une leçon ne signifie pas nécessairement maîtriser la notion. Le système doit suivre plusieurs signaux : exactitude, autonomie, nombre d’indices, vitesse raisonnable, régularité et réussite différée.

### 6.6 Révision espacée et pratique mélangée

Les notions fragiles doivent réapparaître au bon moment. La pratique doit progressivement mélanger plusieurs types de problèmes afin que l’élève apprenne à reconnaître la méthode pertinente.

### 6.7 Difficulté adaptative

La difficulté augmente ou diminue selon les résultats. Le système doit pouvoir :

- accélérer lorsqu’un objectif est manifestement maîtrisé ;
- ralentir et décomposer lorsqu’un blocage apparaît ;
- proposer une leçon de prérequis ;
- offrir un défi facultatif aux élèves avancés.

### 6.8 Droit à l’erreur

L’erreur est traitée comme une information pédagogique, pas comme une punition. La gamification ne doit jamais humilier un élève ni exposer publiquement ses difficultés.

---

## 7. Rôles utilisateurs

| Rôle | Capacités principales |
|---|---|
| Visiteur | Découvrir le produit, consulter le catalogue public et essayer une activité de démonstration |
| Élève | Apprendre, pratiquer, suivre sa progression, participer aux défis et préparer les évaluations |
| Parent / responsable | Suivre l’activité autorisée de ses enfants, recevoir des bilans et gérer une offre familiale |
| Enseignant | Créer des classes, inviter des élèves, assigner du contenu et suivre les progrès |
| Responsable d’établissement | Gérer enseignants, classes, licences et indicateurs agrégés |
| Auteur pédagogique | Créer des cours, leçons, activités et exercices dans le studio de contenu |
| Relecteur / validateur | Vérifier l’exactitude, le programme, la langue et la qualité pédagogique |
| Administrateur plateforme | Gérer utilisateurs, contenus, paramètres, modération, support et sécurité |
| Support | Traiter les demandes sans accéder inutilement aux données pédagogiques sensibles |

Les autorisations devront suivre le principe du **moindre privilège**.

---

## 8. Fonctionnalités de la plateforme cible

Cette section décrit la **cible complète**. Toutes les fonctions ne seront pas livrées lors de la première version.

### 8.1 Site public

- Page d’accueil présentant la promesse et la méthode.
- Démonstrations interactives sans compte.
- Catalogue public par niveau, série et matière.
- Pages détaillées des parcours, cours et chapitres.
- Présentation des offres gratuites, individuelles, familiales et scolaires.
- Pages dédiées aux élèves, parents, enseignants et établissements.
- Témoignages, questions fréquentes, centre d’aide et formulaire de contact.
- Informations légales, confidentialité, cookies et conditions d’utilisation.
- Blog ou espace de ressources pédagogiques.

### 8.2 Inscription et onboarding

- Création de compte par e-mail.
- Connexion avec fournisseurs compatibles à décider ultérieurement.
- Vérification d’e-mail et récupération de mot de passe.
- Sélection du rôle : élève, parent, enseignant ou établissement.
- Sélection du niveau, de la série, de l’établissement facultatif et des objectifs.
- Questionnaire sur les difficultés et disponibilités.
- Test diagnostique initial facultatif ou recommandé.
- Recommandation automatique du premier parcours.
- Définition d’un objectif quotidien ou hebdomadaire.
- Consentement parental lorsque la réglementation ou l’âge l’exige.

### 8.3 Accueil élève personnalisé

- Action principale **« Continuer »** vers la prochaine activité pertinente.
- Leçon du jour.
- Objectif quotidien et progression vers cet objectif.
- Série de jours d’apprentissage.
- Énergie de protection de série en cas d’absence, selon les règles retenues.
- XP, niveau, badges et ligue.
- Cours en cours et pourcentage de progression.
- Recommandations personnalisées.
- Notions à réviser prochainement.
- Échéances : devoirs, contrôles et examens.
- Activités attribuées par un enseignant.
- Résumé des réussites récentes.

### 8.4 Catalogue et parcours d’apprentissage

- Parcours guidés du fondamental vers l’avancé.
- Parcours par classe et série.
- Parcours par objectif : remise à niveau, programme annuel, révision, Bac.
- Filtres par niveau, série, matière, thème, difficulté et durée.
- Recherche avec suggestions.
- Présentation des prérequis.
- Estimation du temps nécessaire.
- Affichage du nombre de leçons et d’exercices.
- Possibilité de suivre, quitter ou reprendre un parcours.
- Accès séquentiel ou libre selon les droits de l’offre.
- Favoris et liste **« À apprendre plus tard »**.

### 8.5 Moteur de leçons interactives

Chaque leçon peut combiner :

- texte court et progressif ;
- formules mathématiques correctement rendues ;
- schémas et graphiques interactifs ;
- animations pédagogiques ;
- curseurs et paramètres manipulables ;
- glisser-déposer ;
- classement ou association ;
- sélection simple ou multiple ;
- saisie numérique, algébrique ou textuelle ;
- construction géométrique ;
- placement de points sur un repère ;
- tracé de courbes ;
- tableaux à compléter ;
- démonstrations à ordonner ;
- réponses étape par étape ;
- exemples contextualisés ;
- mini-simulations ;
- bilan de fin de leçon.

Le moteur doit enregistrer les tentatives, mais ne doit pas enregistrer chaque geste plus longtemps que nécessaire.

### 8.6 Exercices et évaluations

- Exercices guidés.
- Exercices autonomes.
- Séries de pratique ciblée.
- Révision mélangée de plusieurs notions.
- Quiz de fin de leçon.
- Contrôle de fin de chapitre.
- Test diagnostique.
- Examen blanc chronométré.
- Mode préparation au Baccalauréat.
- Banque d’exercices paramétrables.
- Variantes générées à partir de modèles validés.
- Barème détaillé.
- Correction pas à pas.
- Reprise d’un exercice ou d’une leçon.
- Historique personnel des erreurs et carnet de remédiation.

### 8.7 Tuteur pédagogique assisté par IA

Le tuteur doit être intégré à la leçon et connaître uniquement le contexte nécessaire : objectif, énoncé, éléments manipulés, tentatives et erreurs récentes.

Fonctions prévues :

- poser une question intermédiaire plutôt que donner la réponse ;
- fournir des indices gradués ;
- expliquer une erreur en termes simples ;
- proposer un exemple analogue ;
- mettre en évidence une partie du graphique ou de l’interface ;
- adapter le niveau de langage à l’élève ;
- demander à l’élève d’expliquer son raisonnement ;
- orienter vers un prérequis ;
- produire un résumé de ce qui vient d’être compris ;
- fonctionner en texte et, éventuellement, en audio.

Garde-fous indispensables :

- rester dans le domaine pédagogique autorisé ;
- ne pas mener de conversation personnelle avec un mineur ;
- ne jamais demander d’information sensible ;
- ne pas fournir directement la solution d’une évaluation active ;
- utiliser des outils mathématiques déterministes pour vérifier les calculs ;
- citer la leçon interne ou le référentiel utilisé ;
- signaler l’incertitude ;
- permettre de désactiver ou couper le son du tuteur ;
- journaliser de façon limitée les incidents de sécurité ;
- organiser des évaluations régulières de précision et de sûreté.

### 8.8 Personnalisation et adaptation

- Profil de maîtrise par compétence et objectif pédagogique.
- Détection des prérequis fragiles.
- Recommandation de la prochaine meilleure activité.
- Adaptation de la difficulté.
- Révision espacée.
- Rappels de notions oubliées.
- Parcours de remédiation automatique.
- Parcours d’approfondissement.
- Suggestions basées sur les objectifs, pas sur de la publicité comportementale.
- Possibilité pour l’élève ou l’enseignant de remplacer la recommandation.

### 8.9 Progression et maîtrise

- Progression globale, par matière, parcours, cours, chapitre et leçon.
- États : non commencé, commencé, en cours, terminé, à revoir, maîtrisé.
- Score de maîtrise explicable.
- Temps d’apprentissage actif.
- Taux de réussite.
- Nombre d’indices utilisés.
- Historique des tentatives.
- Carte des compétences.
- Comparaison de l’élève avec sa propre progression passée.
- Synchronisation entre appareils.

### 8.10 Gamification responsable

- Points d’expérience (XP).
- Niveaux de profil.
- Série quotidienne.
- Protection limitée de série.
- Objectifs quotidiens et hebdomadaires.
- Badges de progression et de maîtrise.
- Défis thématiques.
- Ligues ou classements hebdomadaires facultatifs.
- Promotion, maintien ou changement de ligue selon des règles transparentes.
- Classements anonymisés ou utilisant un pseudonyme.
- Célébrations visuelles et sonores désactivables.
- Aucune mécanique de hasard payante.
- Aucune pénalisation académique pour non-participation au classement.

### 8.11 Espace parent / responsable

- Liaison sécurisée avec un ou plusieurs comptes élèves.
- Vue d’ensemble hebdomadaire.
- Temps d’apprentissage actif.
- Leçons commencées, terminées et maîtrisées.
- Régularité et objectifs atteints.
- Compétences fortes et notions à renforcer.
- Échéances à venir.
- Rapport hebdomadaire par e-mail ou notification, avec consentement.
- Encouragements privés envoyés à l’enfant.
- Gestion d’une offre familiale et des places disponibles.
- Contrôles adaptés à l’âge sans surveillance intrusive.
- Paramètres de confidentialité et de notifications.

### 8.12 Espace enseignant

- Création de classes.
- Invitation par lien, code ou import autorisé.
- Gestion de la liste d’élèves.
- Attribution d’un cours, d’une leçon, d’une série d’exercices ou d’un examen.
- Date de début, date limite et consignes.
- Parcours libre ou imposé.
- Prévisualisation des contenus avant attribution.
- Tableau de suivi par classe.
- Statut individuel : non commencé, en cours, terminé.
- Temps d’apprentissage actif.
- Taux de complétion et niveau de maîtrise.
- Identification des élèves bloqués ou avancés.
- Vue par compétence et par leçon.
- Commentaire privé à un élève.
- Réaffectation d’une activité de remédiation.
- Export CSV/PDF des résultats autorisés.
- Rapports de classe.
- Archivage d’une classe en fin d’année.
- Utilisation sur vidéoprojecteur pour une activité collective.

### 8.13 Espace établissement

- Gestion des enseignants, classes et élèves.
- Invitations et révocation des accès.
- Attribution des licences.
- Indicateurs agrégés par niveau, série et matière.
- Suivi de l’adoption sans exposer inutilement les réponses individuelles.
- Export de rapports institutionnels.
- Paramétrage de l’année scolaire.
- Gestion de plusieurs établissements pour un groupe autorisé.
- Journal d’audit des actions administratives.

### 8.14 Studio de création de contenu

- Éditeur de parcours, cours, niveaux, leçons et activités.
- Bibliothèque de composants interactifs réutilisables.
- Éditeur de formules, graphiques et figures.
- Prévisualisation mobile, tablette et ordinateur.
- Génération de variantes à partir de paramètres.
- Définition de la bonne réponse et des erreurs fréquentes.
- Indices gradués et corrections.
- Métadonnées : programme, classe, série, compétence, thème, durée et difficulté.
- Workflow brouillon → relecture → validation → publication.
- Versionnage et historique des modifications.
- Publication programmée.
- Retrait rapide d’un contenu erroné.
- Tests automatiques des réponses et variantes.
- Tableau de qualité : taux d’erreur anormal, abandon, signalements.

### 8.15 Administration et support

- Gestion des utilisateurs et rôles.
- Suspension, réactivation et suppression encadrées.
- Gestion des offres et droits d’accès.
- Gestion du catalogue et du référentiel académique.
- Modération des pseudonymes et contenus signalés.
- Centre de support et tickets.
- Base de connaissances et FAQ.
- Signalement d’un problème dans une leçon.
- Signalement d’une réponse potentiellement incorrecte.
- Tableau de santé de la plateforme.
- Journaux d’audit sécurisés.
- Gestion des consentements et demandes liées aux données personnelles.

### 8.16 Notifications

- Rappel de pratique quotidienne.
- Alerte de série menacée.
- Rappel d’un devoir ou examen.
- Recommandation de cours.
- Résumé hebdomadaire.
- Résultat d’un défi ou d’une ligue.
- Nouveau contenu pertinent.
- Paramètres séparés par type et canal.
- Heures calmes et limitation de fréquence.
- Désabonnement simple, hors messages transactionnels indispensables.

### 8.17 Paiements et abonnements

- Offre gratuite avec limites configurables.
- Offre individuelle mensuelle ou annuelle.
- Offre familiale avec plusieurs profils indépendants.
- Offre établissement ou groupe.
- Essai gratuit configurable.
- Coupons ou campagnes ponctuelles.
- Cadeau d’abonnement facultatif.
- Factures et reçus.
- Renouvellement, changement d’offre et annulation.
- Gestion claire des droits après expiration.
- Intégration ultérieure de moyens de paiement réellement adaptés au marché cible.

### 8.18 Multiplateforme

- Application web responsive.
- Progressive Web App (PWA).
- Installation sur l’écran d’accueil.
- Synchronisation des progrès.
- Notifications web et mobiles lorsque disponibles.
- Applications mobiles natives envisagées après validation du produit web.
- Continuité partielle hors connexion pour les contenus préchargés.

---

## 9. Expérience Mathématiques

Les Mathématiques constituent la première verticale du produit et doivent servir de fondation au moteur pédagogique général.

### Types de contenus prioritaires

- Calcul algébrique.
- Fonctions et représentations graphiques.
- Équations et inéquations.
- Géométrie plane et dans l’espace.
- Trigonométrie.
- Suites.
- Statistiques et probabilités.
- Nombres complexes pour les séries concernées.
- Vecteurs, transformations et géométrie analytique.
- Limites, dérivation, primitives et intégration selon les programmes concernés.
- Raisonnement, démonstration et résolution de situations.

Cette liste est indicative : la structure finale doit être produite depuis les programmes et progressions officiels versionnés.

### Composants interactifs nécessaires

- Droite numérique.
- Repère cartésien.
- Traceur de fonctions.
- Tableau de signes interactif.
- Tableau de variations.
- Manipulation d’expressions algébriques.
- Balance d’équation.
- Arbre de probabilités.
- Diagrammes statistiques.
- Géométrie avec points, droites, cercles et vecteurs.
- Curseur de paramètres pour observer l’effet sur une courbe.
- Étapes de démonstration à organiser.
- Zone de calcul avec validation symbolique.

### Structure type d’une leçon

1. **Situation de départ** — problème court et contextualisé.
2. **Exploration** — manipulation visuelle ou essai guidé.
3. **Découverte** — formulation progressive de la propriété.
4. **Méthode** — résolution pas à pas d’un exemple.
5. **Pratique guidée** — indices disponibles.
6. **Pratique autonome** — moins d’assistance.
7. **Transfert** — problème présenté différemment.
8. **Bilan** — notion, méthode, pièges fréquents.
9. **Mini-évaluation** — vérification immédiate de la maîtrise.
10. **Plan de révision** — prochaine date de pratique recommandée.

### Validation mathématique

- Les réponses numériques doivent accepter les formats équivalents autorisés.
- Les réponses algébriques doivent être comparées symboliquement lorsque cela est pertinent.
- Les domaines de définition et cas particuliers doivent être testés.
- Les graphiques doivent être vérifiés par des fonctions déterministes.
- Les variantes générées doivent passer des tests automatiques et une validation humaine avant publication.
- Le tuteur IA ne doit jamais être la seule source de vérité mathématique.

---

## 10. Parcours utilisateurs principaux

### 10.1 Nouvel élève

```text
Accueil public
→ Choix « Je suis élève »
→ Création de compte
→ Niveau et série
→ Objectif principal
→ Diagnostic court
→ Parcours recommandé
→ Première leçon interactive
→ Résultat et objectif quotidien
→ Tableau de bord personnalisé
```

### 10.2 Élève qui revient

```text
Connexion
→ Continuer la prochaine activité
→ Retour immédiat sur les réponses
→ Mise à jour de la maîtrise et des XP
→ Révision recommandée ou nouvelle leçon
→ Résumé de session
```

### 10.3 Préparation d’un contrôle

```text
Choisir « Préparer une évaluation »
→ Sélectionner les chapitres et la date
→ Diagnostic ciblé
→ Plan de révision
→ Leçons de remédiation
→ Séries mixtes
→ Test blanc
→ Bilan des dernières lacunes
```

### 10.4 Enseignant

```text
Créer une classe
→ Inviter les élèves
→ Choisir une leçon ou un parcours
→ Définir une échéance
→ Suivre activité et complétion
→ Repérer les difficultés communes
→ Assigner une remédiation
→ Exporter ou archiver le bilan
```

### 10.5 Parent

```text
Créer ou ouvrir un compte parent
→ Lier le compte de l’enfant avec consentement
→ Consulter le bilan hebdomadaire
→ Voir régularité, progression et difficultés
→ Envoyer un encouragement
→ Ajuster notifications ou abonnement
```

---

## 11. Organisation du contenu

### Unités de contenu

| Unité | Description |
|---|---|
| Programme | Version officielle pour une année ou une période donnée |
| Parcours | Suite recommandée de cours orientée vers un objectif |
| Cours | Ensemble cohérent couvrant un thème important |
| Niveau de cours | Étape de difficulté ou groupe de leçons |
| Leçon | Séquence interactive courte avec objectif mesurable |
| Activité | Écran ou interaction pédagogique dans une leçon |
| Exercice | Problème évalué avec réponse, indices et correction |
| Pratique | Ensemble d’exercices ciblés ou mélangés |
| Évaluation | Diagnostic, quiz, contrôle ou examen blanc |
| Compétence | Capacité suivie dans le modèle de maîtrise |

### Métadonnées minimales

Chaque leçon doit inclure :

- version du programme ;
- niveau et série ;
- matière, compétence, thème et chapitre ;
- objectifs pédagogiques ;
- prérequis ;
- difficulté ;
- durée estimée ;
- type d’activité ;
- critères de réussite ;
- erreurs fréquentes ;
- indices ;
- correction ;
- auteur, relecteur et validateur ;
- statut de publication ;
- date de dernière vérification.

---

## 12. Modèle économique envisagé

Le modèle économique n’est pas encore validé. L’architecture doit néanmoins permettre plusieurs offres sans rendre les contenus pédagogiques dépendants d’un prix précis.

### Offre gratuite possible

- Accès au catalogue.
- Nombre limité de leçons ou pratiques par jour.
- Progression séquentielle.
- Aperçu limité du tuteur pédagogique.
- Progression, séries et objectifs de base.
- Publicité éventuelle uniquement si elle est compatible avec la protection des mineurs ; l’option privilégiée reste une expérience sans publicité ciblée.

### Offre Premium possible

- Accès illimité aux cours et pratiques.
- Accès complet au tuteur pédagogique.
- Navigation libre dans les leçons.
- Révisions et recommandations avancées.
- Examens blancs et préparation intensive.
- Téléchargement temporaire de contenus compatibles.
- Expérience sans publicité.

### Offre famille possible

- Plusieurs comptes individuels.
- Progression indépendante.
- Tableau de bord parent.
- Gestion des membres et invitations.

### Offre enseignant / établissement possible

- Classes et devoirs.
- Suivi détaillé.
- Rapports et exports.
- Gestion centralisée des comptes.
- Tarification par classe, établissement ou nombre d’élèves.

Les prix, moyens de paiement et règles d’éligibilité feront l’objet d’une décision séparée.

---

## 13. Architecture fonctionnelle

```text
Interfaces
├── Site public
├── Application élève
├── Espace parent
├── Espace enseignant
├── Portail établissement
└── Studio de contenu / administration

Domaines métier
├── Identité et accès
├── Référentiel académique
├── Catalogue et parcours
├── Moteur de leçons interactives
├── Exercices et évaluations
├── Maîtrise et personnalisation
├── Tuteur pédagogique
├── Gamification
├── Classes et devoirs
├── Abonnements et paiements
├── Notifications
├── Analytique produit et pédagogique
└── Support, sécurité et conformité
```

### Principes d’architecture

- Séparer le contenu pédagogique du code de l’application.
- Utiliser un schéma de contenu versionné.
- Commencer par un **monolithe modulaire** bien structuré avant d’envisager des microservices.
- Conserver les décisions pédagogiques importantes dans des services déterministes et auditables.
- Encapsuler les fournisseurs externes derrière des interfaces remplaçables.
- Concevoir l’application pour une évolution vers plusieurs matières sans dupliquer le moteur.

---

## 14. Architecture technique envisagée

> Cette section constitue une orientation à confirmer après le **GO** et après audit du besoin réel. Elle ne vaut pas choix définitif.

### Application cliente

- Web responsive et PWA en priorité.
- Framework web moderne avec rendu performant.
- TypeScript recommandé.
- Design system accessible et documenté.
- Bibliothèque de composants interactifs pédagogiques.
- Rendu mathématique compatible LaTeX.
- Graphiques, géométrie et visualisations avec technologies web adaptées.

### Serveur

- API sécurisée.
- Architecture modulaire.
- Traitements asynchrones pour notifications, rapports et génération contrôlée.
- Webhooks pour paiements et services externes.
- Journalisation structurée sans données sensibles inutiles.

### Données

- Base relationnelle principale, par exemple PostgreSQL.
- Cache et files de tâches si nécessaires.
- Stockage objet pour images, audio et ressources pédagogiques.
- Moteur de recherche seulement lorsque le catalogue le justifie.
- Entrepôt analytique séparé des données opérationnelles à terme.

### IA

- Passerelle serveur unique vers les modèles.
- Aucune clé exposée au client.
- Récupération du contexte depuis les contenus validés.
- Outils mathématiques déterministes.
- Filtres de sécurité et limitation de sujets.
- Évaluation automatique et humaine des réponses.
- Traçabilité limitée et respectueuse de la vie privée.
- Fournisseur remplaçable.

### Déploiement

- Production web : `https://excellence-lycee.vercel.app`.
- Production API : `https://excellence-lycee-api.vercel.app`.
- Architecture Vercel : deux projets coordonnés, avec proxy web propriétaire `/api/*` vers l’API afin de préserver les cookies de session et de ne jamais exposer les secrets serveur au navigateur.
- Déploiement continu du frontend : le dépôt GitHub `davykev2/excellence-lycee` est connecté au projet Vercel `excellence-lycee`, dont le **Root Directory est `apps/web`**. Chaque push sur `main` déclenche automatiquement un déploiement de production ; aucun déploiement manuel n’est nécessaire. Un déploiement manuel de secours se lance depuis la racine du dépôt avec `npx vercel --prod`, et non depuis `apps/web`.
- Données de production : Supabase, configuré uniquement dans le projet API.
- Environnements distincts : développement, préproduction et production.
- Intégration et déploiement continus.
- Migrations de base de données versionnées.
- Sauvegardes chiffrées et testées.
- Surveillance des erreurs, performances et disponibilités.
- Retour rapide à une version stable.

---

## 15. Modèle de données conceptuel

### Identité

- `User`
- `Profile`
- `StudentProfile`
- `GuardianProfile`
- `TeacherProfile`
- `Organization`
- `School`
- `Classroom`
- `Membership`
- `Consent`

### Référentiel académique

- `Curriculum`
- `AcademicYear`
- `GradeLevel`
- `Track` / `Series`
- `Subject`
- `Competency`
- `Theme`
- `CurriculumUnit`

### Contenu

- `LearningPath`
- `Course`
- `CourseLevel`
- `Lesson`
- `Activity`
- `ExerciseTemplate`
- `ExerciseVariant`
- `Hint`
- `Solution`
- `Asset`
- `ContentVersion`
- `ContentReview`

### Apprentissage

- `Enrollment`
- `LessonAttempt`
- `ExerciseAttempt`
- `AssessmentAttempt`
- `MasteryState`
- `ReviewSchedule`
- `Recommendation`
- `LearningSession`
- `ErrorPattern`

### Motivation

- `XpEvent`
- `DailyGoal`
- `Streak`
- `StreakProtection`
- `Badge`
- `UserBadge`
- `League`
- `LeagueMembership`
- `Challenge`

### Enseignement

- `Assignment`
- `AssignmentTarget`
- `AssignmentSubmission`
- `TeacherFeedback`
- `ClassroomReport`

### Commerce et communication

- `Plan`
- `Subscription`
- `Entitlement`
- `Invoice`
- `Payment`
- `FamilyGroup`
- `NotificationPreference`
- `Notification`
- `SupportTicket`

Les noms définitifs pourront changer. Les relations devront empêcher qu’un utilisateur consulte les données d’un élève sans autorisation explicite.

---

## 16. Sécurité, vie privée et protection des mineurs

### Principes

- Collecte minimale des données.
- Consentement adapté à l’âge et au rôle.
- Paramètres privés par défaut.
- Chiffrement en transit et au repos.
- Mots de passe hachés avec un algorithme reconnu.
- Sessions sécurisées et révocables.
- Authentification renforcée pour les administrateurs.
- Contrôle d’accès testé côté serveur.
- Journal d’audit pour les actions sensibles.
- Sauvegardes, restauration et plan de réponse aux incidents.
- Suppression et export des données selon les droits applicables.
- Durées de conservation documentées.

### Mineurs

- Aucun message privé entre élèves inconnus.
- Aucun profil élève indexé publiquement.
- Pseudonymes pour les classements.
- Pas de publicité comportementale fondée sur l’activité scolaire.
- Pas de vente de données personnelles.
- Tuteur IA limité au contexte pédagogique.
- Processus clair de signalement et d’escalade.
- Validation juridique locale avant ouverture publique.

### Conformité à étudier

- Législation ivoirienne applicable à la protection des données.
- Exigences liées aux mineurs et au consentement parental.
- Conditions des prestataires de paiement, d’hébergement, d’IA et de notification.
- Obligations contractuelles des établissements scolaires.

Ce document ne constitue pas un avis juridique.

---

## 17. Accessibilité, performance et faible connectivité

### Accessibilité

- Objectif WCAG 2.2 niveau AA lorsque applicable.
- Navigation complète au clavier.
- Focus visible.
- Contrastes suffisants.
- Cibles tactiles confortables.
- Libellés explicites.
- Lecteurs d’écran et ordre de lecture cohérent.
- Alternatives textuelles pour les graphiques.
- Pas d’information transmise uniquement par la couleur.
- Contrôle des animations et du son.
- Temps supplémentaire ou absence de chronomètre hors examens.
- Prise en compte de la dyscalculie, de la dyslexie et des difficultés d’attention dans la mesure du possible.

### Performance

- Chargement initial rapide sur réseau mobile.
- Découpage du code et chargement à la demande.
- Images et médias optimisés.
- Budget de performance par écran.
- Limitation des animations coûteuses.
- Mise en cache contrôlée.
- Mesure des performances sur appareils modestes.

### Faible connectivité

- Mode économie de données.
- Indicateur clair de synchronisation.
- Reprise après interruption.
- Préchargement facultatif de la prochaine leçon.
- Cache des ressources déjà consultées lorsque possible.
- File locale des tentatives en attente de synchronisation.
- Résolution explicite des conflits.
- Contenus audio et vidéo facultatifs, jamais indispensables à la compréhension.

---

## 18. Qualité pédagogique et gouvernance des contenus

### Workflow obligatoire

```text
Référentiel officiel
→ Conception pédagogique
→ Création
→ Vérification scientifique
→ Relecture linguistique
→ Test des interactions
→ Validation programme
→ Prépublication
→ Test avec élèves
→ Publication
→ Suivi des données et signalements
→ Révision
```

### Règle des quatre yeux

Aucun contenu académique ne doit être publié par son seul auteur. Une seconde personne qualifiée doit vérifier au minimum l’exactitude, le barème, les réponses acceptées et l’alignement au programme.

### Qualité continue

- Analyse des exercices abandonnés.
- Détection des taux d’échec anormaux.
- Analyse des réponses signalées.
- Tests de toutes les variantes générées.
- Révision annuelle contre les progressions officielles.
- Historique de publication et possibilité de retour arrière.
- Comité pédagogique pour les décisions importantes.

### Utilisation de l’IA pour le contenu

L’IA peut assister la rédaction, la création de variantes ou la détection d’incohérences, mais aucun contenu généré ne doit être publié sans validation humaine qualifiée.

---

## 19. Mesure de la réussite

### Indicateur principal proposé

**Nombre hebdomadaire d’élèves actifs qui maîtrisent au moins un objectif pédagogique vérifié.**

Cet indicateur évite de confondre temps passé, clics et véritable apprentissage.

### Indicateurs pédagogiques

- Progression entre diagnostic initial et réévaluation.
- Taux de maîtrise par objectif.
- Rétention de la maîtrise après plusieurs semaines.
- Diminution des erreurs récurrentes.
- Réussite aux évaluations de transfert.
- Part d’élèves nécessitant moins d’indices au fil du temps.

### Indicateurs d’engagement

- Élèves actifs par jour, semaine et mois.
- Taux de retour après 1, 7 et 30 jours.
- Sessions d’apprentissage terminées.
- Objectifs quotidiens atteints.
- Régularité sans pression excessive.
- Cours commencés et réellement poursuivis.

### Indicateurs enseignants

- Classes actives.
- Devoirs attribués et terminés.
- Temps nécessaire à la création d’une classe.
- Utilisation des rapports pour une action de remédiation.
- Satisfaction des enseignants.

### Garde-fous

- Taux de désactivation des notifications.
- Usage nocturne excessif chez les mineurs.
- Nombre de signalements de contenu.
- Incidents de sécurité du tuteur IA.
- Écart de réussite selon appareil, réseau, genre ou zone géographique lorsque la mesure est légale et éthique.

---

## 20. Roadmap proposée

### Phase 0 — Cadrage

- Valider le nom et la vision.
- Définir le premier niveau et les premières séries.
- Rassembler les programmes et progressions officiels.
- Choisir les premiers chapitres de Mathématiques.
- Définir la charte pédagogique.
- Auditer les contraintes légales et de protection des mineurs.
- Concevoir trois directions visuelles originales.
- Tester le concept auprès d’élèves et enseignants.

### Phase 1 — Prototype pédagogique

- Une leçon de Mathématiques entièrement interactive.
- Un mini-parcours de plusieurs leçons.
- Retour immédiat, indices et correction.
- Première version du moteur mathématique.
- Test sur téléphone et connexion limitée.
- Tests utilisateurs avec un petit groupe.

### Phase 2 — MVP Mathématiques

- Comptes élèves.
- Niveau et série.
- Catalogue Mathématiques limité mais cohérent.
- Parcours guidé.
- Leçons et exercices interactifs.
- Progression et maîtrise de base.
- Objectif quotidien, XP et série.
- Tableau de bord élève.
- Studio de contenu minimal.
- Administration et signalement.

### Phase 3 — Personnalisation et accompagnement

- Diagnostic complet.
- Révision espacée.
- Recommandations adaptatives.
- Tuteur pédagogique avec garde-fous.
- Pratique ciblée et mélangée.
- Badges, ligues et défis facultatifs.

### Phase 4 — Enseignants et parents

- Classes, invitations et devoirs.
- Tableau de suivi enseignant.
- Rapports parents.
- Offres famille et établissement.
- Exports et gestion des établissements.

### Phase 5 — Couverture Mathématiques complète

- Tous les niveaux et séries retenus.
- Préparation aux compositions et au Bac.
- Examens blancs.
- Banque d’exercices étendue.
- Validation annuelle du référentiel.

### Phase 6 — Autres matières

- Physique-Chimie.
- Français.
- Anglais.
- SVT.
- Philosophie.
- Histoire-Géographie.

Chaque matière doit réutiliser le moteur commun tout en disposant de composants spécifiques.

### Phase 7 — Échelle nationale

- Partenariats avec établissements.
- Portail multi-établissements.
- Applications mobiles si justifiées.
- Optimisation avancée hors connexion.
- Analytique pédagogique agrégée.
- Renforcement du support et de la gouvernance.

---

## 21. Définition du premier MVP

Le MVP ne doit pas essayer de contenir immédiatement toutes les fonctions de la plateforme finale. Il doit prouver que des élèves ivoiriens apprennent réellement mieux avec l’expérience proposée.

### Inclus

- Une cible Mathématiques clairement définie par niveau et série.
- Un parcours pédagogique cohérent, pas une collection de pages isolées.
- Des leçons véritablement interactives.
- Des exercices progressifs avec validation fiable.
- Des indices et corrections utiles.
- Un compte élève et une progression synchronisée.
- Un tableau de bord simple.
- Un objectif quotidien, des XP et une série.
- Une administration minimale des contenus.
- Une expérience mobile rapide.
- Des outils de signalement et de support.
- Des mesures pédagogiques de base.

### Non inclus au premier lancement

- Toutes les matières.
- Couverture immédiate de tous les chapitres de toutes les séries.
- Réseau social public.
- Cours vidéo en direct.
- Applications mobiles natives complètes.
- IA générale sans restrictions.
- Microservices complexes.
- Classements obligatoires.

### Critères de réussite du MVP

- Des élèves ciblés terminent le parcours sans accompagnement technique.
- Les exercices acceptent correctement les réponses mathématiquement équivalentes prévues.
- Une amélioration mesurable apparaît entre diagnostic et réévaluation.
- La majorité des testeurs comprend quoi faire sur chaque écran.
- L’expérience reste utilisable sur un téléphone modeste et un réseau mobile limité.
- Aucun problème critique de sécurité ou de protection des mineurs n’est ouvert.
- Les enseignants testeurs jugent l’alignement au programme satisfaisant.

---

## 22. Risques et réponses prévues

| Risque | Réponse |
|---|---|
| Périmètre trop ambitieux | Construire par phases et valider l’apprentissage avant l’échelle |
| Contenu insuffisant | Mettre en place tôt le studio, le workflow et une équipe pédagogique |
| Erreur dans un exercice | Validation humaine, tests automatiques, signalement et retrait rapide |
| IA donnant une mauvaise réponse | Outils déterministes, contexte limité, évaluations et possibilité de désactivation |
| Copie trop proche de Brilliant | Identité, contenus, illustrations et interactions originaux |
| Mauvaise adaptation au programme | Référentiel DPFC versionné et validation par enseignants ivoiriens |
| Connexion trop faible | PWA, budgets de performance, économie de données et reprise hors ligne |
| Gamification addictive | Notifications limitées, classements facultatifs et garde-fous de bien-être |
| Données de mineurs exposées | Confidentialité par défaut, contrôle d’accès et collecte minimale |
| Coût d’infrastructure IA | Limites, cache sûr, petits modèles spécialisés et priorisation pédagogique |
| Difficulté à maintenir plusieurs matières | Moteur commun, schéma de contenu et composants spécialisés |
| Faible adoption enseignant | Mise en route simple, prévisualisation et rapports directement utiles |

---

## 23. Décisions restant à prendre

Les décisions suivantes doivent être validées avant ou pendant la conception, mais avant leur implémentation définitive :

1. Nom officiel de la plateforme.
2. Identité visuelle et personnalité de marque.
3. Première classe et première série de Mathématiques à lancer.
4. Premiers chapitres du prototype.
5. Rôle exact du tuteur IA au premier lancement.
6. Langues de l’interface en plus du français.
7. Présence ou non d’une offre gratuite limitée.
8. Modèle de paiement et prix.
9. Priorité entre espace enseignant et espace parent.
10. Disponibilité d’enseignants ivoiriens pour la validation.
11. Hébergement et localisation des données.
12. Niveau de fonctionnement hors connexion.
13. Âge minimum et mécanisme de consentement parental.
14. Besoin d’applications natives après la PWA.
15. Forme des classements, badges et récompenses.

---

## 24. Fonctionnalités vérifiées dans un compte connecté

Cette section consigne les fonctions observées le **19 juillet 2026** dans un compte Brilliant connecté utilisant l’offre gratuite. L’examen est resté non destructif : aucun essai Premium n’a été activé, aucun paramètre n’a été modifié, aucun achat n’a été effectué et aucun exercice n’a été validé.

Ces constats servent à préciser le cahier des charges d’Excellence Lycée. Ils ne constituent pas une autorisation de copier l’interface ou les contenus de Brilliant.

### 24.1 Navigation principale

L’application connectée est organisée autour de trois destinations principales :

- **Home** — accueil et recommandations ;
- **Courses** — catalogue et parcours ;
- **You** — profil, XP, ligues et accès aux paramètres.

L’en-tête affiche également :

- l’état de l’offre ou l’appel à essayer Premium ;
- le nombre de protections de série disponibles ;
- le compteur d’XP ;
- un menu complémentaire.

### 24.2 Accueil personnalisé

L’accueil ne présente pas uniquement un catalogue. Il propose directement plusieurs cartes de reprise ou de découverte contenant :

- le nom du cours ;
- le niveau recommandé ;
- la prochaine leçon ;
- un bouton **Start** ou de reprise ;
- une illustration propre au cours ;
- plusieurs recommandations consultables sous forme de carrousel.

L’expérience confirme l’importance, pour Excellence Lycée, d’afficher une action principale claire : **continuer la meilleure prochaine activité**, sans forcer l’élève à rechercher lui-même une leçon à chaque visite.

### 24.3 Parcours suivis et catalogue connecté

Le catalogue connecté distingue :

- **Your learning paths** — parcours déjà suivis ou favoris ;
- **Other learning paths** — autres parcours disponibles.

Fonctions observées :

- ajout ou retrait d’un parcours favori ;
- pourcentage de progression du parcours ;
- barre de progression par cours ;
- ordre recommandé des cours ;
- niveau scolaire indicatif ;
- séparation entre parcours fondamental, intermédiaire et avancé ;
- accès aux anciens cours archivés ;
- recherche assistée avec une invite du type **« Que veux-tu apprendre ? »**.

Pour Excellence Lycée, cette organisation sera adaptée à la hiérarchie ivoirienne : classe, série, matière, compétence, thème et leçon.

### 24.4 Profil, XP et ligues

Le profil regroupe l’identité visuelle de l’apprenant et sa progression compétitive.

Fonctions observées :

- avatar ou initiale ;
- nom d’affichage ;
- XP total ou hebdomadaire ;
- ligues verrouillées jusqu’à l’atteinte d’un seuil initial ;
- indication claire du nombre d’XP restant avant le déverrouillage ;
- classement hebdomadaire après déverrouillage.

Pour Excellence Lycée, les classements resteront facultatifs, pseudonymisés et sans conséquence sur les résultats académiques.

La photo de profil restera elle aussi facultative : l’inscription ne sera jamais bloquée si l’élève n’en fournit pas, et un avatar neutre accessible sera utilisé par défaut.

### 24.5 Structure réelle d’une leçon

Une leçon connectée est présentée comme une suite d’écrans courts. L’état de la page est reflété dans l’URL, ce qui permet de reprendre ou identifier une étape précise.

Éléments observés :

- bouton de fermeture ;
- barre de progression de la leçon ;
- accès au statut de la série quotidienne ;
- titre et consigne courte ;
- zone centrale interactive ;
- bouton **Start over** pour réinitialiser l’activité ;
- bouton **Check** désactivé tant que l’élève n’a pas réalisé l’action attendue ;
- retour pédagogique prévu après validation ;
- contrôles fixes accessibles pendant l’activité.

Cette structure confirme qu’un exercice ne doit pas être un simple formulaire. L’interface doit connaître l’état de la manipulation et n’autoriser la validation qu’au moment pertinent.

### 24.6 Tuteur intégré à l’activité

Le tuteur est intégré au contexte de la leçon au lieu d’être isolé dans une page de chat générique.

Fonctions observées :

- ouverture depuis un bouton présent dans l’activité ;
- message d’introduction lié au cours ;
- reprise automatique de la consigne actuelle ;
- champ de saisie libre ;
- entrée vocale grâce à un bouton d’enregistrement ;
- conservation visuelle de l’exercice pendant l’échange ;
- capacité prévue à guider l’élève sans quitter la leçon.

Pour Excellence Lycée, le tuteur devra recevoir le contexte structuré de l’exercice, les actions déjà effectuées et les erreurs constatées, tout en restant soumis aux garde-fous décrits dans ce document.

### 24.7 Son et narration

La leçon propose des réglages audio séparés :

- narration ;
- effets sonores.

Chaque option peut être activée ou désactivée. Excellence Lycée devra conserver cette séparation et ne jamais rendre le son indispensable à la résolution.

### 24.8 Signalement intégré

Un élève peut signaler un problème sans quitter la leçon. Le panneau observé comprend :

- type de ticket ;
- catégorie de rapport de bug ;
- champ de description ;
- bouton d’envoi désactivé tant que les informations nécessaires ne sont pas fournies ;
- capture de l’état visuel de la leçon jointe au rapport ;
- avertissement indiquant que la capture technique peut différer légèrement de l’affichage réel.

Excellence Lycée devra permettre de distinguer au minimum : erreur d’énoncé, réponse considérée à tort comme incorrecte, problème d’affichage, problème de traduction ou de langue, difficulté d’accessibilité et autre problème technique.

### 24.9 Paramètres du compte

Fonctions de gestion observées :

- modification du prénom et du nom ;
- vérification de l’adresse e-mail ;
- ajout d’une autre adresse e-mail ;
- changement de mot de passe ;
- connexion d’un compte tiers ;
- affichage des comptes connectés ;
- gestion des cookies ;
- export des données personnelles ;
- désactivation ou suppression du compte.

### 24.10 Préférences

Les préférences sont regroupées en trois familles :

- **Appearance** — thème clair, sombre ou automatique ;
- **Audio settings** — comportement sonore ;
- **Email notifications** — catégories de communication.

Catégories de notification observées :

- séries quotidiennes ;
- ligues ;
- rappels d’apprentissage ;
- actualités et annonces ;
- réglage global.

### 24.11 Abonnement depuis le compte

L’espace abonnement indique le plan actuel et présente les avantages Premium :

- apprentissage quotidien illimité ;
- cours complets ;
- tutorat par Koji ;
- absence de publicité ;
- pratique personnalisée ;
- possibilité d’avancer librement dans un cours.

Il comprend également :

- consultation des offres ;
- contact du support ;
- accès aux pages d’aide ;
- gestion ou achat de cadeaux Premium.

La séparation technique entre le contenu, l’abonnement et les droits d’accès devra être reproduite dans Excellence Lycée afin de pouvoir faire évoluer les offres sans réécrire les cours.

### 24.12 Limites de cette vérification

Les éléments suivants n’ont volontairement pas été testés :

- activation ou annulation d’un essai ;
- paiement ;
- validation d’une réponse et attribution réelle d’XP ;
- promotion dans une ligue ;
- conversation envoyée au tuteur ;
- modification des préférences ;
- export ou suppression des données ;
- parcours complet d’un compte Premium ;
- tableau de bord enseignant authentifié.

Ces fonctions sont déjà prévues dans la cible produit, mais devront être vérifiées par des prototypes propres à Excellence Lycée plutôt que reproduites à l’identique.

---

## 25. Références

### Références produit observées

Consultées le **19 juillet 2026** :

- [Brilliant — page d’accueil](https://brilliant.org/)
- [Brilliant — catalogue des cours](https://brilliant.org/courses/)
- [Brilliant — offre Premium](https://brilliant.org/subscribe/)
- [Brilliant for Educators](https://educator.brilliant.org/)
- [Brilliant — centre d’aide](https://brilliant.org/help/)
- [Fonctionnement des parcours d’apprentissage](https://brilliant.org/help/features/what-are-learning-paths/)
- [Fonctionnement du tuteur Koji](https://brilliant.org/help/features/how-does-koji-work/)
- [XP](https://brilliant.org/help/features/what-is-xp/)
- [Ligues et classements](https://brilliant.org/help/features/what-are-leagues-and-leaderboards/)
- [Séries quotidiennes](https://brilliant.org/help/features/what-is-a-streak/)
- [Protection de série](https://brilliant.org/help/features/what-is-a-streak-charge/)
- [Suivi des progrès par les enseignants](https://brilliant.org/help/for-educators/can-i-track-my-students-progress-on-brilliant/)

Ces références servent à comprendre des modèles d’expérience. Elles n’autorisent pas la copie de contenus, de code, d’illustrations, de marque ou d’interface.

### Références académiques ivoiriennes

- [DPFC — site officiel](https://dpfc-ci.net/)
- [DPFC — progressions du secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)
- [Programme éducatif de Mathématiques — Seconde A](https://dpfc-ci.net/dpfc/programmes/maths/05.%20Prog%20%C3%89duct%20MATHS%202A%20CND%200923.pdf)
- [Programme éducatif de Mathématiques — Seconde C](https://dpfc-ci.net/dpfc/programmes/maths/06.Prog%20Educt%20maths%202C%20CND%200923.pdf)
- [Programme éducatif de Mathématiques — Première C](https://dpfc-ci.net/dpfc/programmes/maths/09.Prog%20Educt%20maths%201C%20CND%200923.pdf)
- [Programme éducatif de Mathématiques — Première D](https://dpfc-ci.net/dpfc/programmes/maths/10.Prog%20Educt%20maths%201D%20CND%200923.pdf)
- [Programme éducatif de Mathématiques — Terminale D](https://dpfc-ci.net/dpfc/programmes/maths/14.%20Prog%20Educt%20maths%20TD%20CND%200923.pdf)

Avant la production de contenus, l’équipe devra constituer et valider la liste exhaustive des documents officiels applicables à chaque niveau et série.

---

## 26. État du dépôt

Le dépôt contient désormais le cadrage produit complet et un premier frontend responsive sous `apps/web`.

### Stack du prototype

- React 19 et TypeScript ;
- Vite ;
- Nunito Sans Variable ;
- Phosphor Icons ;
- Recharts pour les visualisations mathématiques interactives.
- Fastify et TypeScript pour l’API ;
- SQLite pour la persistance locale du MVP ;
- JWT courts, cookies de renouvellement `HttpOnly`, bcrypt, limitation de débit et en-têtes de sécurité.

### Organisation actuelle

```text
apps/api/
├── src/routes/          # authentification, profil et progression
├── src/database.ts      # schéma SQLite et couche de persistance
└── package.json

apps/web/
├── src/assets/          # logo officiel et décors raster
├── src/config/          # navigation configurable
├── src/data/            # programme, niveaux et matières
├── src/domain/          # contrats TypeScript du domaine
├── src/features/        # dashboard, leçon, tuteur, navigation
├── src/ui/              # composants UI génériques
├── design-qa.md         # validation visuelle et fonctionnelle
└── package.json
```

### Commandes de développement

```bash
cd apps/api
npm install
npm run start

cd apps/web
npm install
npm run dev
```

Validation locale :

```bash
npm run typecheck
npm run build
```

---

## Propriété intellectuelle

**Brilliant** est une marque appartenant à ses détenteurs respectifs. Excellence Lycée n’est ni affilié, ni approuvé, ni sponsorisé par Brilliant.

Tous les contenus pédagogiques, exercices, illustrations, animations, composants interactifs, textes, sons, marques et éléments graphiques d’Excellence Lycée devront être originaux ou utilisés sous une licence compatible et documentée.

## Licence du projet

À définir avant la publication du code ou l’accueil de contributeurs externes.
---

## Annexe — Présentation historique du dépôt

Application web (et mobile Android) d'entraînement pour les élèves du lycée en
Côte d'Ivoire, de la **Seconde à la Terminale**. Portée par la structure
**EXCELLENCE** (« Leader de la formation aux concours d'entrée à l'INP-HB et à
l'ESATIC »).

Les élèves révisent dans toutes les matières de leur classe et de leur série,
dans un esprit compétitif : résumés de cours, quiz à correction immédiate,
quiz rapide, devoirs chronométrés, duels 1 contre 1, classements, badges et
gamification.

🔗 **Application en ligne : [excellence-lycee.vercel.app](https://excellence-lycee.vercel.app)**

---

## ✨ Fonctionnalités

- **Résumés de cours** par leçon, rendus en Markdown + formules mathématiques
  (KaTeX), alignés sur les progressions officielles DPFC 2025-2026.
- **Exercices** — quiz par chapitre à **feedback immédiat** : QCM et questions
  à saisie libre, correction et justification détaillée à chaque réponse,
  déblocage progressif.
- **Quiz rapide** — questions en continu par matière, points, séries (streaks)
  et justifications.
- **Devoirs** — mode examen chronométré, noté sur 20, tentatives limitées.
- **Duels 1 contre 1** entre élèves de la même classe.
- **Classements** par matière, par classe et par établissement.
- **Badges & gamification** : niveaux d'expérience, missions quotidiennes,
  célébrations, retour audio.
- **Communauté** : chat de classe et messagerie privée (temps réel).
- **Back-office admin** : gestion des contenus, des utilisateurs, des
  signalements, matrice de couverture éditoriale.
- **Application Android** empaquetée avec Capacitor.

## 🧱 Stack technique

| Côté | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Zustand |
| Contenu | react-markdown, KaTeX, remark/rehype |
| Mobile | Capacitor 8 (Android) |
| Backend | Supabase (PostgreSQL, Auth, RLS, fonctions RPC, Realtime, Storage) |
| Hébergement | Vercel (frontend) · Supabase Cloud (base) |
| Lint | oxlint |

## 📁 Structure du dépôt

```
.
├── frontend/            # Application React (Vite)
│   ├── src/
│   │   ├── pages/       # Écrans (Dashboard, Quiz, Résumés, Admin, …)
│   │   ├── components/  # UI, quiz, gamification, layout…
│   │   ├── store/       # Zustand (auth, présence, réglages, audio)
│   │   └── lib/         # Client Supabase, utilitaires
│   └── android/         # Projet Capacitor (généré)
├── supabase/
│   ├── schema.sql       # Schéma complet (source de vérité, idempotent)
│   ├── migrations/      # Évolutions successives de la base
│   └── resumes/         # Contenus de résumés (Markdown source)
└── content_pipeline/    # Scripts de préparation de contenu
```

## 🚀 Démarrage

### 1. Base de données

Créer un projet sur [supabase.com](https://supabase.com), puis dans le
**SQL Editor** exécuter `supabase/schema.sql`, puis les fichiers de
`supabase/migrations/` dans l'ordre de leur nom.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

### 3. Compte administrateur

S'inscrire dans l'application, puis dans le SQL Editor :

```sql
update public.profiles set is_admin = true, approuve = true
where username = 'ton_pseudo';
```

## 🔒 Sécurité

- Row Level Security (RLS) sur toutes les tables sensibles.
- Les bonnes réponses ne transitent jamais vers le client avant soumission :
  correction et attribution des points passent par des fonctions RPC
  `SECURITY DEFINER` côté serveur.
- Aucune clé secrète n'est versionnée (`.env` ignoré par git).

## 📝 Licence

Propriété de la structure **EXCELLENCE**. Usage interne.
