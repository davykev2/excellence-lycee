-- ============================================================================
-- EXCELLENCE LYCÉE — résumés svt / Terminale (séries C, D)
-- Généré par supabase/resumes/build_sql.mjs — idempotent, rejouable sans risque.
-- À coller intégralement dans Supabase SQL Editor > New query.
-- ============================================================================

-- 1) Création des chapitres (ignorés s'ils existent déjà au même ordre)
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'L1 — Le réflexe conditionnel', 'La communication dans l''organisme · réflexes acquis, apprentissage'),
  (2, 'L2 — Le fonctionnement du tissu nerveux', 'La communication dans l''organisme · potentiel de repos et d''action, synapse'),
  (3, 'L3 — Le fonctionnement du muscle strié squelettique', 'La communication dans l''organisme · contraction, actine-myosine, énergie'),
  (4, 'L4 — Le fonctionnement du cœur', 'La communication dans l''organisme · automatisme cardiaque, contrôle nerveux et hormonal'),
  (5, 'L5 — Le maintien de la constance du milieu intérieur', 'Le milieu intérieur · rein, homéostasie, ADH, aldostérone'),
  (6, 'L6 — Le système de défense de l''organisme', 'La défense de l''organisme · immunité non spécifique et spécifique'),
  (7, 'L7 — L''infection de l''organisme par le VIH', 'La défense de l''organisme · VIH-SIDA, lymphocytes T4'),
  (8, 'L8 — Le devenir des cellules sexuelles chez les mammifères', 'La reproduction chez les mammifères · fécondation, cellule-œuf, nidation'),
  (9, 'L9 — Le fonctionnement des organes sexuels chez l''Homme', 'La reproduction · cycles sexuels, hormones, contraception'),
  (10, 'L10 — La reproduction chez les spermaphytes', 'La reproduction chez les spermaphytes · pollen, ovule, double fécondation'),
  (11, 'L11 — La transmission d''un caractère héréditaire chez l''Homme', 'La transmission des caractères héréditaires · monohybridisme, pedigree'),
  (12, 'L12 — La transmission de deux caractères héréditaires', 'La transmission des caractères héréditaires · dihybridisme, gènes liés/indépendants'),
  (14, 'L14 — L''exploitation des gisements miniers', 'Les ressources minières · prospection, exploitation, impacts'),
  (15, 'L15 — L''amélioration et la protection des sols', 'La gestion des sols · amendements, techniques de protection')
) as x(ordre, titre, description) on true
where m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre et description resynchronisés au passage)

-- ---- L1 — Le réflexe conditionnel ----
update public.chapitres c set
  titre = 'L1 — Le réflexe conditionnel',
  description = 'La communication dans l''organisme · réflexes acquis, apprentissage',
  resume = $md$*Thème : La communication dans l'organisme*

## Introduction

Certaines activités (conduire, nager, écrire, lire) s'acquièrent avec le temps : ce sont des **réflexes conditionnels**. Comment se mettent-ils en place et quels organes assurent la transmission des messages nerveux ?

## I. Les réflexes conditionnels se mettent en place par apprentissage

### Les expériences de Pavlov (chien)

On présente à un chien deux stimuli, isolés ou combinés :

| Phase | Stimulus | Réaction | Interprétation |
|---|---|---|---|
| 1 | Son du métronome seul | Ne salive pas | Le son est un **stimulus neutre** (aucune action sur les glandes salivaires) |
| 2 | Viande seule | Salive | **Réflexe inné (inconditionnel)** ; la viande est un **stimulus absolu (inconditionnel)** |
| 3 | Son + viande (répété) | Salive | Phase d'**apprentissage** (association des deux stimuli) |
| 4 | Son seul | Salive | Le son est devenu **stimulus conditionnel** → **réflexe conditionnel (acquis)** |

**Définition** : un **réflexe conditionnel** (ou acquis) est une réaction déclenchée par un stimulus qui n'a habituellement pas d'action sur la fonction considérée ; il se met en place à la suite d'un **apprentissage**. Il permet le dressage des animaux et développe l'automatisme.

## II. Les réflexes conditionnels se mettent en place selon un mécanisme

Lors de l'association répétée son + viande, il s'établit une **nouvelle liaison nerveuse** entre l'**aire auditive** et l'**aire gustative** (au niveau des hémisphères cérébraux). Le son peut alors stimuler l'aire gustative et provoquer la salivation.

**Organes intervenant** dans le réflexe conditionnel de salivation :

- **Récepteur sensitif** : l'oreille ;
- **Centres nerveux** : le **cerveau** (hémisphères cérébraux, siège de la nouvelle liaison) et le **bulbe rachidien** (centre salivaire) ;
- **Effecteurs** : les **glandes salivaires**.

**Conditions de mise en place** du réflexe conditionnel :

- présence des **hémisphères cérébraux** ;
- des organes **intègres** (en bon état) ;
- l'**état de vigilance** de l'animal (absence de stress) ;
- l'**efficacité des stimuli** (intéressants, précis) ;
- l'**ordre de présentation** : le stimulus neutre doit **précéder** le stimulus absolu ;
- l'**entretien** du réflexe (sinon **extinction** : le réflexe conditionnel n'est pas définitif).

## Conclusion

Les réflexes conditionnels (ou acquis) se mettent en place à la suite d'un **apprentissage** et selon un **mécanisme** (établissement de nouvelles liaisons nerveuses corticales).

---

### 📌 L'essentiel à retenir

- **Réflexe inné (inconditionnel)** : inné, stéréotypé, déclenché par un **stimulus absolu** (ex. viande → salivation) ;
- **Réflexe conditionnel (acquis)** : acquis par apprentissage, temporaire, déclenché par un **stimulus conditionnel** (ex. son après conditionnement) ;
- Mécanisme = **nouvelle liaison nerveuse** entre deux aires corticales (auditive ↔ gustative) ;
- Le stimulus **neutre** doit **précéder** le stimulus absolu pendant le conditionnement ;
- Sans entretien → **extinction** du réflexe.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 1;

-- ---- L2 — Le fonctionnement du tissu nerveux ----
update public.chapitres c set
  titre = 'L2 — Le fonctionnement du tissu nerveux',
  description = 'La communication dans l''organisme · potentiel de repos et d''action, synapse',
  resume = $md$*Thème : La communication dans l'organisme*

## Introduction

Le tissu nerveux assure la propagation du message nerveux dans l'organisme. Comment ce message se propage-t-il — grâce à sa nature, aux propriétés de la structure nerveuse, et selon quel mécanisme ?

## I. La nature du message nerveux

### 1. Organisation du tissu nerveux

Le **nerf** est formé de **faisceaux de fibres nerveuses** et de vaisseaux sanguins, entourés d'une gaine conjonctive (**épinèvre** → périnèvre → endonèvre). Le **neurone** (cellule nerveuse) est l'**unité fonctionnelle** du tissu nerveux ; il comprend le **corps cellulaire (péricaryon)**, l'**axone (cylindraxe)** et l'**arborisation terminale**. On distingue les fibres **myélinisées** et **amyélinisées**.

### 2. Nature électrique du message nerveux (oscilloscope, axone géant de calmar)

- **Potentiel de repos (potentiel de membrane)** : différence de potentiel entre la surface et l'intérieur de la fibre au repos = **−70 mV** (surface + / intérieur −). Il est dû à une **inégale répartition des ions** (intérieur riche en **K⁺**, extérieur riche en **Na⁺**), maintenue par la **pompe ionique Na⁺/K⁺** (transport actif consommant de l'ATP) ;
- **Potentiel d'action (PA)** : à la suite d'une stimulation efficace, on enregistre une **inversion momentanée de la polarité**. Ses phases :
  1. **Artéfact de stimulation** (instant de la stimulation) ;
  2. **Dépolarisation** : entrée massive de **Na⁺** (ouverture des canaux Na⁺ voltage-dépendants) → l'intérieur devient positif ;
  3. **Repolarisation** : sortie de **K⁺** (ouverture des canaux K⁺) → retour à la polarité initiale ;
  4. **Hyperpolarisation** : sortie excessive de K⁺ ;
  5. **Restauration** : la pompe Na⁺/K⁺ rétablit les concentrations initiales.

L'**influx nerveux** est une **onde de négativité** qui se propage le long de l'axone sous forme de **courants locaux**.

## II. Les propriétés de la structure nerveuse

### 1. Excitabilité (réponse selon intensité et durée)

- **Excitation liminaire (seuil)** : provoque une réponse ; **infraliminaire** : inefficace ; **supraliminaire** : efficace ;
- **Rhéobase** : plus petite intensité qui provoque une réponse ; **temps utile** : durée minimale d'application de la rhéobase ; **chronaxie** : durée d'application de l'intensité **double de la rhéobase** — plus la chronaxie est petite, plus le nerf est excitable.

### 2. Réponses à des intensités croissantes

- **La fibre nerveuse** obéit à la **loi du tout ou rien** : dès le seuil atteint, réponse d'amplitude **d'emblée maximale** ;
- **Le nerf** obéit à la **loi de sommation** : l'amplitude croît avec l'intensité (**recrutement** progressif de fibres de seuils différents) jusqu'à un maximum.

### 3. Période réfractaire (deux stimulations successives)

- **Période réfractaire absolue (PRA)** : après une réponse, le nerf est **inexcitable** (canaux Na⁺ fermés, pompe non rétablie) ;
- **Période réfractaire relative (PRR)** : l'excitabilité revient progressivement.

### 4. Sens et vitesse de conduction

- **Sens** : sur une fibre **isolée**, l'influx se propage dans les **deux sens** ; dans l'**organisme**, dans un **seul sens** (dendrites → corps cellulaire → axone → arborisation terminale) ;
- **Vitesse** : augmente avec le **diamètre**, la **température** et la **myélinisation**. Fibres **amyélinisées** : conduction **continue** de proche en proche (courants locaux, lente) ; fibres **myélinisées** : conduction **saltatoire** (sauts d'un **nœud de Ranvier** à l'autre, rapide). Vitesse : **V = d / t = (d₂−d₁)/(t₂−t₁)**.

## III. La transmission d'un neurone à une autre structure : la synapse

### 1. Les zones de contact

La **synapse** est la zone de contact ; elle comprend un **élément présynaptique**, une **fente synaptique** et un **élément postsynaptique**. Synapses neuro-neuroniques (**axo-axonique, axo-dendritique, axo-somatique**) et synapse neuro-musculaire (**plaque motrice**).

### 2. Le passage de l'influx à travers la synapse

Étapes (transmission **chimique**) :

1. Arrivée du PA au bouton présynaptique ;
2. Entrée d'ions **Ca²⁺** ;
3. Libération des **neurotransmetteurs** (ex. **acétylcholine**) par **exocytose** dans la fente ;
4. Fixation sur les **récepteurs spécifiques** de la membrane postsynaptique ;
5. Ouverture des canaux Na⁺ chimio-dépendants → entrée de Na⁺ ;
6. **Dépolarisation** postsynaptique → naissance d'un PA ;
7. **Hydrolyse** du neurotransmetteur (par l'**acétylcholinestérase** → acétate + choline) ;
8. **Recapture** de la choline par le bouton présynaptique.

- **Synapse excitatrice** → dépolarisation → **PPSE** (potentiel postsynaptique excitateur) ;
- **Synapse inhibitrice** → hyperpolarisation (sortie de K⁺ ou entrée de Cl⁻) → **PPSI** (inhibiteur), pas de PA.

## Conclusion

L'influx nerveux se propage le long du neurone sous forme de **courants locaux** (modification de la perméabilité membranaire aux ions). Son passage à travers la synapse est assuré par un **médiateur chimique**. Dans l'organisme, il circule toujours du corps cellulaire vers les terminaisons.

---

### 📌 L'essentiel à retenir

- **Potentiel de repos** = −70 mV (pompe Na⁺/K⁺) ; **PA** = dépolarisation (entrée Na⁺) → repolarisation (sortie K⁺) ;
- **Fibre** = loi du **tout ou rien** ; **nerf** = loi de **sommation** (recrutement) ;
- **Période réfractaire** absolue puis relative ; conduction **saltatoire** (myélinisée, rapide) vs continue ;
- **Synapse** = transmission **chimique** (Ca²⁺ → exocytose → neurotransmetteur → récepteur → Na⁺) ;
- Synapse **excitatrice (PPSE)** vs **inhibitrice (PPSI)**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 2;

-- ---- L3 — Le fonctionnement du muscle strié squelettique ----
update public.chapitres c set
  titre = 'L3 — Le fonctionnement du muscle strié squelettique',
  description = 'La communication dans l''organisme · contraction, actine-myosine, énergie',
  resume = $md$*Thème : La communication dans l'organisme*

## Introduction

Les muscles striés squelettiques sont des organes spécialisés dans le mouvement, commandés par le système nerveux central. Comment fonctionne le muscle strié squelettique — grâce à sa structure, selon quel mécanisme, sous quelles stimulations et avec quelle énergie ?

## I. La structure du muscle

Le **muscle frais** est constitué de **faisceaux de fibres musculaires**. La **fibre musculaire** est une cellule géante, allongée, **plurinucléée**, avec des striations, baignant dans le **sarcoplasme** et entourée du **sarcolemme**. Elle présente une alternance de **bandes sombres** (traversées par la **zone H**) et de **bandes claires** (traversées par la **strie Z**).

Le **sarcomère** (portion entre deux stries Z) est l'unité contractile. Il contient deux types de filaments :

- **filaments fins d'actine** (actine G + **troponine** + **tropomyosine**) ;
- **filaments épais de myosine**.

## II. Le mécanisme de la contraction

Au passage du repos à la contraction : la **zone H raccourcit**, le **sarcomère diminue**, la **bande claire se réduit**, mais la **bande sombre** et les longueurs d'**actine et de myosine restent constantes** → les filaments **glissent** les uns sur les autres (théorie du glissement).

**Étapes** (déclenchées par le Ca²⁺) :

1. **Attachement** : le muscle excité libère les ions **Ca²⁺** du réticulum sarcoplasmique ; le Ca²⁺ se fixe sur la **troponine**, qui déforme la **tropomyosine** et **démasque les sites** ; l'ATP se fixe sur la tête de myosine → **pont actomyosine** ;
2. **Glissement (pivotement)** : la myosine **hydrolyse l'ATP** (ATP → ADP + Pi + **énergie**) ; la tête de myosine pivote et fait glisser l'actine → diminution de la zone H = **contraction** ;
3. **Détachement** : une nouvelle molécule d'ATP se fixe → rupture du pont actomyosine ;
4. **Relâchement** : réabsorption du Ca²⁺.

## III. Les stimulations

### 1. Aspects électrique et mécanique

- **Potentiel de membrane musculaire** ≈ **−85 mV**, maintenu par la pompe Na⁺/K⁺ ATPase. Le **PA musculaire (électromyogramme)** résulte d'une entrée de Na⁺ (dépolarisation) puis d'une sortie de K⁺ (repolarisation) ;
- Le **PA précède toujours le myogramme** : c'est lui qui déclenche la contraction. Le **myogramme** (secousse) comprend : **temps de latence → phase de contraction → phase de relâchement**.

### 2. Réponses aux stimulations successives

- 2ᵉ stimulation **après** la secousse → 2 secousses **identiques** ;
- 2ᵉ stimulation pendant le **relâchement** ou la **contraction** → amplitude **plus grande** (**sommation**) ;
- Stimulations répétées pendant le relâchement → **tétanos imparfait** (courbe en dents de scie, fusion incomplète) ;
- Stimulations répétées pendant la contraction → **tétanos parfait** (plateau, fusion complète) ;
- Stimulations prolongées → **fatigue musculaire** (amplitude faible, contraction allongée) → crampes.

La **fibre musculaire** obéit à la **loi du tout ou rien** ; le **muscle** obéit à la **loi de sommation**.

## IV. L'énergie de la contraction

Le muscle en activité **consomme O₂ et glucose (glycogène)** et produit **CO₂ et acide lactique**. La quantité d'**ATP reste constante** car elle est **régénérée** :

- **Voies rapides** (anaérobies immédiates) :
  - **myokinase** : 2 ADP → ATP + AMP ;
  - **phosphocréatinase** : ADP + phosphocréatine → ATP + créatine ;
- **Voies lentes** — à partir de la **glycolyse** (glucose → 2 acides pyruviques, +8 ATP) :
  - **fermentation lactique** (anaérobie) : bilan **2 ATP** (avec production d'acide lactique) ;
  - **respiration cellulaire** (aérobie, dans la **mitochondrie**, cycle de Krebs) : **38 ATP** au total — `C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + 38 ATP`.

## Conclusion

Le muscle strié squelettique se contracte grâce à sa **structure** (actine/myosine), selon un **mécanisme** de glissement dépendant du **Ca²⁺** et de l'**ATP**, en réponse à des **stimulations** (PA musculaire), et grâce à une **énergie biochimique** régénérée en permanence.

---

### 📌 L'essentiel à retenir

- Unité contractile = **sarcomère** ; filaments **fins d'actine** (+ troponine, tropomyosine) et **épais de myosine** ;
- Contraction = **glissement** de l'actine sur la myosine, déclenché par le **Ca²⁺**, alimenté par l'**hydrolyse de l'ATP** ;
- Cycle : **attachement → glissement → détachement → relâchement** ;
- Le **PA musculaire précède** la secousse ; fibre = **tout ou rien**, muscle = **sommation** (→ tétanos imparfait/parfait, fatigue) ;
- Régénération de l'ATP : voies rapides (myokinase, phosphocréatine) et lentes (fermentation lactique 2 ATP / respiration **38 ATP**).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 3;

-- ---- L4 — Le fonctionnement du cœur ----
update public.chapitres c set
  titre = 'L4 — Le fonctionnement du cœur',
  description = 'La communication dans l''organisme · automatisme cardiaque, contrôle nerveux et hormonal',
  resume = $md$*Thème : La communication dans l'organisme*

## Introduction

Un cœur isolé de batracien, placé dans un milieu de culture, continue de battre plusieurs heures. Comment le cœur fonctionne-t-il, et quelle est l'influence du système nerveux sur son activité ?

## I. Le cœur fonctionne de manière autonome

- Chez une grenouille **décérébrée et démédullée**, le cœur bat encore ; **isolé** dans du liquide physiologique (**solution de Ringer**), il continue de battre → autonomie ;
- La **destruction du tissu nodal** arrête le cœur ; la **section du faisceau de His** perturbe seulement le rythme des ventricules.

Le **tissu nodal** (nœud sinusal → nœud septal → faisceau de His → réseau de Purkinje) est le **siège de l'automatisme cardiaque**. Le **nœud sinusal** impose son rythme : c'est le **pacemaker (moteur)** du cœur. Son PA présente un **prépotentiel entraîneur** (dépolarisation lente) qui assure la continuité de l'activité. Le **PA du myocarde** comporte une phase de dépolarisation brusque, un **plateau** (dépolarisation maintenue) et une repolarisation ; sa **période réfractaire** est aussi longue que la contraction (le cœur ne peut pas être tétanisé).

## II. Les phénomènes de l'activité cardiaque

### 1. La révolution cardiaque (cardiogramme)

Le **cardiogramme** présente : **AB** = systole auriculaire, **BC** = diastole auriculaire, **CD** = systole ventriculaire, **DE** = diastole générale. L'ensemble constitue une **révolution (cycle) cardiaque**.

### 2. L'électrocardiogramme (ECG)

Ondes **PQRST** (phénomènes électriques) :

- **Onde P** : dépolarisation des oreillettes → systole auriculaire ;
- **Complexe QRS** : dépolarisation des ventricules → systole ventriculaire ;
- **Onde T** : repolarisation des ventricules → diastole générale.

## III. Le contrôle nerveux du cœur

- La **stimulation des nerfs parasympathiques** (nerf X, vague, pneumogastrique) → **ralentissement** (bradycardie), arrêt en diastole puis **échappement** ; leur **section** → accélération ;
- La **stimulation des nerfs orthosympathiques** (sympathiques) → **accélération** (tachycardie) ; leur section → ralentissement.

→ Les deux systèmes sont **antagonistes** : parasympathique **modérateur**, orthosympathique **accélérateur**.

**Régulation (réflexe) de la pression artérielle** : quand la pression monte, les **barorécepteurs** (crosse aortique, sinus carotidien) sont excités ; l'influx passe par les **nerfs sino-aortiques** (nerf de **Héring** et nerf de **Cyon**, **sensitifs**) vers le **centre cardio-vasculaire** (bulbe rachidien). Le **centre cardio-modérateur** (bulbe) agit via le nerf X → ralentissement ; le **centre cardio-accélérateur** (moelle cervico-dorsale) agit via l'orthosympathique → accélération. Le mécanisme ramène la pression à la normale (rétroaction).

## IV. Le contrôle chimique du cœur

**Expérience de Loewi** : deux cœurs (A et B) reliés par un raccord. Exciter le nerf vague de A arrête **A puis B** ; exciter l'orthosympathique de A accélère **A puis B**. Avec de l'**atropine** (bloque la substance vagale) ou de l'**ergotoxine** (bloque la sympathine), plus aucun effet sur B → des **substances chimiques** transmettent l'effet.

- Nerf parasympathique → **acétylcholine (ACH)** = **cardiomodératrice** (perfusée seule, elle ralentit et arrête le cœur en diastole) ;
- Nerf orthosympathique → **adrénaline / noradrénaline (ADR)** = **cardioaccélératrice**.

Ces **médiateurs chimiques** (neuromédiateurs), sécrétés aux terminaisons nerveuses et déversés dans les fentes synaptiques, sont détruits par des enzymes (acétylcholinestérase) — d'où le phénomène d'**échappement**.

## Conclusion

Le cœur fonctionne de manière **autonome** (tissu nodal), mais son rythme est **régulé** par le système nerveux (nerfs parasympathique et orthosympathique) et par les **neuromédiateurs** (ACH, ADR) qu'ils libèrent.

---

### 📌 L'essentiel à retenir

- **Automatisme** cardiaque = **tissu nodal**, moteur = **nœud sinusal** (pacemaker) → His → Purkinje ;
- Cycle : systole auriculaire → diastole auriculaire → systole ventriculaire → diastole générale ; ECG = **P** (oreillettes), **QRS** (ventricules), **T** (repolarisation) ;
- **Parasympathique (nerf X → ACH)** = ralentit ; **orthosympathique (→ ADR)** = accélère : systèmes **antagonistes** ;
- Régulation par les **barorécepteurs** → nerfs de Héring/Cyon (sensitifs) → centres bulbaire (modérateur) et médullaire (accélérateur) ;
- Preuve chimique : **expérience de Loewi**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 4;

-- ---- L5 — Le maintien de la constance du milieu intérieur ----
update public.chapitres c set
  titre = 'L5 — Le maintien de la constance du milieu intérieur',
  description = 'Le milieu intérieur · rein, homéostasie, ADH, aldostérone',
  resume = $md$*Thème : Le milieu intérieur*

## Introduction

Une défaillance des reins souille le sang et déséquilibre le **milieu intérieur** (le milieu dans lequel baignent toutes les cellules). Comment le rein maintient-il le milieu intérieur **constant** — grâce à sa structure, à ses fonctions et à la régulation de certains constituants ?

## I. La structure du rein

Le rein comprend une **capsule fibreuse**, une **zone corticale (cortex)**, une **zone médullaire (médulla)** avec les **pyramides de Malpighi**, un **bassinet** (qui collecte l'urine) relié à l'**uretère**.

Le **néphron** est l'**unité structurale et fonctionnelle** du rein. Il comprend :

- le **corpuscule de Malpighi** = **capsule de Bowman** + **glomérule** ;
- les **tubes urinaires** : tube contourné **proximal**, **anse de Henlé**, tube contourné **distal**, tube collecteur de **Bellini**.

## II. Les fonctions du rein (formation de l'urine)

Comparaison plasma / urine primitive / urine définitive :

- **Protéines, lipides, glucose** : présents dans le plasma, absents de l'urine → bloqués par la **filtration glomérulaire** (le rein est un **filtre sélectif**). Le filtrat obtenu = **urine primitive** ;
- **Acide hippurique, sels ammoniacaux** : absents du plasma mais présents dans l'urine → **sécrétion tubulaire** (rôle **sécréteur**) ;
- **Eau et sels minéraux** : plus concentrés dans l'urine → **excrétion tubulaire** (rôle **excréteur**) ;
- Certaines substances retournent au plasma → **réabsorption** (totale ou partielle, active ou passive) ; certaines (glucose) sont des **substances à seuil**.

**Étapes de la formation de l'urine** : **filtration glomérulaire → réabsorption → sécrétion tubulaire → excrétion**.

## III. La régulation de certains constituants

### 1. La régulation de l'eau (hormone ADH)

- **Excès d'eau** → ↑ volémie → dilution du plasma → **baisse de la pression osmotique (PO)**. Les **volorécepteurs** (oreillette gauche) et **osmorécepteurs** (carotides), reliés à l'**hypothalamus**, sont faiblement stimulés → la **posthypophyse** sécrète **peu d'ADH** → **moins de réabsorption d'eau** → **polyurie** (urine abondante et diluée) ;
- **Perte d'eau** (hémorragie, diarrhée) → ↑ PO, ↓ volémie → forte sécrétion d'**ADH** → **forte réabsorption d'eau** → **oligurie** (urine rare et concentrée).

L'**ADH** (hormone antidiurétique), produite par l'hypothalamus et libérée par la **posthypophyse**, agit sur les tubules pour **augmenter la réabsorption de l'eau**.

### 2. La régulation du sodium (système rénine-angiotensine-aldostérone)

- Quand la teneur en **Na⁺** augmente : les cellules glomérulaires produisent **peu de rénine** → peu d'**angiotensine** (la rénine + l'**angiotensinogène** du foie donnent l'angiotensine) → faible stimulation de la **corticosurrénale** → peu d'**aldostérone** → **faible réabsorption de Na⁺** → forte élimination du sodium (retour de la PO à la normale) ;
- Quand le Na⁺ baisse : mécanisme inverse → forte aldostérone → forte réabsorption de Na⁺.

L'**aldostérone**, produite par la **corticosurrénale**, augmente la **réabsorption du sodium**.

### 3. La régulation du pH (poumons + reins)

- **Acidose** (pH < 7,4) : ↑ élimination du CO₂ (hyperventilation) et des ions **H⁺** par les reins ;
- **Alcalose** (pH > 7,4) : ↓ élimination du CO₂ (hypoventilation) et élimination des **bicarbonates HCO₃⁻** ;
- Système tampon : `CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺`.

L'ensemble de ces régulations qui maintiennent l'équilibre dynamique de l'organisme constitue l'**homéostasie** (constance du pH, de la glycémie, de la pression osmotique, de l'eau, du sodium…).

## Conclusion

Le rein maintient le milieu intérieur constant grâce à sa **structure** (collecte de l'urine), à ses **fonctions** (filtration, réabsorption, sécrétion, excrétion) et à la **régulation** de l'eau (ADH), du sodium (aldostérone) et du pH.

---

### 📌 L'essentiel à retenir

- **Néphron** = unité du rein : corpuscule de Malpighi (glomérule + capsule de Bowman) + tubes ;
- Formation de l'urine : **filtration → réabsorption → sécrétion → excrétion** ;
- **Eau** : régulée par l'**ADH** (posthypophyse) → ↑ réabsorption d'eau (oligurie) / ↓ (polyurie) ;
- **Sodium** : régulé par l'**aldostérone** (corticosurrénale) via le système **rénine-angiotensine** ;
- **Homéostasie** = maintien de la constance du milieu intérieur (eau, Na⁺, pH, glycémie…).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 5;

-- ---- L6 — Le système de défense de l'organisme ----
update public.chapitres c set
  titre = 'L6 — Le système de défense de l''organisme',
  description = 'La défense de l''organisme · immunité non spécifique et spécifique',
  resume = $md$*Thème : La défense de l'organisme et son dysfonctionnement*

## Introduction

L'organisme se défend contre les corps étrangers. Comment le fait-il — de façon non spécifique contre tous les corps étrangers, de façon spécifique contre un antigène précis, et selon quel mécanisme ?

## I. La défense non spécifique (contre tous les corps étrangers)

### 1. Les barrières naturelles (1ʳᵉ ligne de défense)

- **Mécaniques** : peau, muqueuses nasales et bronchiques (cils vibratiles) ;
- **Chimiques** : sueur (pH 3,5), larmes, salive et mucus (**lysozyme**), acide gastrique (pH 1-2), sécrétions alcalines du duodénum (pH 8), spermine, sécrétions vaginales ;
- **Biologiques** : bactéries **non pathogènes** du tube digestif.

### 2. La réaction inflammatoire et la phagocytose

L'entrée de microbes déclenche une **réaction inflammatoire** locale (**chaleur, rougeur, douleur, enflure**), due aux kinines et à l'**histamine** (mastocytes). Interviennent d'abord les **polynucléaires (granulocytes)**, puis les **macrophages** (issus des monocytes). Ces **phagocytes** réalisent la **phagocytose** en 3 étapes : **adhésion** (fixation de l'antigène) → **absorption** (vésicule de phagocytose) → **digestion** (par les enzymes lytiques des lysosomes), suivie de la **réparation tissulaire**.

Si les microbes franchissent la plaie, ils atteignent les **ganglions lymphatiques** (2ᵉ barrière) → **adénite** / **lymphangite**, puis le sang (le **foie** oppose une dernière résistance). En cas d'échec : **septicémie** (invasion généralisée) ou **toxémie** (diffusion de toxines).

## II. La défense spécifique (contre un antigène précis)

### 1. Les deux types de réponse (expériences sur la souris)

- Une **anatoxine** (toxine atténuée : pouvoir pathogène perdu, pouvoir antigénique conservé) protège **uniquement** contre la toxine correspondante → la défense est **spécifique (acquise)** ;
- Le **sérum** d'un animal immunisé transfère la protection → **réponse immunitaire humorale** (effecteurs = **anticorps**) ;
- Les **lymphocytes vivants** d'un animal immunisé transfèrent la protection (le sérum, non) → **réponse immunitaire à médiation cellulaire**.

Les **anticorps** sont des protéines (**immunoglobulines** : IgA, IgD, IgE, IgG, IgM). Ils neutralisent l'antigène, favorisent la phagocytose et activent le **complément** (protéines du sérum qui lysent les bactéries).

### 2. Le soi et le non-soi (expériences de greffe)

- **Autogreffe** (même organisme) et **isogreffe** (vrais jumeaux) → **acceptées** ;
- **Homogreffe/allogreffe** (même espèce) et **hétérogreffe/xénogreffe** (espèces différentes) → **rejetées**.

L'intégration du greffon dépend de la reconnaissance par le **CMH (Complexe Majeur d'Histocompatibilité) ou HLA** — les marqueurs du **« soi »** (avec le groupe sanguin ABO). Tout ce qui déclenche une réaction immunitaire est un **antigène** (le **« non-soi »**). L'**épitope** (déterminant antigénique) est présenté par les **cellules présentatrices** (macrophages, lymphocytes B) aux lymphocytes.

## III. Le mécanisme des réponses immunitaires

Les réactions immunitaires se déroulent en **3 étapes** :

1. **Reconnaissance / induction** : le macrophage phagocyte l'antigène, en extrait le **déterminant antigénique** et le **présente** aux lymphocytes ;
2. **Activation et différenciation** (dans les organes lymphoïdes) : les lymphocytes sensibilisés se multiplient par mitose :
   - **Lymphocytes B** (maturés dans la **moelle osseuse**) → **plasmocytes** (producteurs d'**anticorps**) + **lymphocytes B mémoire** ;
   - **Lymphocytes T** (maturés dans le **thymus**) → **T mémoire**, **T régulateurs** (helpers T4/Th et suppresseurs Ts), **T cytotoxiques (Tc/T8)** ;
3. **Phase effectrice** :
   - **Réponse à médiation cellulaire** : les **lymphocytes T cytotoxiques** se fixent sur les cellules cibles et libèrent la **perforine** → pores → entrée d'eau → **cytolyse**. Adaptée aux cellules infectées par des **virus/parasites intracellulaires** ;
   - **Réponse à médiation humorale** : les **plasmocytes** sécrètent des **anticorps** circulants qui forment un **complexe immun** avec l'antigène. Adaptée aux **bactéries extracellulaires et toxines**.

Quelle que soit la réponse, il existe une **coopération cellulaire** entre macrophages, lymphocytes T et lymphocytes B.

**Organes lymphoïdes** : **primaires** (moelle osseuse, thymus → production/maturation) ; **secondaires** (rate, ganglions → activation, prolifération, production d'anticorps).

## Conclusion

L'organisme se défend selon deux mécanismes : **non spécifique** (barrières, inflammation, phagocytose) et **spécifique** (immunité humorale par anticorps et immunité cellulaire par lymphocytes T cytotoxiques), avec coopération cellulaire.

---

### 📌 L'essentiel à retenir

- **Défense non spécifique** : barrières → **inflammation** → **phagocytose** (adhésion, absorption, digestion) ;
- **Défense spécifique** : **humorale** (lymphocytes B → plasmocytes → **anticorps**, contre bactéries/toxines) et **cellulaire** (lymphocytes **T cytotoxiques** → perforine → cytolyse, contre cellules infectées) ;
- **Soi/non-soi** : reconnaissance par le **CMH (HLA)** — base du rejet de greffe ;
- Lymphocytes **B** maturés dans la **moelle**, **T** dans le **thymus** ;
- **Coopération cellulaire** : macrophage + LT + LB.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 6;

-- ---- L7 — L'infection de l'organisme par le VIH ----
update public.chapitres c set
  titre = 'L7 — L''infection de l''organisme par le VIH',
  description = 'La défense de l''organisme · VIH-SIDA, lymphocytes T4',
  resume = $md$*Thème : La défense de l'organisme et son dysfonctionnement*

## Introduction

Le VIH (virus de l'immunodéficience humaine) affaiblit l'organisme et constitue un problème de santé publique. Comment le virus du SIDA affaiblit-il l'organisme — par sa structure, en détruisant ses cellules, et en l'exposant à des maladies ?

## I. La structure du VIH

Le VIH est constitué de :

- une **capside protéique (cœur)** contenant **deux molécules d'ARN**, chacune associée à une **transcriptase inverse (réverse / rétrotranscriptase)** ;
- une couche de **protéines internes** ;
- une **enveloppe lipidique externe** hérissée de **glycoprotéines d'enveloppe** : **Gp120** et **Gp41**.

C'est un **rétrovirus** (son matériel génétique est de l'ARN).

## II. L'infection et la destruction des cellules (le lymphocyte T4)

Les cellules cibles du VIH sont les **lymphocytes T4 (LT4)**, porteurs du récepteur membranaire **CD4**. Étapes de l'infection :

1. **Adsorption (fixation)** : la **Gp120** du virus adhère au récepteur **CD4** ; sa libération démasque la **Gp41** qui perfore la membrane → **fusion** des membranes ;
2. **Injection** de l'**ARN viral** et de la **transcriptase inverse** dans le cytoplasme du LT4 ;
3. **Transcription inverse** : synthèse d'**ADN proviral** à partir de l'ARN viral ;
4. **Intégration** de l'ADN proviral à l'ADN du LT4 (grâce à l'**intégrase**) ;
5. **Transcription** en ARN messager viral → **synthèse des protéines virales** ;
6. **Assemblage** et **bourgeonnement** des nouveaux virus, qui emportent une partie de la membrane du LT4 → **destruction du LT4**.

Les nouveaux virus attaquent d'autres LT4 : la destruction progressive des LT4, cellules clés de la défense, affaiblit l'organisme.

## III. L'évolution de l'infection et les maladies opportunistes

Suivi des taux de **VIH (virémie)**, de **LT4** et d'**anticorps anti-VIH** :

- **Phase I — primo-infection (0 à ~6 mois)** : la virémie **monte** puis chute quand apparaissent les **anticorps anti-VIH** et que les LT4 se multiplient. Dès l'apparition des anticorps, le sujet est **séropositif** ;
- **Phase II — phase asymptomatique (~6 à 56 mois)** : la virémie reste basse (virus neutralisés par les anticorps), puis remonte tandis que les LT4 commencent à chuter. Aucun symptôme, mais le sujet est **contagieux** (sang, sécrétions sexuelles) ;
- **Phase III — phase symptomatique / SIDA déclaré (au-delà de ~56 mois)** : la virémie **augmente**, les taux de LT4 et d'anticorps **s'effondrent** → **dysfonctionnement du système immunitaire** → apparition des **maladies opportunistes** (tuberculose, sarcome de Kaposi…).

## Conclusion

Grâce à sa structure particulière (Gp120/CD4), le VIH infecte et détruit les **lymphocytes T4**, cellules de défense. Il provoque une **immunodéficience** qui expose l'organisme aux **maladies opportunistes**. La prévention repose sur une vie saine et responsable (protection lors des rapports, dépistage, matériel stérile).

---

### 📌 L'essentiel à retenir

- VIH = **rétrovirus** : 2 ARN + **transcriptase inverse**, enveloppe à **Gp120/Gp41** ;
- Cellule cible = **lymphocyte T4** (récepteur **CD4**) ; entrée par fixation **Gp120–CD4** ;
- Cycle : adsorption → transcription inverse → **intégration (intégrase)** → multiplication → **bourgeonnement** → destruction du LT4 ;
- 3 phases : **primo-infection** (→ séropositivité) → **asymptomatique** → **SIDA déclaré** (maladies opportunistes) ;
- Le VIH détruit les cellules mêmes de l'immunité → **immunodéficience**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 7;

-- ---- L8 — Le devenir des cellules sexuelles chez les mammifères ----
update public.chapitres c set
  titre = 'L8 — Le devenir des cellules sexuelles chez les mammifères',
  description = 'La reproduction chez les mammifères · fécondation, cellule-œuf, nidation',
  resume = $md$*Thème : La reproduction chez les mammifères*

## Introduction

Chez les mammifères, la fécondation se déroule en plusieurs étapes et aboutit à un œuf qui évolue en embryon. Comment les cellules sexuelles donnent-elles un embryon — par leur union, puis par le développement de la cellule-œuf ?

## I. L'union des gamètes : la fécondation

### 1. La migration des gamètes

- **Gamète femelle** : l'**ovocyte II** expulsé par l'ovaire est capté par le **pavillon** de la trompe, transporté jusqu'à l'**ampoule** (cils vibratiles, contractions) où il attend ~72 h ;
- **Gamète mâle** : 100 à 400 millions de **spermatozoïdes** déposés dans le vagin/utérus migrent grâce à leur flagelle. Ils subissent :
  - la **sélection** (glaire cervicale et acidité éliminent ~99 % d'entre eux) ;
  - la **capacitation** (élimination de l'enduit protéique acquis à l'épididyme) → acquisition du **pouvoir fécondant**.

### 2. La rencontre et la pénétration

- **Rencontre** au **1/3 supérieur de la trompe** : les spermatozoïdes entourent l'ovocyte II ;
- **Réaction acrosomique** : au contact de la **zone pellucide**, l'acrosome libère ses enzymes ; un spermatozoïde traverse la zone pellucide et pénètre dans le cytoplasme ovocytaire ;
- **Activation de l'ovocyte II** :
  - formation d'une **membrane de fécondation** (granules corticaux) **imperméable** aux autres spermatozoïdes → empêche la **polyspermie** ;
  - achèvement de la **2ᵉ division de méiose** (émission du **2ᵉ globule polaire**) → l'ovocyte II devient un **ovule**.

### 3. La caryogamie (amphimixie)

Le noyau de l'ovule devient le **pronucléus femelle** ; le noyau du spermatozoïde (qui abandonne flagelle et pièce intermédiaire) devient le **pronucléus mâle**. Les deux pronucléus fusionnent : c'est la **caryogamie (amphimixie)** → formation de la **cellule-œuf (zygote)** diploïde.

**Fécondation** = fusion d'un noyau **haploïde** mâle avec un noyau **haploïde** femelle → un noyau **diploïde** (zygote).

## II. Le développement de la cellule-œuf

Dès la fécondation (dans la trompe), l'œuf se divise :

- **Segmentation** : divisions successives de l'œuf pendant son déplacement vers l'utérus (sans organe de locomotion) → **morula** (amas de cellules entourées de la zone pellucide) ;
- **Blastocyste** : la morula, libre 2-3 jours dans la cavité utérine, se creuse d'une cavité et perd la zone pellucide ;
- **Nidation** : vers le **6ᵉ-7ᵉ jour**, l'embryon s'accole à la muqueuse utérine (préparée par la **progestérone** : vascularisation, glandes à mucus et glycogène) ; le **trophoblaste** attaque la muqueuse par des enzymes, l'embryon s'implante et la muqueuse se referme. La nidation s'achève **~11 jours** après la fécondation → début de la **gestation** ;
- Le **trophoblaste** forme avec l'utérus le **placenta**, qui sécrète l'hormone **HCG** (Hormone Chorionique Gonadotrope) : elle empêche la régression du **corps jaune** et prolonge son action.

## Conclusion

Les mammifères se reproduisent à partir des gamètes mâle et femelle qui **fusionnent** (fécondation) pour donner la **cellule-œuf**, dont le **développement** (segmentation → morula → blastocyste → nidation) donne un embryon implanté dans la muqueuse utérine.

---

### 📌 L'essentiel à retenir

- **Étapes de la fécondation** : migration → rencontre → **réaction acrosomique** et pénétration → activation de l'ovocyte II (membrane de fécondation anti-polyspermie + 2ᵉ globule polaire) → **caryogamie** → zygote ;
- Le spermatozoïde acquiert son pouvoir fécondant par la **capacitation** ; fécondation au **1/3 supérieur de la trompe** ;
- Développement : **segmentation → morula → blastocyste → nidation** (6-7ᵉ jour, fin ~11ᵉ jour) ;
- Le **placenta** sécrète l'**HCG** qui maintient le **corps jaune** ;
- Fécondation = **haploïde + haploïde → diploïde**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 8;

-- ---- L9 — Le fonctionnement des organes sexuels chez l'Homme ----
update public.chapitres c set
  titre = 'L9 — Le fonctionnement des organes sexuels chez l''Homme',
  description = 'La reproduction · cycles sexuels, hormones, contraception',
  resume = $md$*Thème : La reproduction chez les mammifères*

## Introduction

Comment le fonctionnement des organes sexuels chez l'Homme se fait-il — par cycle chez la femme, sous l'influence du complexe hypothalamo-hypophysaire, et sous l'action des méthodes contraceptives ?

## I. Le fonctionnement cyclique des organes sexuels femelles

### 1. Le cycle ovarien (3 phases)

- **Phase folliculaire (pré-ovulatoire)** : croissance de quelques follicules ;
- **Ovulation** : libération de l'**ovocyte II** après rupture du follicule mûr (vers le 14ᵉ jour) ;
- **Phase lutéale (post-ovulatoire)** : formation, croissance puis régression du **corps jaune** (issu du follicule rompu).

### 2. Le cycle utérin

- **Menstruation (1ᵉʳ-5ᵉ jour)** : dégradation de l'endomètre → **règles** ;
- **Phase folliculaire** : l'endomètre se reconstitue et s'épaissit (glandes en tube, artérioles) ;
- **Phase lutéale** : la muqueuse s'accroît, les glandes se ramifient (« **dentelle utérine** »), artérioles spiralées → prête à accueillir l'embryon.

### 3. Le cycle hormonal

- **Hormones ovariennes** : les **œstrogènes** (surtout l'**œstradiol**, sécrété par la thèque interne et la granulosa) montent en phase folliculaire (max avant l'ovulation) → reconstruction de la muqueuse ; la **progestérone** (sécrétée par le corps jaune) domine en phase lutéale → prolifération de la muqueuse ;
- **Hormones hypophysaires** : la **FSH** stimule la croissance des follicules ; la **LH** présente un **pic** ~48 h avant l'ovulation, la déclenche et transforme le follicule en corps jaune.

En l'absence de nidation, le **corps jaune régresse** → chute des œstrogènes et de la progestérone → **menstruation**.

## II. Le contrôle par le complexe hypothalamo-hypophysaire

### 1. Chez la femme

Expériences (hypophysectomie → atrophie ovarienne ; greffe/extraits → maturation et ovulation ; lésion hypothalamique → arrêt du cycle ; ovariectomie → hypersécrétion de gonadostimulines) montrent que :

- l'**hypophyse** contrôle les ovaires par les **gonadostimulines** (**FSH** et **LH**) ;
- l'**hypothalamus** contrôle l'hypophyse par la **GnRH** (gonadolibérine, sécrétée de façon **pulsatile**).

**Régulation** : la GnRH → FSH/LH → l'œstradiol des follicules. Le taux croissant d'œstradiol exerce d'abord un **rétrocontrôle négatif** (baisse de FSH) ; puis, à un **taux élevé** (48 h avant l'ovulation), un **rétrocontrôle positif** → **pic de LH** → **ovulation** et formation du corps jaune. La progestérone et l'œstradiol du corps jaune exercent ensuite un **rétrocontrôle négatif** freinant FSH et LH.

### 2. Chez l'homme

- L'**hypophyse** contrôle les testicules par la **FSH** et la **LH** :
  - **FSH** → active la **spermatogenèse** via les **cellules de Sertoli** (qui sécrètent l'**inhibine**) ;
  - **LH** → active la sécrétion de **testostérone** par les **cellules de Leydig** ;
- La **testostérone** (caractères sexuels primaires et secondaires) et l'**inhibine** exercent un **rétrocontrôle négatif** sur le complexe hypothalamo-hypophysaire. Le fonctionnement testiculaire est **continu** (pas de rétrocontrôle positif, contrairement à la femme).

## III. Les méthodes contraceptives chimiques (pilules)

Les pilules sont des **hormones de synthèse** proches des naturelles :

- **Pilules combinées** (œstrogènes + progestatifs, 21 jours) : **bloquent l'ovulation** (rétrocontrôle négatif sur l'hypophyse) et rendent l'utérus **impropre à la nidation** ;
- **Pilules séquentielles** : œstrogènes puis œstrogènes + progestatifs ;
- **Micropilules (microdosées)** : progestatifs seuls → glaire **imperméable** aux spermatozoïdes, utérus impropre à la nidation ;
- **Pilule du lendemain** : fortes doses, empêche une éventuelle nidation (agit sur les trompes et la muqueuse).

**Mécanisme** : un taux élevé d'**œstrogènes de synthèse** en période pré-ovulatoire **inhibe l'hypophyse** (rétrocontrôle négatif) → pas d'ovulation ; la **progestérone** rend l'utérus impropre à la nidation.

**Avantages** : planning familial, préservation de la santé de la mère, réduction des grossesses à risque (précoces, tardives, rapprochées).

## Conclusion

Le fonctionnement des organes sexuels femelles se fait **par cycle**, sous le contrôle du **complexe hypothalamo-hypophysaire** (jeu de rétrocontrôles), et peut être modulé par les **pilules contraceptives**.

---

### 📌 L'essentiel à retenir

- **Cycle ovarien** : phase folliculaire → **ovulation** (J14) → phase lutéale (corps jaune) ;
- **Œstrogènes** (follicules) reconstruisent la muqueuse ; **progestérone** (corps jaune) la maintient ;
- **FSH** = croissance des follicules ; **pic de LH** = ovulation ; commande par la **GnRH** (hypothalamus) ;
- **Rétrocontrôle** : négatif (freine FSH/LH) puis **positif** (pic de LH) chez la femme ; uniquement négatif chez l'homme (**testostérone/inhibine**) ;
- **Pilules** : bloquent l'ovulation (rétrocontrôle négatif) et/ou empêchent la nidation.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 9;

-- ---- L10 — La reproduction chez les spermaphytes ----
update public.chapitres c set
  titre = 'L10 — La reproduction chez les spermaphytes',
  description = 'La reproduction chez les spermaphytes · pollen, ovule, double fécondation',
  resume = $md$*Thème : La reproduction chez les spermaphytes*

## Introduction

Une fleur dont le pistil est saupoudré de pollen se transforme en **fruit** contenant des **graines**. Comment la graine se forme-t-elle à partir de la fleur — grâce aux structures particulières du pollen et de l'ovule, et à la fécondation ?

## I. Les structures du grain de pollen et de l'ovule

### 1. L'anthère et le grain de pollen (organe mâle)

L'**anthère** contient des **sacs polliniques (microsporanges)** où se trouvent les **cellules mères du pollen (2n)**. Formation du pollen :

- la cellule mère (2n) subit la **méiose** → 4 cellules haploïdes (**microspores**) groupées en **tétrade** ;
- chaque microspore subit une **mitose** → **grain de pollen** à deux cellules inégales.

Le **grain de pollen** comprend :

- une grosse **cellule végétative** (noyau végétatif) ;
- une petite **cellule reproductrice** (noyau reproducteur) ;
- deux membranes : l'**exine** (externe, épaisse, à épines et pores) et l'**intine** (interne, mince).

À maturité, l'anthère s'ouvre (**déhiscence**) et libère les grains de pollen.

### 2. L'ovaire et l'ovule (organe femelle)

L'**ovaire**, formé de **carpelles** soudés, contient des **loges carpellaires** portant des **ovules** (sur les placentas). L'ovule comprend : funicule, hile, chalaze, **téguments** (primine, secondine) entourant le **nucelle**, interrompus au **micropyle**.

Dans le nucelle, la **cellule mère du sac (2n)** subit la **méiose** → 4 cellules haploïdes (3 dégénèrent). La **mégaspore** restante subit **3 mitoses** → **8 noyaux** en **7 cellules** : le **sac embryonnaire** :

- pôle **micropylaire** : l'**oosphère** (gamète femelle) + 2 **synergides** ;
- pôle **chalazien** : 3 **antipodes** ;
- au centre : la cellule centrale à **2 noyaux du sac** (noyaux centraux).

## II. La double fécondation → graine et fruit

### 1. La germination du grain de pollen

Après la **pollinisation**, le grain de pollen germe : il émet un **tube pollinique** (guidé par le noyau végétatif) ; le noyau reproducteur se divise en **deux anthérozoïdes** ; à la fin de la croissance, le noyau végétatif dégénère.

### 2. La double fécondation (caractéristique des spermaphytes)

- **1er anthérozoïde + oosphère** → **œuf principal (embryon)**, **diploïde (2n)** ;
- **2e anthérozoïde + les 2 noyaux du sac** → **œuf accessoire (albumen)**, **triploïde (3n)**.

### 3. Les transformations

- l'**œuf principal** → **embryon (plantule)** ;
- l'**œuf accessoire** → **albumen** (réserves) ;
- l'**ovule** → **graine** ;
- l'**ovaire** → **fruit** (hypertrophie, réserves).

## Conclusion

Les grains de pollen (noyau reproducteur → 2 anthérozoïdes) et les ovules (sac embryonnaire : oosphère + noyaux du sac) se forment dans la fleur. À l'issue de la **double fécondation** — spécifique des spermaphytes —, l'ovule devient une **graine** et l'ovaire un **fruit**.

---

### 📌 L'essentiel à retenir

- **Grain de pollen** : cellule végétative + cellule reproductrice, entourées d'**exine** et d'**intine** ;
- **Sac embryonnaire** : **8 noyaux / 7 cellules** = oosphère + 2 synergides + 3 antipodes + cellule centrale (2 noyaux) ;
- **Double fécondation** : oosphère + anthérozoïde → **œuf principal (2n) → embryon** ; 2 noyaux du sac + anthérozoïde → **œuf accessoire (3n) → albumen** ;
- **Ovule → graine**, **ovaire → fruit** ;
- La **double fécondation** est caractéristique des **spermaphytes**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 10;

-- ---- L11 — La transmission d'un caractère héréditaire chez l'Homme ----
update public.chapitres c set
  titre = 'L11 — La transmission d''un caractère héréditaire chez l''Homme',
  description = 'La transmission des caractères héréditaires · monohybridisme, pedigree',
  resume = $md$*Thème : La transmission des caractères héréditaires*

## Introduction

Une anomalie (ex. six orteils à chaque pied) se transmet de génération en génération dans une famille. Comment un caractère héréditaire se transmet-il chez l'Homme — par un **autosome** ou par un **hétérosome** (chromosome sexuel) ?

## Méthode : le raisonnement sur un pedigree

1. **Dominance / récessivité** : si deux parents **normaux** ont un enfant **atteint** → l'allèle de l'anomalie est **récessif** (les parents sont hétérozygotes, porteurs sains). Si tout enfant atteint a **au moins un parent atteint** (anomalie présente à chaque génération) → l'allèle est **dominant** ;
2. **Localisation du gène** : on **suppose** le gène porté par X, on établit l'échiquier de croisement, et on **vérifie la cohérence** avec le pedigree. Si une contradiction apparaît → le gène est **autosomal**.

## I. Transmission par un autosome

### 1. L'albinisme (récessif, autosomal)

L'**albinisme** (absence de synthèse de mélanine) : deux parents normaux ont des enfants albinos (garçons **et** filles) → allèle **récessif** (a). L'hypothèse « porté par X » donne « toutes les filles normales », or il existe une **fille albinos** → contradiction → l'allèle est **autosomal**. Symboles : **A** (normal, dominant) / **a** (albinos, récessif).

### 2. La brachydactylie (dominant, autosomal)

La **brachydactylie** (doigts/orteils courts) : tout atteint a au moins un parent atteint (présente à chaque génération) → allèle **dominant** (N). L'hypothèse X donnerait « aucun garçon atteint du couple I₁×I₂ », or un garçon atteint existe → **autosomal**. Symboles : **N** (atteint, dominant) / **n** (normal, récessif).

### 3. Les groupes sanguins ABO (polyallélisme)

Trois allèles (**A, B, O**) → 4 groupes. Un couple A × B peut donner un enfant **AB** (A et B tous deux exprimés → **codominance**) et un enfant **O** (allèle O présent, masqué chez les parents → **O récessif**). Donc : **A et B codominants entre eux, dominants sur O**. Génotypes : groupe A = A//A ou A//O ; B = B//B ou B//O ; **AB = A//B** ; **O = O//O**.

## II. Transmission par un hétérosome : le daltonisme (récessif, lié à l'X)

Le **daltonisme** (confusion rouge/vert) : deux parents normaux ont un fils daltonien → allèle **récessif** (d). L'hypothèse « porté par X » est **cohérente** avec le pedigree — en particulier, une **femme atteinte transmet l'anomalie à tous ses fils**. L'allèle est donc porté par le **chromosome X** (**lié au sexe**). Notation : X^D (normal), X^d (daltonien) ; un homme **X^d Y** est atteint, une femme est atteinte seulement si **X^d X^d**.

## Conclusion

Un caractère héréditaire peut se transmettre chez l'Homme :

- par un **autosome** (albinisme, brachydactylie, groupes sanguins) ;
- par un **hétérosome** (daltonisme, lié à l'X).

Il peut être gouverné par un **couple d'allèles** (deux allèles) ou par **plusieurs allèles** (**polyallélisme**, ex. ABO).

---

### 📌 L'essentiel à retenir

- 2 parents normaux → enfant atteint = allèle **récessif** ; anomalie à chaque génération = allèle **dominant** ;
- **Méthode** : supposer le gène sur X, tester la cohérence avec le pedigree ; incohérence → **autosomal** ;
- **Albinisme** = récessif autosomal ; **brachydactylie** = dominant autosomal ;
- **ABO** : 3 allèles, **A/B codominants**, **O récessif** ;
- **Daltonisme** = récessif **lié à l'X** : une femme atteinte transmet à **tous ses fils**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 11;

-- ---- L12 — La transmission de deux caractères héréditaires ----
update public.chapitres c set
  titre = 'L12 — La transmission de deux caractères héréditaires',
  description = 'La transmission des caractères héréditaires · dihybridisme, gènes liés/indépendants',
  resume = $md$*Thème : La transmission des caractères héréditaires*

## Introduction

L'étude simultanée de **deux caractères** est le **dihybridisme**. Ces deux caractères peuvent être portés par des **chromosomes différents** (gènes **indépendants**) ou par le **même chromosome** (gènes **liés**). Comment les distinguer et interpréter les croisements ?

## Notions et méthode

- **F1 homogène** (100 % identiques) → les parents sont de **race pure (homozygotes)** ; les phénotypes exprimés en F1 sont **dominants**, les masqués **récessifs** (première loi de Mendel : uniformité) ;
- **Test-cross (croisement test)** : croisement d'un **hybride** F1 avec un **double homozygote récessif** → la descendance reflète directement les gamètes de l'hybride ;
- **Test d'indépendance** : on compare les effectifs observés aux effectifs théoriques attendus sous l'hypothèse **9/16, 3/16, 3/16, 1/16** (F1×F1) ou **1/4, 1/4, 1/4, 1/4** (test-cross).

## I. Gènes indépendants (chromosomes différents) — exemple des pois

Croisement **lisses-jaunes × ridées-vertes** :

- **F1** : 100 % lisses et jaunes → **lisse (R)** et **jaune (V)** dominants ; **ridé (r)**, **vert (v)** récessifs ;
- **F1 × F1** : proportions **9/16 [RV], 3/16 [Rv], 3/16 [rV], 1/16 [rv]**. Les effectifs observés = effectifs théoriques → **gènes indépendants** ;
- **Test-cross (F1 × double récessif)** : **1/4, 1/4, 1/4, 1/4** → confirme l'indépendance.

Chaque caractère pris séparément donne **3/4 – 1/4** (F1×F1) ou **1/2 – 1/2** (test-cross) : c'est la **disjonction indépendante** des deux couples d'allèles (troisième loi de Mendel).

## II. Gènes liés (même chromosome) — exemple de la drosophile

Caractères « couleur du corps » (gris **n⁺** dominant / noir **n**) et « longueur des ailes » (long **vg⁺** / vestigial **vg**).

- **F1** homogène (gris, ailes longues) → parents de race pure ;
- **Test-cross (F1 × double récessif)** : au lieu de 4 classes égales, on observe **2 phénotypes majoritaires** (≈ parentaux) et **2 minoritaires** (≈ recombinés) : 421 / 422 / 78 / 79. Effectifs observés ≠ théoriques → **gènes liés** (portés par le même chromosome) ;
- Les phénotypes **majoritaires** correspondent aux **gamètes parentaux** ; les **minoritaires** aux **gamètes recombinés**, issus d'un **crossing-over** (échange entre chromosomes homologues) — événement **rare**.

### Position des allèles (cis / trans)

L'effectif observé des recombinants (double récessif) étant inférieur au théorique → les allèles du double hétérozygote sont en position **cis** (n⁺ et vg⁺ sur le même chromosome, n et vg sur l'homologue).

### Distance génétique et carte factorielle

La **distance génétique (dg)** = pourcentage de **gamètes recombinés**, exprimée en **unités de recombinaison (UR)** ou **centimorgans (cM)**.

- En **test-cross** : dg = % des **phénotypes minoritaires** = (78 + 79) / 1000 × 100 ≈ **15,7 UR** ;
- La **carte factorielle** représente linéairement cette distance entre les deux gènes selon une échelle choisie.

*(Chez la drosophile mâle, il n'y a pas de crossing-over : seuls des gamètes parentaux.)*

## Conclusion

La transmission simultanée de deux caractères peut se faire :

- par **deux chromosomes différents** → gènes **indépendants** (proportions 9:3:3:1 ou 1:1:1:1, disjonction indépendante) ;
- par le **même chromosome** → gènes **liés** (majoritaires parentaux + minoritaires recombinés par crossing-over), avec une **distance génétique** mesurable.

---

### 📌 L'essentiel à retenir

- **F1 homogène** → parents de race pure ; caractère exprimé = **dominant** ;
- **Gènes indépendants** : test-cross → **1:1:1:1** ; F1×F1 → **9:3:3:1** (effectifs observés = théoriques) ;
- **Gènes liés** : 2 classes **majoritaires (parentales)** + 2 **minoritaires (recombinées)** par **crossing-over** ;
- **Position cis/trans** déterminée par l'effectif des recombinants doubles récessifs ;
- **Distance génétique** (en test-cross) = **% de gamètes recombinés** = % des phénotypes minoritaires → **carte factorielle**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 12;

-- ---- L14 — L'exploitation des gisements miniers ----
update public.chapitres c set
  titre = 'L14 — L''exploitation des gisements miniers',
  description = 'Les ressources minières · prospection, exploitation, impacts',
  resume = $md$*Thème : Les ressources minières*

## Introduction

Comment l'exploitation des gisements miniers se fait-elle — par des méthodes de **prospection**, selon différentes méthodes d'**exploitation**, et avec quelles **conséquences** sur l'environnement et la société ?

## I. Les méthodes de prospection

La **prospection minière** est l'ensemble des opérations menées depuis la recherche du premier **indice** jusqu'à l'**évaluation du gisement**. Elle associe la **géochimie** et la **géophysique**.

### 1. Les méthodes directes (sur le site d'échantillonnage)

- **Prospection alluvionnaire** : rechercher les minéraux lourds dans les **sédiments des cours d'eau** par la technique de la **batée** (on lave limons, sables et graviers ; la **séparation densimétrique** — loi hydrodynamique — sépare les minéraux selon leur densité, ex. or ≠ magnétite) ;
- **Prospection géochimique** (3 phases) : **prélèvements** (sols, alluvions, roches) → **préparation** (désagrégation, séchage, tamisage — on garde le sous-tamis) → **analyse** par dosage propre à chaque minéral (ex. l'or : attaque à l'**eau chlorée**, dosage à la **rhodamine**) ;
- **Prospection géologique** : examiner les **affleurements**, prélever des échantillons (marteau), les analyser et déterminer la **roche encaissante**.

### 2. Les méthodes indirectes (prospection géophysique)

Chaque méthode exploite une **propriété physique** des roches :

- **Électrique** : conductibilité et **résistivité** (contours isovaleurs) ;
- **Magnétique** : anomalies du champ magnétique dues aux concentrations **ferromagnétiques** (Fe, Co, Ni…) → cartes d'intensité ;
- **Radiométrique** : **radioactivité** des roches (scintillomètre, compteur Geiger) ;
- **Sismique réflexion** : propagation d'**ondes** (explosions, camions vibreurs) — principe de l'écho → structure du sous-sol.

## II. Les méthodes d'exploitation

L'exploitation consiste à **extraire le minerai**. Deux grandes techniques :

- **Exploitation à ciel ouvert** : pour les gisements **affleurants ou à faible profondeur** (graviers, sables), **stratiformes** (charbon, phosphates, manganèse) et métallifères (fer, aluminium, nickel). On enlève les terrains stériles (« **morts terrains** ») : c'est la **découverture** (avec un **taux de découverture** qui influence le prix de revient) ;
- **Exploitation souterraine** : pour les minerais **en profondeur** (or, diamant). On creuse des **galeries**, tunnels et puits depuis la surface.

## III. Les conséquences de l'exploitation minière

### 1. Impacts positifs

Création de **richesses** et de **devises**, création d'**emplois** et d'**infrastructures** (routes, écoles, centres de santé), hausse de la demande de biens et services, diversité culturelle → amélioration de la **qualité de vie**.

### 2. Impacts négatifs

- **Environnement** : déforestation, dégradation des sols, **pollution** des eaux, de l'air et des sols (produits chimiques), destruction de la couche d'ozone, effet de serre, changement climatique ;
- **Société / santé** : **déplacement et réinstallation** des populations, migrations, affaiblissement des moyens d'existence, conflits, maladies respiratoires, perte des ressources culturelles.

## Conclusion

L'exploitation minière s'appuie sur des méthodes de **prospection** (directes/indirectes) et d'**exploitation** (ciel ouvert / souterraine). Elle a des conséquences à la fois **positives** (économiques, sociales) et **négatives** (environnementales, sanitaires).

---

### 📌 L'essentiel à retenir

- **Prospection directe** : alluvionnaire (**batée**), géochimique (prélèvement → préparation → analyse), géologique ;
- **Prospection indirecte (géophysique)** : électrique, magnétique, radiométrique, sismique réflexion ;
- **Exploitation** : **à ciel ouvert** (gisements superficiels, « découverture ») vs **souterraine** (gisements profonds, galeries) ;
- Un gisement est **rentable** tant que la teneur dépasse le **seuil** de rentabilité (ex. 3,63 g d'or/t) ;
- Conséquences **positives** (emplois, devises, infrastructures) et **négatives** (déforestation, pollutions, déplacements de populations).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 14;

-- ---- L15 — L'amélioration et la protection des sols ----
update public.chapitres c set
  titre = 'L15 — L''amélioration et la protection des sols',
  description = 'La gestion des sols · amendements, techniques de protection',
  resume = $md$*Thème : La gestion des sols*

## Introduction

Face à des sols de moins en moins productifs, comment améliorer la **fertilité** d'un sol — par des **amendements** et par des **techniques de protection** ?

## I. L'amélioration par les amendements

### 1. L'amendement chimique (engrais chimiques)

L'apport d'engrais **N-P-K** (azote, phosphore, potassium) enrichit la **réserve minérale** du sol en éléments **directement assimilables**. Le rendement augmente avec la dose **jusqu'à un optimum** (ex. 82,5 qtx/ha à 150 kg/ha), puis **diminue** : à forte dose, les engrais deviennent **toxiques** pour les plantes. Effet **immédiat** mais limité à la durée d'une récolte.

### 2. L'amendement organique (engrais organiques)

Les **vers de terre** et la faune du sol décomposent la **matière organique** (**minéralisation**) : ils libèrent des sels minéraux assimilables (un sol avec vers de terre est plus riche en Ca, N, P, K). Deux types d'engrais organiques :

- **débris animaux et végétaux** : paille, fumier, purin ;
- **engrais verts** : culture à croissance rapide incorporée au sol (les **légumineuses**, grâce à leurs **nodosités**, fixent l'**azote atmosphérique**).

L'engrais organique nécessite d'être **minéralisé** avant d'être assimilé (effet plus lent mais durable, souvent supérieur à l'engrais chimique).

### 3. L'amendement calcaire et humifère

Un sol impropre à l'agriculture (pH acide ~4,5, structure compacte, pauvre en Ca²⁺, riche en H⁺, sans humus, vie microbienne faible) doit être amendé :

- **Amendement calcaire** : apport de **calcium** pour **floculer** l'argile et l'humus (**complexe argilo-humique**) et **remonter le pH** :
  - **chaux vive (CaO)** — sols très acides : `CaO + H₂O → Ca(OH)₂` ; les **Ca²⁺** se fixent sur le complexe en échange des **H⁺**, les OH⁻ neutralisent les H⁺ → structure **grumeleuse**, pH qui remonte ;
  - **carbonate de calcium (CaCO₃)** — sols légers (sableux) ;
- **Amendement humifère** : apport d'**humus** (matière organique brune issue de la décomposition végétale). Il améliore les propriétés **physiques** (complexe argilo-humique, agrégats stables, perméabilité), **chimiques** (minéralisation → éléments assimilables) et **biologiques** (support des micro-organismes, activateurs de croissance).

## II. L'amélioration par les techniques de protection

- **Paillage** : couverture de matière végétale morte (paille) → protège contre la **battance** des pluies, l'érosion et l'insolation, et enrichit le sol ;
- **Jachère** : mise au **repos** du sol pour qu'il reconstitue naturellement sa fertilité ;
- **Assolement (rotation)** : **alternance de cultures** aux besoins minéraux différents → retarde l'épuisement du sol ;
- **Terrassement** : cultures en **terrasses** (escaliers) sur terrains pentus → lutte contre l'écoulement rapide des eaux ;
- **Plantes de couverture (engazonnement)** : recouvrir le sol → protection contre l'érosion, reconstitution de la faune et de la flore ;
- **Reboisement** des terrains dénudés.

## Conclusion

L'amélioration de la fertilité d'un sol se fait par apport d'**engrais** (chimiques ou organiques), par **amendements** (calcaires ou humifères) ou par des **techniques de protection** (paillage, jachère, assolement, terrassement…). Leur mise en œuvre assure une **gestion rationnelle des sols** et la préservation de l'environnement.

---

### 📌 L'essentiel à retenir

- **Engrais chimiques (N-P-K)** : effet **immédiat** mais **toxiques** à forte dose ; **engrais organiques** : minéralisés d'abord, effet durable (légumineuses = fixation d'azote) ;
- **Amendement calcaire** : Ca²⁺ → complexe argilo-humique + **remonte le pH** ; **amendement humifère** : humus → améliore propriétés physiques/chimiques/biologiques ;
- **Techniques de protection** : **paillage** (érosion), **jachère** (repos), **assolement** (rotation), **terrassement** (pente), engazonnement ;
- Adapter la culture aux **besoins minéraux** disponibles dans le sol.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'svt' and n.nom = 'Terminale' and s.nom in ('C', 'D')
  and c.ordre = 15;

-- Contrôle : liste des résumés publiés pour la matière
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille_resume, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = 'svt' and n.nom = 'Terminale'
order by s.nom, c.ordre;
