-- ============================================================================
-- EXCELLENCE LYCÉE — résumés physique-chimie / Terminale (série C)
-- Copie des résumés publiés de la série D (programme commun C/D).
-- Idempotent, rejouable sans risque. Coller dans Supabase SQL Editor > New query.
-- ============================================================================

-- 1) Création des chapitres série C (ignorés s'ils existent déjà au même ordre)
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'Physique · L1 — Cinématique du point', 'Référentiel, vecteurs position/vitesse/accélération, mouvements rectilignes et circulaire uniforme'),
  (2, 'Physique · L2 — Mouvement du centre d''inertie d''un solide', 'Centre d’inertie, théorème du centre d’inertie (2e loi de Newton), applications'),
  (4, 'Physique · L4 — Mouvements dans les champs g et E uniformes', 'Projectile dans le champ de pesanteur, particule chargée dans un champ électrique uniforme'),
  (5, 'Physique · L5 — Oscillations mécaniques libres', 'Pendule élastique et pendule simple, équation différentielle, période propre, énergie'),
  (6, 'Physique · L6 — Champ magnétique', 'Sources de champ magnétique, vecteur champ, lignes de champ, solénoïde'),
  (8, 'Physique · L8 — Loi de Laplace', 'Force électromagnétique sur un conducteur parcouru par un courant, applications'),
  (9, 'Physique · L9 — Induction électromagnétique', 'Flux magnétique, loi de Faraday, loi de Lenz, courants induits, alternateur'),
  (10, 'Physique · L10 — Auto-induction', 'Inductance d’une bobine, f.é.m. auto-induite, énergie emmagasinée'),
  (51, 'Chimie · L1 — Les alcools', 'Classes d’alcools, nomenclature, oxydation ménagée, tests d’identification'),
  (52, 'Chimie · L2 — Composés carbonylés : aldéhydes et cétones', 'Groupe carbonyle, nomenclature, tests d’identification (DNPH, Fehling, Schiff)'),
  (53, 'Chimie · L3 — Les amines', 'Classes d’amines, nomenclature, caractère basique, réactions'),
  (54, 'Chimie · L4 — Acides carboxyliques et dérivés', 'Acides carboxyliques, estérification, chlorures d’acyle, anhydrides d’acide'),
  (55, 'Chimie · L5 — Fabrication d''un savon', 'Corps gras, saponification, propriétés et mode d’action du savon'),
  (56, 'Chimie · L6 — Solutions aqueuses : notion de pH', 'Produit ionique de l’eau, définition du pH, solutions acides, basiques, neutres'),
  (57, 'Chimie · L7 — Acide fort, base forte', 'Ionisation totale, pH des solutions d’acide fort et de base forte, dilution'),
  (58, 'Chimie · L8 — Acide faible, base faible', 'Ionisation partielle, coefficient d’ionisation, constante d’acidité Ka'),
  (59, 'Chimie · L9 — Couple acide/base, classification', 'Couples acide-base, échelle des pKa, domaines de prédominance'),
  (60, 'Chimie · L10 — Réactions acido-basiques, solutions tampons', 'Réaction entre couples, constante de réaction, préparation et propriétés des tampons'),
  (61, 'Chimie · L11 — Dosage acido-basique', 'Principe du dosage, équivalence, courbes pH-métriques, choix de l’indicateur'),
  (62, 'Chimie · L12 — Acides α-aminés', 'Structure, chiralité, zwitterion, propriétés acido-basiques, liaison peptidique')
) as x(ordre, titre, description) on true
where m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre/description resynchronisés)

-- ---- Physique · L1 — Cinématique du point (ordre 1) ----
update public.chapitres c set
  titre = 'Physique · L1 — Cinématique du point',
  description = 'Référentiel, vecteurs position/vitesse/accélération, mouvements rectilignes et circulaire uniforme',
  resume = $md$## 🎯 L'essentiel

La **cinématique** décrit le mouvement d'un point sans s'occuper de ses causes. Tout mouvement se décrit **par rapport à un référentiel** muni d'un repère et d'une horloge.

## Vecteurs du mouvement

- **Position** : $\overrightarrow{OM}(t) = x(t)\,\vec{i} + y(t)\,\vec{j}$ — les équations $x(t)$, $y(t)$ sont les **équations horaires**.
- **Vitesse** : $\vec{v} = \dfrac{d\overrightarrow{OM}}{dt}$ ; toujours **tangente** à la trajectoire ; norme en m/s.
- **Accélération** : $\vec{a} = \dfrac{d\vec{v}}{dt}$ ; en m/s².

## Mouvement rectiligne uniforme (MRU)

$\vec{v}$ constant, $a = 0$ :
$$x(t) = v\,t + x_0$$

## Mouvement rectiligne uniformément varié (MRUV)

$a$ constante :
$$v(t) = a\,t + v_0 \qquad x(t) = \frac{1}{2}a\,t^2 + v_0\,t + x_0$$
Relation indépendante du temps : $v^2 - v_0^2 = 2a(x - x_0)$.

- **Accéléré** si $\vec{a}$ et $\vec{v}$ de même sens ($a \cdot v > 0$) ; **retardé** sinon.

## Mouvement circulaire uniforme

Le point parcourt un cercle de rayon $r$ à vitesse de norme constante :
- Vitesse angulaire $\omega$ (rad/s) : $v = r\,\omega$
- Période : $T = \dfrac{2\pi}{\omega}$ ; fréquence $N = \dfrac{1}{T}$
- L'accélération est **centripète** (dirigée vers le centre) : $a = \dfrac{v^2}{r} = r\,\omega^2$

## ✏️ Exemple type

Un mobile part de $x_0 = 0$ avec $v_0 = 2$ m/s et $a = 4$ m/s². Quand atteint-il $v = 10$ m/s ?
$$v = at + v_0 \Rightarrow t = \frac{10 - 2}{4} = 2\ \text{s}, \qquad x = \frac{1}{2}(4)(2^2) + 2(2) = 12\ \text{m}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 1;

-- ---- Physique · L2 — Mouvement du centre d'inertie d'un solide (ordre 2) ----
update public.chapitres c set
  titre = 'Physique · L2 — Mouvement du centre d''inertie d''un solide',
  description = 'Centre d’inertie, théorème du centre d’inertie (2e loi de Newton), applications',
  resume = $md$## 🎯 L'essentiel

Le **centre d'inertie** $G$ d'un solide est le point où se résume le mouvement d'ensemble du solide. Son mouvement est régi par le **théorème du centre d'inertie** (TCI).

## Théorème du centre d'inertie

Dans un référentiel galiléen :
$$\sum \vec{F}_{ext} = m\,\vec{a}_G$$
La somme des forces extérieures appliquées au solide est égale au produit de sa masse par l'accélération de son centre d'inertie.

**Cas particuliers :**
- $\sum \vec{F}_{ext} = \vec{0} \iff \vec{a}_G = \vec{0}$ : $G$ est immobile ou en MRU (**principe d'inertie**)
- Principe des **actions réciproques** : $\vec{F}_{A/B} = -\vec{F}_{B/A}$

## Méthode de résolution (à connaître par cœur)

1. **Définir le système** (le solide étudié)
2. Choisir le **référentiel** galiléen et le repère
3. Faire le **bilan des forces extérieures** (poids $\vec{P}$, réaction $\vec{R}$, tension $\vec{T}$, frottements $\vec{f}$…)
4. Appliquer le **TCI** : $\sum \vec{F}_{ext} = m\vec{a}_G$
5. **Projeter** sur les axes du repère
6. Résoudre

## Application : plan incliné (angle $\alpha$)

Solide glissant sans frottement, axe $Ox$ le long de la pente :
$$P\sin\alpha = ma \Rightarrow a = g\sin\alpha$$
Avec frottement $f$ : $a = g\sin\alpha - \dfrac{f}{m}$.

## ✏️ Exemple type

Un solide de 2 kg glisse sans frottement sur un plan incliné à 30°. Accélération ?
$$a = g\sin 30° = 10 \times 0{,}5 = 5\ \text{m/s}^2$$
La réaction du plan : $R = mg\cos 30° = 2 \times 10 \times \dfrac{\sqrt{3}}{2} \approx 17{,}3$ N.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 2;

-- ---- Physique · L4 — Mouvements dans les champs g et E uniformes (ordre 4) ----
update public.chapitres c set
  titre = 'Physique · L4 — Mouvements dans les champs g et E uniformes',
  description = 'Projectile dans le champ de pesanteur, particule chargée dans un champ électrique uniforme',
  resume = $md$## 🎯 L'essentiel

Dans un champ **uniforme** (pesanteur $\vec{g}$ ou électrique $\vec{E}$), l'accélération est constante : la trajectoire est une **parabole** (ou une droite si la vitesse initiale est parallèle au champ).

## Projectile dans le champ de pesanteur

Lancé avec $\vec{v}_0$ incliné d'un angle $\alpha$, sans frottement : $\vec{a} = \vec{g}$.

**Équations horaires** (origine au point de lancement, $Oy$ vertical ascendant) :
$$x(t) = v_0\cos\alpha \cdot t \qquad y(t) = -\frac{1}{2}g t^2 + v_0\sin\alpha \cdot t$$

**Équation de la trajectoire** :
$$y = -\frac{g}{2v_0^2\cos^2\alpha}\,x^2 + x\tan\alpha$$

- **Flèche** (hauteur max, quand $v_y = 0$) : $h = \dfrac{v_0^2\sin^2\alpha}{2g}$
- **Portée** (retour à $y=0$) : $d = \dfrac{v_0^2\sin 2\alpha}{g}$ — maximale pour $\alpha = 45°$

## Particule chargée dans un champ E uniforme

Force électrique : $\vec{F} = q\vec{E}$, d'où $\vec{a} = \dfrac{q\vec{E}}{m}$ (le poids est négligeable).

- $q > 0$ : accélération dans le sens de $\vec{E}$ ; $q < 0$ : sens opposé.
- Entre deux plaques (tension $U$, distance $d$) : $E = \dfrac{U}{d}$.
- Particule entrant **perpendiculairement** au champ : trajectoire **parabolique** — principe de la déviation dans un oscilloscope.

**Théorème de l'énergie cinétique** version électrique : $\Delta E_c = qU$ entre deux points de tension $U$.

## ✏️ Exemple type

Ballon frappé à $v_0 = 20$ m/s sous 45° ($g = 10$) :
$$d = \frac{20^2 \times \sin 90°}{10} = 40\ \text{m}, \qquad h = \frac{400 \times 0{,}5}{20} = 10\ \text{m}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 4;

-- ---- Physique · L5 — Oscillations mécaniques libres (ordre 5) ----
update public.chapitres c set
  titre = 'Physique · L5 — Oscillations mécaniques libres',
  description = 'Pendule élastique et pendule simple, équation différentielle, période propre, énergie',
  resume = $md$## 🎯 L'essentiel

Un **oscillateur mécanique libre** effectue des allers-retours autour de sa position d'équilibre, sans apport d'énergie extérieur. Non amorti, son mouvement est **sinusoïdal**.

## Pendule élastique (ressort horizontal)

Solide de masse $m$ accroché à un ressort de raideur $k$. Le TCI donne l'**équation différentielle** :
$$\ddot{x} + \frac{k}{m}\,x = 0$$

**Solution** : $x(t) = X_m\cos(\omega_0 t + \varphi)$ avec :
$$\omega_0 = \sqrt{\frac{k}{m}} \qquad T_0 = 2\pi\sqrt{\frac{m}{k}}$$

$X_m$ : amplitude ; $\varphi$ : phase initiale (déterminées par les conditions initiales).

## Pendule simple

Masse ponctuelle au bout d'un fil de longueur $l$, **petites oscillations** :
$$\ddot{\theta} + \frac{g}{l}\,\theta = 0 \qquad T_0 = 2\pi\sqrt{\frac{l}{g}}$$
💡 La période ne dépend **ni de la masse ni de l'amplitude** (loi d'isochronisme).

## Énergie de l'oscillateur

- Cinétique : $E_c = \dfrac{1}{2}mv^2$ ; potentielle élastique : $E_p = \dfrac{1}{2}kx^2$
- **Énergie mécanique** (sans frottement) : constante
$$E_m = \frac{1}{2}kX_m^2 = \frac{1}{2}m\omega_0^2X_m^2$$
Elle s'échange en permanence entre $E_c$ (maximale au passage à l'équilibre) et $E_p$ (maximale aux extrémités).

## Amortissement

Avec frottements, l'amplitude **décroît** (régime pseudo-périodique) puis le mouvement s'arrête : l'énergie mécanique se dissipe en chaleur.

## ✏️ Exemple type

Ressort $k = 40$ N/m, masse $m = 0{,}1$ kg :
$$T_0 = 2\pi\sqrt{\frac{0{,}1}{40}} = 2\pi \times 0{,}05 \approx 0{,}31\ \text{s}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 5;

-- ---- Physique · L6 — Champ magnétique (ordre 6) ----
update public.chapitres c set
  titre = 'Physique · L6 — Champ magnétique',
  description = 'Sources de champ magnétique, vecteur champ, lignes de champ, solénoïde',
  resume = $md$## 🎯 L'essentiel

Un **champ magnétique** règne dans une région de l'espace où une aiguille aimantée subit une action d'orientation. Il est créé par les **aimants** et les **courants électriques**.

## Le vecteur champ magnétique $\vec{B}$

- **Direction** : celle de l'aiguille aimantée (axe sud-nord de l'aiguille)
- **Sens** : du sud vers le nord de l'aiguille
- **Norme** : en **tesla (T)**, mesurée au teslamètre

## Lignes de champ

Courbes tangentes à $\vec{B}$ en chaque point, orientées dans le sens de $\vec{B}$. À l'extérieur d'un aimant, elles sortent du pôle **nord** et entrent au pôle **sud**. Un champ est **uniforme** quand les lignes sont parallèles (ex. entre les branches d'un aimant en U).

## Champ créé par un courant

L'expérience d'Œrsted montre qu'un courant crée un champ magnétique. Le sens s'obtient avec la **règle de la main droite** (le pouce suit le courant, les doigts s'enroulent dans le sens de $\vec{B}$).

**Solénoïde** (bobine longue) parcouru par un courant $I$ : à l'intérieur, champ **uniforme** parallèle à l'axe :
$$B = \mu_0\,n\,I = \mu_0\,\frac{N}{L}\,I$$
avec $\mu_0 = 4\pi \times 10^{-7}$ SI, $n$ = nombre de spires par mètre. Le solénoïde a une **face nord** et une **face sud** comme un aimant.

## Superposition

Si plusieurs sources créent en un point des champs $\vec{B}_1$, $\vec{B}_2$… le champ résultant est :
$$\vec{B} = \vec{B}_1 + \vec{B}_2 + \dots$$
(somme **vectorielle**).

## ✏️ Exemple type

Solénoïde de 50 cm comportant 1000 spires, parcouru par $I = 2$ A :
$$B = 4\pi \times 10^{-7} \times \frac{1000}{0{,}5} \times 2 \approx 5 \times 10^{-3}\ \text{T}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 6;

-- ---- Physique · L8 — Loi de Laplace (ordre 8) ----
update public.chapitres c set
  titre = 'Physique · L8 — Loi de Laplace',
  description = 'Force électromagnétique sur un conducteur parcouru par un courant, applications',
  resume = $md$## 🎯 L'essentiel

Un conducteur parcouru par un courant et placé dans un champ magnétique subit une force : la **force de Laplace**.

## Loi de Laplace

Pour une portion rectiligne de longueur $l$ parcourue par un courant $I$ dans un champ uniforme $\vec{B}$ :
$$F = B\,I\,l\,\sin\alpha$$
où $\alpha$ est l'angle entre le conducteur et $\vec{B}$. La force est **maximale** quand le conducteur est perpendiculaire au champ ($\alpha = 90°$).

## Caractéristiques de $\vec{F}$

- **Direction** : perpendiculaire au plan formé par le conducteur et $\vec{B}$
- **Sens** : règle des **trois doigts de la main droite** — pouce = courant $I$, index = champ $\vec{B}$, majeur = force $\vec{F}$
- **Point d'application** : milieu de la portion de conducteur dans le champ

⚠️ Si $I$ change de sens **ou** si $\vec{B}$ change de sens, la force change de sens.

## Expériences classiques

- **Rails de Laplace** : une tige mobile sur deux rails, dans un champ $\vec{B}$, se met en mouvement dès qu'un courant circule — conversion d'énergie **électrique → mécanique**.
- **Roue de Barlow** : rotation continue d'une roue au contact d'un mercure conducteur.

## Applications

- **Moteur électrique** à courant continu (rotation d'une spire dans un champ)
- **Haut-parleur** (bobine mobile dans l'entrefer d'un aimant : le courant variable fait vibrer la membrane)
- Appareils de mesure à cadre mobile

## ✏️ Exemple type

Tige de 10 cm parcourue par $I = 5$ A, perpendiculaire à un champ $B = 0{,}2$ T :
$$F = 0{,}2 \times 5 \times 0{,}1 \times \sin 90° = 0{,}1\ \text{N}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 8;

-- ---- Physique · L9 — Induction électromagnétique (ordre 9) ----
update public.chapitres c set
  titre = 'Physique · L9 — Induction électromagnétique',
  description = 'Flux magnétique, loi de Faraday, loi de Lenz, courants induits, alternateur',
  resume = $md$## 🎯 L'essentiel

Quand le **flux magnétique** à travers un circuit **varie**, une tension apparaît : c'est l'**induction électromagnétique** — le principe de production de presque toute l'électricité mondiale.

## Flux magnétique

À travers une surface $S$ (circuit plat, normale $\vec{n}$) dans un champ uniforme $\vec{B}$ :
$$\Phi = B\,S\,\cos\theta$$
avec $\theta$ = angle entre $\vec{B}$ et $\vec{n}$. Unité : le **weber (Wb)**. Pour une bobine de $N$ spires : $\Phi = N\,B\,S\cos\theta$.

## Mise en évidence

On crée un courant **induit** dans une bobine (l'**induit**) en :
- déplaçant un aimant près d'elle (ou l'inverse),
- faisant varier le courant dans une bobine voisine (l'**inducteur**),
- déformant ou faisant tourner le circuit dans le champ.

Dès que la variation cesse, le courant induit disparaît.

## Loi de Faraday

La force électromotrice (f.é.m.) induite vaut :
$$e = -\frac{d\Phi}{dt}$$
Plus le flux varie **vite**, plus la f.é.m. est grande.

## Loi de Lenz

Le courant induit s'oppose, par ses effets, à la **cause qui lui donne naissance** (c'est le sens du signe « − »). Ex. : on approche le pôle nord d'un aimant → la face de la bobine devient une face **nord** pour le repousser.

## Applications

- **Alternateur** : rotation d'un aimant devant des bobines → tension alternative (centrales électriques, dynamo de vélo)
- **Transformateur**, plaques à induction, freinage par courants de Foucault

## ✏️ Exemple type

Bobine de 100 spires, $S = 20\ \text{cm}^2$, le champ passe de 0 à 0,5 T en 0,1 s (normale parallèle à $\vec{B}$) :
$$|e| = N\,\frac{\Delta(BS)}{\Delta t} = 100 \times \frac{0{,}5 \times 20 \times 10^{-4}}{0{,}1} = 1\ \text{V}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 9;

-- ---- Physique · L10 — Auto-induction (ordre 10) ----
update public.chapitres c set
  titre = 'Physique · L10 — Auto-induction',
  description = 'Inductance d’une bobine, f.é.m. auto-induite, énergie emmagasinée',
  resume = $md$## 🎯 L'essentiel

Une bobine traversée par un courant **variable** crée elle-même un flux variable à travers ses propres spires : elle s'oppose aux variations de son propre courant. C'est l'**auto-induction**.

## Inductance d'une bobine

Le **flux propre** d'une bobine est proportionnel au courant qui la traverse :
$$\Phi_{propre} = L\,i$$
$L$ est l'**inductance**, en **henry (H)**. Elle ne dépend que de la géométrie de la bobine (et du noyau éventuel).

## F.é.m. auto-induite

$$e = -L\,\frac{di}{dt}$$

**Tension aux bornes d'une bobine réelle** (résistance $r$, convention récepteur) :
$$u = r\,i + L\,\frac{di}{dt}$$

## Conséquences concrètes

- À la **fermeture** d'un circuit inductif : le courant ne s'établit pas instantanément (retard à l'allumage d'une lampe en série avec une bobine).
- À l'**ouverture** : la bobine s'oppose à l'annulation du courant → **étincelle de rupture** aux bornes de l'interrupteur.
- En courant **continu établi** ($di/dt = 0$) : la bobine se comporte comme une simple résistance $r$.

## Énergie emmagasinée

Une bobine parcourue par un courant $i$ stocke une énergie **magnétique** :
$$E = \frac{1}{2}L\,i^2$$
C'est cette énergie qui se libère dans l'étincelle de rupture.

## ✏️ Exemple type

Bobine $L = 0{,}5$ H : le courant passe de 0 à 2 A en 0,1 s (variation supposée régulière).
$$|e| = L\,\frac{\Delta i}{\Delta t} = 0{,}5 \times \frac{2}{0{,}1} = 10\ \text{V}$$
Énergie stockée à 2 A : $E = \dfrac{1}{2} \times 0{,}5 \times 4 = 1$ J.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 10;

-- ---- Chimie · L1 — Les alcools (ordre 51) ----
update public.chapitres c set
  titre = 'Chimie · L1 — Les alcools',
  description = 'Classes d’alcools, nomenclature, oxydation ménagée, tests d’identification',
  resume = $md$## 🎯 L'essentiel

Un **alcool** est un composé organique portant un groupe **hydroxyle –OH** sur un carbone **tétraédrique** : formule générale $C_nH_{2n+1}OH$ (alcools saturés).

## Les trois classes d'alcools

Selon le nombre de carbones liés au carbone porteur du –OH :
- **Primaire** : le C du –OH est lié à **1** autre carbone (ou 0) — ex. éthanol $CH_3-CH_2OH$
- **Secondaire** : lié à **2** carbones — ex. propan-2-ol
- **Tertiaire** : lié à **3** carbones — ex. 2-méthylpropan-2-ol

## Nomenclature

Nom de l'alcane + terminaison **-ol**, avec l'indice de position le plus petit possible : butan-1-ol, butan-2-ol…

## Oxydation ménagée

Par un oxydant doux ($KMnO_4$ ou $K_2Cr_2O_7$ en milieu acide) :

| Classe | Oxydation limitée | Oxydation en excès d'oxydant |
|---|---|---|
| Primaire | **aldéhyde** | **acide carboxylique** |
| Secondaire | **cétone** | — |
| Tertiaire | résiste à l'oxydation ménagée | — |

💡 Ce comportement permet d'**identifier la classe** d'un alcool.

## Combustion

Combustion complète : $C_2H_5OH + 3\,O_2 \rightarrow 2\,CO_2 + 3\,H_2O$

## ✏️ Exemple type

Un alcool $A$ de formule $C_4H_{10}O$ donne par oxydation ménagée un composé qui rosit la liqueur de Fehling (aldéhyde) : $A$ est un alcool **primaire** → butan-1-ol ou 2-méthylpropan-1-ol.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 51;

-- ---- Chimie · L2 — Composés carbonylés : aldéhydes et cétones (ordre 52) ----
update public.chapitres c set
  titre = 'Chimie · L2 — Composés carbonylés : aldéhydes et cétones',
  description = 'Groupe carbonyle, nomenclature, tests d’identification (DNPH, Fehling, Schiff)',
  resume = $md$## 🎯 L'essentiel

Les **aldéhydes** et les **cétones** portent le groupe **carbonyle** $C=O$ :
- **Aldéhyde** : le carbonyle est en **bout de chaîne** ($R-CHO$) — terminaison **-al** (éthanal, propanal…)
- **Cétone** : le carbonyle est **dans la chaîne** ($R-CO-R'$) — terminaison **-one** (propanone, butan-2-one…)

## Tests d'identification

| Test | Aldéhyde | Cétone |
|---|---|---|
| **DNPH** (2,4-dinitrophénylhydrazine) | précipité jaune ✔ | précipité jaune ✔ |
| **Liqueur de Fehling** (à chaud) | précipité **rouge brique** ✔ | ✘ |
| **Réactif de Schiff** | rose/violet ✔ | ✘ |
| **Réactif de Tollens** (nitrate d'argent ammoniacal) | **miroir d'argent** ✔ | ✘ |

💡 **DNPH positif** = composé carbonylé ; les tests de Fehling/Schiff/Tollens distinguent alors l'aldéhyde (réducteur) de la cétone.

## Caractère réducteur des aldéhydes

Les aldéhydes s'oxydent facilement en **acides carboxyliques** :
$$R-CHO \xrightarrow{\ oxydant\ } R-COOH$$
Les cétones, elles, ne s'oxydent pas de façon ménagée.

## Obtention

Oxydation ménagée des alcools : primaire → aldéhyde ; secondaire → cétone (voir leçon 1).

## ✏️ Exemple type

Un composé $C_3H_6O$ donne un précipité jaune avec la DNPH mais ne réagit ni avec Fehling ni avec Schiff : c'est une **cétone** → la **propanone** (acétone) $CH_3-CO-CH_3$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 52;

-- ---- Chimie · L3 — Les amines (ordre 53) ----
update public.chapitres c set
  titre = 'Chimie · L3 — Les amines',
  description = 'Classes d’amines, nomenclature, caractère basique, réactions',
  resume = $md$## 🎯 L'essentiel

Les **amines** dérivent de l'ammoniac $NH_3$ en remplaçant un ou plusieurs H par des groupes carbonés. L'azote porte un **doublet libre** responsable de leurs propriétés.

## Les trois classes

- **Primaire** $R-NH_2$ : 1 groupe carboné sur N (ex. méthylamine $CH_3NH_2$)
- **Secondaire** $R-NH-R'$ : 2 groupes (ex. diméthylamine)
- **Tertiaire** $R-N(R')-R''$ : 3 groupes (ex. triméthylamine)

## Nomenclature

- Nom de l'alcane + **-amine** : éthanamine, propan-1-amine…
- Substituants sur l'azote signalés par **N-** : N-méthylpropan-1-amine.

## Caractère basique

Grâce au doublet libre de l'azote, une amine **capte un proton** :
$$R-NH_2 + H_2O \rightleftharpoons R-NH_3^+ + OH^-$$
Les solutions aqueuses d'amines sont **basiques** (pH > 7). Couple : $R-NH_3^+/R-NH_2$.

💡 Les amines aliphatiques sont des bases **plus fortes** que l'ammoniac (effet donneur des groupes alkyle).

## Réactions caractéristiques

- **Avec les acides** : formation d'un sel d'ammonium
$$CH_3NH_2 + HCl \rightarrow CH_3NH_3^+ + Cl^-$$
- **Alkylation** (avec un halogénoalcane $R-X$) : l'amine gagne un groupe alkyle, la classe augmente (primaire → secondaire → tertiaire → ion ammonium quaternaire).

## ✏️ Exemple type

Classer par basicité croissante : ammoniac < méthylamine < diméthylamine (plus il y a de groupes donneurs sur N, plus le doublet est disponible).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 53;

-- ---- Chimie · L4 — Acides carboxyliques et dérivés (ordre 54) ----
update public.chapitres c set
  titre = 'Chimie · L4 — Acides carboxyliques et dérivés',
  description = 'Acides carboxyliques, estérification, chlorures d’acyle, anhydrides d’acide',
  resume = $md$## 🎯 L'essentiel

Les **acides carboxyliques** $R-COOH$ portent le groupe **carboxyle**. Leurs dérivés (esters, chlorures d'acyle, anhydrides, amides) s'en déduisent en remplaçant le –OH.

## Nomenclature

« Acide … -oïque » : acide méthanoïque $HCOOH$, acide éthanoïque $CH_3COOH$ (vinaigre)…

## Estérification directe

$$acide + alcool \rightleftharpoons ester + eau$$
$$R-COOH + R'-OH \rightleftharpoons R-COO-R' + H_2O$$

Caractéristiques essentielles :
- réaction **lente**, **limitée** (équilibre), **athermique**
- rendement avec mélange équimolaire : **67 %** (alcool primaire), ~60 % (secondaire), ~5 % (tertiaire)
- catalysée par les ions $H^+$ (qui n'améliorent pas le rendement, juste la vitesse)

La réaction inverse est l'**hydrolyse de l'ester** (lente et limitée elle aussi).

## Dérivés plus réactifs

Pour une estérification **rapide et totale**, on remplace l'acide par :
- un **chlorure d'acyle** $R-COCl$ : $R-COCl + R'-OH \rightarrow ester + HCl$
- un **anhydride d'acide** $(R-CO)_2O$ : $anhydride + alcool \rightarrow ester + acide$

## Nom des esters

$R-COO-R'$ : « …oate de …yle ». Ex. $CH_3-COO-C_2H_5$ : **éthanoate d'éthyle**.

## ✏️ Exemple type

1 mol d'acide éthanoïque + 1 mol d'éthanol → à l'équilibre, $\dfrac{2}{3}$ mol d'ester :
$$rendement = \frac{2/3}{1} \approx 67\ \%$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 54;

-- ---- Chimie · L5 — Fabrication d'un savon (ordre 55) ----
update public.chapitres c set
  titre = 'Chimie · L5 — Fabrication d''un savon',
  description = 'Corps gras, saponification, propriétés et mode d’action du savon',
  resume = $md$## 🎯 L'essentiel

Un **savon** est un mélange de **carboxylates de sodium** (ou potassium) $R-COO^-Na^+$ obtenu par **saponification** d'un corps gras.

## Les corps gras

Ce sont des **triglycérides** : triesters du **glycérol** (propan-1,2,3-triol) et d'**acides gras** (acides carboxyliques à longue chaîne, ex. acide oléique, palmitique, stéarique).

## La saponification

Hydrolyse **basique** d'un ester — réaction **lente à froid, totale** (accélérée à chaud) :
$$ester + OH^- \rightarrow carboxylate + alcool$$
Pour un triglycéride :
$$triglycéride + 3\,NaOH \rightarrow 3\,savon + glycérol$$

**Au laboratoire :** huile + soude concentrée + chauffage à reflux (pierre ponce), puis **relargage** dans l'eau salée (le savon, peu soluble dans l'eau salée, précipite), filtration, séchage.

## Mode d'action du savon

L'ion carboxylate a une double nature :
- **queue carbonée hydrophobe** (lipophile) : se fixe sur les graisses
- **tête $-COO^-$ hydrophile** : reste dans l'eau

Les salissures grasses sont entourées de **micelles** et emportées par l'eau.

⚠️ Le savon mousse mal en **eau dure** (riche en $Ca^{2+}$, $Mg^{2+}$) : formation de carboxylates insolubles.

## ✏️ Exemple type

Masse de savon (M = 304 g/mol) obtenue à partir de 0,1 mol de triglycéride avec excès de soude :
$$n_{savon} = 3 \times 0{,}1 = 0{,}3\ \text{mol} \Rightarrow m = 0{,}3 \times 304 = 91{,}2\ \text{g}$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 55;

-- ---- Chimie · L6 — Solutions aqueuses : notion de pH (ordre 56) ----
update public.chapitres c set
  titre = 'Chimie · L6 — Solutions aqueuses : notion de pH',
  description = 'Produit ionique de l’eau, définition du pH, solutions acides, basiques, neutres',
  resume = $md$## 🎯 L'essentiel

Le **pH** mesure l'acidité d'une solution aqueuse : plus le pH est **petit**, plus la solution est **acide**.

## Autoprotolyse de l'eau

L'eau s'ionise très faiblement :
$$2\,H_2O \rightleftharpoons H_3O^+ + OH^-$$

**Produit ionique de l'eau** (à 25 °C) :
$$K_e = [H_3O^+][OH^-] = 10^{-14}$$

## Définition du pH

$$pH = -\log[H_3O^+] \qquad \text{soit} \qquad [H_3O^+] = 10^{-pH}$$
($[H_3O^+]$ en mol/L). Mesure : **pH-mètre** (précis) ou papier pH / indicateurs colorés (approché).

## Solutions acides, basiques, neutres (25 °C)

| Solution | Condition | pH |
|---|---|---|
| **Acide** | $[H_3O^+] > [OH^-]$ | $pH < 7$ |
| **Neutre** | $[H_3O^+] = [OH^-] = 10^{-7}$ | $pH = 7$ |
| **Basique** | $[H_3O^+] < [OH^-]$ | $pH > 7$ |

💡 Connaissant le pH, on obtient les deux concentrations :
$[H_3O^+] = 10^{-pH}$ puis $[OH^-] = \dfrac{10^{-14}}{[H_3O^+]} = 10^{pH-14}$.

## Dilution

Diluer une solution acide **augmente** son pH (vers 7) ; diluer une base le **diminue** (vers 7). Le pH d'une solution diluée ne « traverse » jamais 7.

## ✏️ Exemple type

Solution de $pH = 3$ : $[H_3O^+] = 10^{-3}$ mol/L et $[OH^-] = 10^{-11}$ mol/L → solution acide. Diluée 10 fois (acide fort) : pH = 4.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 56;

-- ---- Chimie · L7 — Acide fort, base forte (ordre 57) ----
update public.chapitres c set
  titre = 'Chimie · L7 — Acide fort, base forte',
  description = 'Ionisation totale, pH des solutions d’acide fort et de base forte, dilution',
  resume = $md$## 🎯 L'essentiel

Un **acide fort** (ou une **base forte**) réagit **totalement** avec l'eau : il n'en reste plus de forme moléculaire en solution.

## Acide fort

Ex. chlorure d'hydrogène : $HCl + H_2O \rightarrow H_3O^+ + Cl^-$ (réaction **totale**, flèche simple).

Pour une concentration $C$ (ni trop concentrée ni trop diluée, $10^{-6} < C < 10^{-1}$ mol/L) :
$$[H_3O^+] = C \qquad \boxed{pH = -\log C}$$

Autres acides forts usuels : acide nitrique $HNO_3$, acide sulfurique (1re acidité).

## Base forte

Ex. hydroxyde de sodium : $NaOH \rightarrow Na^+ + OH^-$ (dissolution totale).

Pour une concentration $C$ :
$$[OH^-] = C \qquad \boxed{pH = 14 + \log C}$$

## Vérifier la force expérimentalement

Comparer le pH mesuré au pH théorique :
- acide de concentration $10^{-2}$ mol/L avec $pH = 2$ → **fort**
- même concentration mais $pH > 2$ → **faible** (ionisation partielle)

## Dilution d'un facteur 10

- Acide fort : pH **augmente de 1** unité
- Base forte : pH **diminue de 1** unité
(valable tant qu'on reste loin de pH 7)

## ✏️ Exemple type

Solution de soude à $C = 10^{-2}$ mol/L :
$$pH = 14 + \log 10^{-2} = 14 - 2 = 12$$
Diluée 100 fois : $pH = 10$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 57;

-- ---- Chimie · L8 — Acide faible, base faible (ordre 58) ----
update public.chapitres c set
  titre = 'Chimie · L8 — Acide faible, base faible',
  description = 'Ionisation partielle, coefficient d’ionisation, constante d’acidité Ka',
  resume = $md$## 🎯 L'essentiel

Un **acide faible** (ou une **base faible**) ne réagit que **partiellement** avec l'eau : il s'établit un **équilibre chimique**.

## Acide faible

Ex. acide éthanoïque :
$$CH_3COOH + H_2O \rightleftharpoons CH_3COO^- + H_3O^+$$
(double flèche = équilibre). Conséquence : pour une même concentration $C$,
$$pH > -\log C$$
et toutes les espèces coexistent : $CH_3COOH$, $CH_3COO^-$, $H_3O^+$, $OH^-$.

## Base faible

Ex. ammoniac :
$$NH_3 + H_2O \rightleftharpoons NH_4^+ + OH^-$$
Pour une même concentration : $pH < 14 + \log C$.

## Constante d'acidité

À chaque couple acide/base $AH/A^-$ est associée :
$$K_a = \frac{[A^-][H_3O^+]}{[AH]} \qquad pK_a = -\log K_a$$
Plus $K_a$ est **grand** (donc $pK_a$ **petit**), plus l'acide est **fort**.

## Coefficient d'ionisation

$$\alpha = \frac{\text{quantité ionisée}}{\text{quantité initiale}} = \frac{[A^-]}{C}$$
$\alpha = 1$ pour un acide fort ; $\alpha < 1$ pour un acide faible. ⚠️ $\alpha$ **augmente avec la dilution**.

## ✏️ Exemple type

Une solution d'acide éthanoïque à $C = 10^{-2}$ mol/L a un pH de 3,4 (et non 2) :
$$[H_3O^+] = 10^{-3{,}4} \approx 4 \times 10^{-4}\ \text{mol/L} \qquad \alpha = \frac{4 \times 10^{-4}}{10^{-2}} = 4\ \%$$
→ ionisation très partielle : acide **faible**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 58;

-- ---- Chimie · L9 — Couple acide/base, classification (ordre 59) ----
update public.chapitres c set
  titre = 'Chimie · L9 — Couple acide/base, classification',
  description = 'Couples acide-base, échelle des pKa, domaines de prédominance',
  resume = $md$## 🎯 L'essentiel

Un **couple acide/base** $AH/A^-$ est formé de deux espèces qui s'échangent un **proton** $H^+$ :
$$AH \rightleftharpoons A^- + H^+$$

## Couples importants à connaître

| Couple | $pK_a$ (25 °C) |
|---|---|
| $H_3O^+ / H_2O$ | 0 |
| $CH_3COOH / CH_3COO^-$ | 4,8 |
| $NH_4^+ / NH_3$ | 9,2 |
| $H_2O / OH^-$ | 14 |

L'eau est **amphotère** (ampholyte) : acide dans un couple, base dans l'autre.

## Classification des couples

- Plus $pK_a$ est **petit** → acide plus **fort** (base conjuguée plus faible)
- Plus $pK_a$ est **grand** → base conjuguée plus **forte**

**Réaction spontanée** : l'acide le plus fort réagit avec la base la plus forte (règle du gamma sur l'échelle des $pK_a$).

## Relation fondamentale

Pour tout couple en solution :
$$pH = pK_a + \log\frac{[A^-]}{[AH]}$$

## Domaines de prédominance

- $pH < pK_a$ : la forme **acide** $AH$ prédomine
- $pH = pK_a$ : $[AH] = [A^-]$
- $pH > pK_a$ : la forme **basique** $A^-$ prédomine

💡 Application : les **indicateurs colorés** sont des couples acide/base dont les deux formes ont des couleurs différentes — leur zone de virage encadre leur $pK_a$.

## ✏️ Exemple type

Dans une solution de pH = 6, l'acide éthanoïque ($pK_a = 4{,}8$) est surtout sous forme $CH_3COO^-$ :
$$\frac{[CH_3COO^-]}{[CH_3COOH]} = 10^{6 - 4{,}8} = 10^{1{,}2} \approx 16$$$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 59;

-- ---- Chimie · L10 — Réactions acido-basiques, solutions tampons (ordre 60) ----
update public.chapitres c set
  titre = 'Chimie · L10 — Réactions acido-basiques, solutions tampons',
  description = 'Réaction entre couples, constante de réaction, préparation et propriétés des tampons',
  resume = $md$## 🎯 L'essentiel

Une **réaction acido-basique** est un transfert de proton entre l'acide d'un couple 1 et la base d'un couple 2 :
$$A_1H + A_2^- \rightleftharpoons A_1^- + A_2H$$

## Constante de la réaction

$$K = \frac{[A_1^-][A_2H]}{[A_1H][A_2^-]} = 10^{\,pK_{a2} - pK_{a1}}$$

- $K > 10^4$ (soit $pK_{a2} - pK_{a1} > 4$) : réaction quasi **totale**
- La réaction spontanée se fait de l'acide **le plus fort** vers la base **la plus forte**.

## Solution tampon

Une **solution tampon** contient un acide faible et sa base conjuguée en quantités **égales** (ou voisines) :
$$pH = pK_a \quad \text{(quand } [AH] = [A^-]\text{)}$$

**Propriétés** — le pH d'un tampon varie **très peu** :
- par **addition modérée** d'acide ou de base,
- par **dilution**.

## Préparation d'un tampon

Trois méthodes classiques :
1. Mélanger l'acide faible et sa base conjuguée (ex. $CH_3COOH$ + $CH_3COONa$) à concentrations égales
2. **Demi-neutralisation** : acide faible + base forte (moitié de l'équivalence)
3. Base faible + acide fort (moitié de l'équivalence)

💡 Importance : le sang est tamponné à pH ≈ 7,4 ; les milieux biologiques et industriels exigent des pH stables.

## ✏️ Exemple type

Mélange de 0,1 mol de $CH_3COOH$ et 0,1 mol de $CH_3COO^-$ ($pK_a = 4{,}8$) :
$$pH = 4{,}8 + \log\frac{0{,}1}{0{,}1} = 4{,}8$$
Tampon efficace autour de pH 4,8.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 60;

-- ---- Chimie · L11 — Dosage acido-basique (ordre 61) ----
update public.chapitres c set
  titre = 'Chimie · L11 — Dosage acido-basique',
  description = 'Principe du dosage, équivalence, courbes pH-métriques, choix de l’indicateur',
  resume = $md$## 🎯 L'essentiel

**Doser** une solution acide (ou basique), c'est déterminer sa **concentration** en la faisant réagir totalement avec une base (ou un acide) de concentration connue.

## L'équivalence

À l'**équivalence**, les réactifs ont été mélangés dans les **proportions stœchiométriques** :
$$C_a V_a = C_b V_b$$
($V_b$ = volume de base versé à l'équivalence pour doser l'acide).

## Courbes de dosage pH-métrique

**Acide fort par base forte** :
- pH initial bas ($-\log C_a$)
- **saut de pH** brutal autour de l'équivalence
- $pH_E = 7$ (solution de sel neutre)

**Acide faible par base forte** :
- pH initial plus élevé
- à la **demi-équivalence** : $pH = pK_a$ (mélange tampon !)
- $pH_E > 7$ (la base conjuguée rend la solution basique)

**Base faible par acide fort** : symétrique, $pH_E < 7$.

## Repérer l'équivalence

- **Méthode des tangentes** parallèles sur la courbe pH = f(V)
- **Indicateur coloré** : sa **zone de virage doit contenir le pH d'équivalence**

| Indicateur | Zone de virage | Convient pour $pH_E$ |
|---|---|---|
| Hélianthine | 3,1 – 4,4 | < 7 |
| BBT (bleu de bromothymol) | 6,0 – 7,6 | = 7 |
| Phénolphtaléine | 8,2 – 10 | > 7 |

## ✏️ Exemple type

10 mL d'acide éthanoïque dosés par de la soude à 0,1 mol/L ; équivalence à 12 mL :
$$C_a = \frac{C_b V_b}{V_a} = \frac{0{,}1 \times 12}{10} = 0{,}12\ \text{mol/L}$$
Indicateur adapté : **phénolphtaléine** ($pH_E > 7$).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 61;

-- ---- Chimie · L12 — Acides α-aminés (ordre 62) ----
update public.chapitres c set
  titre = 'Chimie · L12 — Acides α-aminés',
  description = 'Structure, chiralité, zwitterion, propriétés acido-basiques, liaison peptidique',
  resume = $md$## 🎯 L'essentiel

Les **acides α-aminés** portent **sur le même carbone** (le carbone α) un groupe **carboxyle** $-COOH$ et un groupe **amino** $-NH_2$ :
$$R-CH(NH_2)-COOH$$
Ce sont les constituants des **protéines**. Ex. : glycine ($R = H$), alanine ($R = CH_3$).

## Chiralité

Si le carbone α porte **4 substituants différents**, il est **asymétrique** (noté C*) : la molécule est **chirale** et existe sous deux **énantiomères** (images l'une de l'autre dans un miroir, non superposables), représentés par les projections de **Fischer** (séries D et L).

⚠️ La glycine ($R = H$) n'est **pas** chirale. Les acides aminés naturels sont de série **L**.

## L'amphion (zwitterion)

En solution aqueuse, la forme majoritaire est l'**amphion** : le proton du carboxyle est passé sur l'amine :
$$R-CH(NH_3^+)-COO^-$$
C'est un **ampholyte** : il peut donner ou capter un proton.

## Propriétés acido-basiques

Deux couples encadrent l'amphion :
- $pK_{a1}$ (≈ 2-3) : couple $-COOH / -COO^-$ (cation ⇌ amphion)
- $pK_{a2}$ (≈ 9-10) : couple $-NH_3^+ / -NH_2$ (amphion ⇌ anion)

Prédominance : **cation** si $pH < pK_{a1}$, **amphion** entre les deux, **anion** si $pH > pK_{a2}$.

## Liaison peptidique

Deux acides aminés se lient par **condensation** (élimination d'eau) entre le $-COOH$ de l'un et le $-NH_2$ de l'autre :
$$-CO-NH-$$
Le produit est un **dipeptide** (deux dipeptides différents possibles avec 2 acides aminés différents). L'enchaînement donne les **polypeptides** puis les protéines.

## ✏️ Exemple type

Alanine + glycine → 2 dipeptides possibles : **Ala-Gly** (le COOH de l'alanine réagit) ou **Gly-Ala** (celui de la glycine).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C'
  and c.ordre = 62;

-- Contrôle : liste des résumés publiés pour la série C
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = 'physique-chimie' and n.nom = 'Terminale' and s.nom = 'C' and c.resume_published = true
order by c.ordre;