import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 07 de Physique en Terminale C et leçon 06 en Terminale D.
const sourceDocument = "Mouvement d'une particule chargée dans un champ magnétique uniforme.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => ({
  type: "short-answer",
  prompt,
  options: [],
  correctIndex: 0,
  acceptedAnswers,
  explanation,
  sourceLabel,
  points,
});

interface LevelSeed {
  id: string;
  title: string;
  summary: string;
  pages: string;
  section: string;
  durationMinutes: number;
  xp: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  interaction: LessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: {
      documentTitle: sourceDocument,
      pages: seed.pages,
      section: seed.section,
      fidelity: seed.corrections?.length ? "faithful-corrected" : "faithful",
      corrections: seed.corrections ?? [],
    },
    concept: {
      eyebrow: `Niveau ${index + 1} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Suis cette démarche avant de remplacer les grandeurs par leurs valeurs numériques.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : dessine d'abord les trois vecteurs, travaille avec |q| pour les valeurs, puis utilise le signe de q uniquement pour le sens.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const timeline = (
  items: TimelineInteractionItem[],
  title: string,
  instruction: string,
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Démarche interactive",
  title,
  instruction,
  observation,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
});

const levels: LevelSeed[] = [
  {
    id: "charged-particle-lorentz-force",
    title: "Construire la force de Lorentz",
    summary: "Revoir le produit vectoriel puis déterminer l'expression, la direction, le sens et la valeur de la force magnétique.",
    pages: "1-4",
    section: "Rappel sur le produit vectoriel et 1. Force de Lorentz",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## Le produit vectoriel, outil d'orientation

Soient deux vecteurs non nuls $\vec U$ et $\vec V$. Leur produit vectoriel $\vec U\times\vec V$ est un vecteur :

- perpendiculaire au plan formé par $\vec U$ et $\vec V$ ;
- orienté pour que le trièdre $(\vec U,\vec V,\vec U\times\vec V)$ soit direct ;
- de norme

$$\boxed{\|\vec U\times\vec V\|=UV\sin\theta}$$

où $\theta$ est l'angle entre $\vec U$ et $\vec V$. Le produit vectoriel n'est pas commutatif :

$$\vec U\times\vec V=-\vec V\times\vec U.$$

Il est distributif sur l'addition. Si les vecteurs sont parallèles, son module est nul ; s'ils sont perpendiculaires, son module vaut $UV$.

## Mise en évidence de l'action magnétique

Un faisceau d'électrons traverse le champ quasi uniforme de deux bobines de Helmholtz.

| Situation | Observation |
|---|---|
| $\vec B=\vec 0$ | aucune déviation |
| $\vec v\parallel\vec B$ | aucune déviation |
| $\vec v\perp\vec B$ | trajectoire courbe, circulaire dans le champ uniforme |
| angle quelconque entre $\vec v$ et $\vec B$ | trajectoire hélicoïdale |

Inverser $\vec B$ inverse le sens de la déviation. Une force magnétique agit donc sur la particule chargée en mouvement : la **force de Lorentz**.

## Expression de la force

Pour une particule de charge $q$, de vitesse $\vec v$, placée dans un champ magnétique $\vec B$ :

$$\boxed{\vec F_m=q\,\vec v\times\vec B}$$

Si un champ électrique $\vec E$ agit simultanément, la force électromagnétique totale devient :

$$\boxed{\vec F=q\left(\vec E+\vec v\times\vec B\right)}$$

Les caractéristiques de $\vec F_m$ sont :

- **point d'application** : la particule ;
- **direction** : perpendiculaire à $\vec v$ et à $\vec B$ ;
- **sens** : celui qui rend le trièdre $(q\vec v,\vec B,\vec F_m)$ direct ;
- **valeur** :

$$\boxed{F_m=|q|vB\sin\theta}$$

avec $\theta=(\vec v,\vec B)$. Pour $q>0$, $q\vec v$ a le sens de $\vec v$ ; pour $q<0$, son sens est opposé.

> **Astuce mémoire.** La charge n'est pas « oubliée » dans le sens : on oriente avec $q\vec v$, pas toujours avec $\vec v$.

> **Point de vigilance.** La formule générale n'impose pas une trajectoire circulaire. Le cercle apparaît seulement dans le cas étudié ensuite : champ uniforme, poids négligé et $\vec v\perp\vec B$.`,
    keyPoint: "Fm = q v × B et Fm = |q|vB sin θ ; la force est perpendiculaire à v et B.",
    example: "Pour un proton avec v ⟂ B, q = 1,6×10⁻¹⁹ C, v = 2,0×10⁶ m·s⁻¹ et B = 0,50 T : Fm = 1,6×10⁻¹³ N.",
    methodSteps: [
      "Repère la charge q, le vecteur vitesse et le champ magnétique.",
      "Mesure ou identifie l'angle entre v et B.",
      "Calcule le module avec |q|vB sin θ.",
      "Oriente qv en tenant compte du signe de la charge.",
      "Utilise le trièdre direct (qv, B, Fm).",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Vecteurs explorables",
      title: "Le trièdre de Lorentz",
      instruction: "Sélectionne chaque repère pour reconstruire la force sur une charge positive.",
      observation: "Avec v vers la droite et B entrant dans le plan, v × B est dirigé vers le haut pour q > 0.",
      caption: "Schéma original redessiné d'après les expériences et la relation vectorielle du support.",
      viewBox: "0 0 420 250",
      shapes: [
        { shape: "circle", cx: 105, cy: 150, r: 16, tone: "accent" },
        { shape: "text", x: 105, y: 156, content: "+q", anchor: "middle" },
        { shape: "line", x1: 125, y1: 150, x2: 285, y2: 150, tone: "accent" },
        { shape: "path", d: "M285 150 L267 141 L267 159 Z", tone: "fill" },
        { shape: "text", x: 205, y: 137, content: "v", anchor: "middle" },
        { shape: "line", x1: 105, y1: 130, x2: 105, y2: 45, tone: "accent" },
        { shape: "path", d: "M105 45 L96 63 L114 63 Z", tone: "fill" },
        { shape: "text", x: 122, y: 86, content: "F", anchor: "start" },
        { shape: "circle", cx: 330, cy: 150, r: 13, tone: "soft" },
        { shape: "line", x1: 322, y1: 142, x2: 338, y2: 158, tone: "muted" },
        { shape: "line", x1: 338, y1: 142, x2: 322, y2: 158, tone: "muted" },
        { shape: "text", x: 330, y: 184, content: "B entrant", anchor: "middle" },
      ],
      hotspots: [
        { id: "velocity", number: 1, label: "Vitesse", detail: "Le vecteur vitesse est tangent à la trajectoire instantanée.", x: 225, y: 150 },
        { id: "field", number: 2, label: "Champ entrant", detail: "La croix représente un vecteur dirigé vers l'arrière du plan.", x: 330, y: 150 },
        { id: "force", number: 3, label: "Force", detail: "Pour q positif, la règle de la main droite donne ici une force vers le haut.", x: 105, y: 72 },
      ],
    },
    questions: [
      choice("Le vecteur U × V est dirigé…", ["perpendiculairement au plan de U et V", "toujours comme U", "toujours comme V", "dans une direction quelconque"], 0, "Le produit vectoriel est normal au plan des deux facteurs.", "Rappel, pages 1-2"),
      choice("Quelle relation traduit l'anticommutativité ?", ["U × V = −V × U", "U × V = V × U", "U × V = U + V", "U × V = 0 toujours"], 0, "Permuter les deux facteurs inverse le produit vectoriel.", "Rappel, page 2"),
      choice("La force magnétique exercée sur une charge q vaut…", ["q v × B", "qE seulement", "mv", "qB/v"], 0, "C'est la définition de la force magnétique de Lorentz.", "1.2, page 4", 2),
      choice("Avec E et B simultanés, la force totale vaut…", ["q(E + v × B)", "q(E × B)", "qv + B", "m(E + B)"], 0, "On additionne la force électrique qE et la force magnétique qv×B.", "1.2, page 4", 2),
      choice("Si v ⟂ B, le module Fm vaut…", ["|q|vB", "0", "|q|v/B", "mvB"], 0, "sin 90° = 1.", "1.3, page 4"),
      choice("Si v ∥ B, la force magnétique est…", ["nulle", "maximale", "parallèle à v", "égale au poids"], 0, "Le sinus de 0 ou π est nul.", "1.1.2, page 3"),
      choice("Pour q < 0, le vecteur qv est…", ["opposé à v", "de même sens que v", "toujours nul", "parallèle à B"], 0, "Multiplier un vecteur par une charge négative inverse son sens.", "1.3, page 4"),
      choice("La force de Lorentz est perpendiculaire…", ["à v et à B", "uniquement à q", "seulement à la masse", "à aucune direction"], 0, "Elle est portée par le produit vectoriel.", "1.3, page 4"),
      short("Calcule Fm pour |q| = 1,6×10⁻¹⁹ C, v = 2,0×10⁶ m·s⁻¹, B = 0,50 T et v ⟂ B.", ["1,6×10^-13", "1.6×10^-13", "1,6e-13", "1.6e-13", "1,6×10^-13 N", "1.6e-13 N"], "Fm=1,6×10⁻¹⁹×2,0×10⁶×0,50=1,6×10⁻¹³ N.", "Application directe", 2),
      choice("Une trajectoire circulaire est-elle garantie par la seule formule de Lorentz ?", ["Non, il faut notamment v ⟂ B et un champ uniforme", "Oui, dans tous les cas", "Oui, même si B = 0", "Seulement pour une particule neutre"], 0, "Un angle quelconque produit généralement une hélice, et une vitesse parallèle n'est pas déviée.", "Précision de cours", 2),
    ],
    corrections: [
      "Page 4 : la mention selon laquelle l'angle serait nécessairement compris strictement entre 0 et π « puisque la trajectoire est un cercle » mélange la loi générale de Lorentz et le cas circulaire particulier. La formule est présentée ici sans cette restriction erronée.",
    ],
  },
  {
    id: "charged-particle-magnetic-deflection",
    title: "Calculer une déflexion magnétique",
    summary: "Relier la géométrie du petit angle au rayon de courbure et exploiter fidèlement l'activité des électrons déviés.",
    pages: "12-14",
    section: "3.1 Déflexion magnétique et activité d'application",
    durationMinutes: 24,
    xp: 75,
    body: String.raw`## Du cercle à l'impact sur l'écran

Un électron entre en $O$ dans une zone de largeur $\ell$ où règne un champ magnétique uniforme. Sa vitesse initiale $\vec v_0$ est perpendiculaire à $\vec B$. Dans le champ, il décrit l'arc de cercle $OS$ de centre $C$ et de rayon :

$$R=\frac{mv_0}{|q|B}.$$

Au point $S$, il quitte le champ. La force magnétique disparaît : le mouvement devient rectiligne uniforme suivant la **tangente** au cercle en $S$. En l'absence de champ, l'électron atteindrait le point $A$ ; avec le champ, il atteint $A'$. La déflexion est :

$$\boxed{D=AA'}$$

## Approximation du petit angle

Le support suppose :

$$\ell\ll L\qquad\text{et}\qquad \alpha<10^\circ.$$

Dans la géométrie de l'arc :

$$\sin\alpha=\frac{\ell}{R}.$$

Sur le trajet jusqu'à l'écran :

$$\tan\alpha\simeq\frac DL.$$

Comme l'angle est petit, $\sin\alpha\simeq\tan\alpha$. Donc :

$$\frac\ell R\simeq\frac DL$$

et finalement :

$$\boxed{D=\frac{|q|\ell LB}{mv_0}}$$

La déflexion augmente avec $|q|$, $\ell$, $L$ et $B$. Elle diminue lorsque $m$ ou $v_0$ augmente. Sa **valeur** utilise $|q|$ ; son côté sur l'écran dépend du signe de $q$ et du sens de $\vec B$.

## Activité officielle

On donne :

$$m=9{,}1\times10^{-31}\ \mathrm{kg},\quad |q|=1{,}6\times10^{-19}\ \mathrm C,$$

$$B=3{,}2\times10^{-4}\ \mathrm T,\quad \ell=2{,}0\ \mathrm{cm},\quad L=30\ \mathrm{cm},$$

$$v_0=2{,}1\times10^7\ \mathrm{m\,s^{-1}}.$$

Après conversion, $\ell=2{,}0\times10^{-2}$ m et $L=0{,}30$ m. Alors :

$$D=\frac{1{,}6\times10^{-19}\times2{,}0\times10^{-2}\times0{,}30\times3{,}2\times10^{-4}}{9{,}1\times10^{-31}\times2{,}1\times10^7}$$

$$\boxed{D\approx1{,}61\times10^{-2}\ \mathrm m=1{,}61\ \mathrm{cm}}$$

> **Astuce mémoire.** Dans le champ : arc de cercle. Hors du champ : droite tangente. L'écran ne prolonge jamais le rayon $CS$.

> **Limite du modèle.** La formule compacte utilise $L$ à la place de la distance exacte depuis le milieu de la zone. Elle est justifiée par $\ell\ll L$.`,
    keyPoint: "Pour ℓ ≪ L et α petit : D = |q|ℓLB/(mv₀), après un arc circulaire puis un trajet rectiligne tangent.",
    example: "Avec les données de l'activité, D≈0,0161 m, soit 1,61 cm.",
    methodSteps: [
      "Oriente B et trace l'arc de cercle dans la zone magnétique.",
      "Prolonge la tangente au point de sortie S jusqu'à l'écran.",
      "Écris sin α = ℓ/R puis tan α ≈ D/L.",
      "Utilise sin α ≈ tan α et R = mv₀/(|q|B).",
      "Convertis centimètres en mètres avant l'application numérique.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Trajectoire explorable",
      title: "De l'arc à la déflexion",
      instruction: "Sélectionne les zones du montage pour suivre l'électron jusqu'à l'écran.",
      observation: "La courbure est limitée à la zone de champ ; la particule poursuit ensuite la tangente.",
      caption: "Montage de déflexion redessiné d'après les pages 12 à 14.",
      viewBox: "0 0 500 260",
      zones: [
        { label: "Champ B", xStart: 65, xEnd: 205 },
        { label: "Vol libre", xStart: 205, xEnd: 430 },
      ],
      shapes: [
        { shape: "line", x1: 65, y1: 105, x2: 430, y2: 105, tone: "muted" },
        { shape: "path", d: "M65 105 C120 105 160 125 205 165", tone: "accent" },
        { shape: "line", x1: 205, y1: 165, x2: 430, y2: 225, tone: "accent" },
        { shape: "line", x1: 430, y1: 65, x2: 430, y2: 235, tone: "outline" },
        { shape: "line", x1: 430, y1: 105, x2: 430, y2: 225, tone: "accent" },
        { shape: "text", x: 447, y: 170, content: "D", anchor: "start" },
        { shape: "text", x: 65, y: 92, content: "O", anchor: "middle" },
        { shape: "text", x: 205, y: 184, content: "S", anchor: "middle" },
        { shape: "text", x: 430, y: 96, content: "A", anchor: "middle" },
        { shape: "text", x: 430, y: 247, content: "A'", anchor: "middle" },
        { shape: "circle", cx: 118, cy: 170, r: 9, tone: "soft" },
        { shape: "line", x1: 112, y1: 164, x2: 124, y2: 176, tone: "muted" },
        { shape: "line", x1: 124, y1: 164, x2: 112, y2: 176, tone: "muted" },
      ],
      hotspots: [
        { id: "arc", number: 1, label: "Arc OS", detail: "Dans le champ, la force normale impose un cercle de rayon R.", x: 145, y: 125 },
        { id: "exit", number: 2, label: "Sortie S", detail: "À la sortie, la force disparaît et la vitesse est tangente au cercle.", x: 205, y: 165 },
        { id: "screen", number: 3, label: "Écran", detail: "D est l'écart entre l'impact réel A' et l'impact A sans champ.", x: 430, y: 165 },
      ],
    },
    questions: [
      choice("Dans la zone magnétique, la trajectoire est…", ["un arc de cercle", "une parabole", "une droite accélérée", "une ellipse nécessairement"], 0, "v₀ est perpendiculaire à B.", "3.1, page 12"),
      choice("Après la sortie S, la particule suit…", ["la tangente au cercle en S", "le rayon CS", "une nouvelle parabole", "une trajectoire immobile"], 0, "Hors du champ et poids négligé, elle est en MRU.", "Activité, question 3, page 14"),
      choice("La déflexion D est…", ["la distance entre l'impact avec champ et l'impact sans champ", "le rayon R", "la largeur ℓ", "la distance OS"], 0, "D=AA' sur l'écran.", "Définition, page 13"),
      choice("Dans l'arc, quelle relation est utilisée ?", ["sin α = ℓ/R", "tan α = R/ℓ", "cos α = L/R", "sin α = D/R"], 0, "La corde géométrique conduit à sin α=ℓ/R dans le modèle du support.", "3.1, pages 13-14", 2),
      choice("Pour ℓ ≪ L, la géométrie de l'écran donne…", ["tan α ≈ D/L", "tan α ≈ L/D", "sin α = R/D", "α = DL"], 0, "La distance longitudinale est assimilée à L.", "3.1, page 13"),
      choice("L'approximation du petit angle permet d'écrire…", ["sin α ≈ tan α", "sin α ≈ 1", "tan α ≈ 0 toujours", "cos α ≈ α"], 0, "Pour α faible, sin α et tan α sont proches de α en radians.", "3.1, page 13"),
      choice("L'expression de la déflexion est…", ["D = |q|ℓLB/(mv₀)", "D = mv₀/(|q|ℓLB)", "D = |q|v₀B/(mℓL)", "D = ℓL/R²"], 0, "On combine D/L≈ℓ/R avec R=mv₀/(|q|B).", "3.1, page 13", 2),
      choice("Si B double, toutes choses égales, D…", ["double", "est divisée par deux", "reste constante", "quadruple"], 0, "D est proportionnelle à B.", "Remarque, page 14"),
      short("Convertis ℓ = 2 cm en mètres.", ["0,02", "0.02", "2×10^-2", "0,02 m", "0.02 m"], "2 cm=2×10⁻² m.", "Activité, données page 14"),
      short("Calcule D avec les données officielles, en centimètres au centième près.", ["1,61", "1.61", "1,61 cm", "1.61 cm", "1,6", "1.6"], "D≈0,016075 m=1,6075 cm≈1,61 cm.", "Activité, question 5.2, page 14", 3),
    ],
    corrections: [
      "Page 14 : l'énoncé dit que la trajectoire circulaire a pour centre O, alors que les questions et le schéma utilisent correctement le centre C. Le centre est C ; O est le point d'entrée.",
    ],
  },
  {
    id: "charged-particle-mass-spectrograph",
    title: "Séparer des isotopes au spectrographe de masse",
    summary: "Enchaîner ionisation, accélération électrique, déviation magnétique et détection pour distinguer deux masses.",
    pages: "15-18",
    section: "3.2 Spectrographe de masse et activité sur les ions bromure",
    durationMinutes: 30,
    xp: 85,
    body: String.raw`## Les quatre fonctions du spectrographe

Un spectrographe de masse sépare des particules de même charge mais de masses différentes.

1. **Chambre d'ionisation** : elle produit les ions, supposés presque au repos.
2. **Chambre d'accélération** : une différence de potentiel $U$ augmente leur énergie cinétique.
3. **Chambre de déviation** : un champ magnétique uniforme courbe leurs trajectoires sans modifier leurs vitesses.
4. **Collecteur ou détecteur** : il enregistre des impacts séparés.

Les isotopes ont le même numéro atomique, donc le même nombre de protons, mais des nombres de neutrons et des masses différents.

## Accélération électrique

Pour un ion qui part presque du repos, le théorème de l'énergie cinétique donne :

$$\frac12mv^2=|qU|.$$

Ainsi :

$$\boxed{v=\sqrt{\frac{2|qU|}{m}}}$$

À tension et charge identiques, l'isotope le plus lourd sort un peu plus lentement.

## Déviation magnétique

Dans le champ perpendiculaire à la vitesse :

$$R=\frac{mv}{|q|B}.$$

En remplaçant $v$ :

$$\boxed{R=\frac1B\sqrt{\frac{2m|U|}{|q|}}}$$

Donc :

$$\boxed{\frac{R_1}{R_2}=\sqrt{\frac{m_1}{m_2}}}$$

L'isotope le plus massif possède le plus grand rayon. Pour des demi-cercles dont les entrées sont communes, la distance entre les impacts vaut :

$$\boxed{d=2(R_2-R_1)}\qquad\text{si }R_2>R_1.$$

## Activité officielle : $^{79}\mathrm{Br}^-$ et $^{81}\mathrm{Br}^-$

On donne $|U_0|=4000$ V, $B=10^{-2}$ T, $|q|=e=1{,}6\times10^{-19}$ C et $1\,\mathrm u=1{,}67\times10^{-27}$ kg.

$$m_1=79\,\mathrm u=1{,}3193\times10^{-25}\ \mathrm{kg}$$

$$m_2=81\,\mathrm u=1{,}3527\times10^{-25}\ \mathrm{kg}$$

Les vitesses de sortie valent environ :

$$v_1\approx9{,}85\times10^4\ \mathrm{m\,s^{-1}},\qquad v_2\approx9{,}73\times10^4\ \mathrm{m\,s^{-1}}.$$

Les rayons sont :

$$R_1\approx8{,}12\ \mathrm m,\qquad R_2\approx8{,}22\ \mathrm m.$$

La séparation au collecteur vaut alors :

$$\boxed{d=2(R_2-R_1)\approx0{,}204\ \mathrm m=20{,}4\ \mathrm{cm}}$$

> **Astuce mémoire.** Dans l'accélérateur, le champ électrique change la vitesse. Dans l'analyseur magnétique, le champ change la direction.`,
    keyPoint: "Spectrographe : v = √(2|qU|/m), R = (1/B)√(2m|U|/|q|), et l'isotope le plus lourd a le plus grand rayon.",
    example: "Pour ⁷⁹Br⁻ et ⁸¹Br⁻, R₁≈8,12 m, R₂≈8,22 m et les impacts sont séparés d'environ 20,4 cm.",
    methodSteps: [
      "Convertis les masses atomiques en kilogrammes.",
      "Utilise l'énergie électrique pour calculer chaque vitesse.",
      "Applique R=mv/(|q|B) ou sa forme combinée.",
      "Classe les isotopes selon leurs rayons.",
      "Lis la géométrie du collecteur et calcule d=2|R₂−R₁|.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Instrument interactif",
      title: "Les chambres du spectrographe",
      instruction: "Explore le trajet des ions depuis leur création jusqu'aux deux impacts.",
      observation: "La tension prépare les vitesses ; le champ magnétique transforme ensuite la différence de masse en différence de rayon.",
      caption: "Spectrographe redessiné d'après les pages 15 à 17.",
      viewBox: "0 0 560 280",
      zones: [
        { label: "Ionisation", xStart: 25, xEnd: 145 },
        { label: "Accélération", xStart: 145, xEnd: 275 },
        { label: "Déviation", xStart: 275, xEnd: 530 },
      ],
      shapes: [
        { shape: "line", x1: 45, y1: 105, x2: 300, y2: 105, tone: "accent" },
        { shape: "path", d: "M300 105 C430 105 430 240 300 240", tone: "accent" },
        { shape: "path", d: "M300 105 C470 105 470 260 300 260", tone: "soft" },
        { shape: "line", x1: 165, y1: 65, x2: 165, y2: 145, tone: "outline" },
        { shape: "line", x1: 235, y1: 65, x2: 235, y2: 145, tone: "outline" },
        { shape: "text", x: 200, y: 54, content: "U", anchor: "middle" },
        { shape: "circle", cx: 390, cy: 165, r: 10, tone: "muted" },
        { shape: "line", x1: 384, y1: 159, x2: 396, y2: 171, tone: "muted" },
        { shape: "line", x1: 396, y1: 159, x2: 384, y2: 171, tone: "muted" },
        { shape: "text", x: 413, y: 168, content: "B", anchor: "start" },
        { shape: "line", x1: 285, y1: 220, x2: 285, y2: 270, tone: "outline" },
        { shape: "text", x: 270, y: 277, content: "détecteur", anchor: "end" },
      ],
      hotspots: [
        { id: "source", number: 1, label: "Ionisation", detail: "Les atomes deviennent des ions de même charge et de masses isotopiques différentes.", x: 90, y: 105 },
        { id: "accelerator", number: 2, label: "Accélération", detail: "La tension U fournit l'énergie cinétique |qU|.", x: 200, y: 105 },
        { id: "analyzer", number: 3, label: "Déviation", detail: "Le champ B conserve la vitesse mais sépare les rayons selon √m.", x: 390, y: 165 },
        { id: "detector", number: 4, label: "Collecteur", detail: "Les deux demi-cercles conduisent à deux impacts séparés de 2|R₂−R₁|.", x: 300, y: 250 },
      ],
    },
    questions: [
      choice("Quel est le rôle de la chambre d'ionisation ?", ["Produire les ions", "Mesurer directement B", "Annuler les masses", "Créer la gravité"], 0, "Elle transforme les atomes en particules chargées.", "3.2, pages 15-16"),
      choice("Dans la chambre d'accélération, l'énergie cinétique acquise vaut…", ["|qU|", "|q|B", "mv", "q/B"], 0, "Le travail du champ électrique vaut la variation d'énergie cinétique.", "3.2, page 16"),
      choice("La vitesse de sortie depuis le repos vaut…", ["√(2|qU|/m)", "2|qU|/m", "m/(2|qU|)", "|q|B/m"], 0, "On résout ½mv²=|qU|.", "3.2, page 16", 2),
      choice("Dans la chambre magnétique, la vitesse en valeur…", ["reste constante", "augmente toujours", "diminue toujours", "devient nulle"], 0, "La force magnétique ne travaille pas.", "3.2 corrigé, pages 15-16"),
      choice("Le rayon combiné vaut…", ["(1/B)√(2m|U|/|q|)", "B√(2|q|U/m)", "mB/(|q|U)", "|q|B/m"], 0, "On remplace v dans R=mv/(|q|B).", "3.2, page 16", 2),
      choice("À charge et tension identiques, l'isotope le plus lourd a…", ["le plus grand rayon", "le plus petit rayon", "le même rayon", "une trajectoire droite"], 0, "R est proportionnel à √m.", "Remarque, page 16"),
      choice("Pour deux demi-cercles, la séparation des impacts est…", ["2|R₂−R₁|", "R₁+R₂", "|R₂−R₁|/2", "2R₁R₂"], 0, "Chaque impact est décalé d'un diamètre 2R.", "Activité, question 2.3, page 17", 2),
      short("Convertis m₁=79 u avec 1 u=1,67×10⁻²⁷ kg.", ["1,3193×10^-25", "1.3193×10^-25", "1,3193e-25", "1.3193e-25", "1,32×10^-25 kg"], "79×1,67×10⁻²⁷=1,3193×10⁻²⁵ kg.", "Activité, données page 18", 2),
      short("Donne v₁ pour l'ion ⁷⁹Br⁻, à trois chiffres significatifs.", ["9,85×10^4", "9.85×10^4", "9,85e4", "9.85e4", "98500", "98499"], "v₁=√(2eU/m₁)≈9,85×10⁴ m·s⁻¹.", "Activité, question 1, page 17", 3),
      short("Donne R₁ pour ⁷⁹Br⁻ au centième de mètre.", ["8,12", "8.12", "8,12 m", "8.12 m"], "R₁=(1/B)√(2m₁U/e)≈8,12 m.", "Activité, question 2.2, page 17", 3),
      short("Donne R₂ pour ⁸¹Br⁻ au centième de mètre.", ["8,22", "8.22", "8,22 m", "8.22 m"], "R₂≈8,224 m, soit 8,22 m.", "Activité, question 2.2, page 17", 3),
      short("Calcule la distance d entre les impacts, en centimètres au dixième près.", ["20,4", "20.4", "20,4 cm", "20.4 cm", "20,43", "20.43"], "d=2(R₂−R₁)≈0,2043 m=20,43 cm≈20,4 cm.", "Activité, question 2.3.3, page 17", 3),
    ],
    corrections: [
      "Page 15 : la description indique que les ions sont « accélérés » dans le champ magnétique. Le champ magnétique les dévie sans modifier leur énergie cinétique ; l'accélération en valeur de vitesse est produite dans la chambre électrique.",
    ],
  },
  {
    id: "charged-particle-cyclotron-principle",
    title: "Comprendre le principe du cyclotron",
    summary: "Distinguer l'accélération entre les dés et la déviation dans les dés, puis établir la condition de synchronisation.",
    pages: "18-20",
    section: "3.3 à 3.3.3 — principe, actions de E et B, période",
    durationMinutes: 28,
    xp: 95,
    body: String.raw`## Architecture du cyclotron

Le cyclotron comporte deux électrodes creuses en forme de D, appelées **dés** ou *dees*. Un champ magnétique uniforme $\vec B$ règne dans les dés. Entre eux se trouve un intervalle étroit où une tension alternative crée un champ électrique $\vec E$.

Une source proche du centre injecte une particule chargée presque au repos.

| Zone | Force dominante | Effet |
|---|---|---|
| intervalle entre les dés | $\vec F_e=q\vec E$ | augmente l'énergie et la vitesse |
| intérieur d'un dé | $\vec F_m=q\vec v\times\vec B$ | courbe la trajectoire sans changer $v$ |

## Première accélération

Pendant une traversée de l'intervalle, le champ électrique est considéré constant. Si la particule part presque du repos :

$$\frac12mv_1^2=|qU|$$

$$\boxed{v_1=\sqrt{\frac{2|qU|}{m}}}$$

À chaque nouvelle traversée, la polarité doit être inversée pour que la force électrique reste dirigée dans le sens du mouvement.

## Mouvement dans un dé

Dans un dé, la particule décrit un demi-cercle de rayon :

$$R=\frac{mv}{|q|B}.$$

La longueur du demi-cercle est $\pi R$. Le temps de transit vaut donc :

$$t_{1/2}=\frac{\pi R}{v}=\boxed{\frac{\pi m}{|q|B}}.$$

Il ne dépend pas de la vitesse. C'est la propriété qui rend possibles les accélérations successives synchronisées.

Pour un tour complet :

$$\boxed{T=\frac{2\pi m}{|q|B}}$$

et la fréquence de la tension alternative doit être :

$$\boxed{f_c=\frac1T=\frac{|q|B}{2\pi m}}.$$

La tension change de signe à chaque demi-tour, donc toutes les $t_{1/2}$ secondes. Sa période complète correspond à un tour de la particule.

## Pourquoi la spirale s'élargit-elle ?

La tension ajoute de l'énergie à chaque passage dans l'intervalle. La vitesse augmente. Comme $R=mv/(|q|B)$, le rayon augmente lui aussi. Les trajectoires semi-circulaires successives forment alors une spirale faite de demi-cercles raccordés.

> **Astuce mémoire.** **E accélère ; B braque.** Le champ électrique fait gagner de l'énergie, le champ magnétique fait tourner.

> **Cadre du modèle.** On néglige le temps de traversée du petit intervalle, les effets relativistes et les pertes.`,
    keyPoint: "Cyclotron : E accélère entre les dés, B impose les demi-cercles ; t½ = πm/(|q|B) et f = |q|B/(2πm).",
    example: "Pour B=1 T, q=3,2×10⁻¹⁹ C et m=3,3×10⁻²⁷ kg, t½≈3,24×10⁻⁸ s et f≈1,54×10⁷ Hz.",
    methodSteps: [
      "Sépare clairement la zone électrique et la zone magnétique.",
      "Utilise le TEC dans l'intervalle pour calculer la vitesse acquise.",
      "Utilise R=mv/(|q|B) à l'intérieur d'un dé.",
      "Calcule le temps d'un demi-tour avec πR/v.",
      "Impose la même fréquence au mouvement et à la tension alternative.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Accélérateur interactif",
      title: "À l'intérieur d'un cyclotron",
      instruction: "Explore les deux dés et l'intervalle accélérateur.",
      observation: "Chaque traversée du centre ajoute de l'énergie ; chaque demi-tour dans B ramène la particule vers l'intervalle.",
      caption: "Cyclotron original redessiné d'après les pages 18 à 21.",
      viewBox: "0 0 480 300",
      shapes: [
        { shape: "path", d: "M220 45 A105 105 0 0 0 220 255 L220 45", tone: "soft" },
        { shape: "path", d: "M260 45 A105 105 0 0 1 260 255 L260 45", tone: "soft" },
        { shape: "line", x1: 220, y1: 45, x2: 220, y2: 255, tone: "outline" },
        { shape: "line", x1: 260, y1: 45, x2: 260, y2: 255, tone: "outline" },
        { shape: "path", d: "M240 150 C280 145 290 185 250 195 C190 210 175 130 235 110 C315 85 345 205 260 238", tone: "accent" },
        { shape: "circle", cx: 240, cy: 150, r: 7, tone: "accent" },
        { shape: "text", x: 165, y: 155, content: "D₁", anchor: "middle" },
        { shape: "text", x: 315, y: 155, content: "D₂", anchor: "middle" },
        { shape: "text", x: 240, y: 30, content: "U alternatif", anchor: "middle" },
        { shape: "circle", cx: 145, cy: 95, r: 10, tone: "muted" },
        { shape: "line", x1: 139, y1: 89, x2: 151, y2: 101, tone: "muted" },
        { shape: "line", x1: 151, y1: 89, x2: 139, y2: 101, tone: "muted" },
        { shape: "text", x: 165, y: 99, content: "B", anchor: "start" },
      ],
      hotspots: [
        { id: "gap", number: 1, label: "Intervalle", detail: "Le champ électrique y accélère la particule et doit s'inverser à chaque demi-tour.", x: 240, y: 90 },
        { id: "dee-one", number: 2, label: "Dé D₁", detail: "Dans le conducteur creux, le champ magnétique impose un demi-cercle sans travail.", x: 165, y: 155 },
        { id: "dee-two", number: 3, label: "Dé D₂", detail: "Le rayon y est plus grand après la nouvelle accélération.", x: 315, y: 155 },
        { id: "spiral", number: 4, label: "Trajectoire", detail: "La suite de demi-cercles de rayons croissants conduit vers la périphérie.", x: 286, y: 220 },
      ],
    },
    questions: [
      choice("Quel champ augmente l'énergie cinétique ?", ["Le champ électrique entre les dés", "Le champ magnétique dans les dés", "Le champ de pesanteur uniquement", "Aucun champ"], 0, "La force électrique travaille.", "3.3.1, page 19"),
      choice("Quel champ courbe la trajectoire dans un dé ?", ["Le champ magnétique", "Le champ électrique extérieur", "La tension nulle", "La masse"], 0, "La force de Lorentz est normale à la vitesse.", "3.3.2, page 20"),
      choice("Pourquoi B ne change-t-il pas l'énergie cinétique ?", ["Fm ⟂ v", "B est toujours nul", "q est nul", "m augmente"], 0, "La puissance magnétique est nulle.", "Activité I.2, page 22", 2),
      choice("Pourquoi inverse-t-on la tension après chaque demi-tour ?", ["Pour que la force électrique accélère encore la particule", "Pour annuler B", "Pour réduire la masse", "Pour immobiliser la particule"], 0, "La particule arrive de l'autre côté avec un sens de mouvement opposé.", "Activité I.3, page 22", 2),
      choice("La vitesse après la première traversée vaut…", ["√(2|qU|/m)", "|q|B/m", "2πm/(|q|B)", "mU/q"], 0, "½mv₁²=|qU|.", "3.3.1, page 19"),
      choice("Le temps d'un demi-tour vaut…", ["πm/(|q|B)", "2πm/(|q|B)", "mv/(|q|B)", "|q|B/(πm)"], 0, "t=πR/v et R=mv/(|q|B).", "3.3.2, page 20", 2),
      choice("Ce temps de demi-tour dépend-il de la vitesse ?", ["Non", "Oui, linéairement", "Oui, comme v²", "Seulement pour q positif"], 0, "v se simplifie dans πR/v.", "Remarque, page 20"),
      choice("La fréquence cyclotron vaut…", ["|q|B/(2πm)", "2πm/(|q|B)", "πm/(|q|B)", "mv/(|q|B)"], 0, "C'est l'inverse de la période d'un tour.", "3.3.2, page 20", 2),
      choice("Pourquoi les rayons successifs augmentent-ils ?", ["La vitesse augmente à chaque traversée de l'intervalle", "La masse augmente", "La charge change de signe", "B disparaît"], 0, "R est proportionnel à v.", "3.3, pages 18-19"),
      short("Avec B=1 T, |q|=3,2×10⁻¹⁹ C et m=3,3×10⁻²⁷ kg, calcule t½.", ["3,24×10^-8", "3.24×10^-8", "3,24e-8", "3.24e-8", "32,4 ns", "32.4 ns"], "t½=πm/(|q|B)≈3,24×10⁻⁸ s.", "Activité, question II.2.c, pages 22-23", 3),
      short("Avec les mêmes données, donne la fréquence en hertz à trois chiffres significatifs.", ["1,54×10^7", "1.54×10^7", "1,54e7", "1.54e7", "15400000", "15,4 MHz"], "f=|q|B/(2πm)≈1,54×10⁷ Hz.", "Activité, question II.2.d, pages 22-23", 3),
      choice("La période de la tension alternative doit être…", ["égale à la période d'un tour de la particule", "égale à quatre tours", "nulle", "dépendante du rayon à chaque passage"], 0, "La tension change de signe à chaque demi-période, comme la particule change de dé.", "Synchronisation, page 20", 2),
    ],
    corrections: [
      "Page 20 : la mise en page de la durée dans le second dé laisse apparaître un facteur 2 parasite dans l'extraction. Chaque demi-tour dure πm/(|q|B), et le tour complet 2πm/(|q|B), ce qui est cohérent avec la conclusion du support.",
    ],
  },
  {
    id: "charged-particle-lorentz-orientation",
    title: "Orienter la force, le champ et la vitesse",
    summary: "Utiliser la main droite, les trois doigts ou le bonhomme d'Ampère sans oublier le signe de la charge.",
    pages: "5-8",
    section: "Règles d'orientation et exemples de représentation",
    durationMinutes: 20,
    xp: 55,
    body: String.raw`## Une seule règle physique, plusieurs moyens mnémotechniques

La relation $\vec F_m=q\vec v\times\vec B$ définit le trièdre direct :

$$\boxed{(q\vec v,\vec B,\vec F_m)}$$

Le support présente trois méthodes équivalentes. Choisis celle qui te paraît la plus naturelle, mais conserve toujours **l'ordre des trois vecteurs**.

### La règle des trois doigts de la main droite

- pouce : $q\vec v$ ;
- index : $\vec B$ ;
- majeur : $\vec F_m$.

Pour retrouver un vecteur manquant, on peut faire une permutation circulaire :

$$ (q\vec v,\vec B,\vec F_m),\qquad (\vec B,\vec F_m,q\vec v),\qquad (\vec F_m,q\vec v,\vec B). $$

Ces trois ordres conservent l'orientation directe. En revanche, échanger seulement deux vecteurs inverse le sens.

### La paume ouverte

Fais entrer $q\vec v$ du poignet vers les doigts, tourne la paume vers $\vec B$ et écarte le pouce : il indique $\vec F_m$.

### Le bonhomme d'Ampère

Le vecteur $q\vec v$ entre par les pieds et sort par la tête. Le bonhomme regarde dans le sens de $\vec B$ ; son bras gauche indique $\vec F_m$.

## Lire les symboles perpendiculaires au plan

- $\odot$ : vecteur **sortant** du plan, comme la pointe d'une flèche qui vient vers toi ;
- $\otimes$ : vecteur **entrant** dans le plan, comme l'empennage d'une flèche qui s'éloigne.

## Le protocole qui évite les erreurs

1. Dessine $\vec v$.
2. Si $q<0$, dessine $q\vec v$ dans le sens opposé ; si $q>0$, garde le même sens.
3. Place $\vec B$.
4. Applique la règle de la main droite à $q\vec v\times\vec B$.
5. Vérifie que $\vec F_m$ est perpendiculaire aux deux autres vecteurs.

> **Astuce mémoire.** Le pouce ne représente pas automatiquement la vitesse : il représente le **premier facteur**, donc $q\vec v$.

> **Test éclair.** Si tu changes seulement le signe de $q$, la trajectoire se courbe dans l'autre sens. Si tu inverses à la fois $q$ et $\vec B$, les deux inversions se compensent.`,
    keyPoint: "Main droite : pouce sur qv, index sur B, majeur sur Fm ; ⊙ sort du plan et ⊗ y entre.",
    example: "Un électron va vers la droite dans un champ entrant. v×B serait vers le haut pour une charge positive ; q<0 inverse donc la force vers le bas.",
    methodSteps: [
      "Identifie le vecteur inconnu parmi qv, B et Fm.",
      "Traduis ⊙ par sortant et ⊗ par entrant.",
      "Construis d'abord qv à partir du signe de q.",
      "Place pouce, index et majeur dans l'ordre du produit vectoriel.",
      "Contrôle la perpendicularité et le changement de sens attendu.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Orientation interactive",
      title: "Entrant, sortant et signe de la charge",
      instruction: "Explore les trois repères avant de conclure sur la force.",
      observation: "Le même couple v/B donne des forces opposées pour une charge positive et une charge négative.",
      caption: "Schéma vectoriel original construit à partir des neuf cas du support.",
      viewBox: "0 0 440 250",
      shapes: [
        { shape: "line", x1: 70, y1: 125, x2: 245, y2: 125, tone: "accent" },
        { shape: "path", d: "M245 125 L226 116 L226 134 Z", tone: "fill" },
        { shape: "text", x: 160, y: 110, content: "v vers la droite", anchor: "middle" },
        { shape: "circle", cx: 330, cy: 125, r: 17, tone: "soft" },
        { shape: "line", x1: 320, y1: 115, x2: 340, y2: 135, tone: "muted" },
        { shape: "line", x1: 340, y1: 115, x2: 320, y2: 135, tone: "muted" },
        { shape: "text", x: 330, y: 158, content: "B entrant", anchor: "middle" },
        { shape: "line", x1: 158, y1: 102, x2: 158, y2: 38, tone: "accent" },
        { shape: "path", d: "M158 38 L149 56 L167 56 Z", tone: "fill" },
        { shape: "text", x: 178, y: 64, content: "F si q > 0", anchor: "start" },
        { shape: "line", x1: 158, y1: 148, x2: 158, y2: 215, tone: "accent" },
        { shape: "path", d: "M158 215 L149 197 L167 197 Z", tone: "fill" },
        { shape: "text", x: 178, y: 198, content: "F si q < 0", anchor: "start" },
      ],
      hotspots: [
        { id: "qv", number: 1, label: "Premier facteur", detail: "Pour q positif, qv suit v ; pour q négatif, il lui est opposé.", x: 210, y: 125 },
        { id: "bin", number: 2, label: "B entrant", detail: "La croix ⊗ représente le champ qui s'éloigne de l'observateur.", x: 330, y: 125 },
        { id: "positive", number: 3, label: "Charge positive", detail: "La force est ici dirigée vers le haut.", x: 158, y: 55 },
        { id: "negative", number: 4, label: "Charge négative", detail: "Le signe négatif inverse la force : elle est dirigée vers le bas.", x: 158, y: 198 },
      ],
    },
    questions: [
      choice("Avec la règle des trois doigts, le pouce représente…", ["qv", "B", "Fm", "la masse"], 0, "Le pouce porte le premier facteur du produit vectoriel.", "Règle des trois doigts, page 6"),
      choice("L'index représente…", ["B", "qv", "Fm", "le rayon"], 0, "L'index porte le deuxième facteur.", "Règle des trois doigts, page 6"),
      choice("Le majeur représente…", ["Fm", "B", "qv", "l'énergie"], 0, "Le majeur donne la résultante du produit vectoriel.", "Règle des trois doigts, page 6"),
      choice("Le symbole ⊙ signifie…", ["vecteur sortant du plan", "vecteur entrant dans le plan", "vecteur nul", "charge négative"], 0, "Le point évoque la pointe d'une flèche venant vers l'observateur.", "Légende, page 5"),
      choice("Le symbole ⊗ signifie…", ["vecteur entrant dans le plan", "vecteur sortant du plan", "champ nul", "vitesse nulle"], 0, "La croix évoque l'arrière d'une flèche qui s'éloigne.", "Légende corrigée, page 5"),
      choice("Pour q>0, qv et v sont…", ["de même sens", "de sens contraires", "toujours perpendiculaires", "toujours nuls"], 0, "Un scalaire positif conserve le sens du vecteur.", "1.3, page 4"),
      choice("Pour q<0, qv et v sont…", ["de sens contraires", "de même sens", "toujours parallèles à B", "sans relation"], 0, "Un scalaire négatif inverse le sens.", "1.3, page 4"),
      choice("Quelle permutation conserve un trièdre direct ?", ["(B, Fm, qv)", "(B, qv, Fm)", "(Fm, B, qv)", "aucune"], 0, "Une permutation circulaire conserve l'orientation.", "Remarque, pages 5-6", 2),
      choice("Si l'on inverse uniquement le signe de q, la force…", ["s'inverse", "reste inchangée", "devient parallèle à v", "double"], 0, "Fm est proportionnelle à q.", "Exemples, page 8"),
      choice("Si l'on inverse simultanément q et B, la force…", ["reste inchangée", "s'inverse", "s'annule toujours", "devient électrique"], 0, "Les deux changements de signe se compensent.", "Synthèse des exemples, page 8", 2),
    ],
    corrections: [
      "Page 5 : la légende imprime « vecteur sortant » sous le symbole pointé et sous le symbole croisé. Le symbole ⊗ désigne en réalité un vecteur entrant dans le plan.",
    ],
  },
  {
    id: "charged-particle-circular-motion",
    title: "Établir le mouvement circulaire uniforme",
    summary: "Passer de la deuxième loi de Newton au rayon, à la période, à la fréquence et aux trois formes possibles de trajectoire.",
    pages: "9-12",
    section: "2. Mouvement dans un champ magnétique uniforme",
    durationMinutes: 28,
    xp: 65,
    body: String.raw`## Hypothèses de l'étude

Une particule de masse $m$ et de charge $q$ entre dans un champ magnétique uniforme $\vec B$ avec une vitesse initiale $\vec v_0$ telle que :

$$\vec v_0\perp\vec B.$$

Le poids est négligé devant la force magnétique. Dans le référentiel terrestre supposé galiléen, la deuxième loi de Newton donne :

$$m\vec a=q\vec v\times\vec B.$$

Donc $\vec a$ est perpendiculaire à $\vec v$. La puissance de la force magnétique vaut :

$$\mathcal P=\vec F_m\cdot\vec v=0.$$

La force ne travaille pas et ne modifie pas l'énergie cinétique : la **valeur** $v$ de la vitesse reste constante. Elle en modifie seulement la direction.

## Pourquoi la trajectoire est-elle un cercle ?

Dans le repère de Frenet :

$$\vec a=a_t\vec\tau+a_n\vec n.$$

Comme $v$ est constante, $a_t=\mathrm dv/\mathrm dt=0$. Toute l'accélération est normale et dirigée vers le centre de courbure :

$$a_n=\frac{v^2}{R}.$$

Or la deuxième loi de Newton fournit :

$$a_n=\frac{|q|vB}{m}.$$

En identifiant les deux expressions :

$$\boxed{R=\frac{mv}{|q|B}}$$

Le rayon est constant : la trajectoire est circulaire et le mouvement est uniforme.

## Grandeurs caractéristiques

Pour un tour complet, $2\pi R=vT$. En remplaçant $R$ :

$$\boxed{T=\frac{2\pi m}{|q|B}}$$

$$\boxed{f=\frac1T=\frac{|q|B}{2\pi m}}$$

$$\boxed{\omega=\frac vR=\frac{|q|B}{m}}$$

La quantité de mouvement vérifie aussi :

$$\boxed{p=mv=|q|BR}$$

La période ne dépend pas de la vitesse dans le modèle non relativiste. Une particule plus rapide décrit un cercle plus grand, mais met le même temps à accomplir un tour.

## Les trois configurations à connaître

| Orientation initiale | Force | Trajectoire |
|---|---|---|
| $\vec v_0\parallel\vec B$ | nulle | droite, MRU |
| $\vec v_0\perp\vec B$ | maximale | cercle, MCU |
| angle quelconque non droit | sur la composante perpendiculaire | hélice uniforme |

> **Correction essentielle du support.** Le module $a=|q|vB/m$ est constant, mais le **vecteur** $\vec a$ ne l'est pas : sa direction tourne avec $\vec v$. On ne peut donc pas intégrer $\vec a$ comme un vecteur constant pour écrire $x=v_0t$ et $y=at^2/2$. Cette étape imprimée est remplacée par le raisonnement rigoureux dans le repère de Frenet.`,
    keyPoint: "Pour v ⟂ B : MCU, R = mv/(|q|B), T = 2πm/(|q|B), f = |q|B/(2πm) et ω = |q|B/m.",
    example: "Un électron de vitesse 2,0×10⁷ m·s⁻¹ dans B=1,0×10⁻² T décrit un cercle de rayon R≈1,14 cm et de période T≈3,57 ns.",
    methodSteps: [
      "Vérifie les hypothèses : champ uniforme, poids négligé et v ⟂ B.",
      "Écris m a = q v × B.",
      "Montre que Fm·v = 0 et donc que v est constante.",
      "Identifie l'accélération normale v²/R à |q|vB/m.",
      "Déduis R, puis T, f, ω ou p selon la grandeur demandée.",
    ],
    interaction: {
      kind: "orbit",
      eyebrow: "Mouvement interactif",
      title: "La force tourne sans accélérer la particule",
      instruction: "Déplace la particule sur l'orbite et observe la tangente et l'accélération centripète.",
      observation: "La vitesse reste tangente au cercle tandis que l'accélération pointe vers son centre ; elles restent perpendiculaires.",
      formula: "R = mv/(|q|B)",
      formulaTex: "R=\\dfrac{mv}{|q|B}",
      radiusLabel: "R = mv/(|q|B)",
      showVelocity: true,
      showAcceleration: true,
      marker: { min: 0, max: 360, step: 10, initial: 35 },
    },
    questions: [
      choice("Pourquoi la valeur de la vitesse reste-t-elle constante ?", ["La force magnétique est perpendiculaire à v et ne travaille pas", "La force est toujours nulle", "La masse disparaît", "Le champ fournit une énergie constante"], 0, "La puissance Fm·v est nulle.", "2.2.1, page 10", 2),
      choice("Dans le cas v ⟂ B, l'accélération est…", ["normale à la trajectoire", "tangentielle uniquement", "nulle", "parallèle à v"], 0, "Elle change la direction de v sans changer son module.", "2.2, pages 10-11"),
      choice("L'expression du rayon est…", ["R = mv/(|q|B)", "R = |q|v/(mB)", "R = mB/(|q|v)", "R = v/(|q|mB)"], 0, "On identifie v²/R et |q|vB/m.", "2.2.2, page 11", 2),
      choice("Si v double à m, q et B constants, R…", ["double", "est divisé par deux", "reste constant", "quadruple"], 0, "R est proportionnel à v.", "2.2.2, page 11"),
      choice("Si B double, R…", ["est divisé par deux", "double", "reste constant", "quadruple"], 0, "R est inversement proportionnel à B.", "2.2.2, page 11"),
      choice("La période cyclotron vaut…", ["2πm/(|q|B)", "2π|q|B/m", "mv/(|q|B)", "|q|B/(2πm)"], 0, "Un tour a une longueur 2πR parcourue à la vitesse v.", "2.2.4, page 11", 2),
      choice("Dans le modèle étudié, la période dépend-elle de v ?", ["Non", "Oui, proportionnellement", "Oui, comme v²", "Seulement pour q>0"], 0, "La vitesse se simplifie dans T=2πR/v.", "Remarque, page 11"),
      choice("La pulsation angulaire vaut…", ["|q|B/m", "m/(|q|B)", "2πm/(|q|B)", "mv"], 0, "ω=v/R et R=mv/(|q|B).", "2.2.4, page 11"),
      choice("Si v₀ ∥ B, la trajectoire est…", ["rectiligne uniforme", "circulaire", "parabolique", "toujours hélicoïdale"], 0, "La force de Lorentz est nulle.", "Remarque, page 11"),
      choice("Si v₀ possède des composantes parallèle et perpendiculaire à B, la trajectoire est…", ["hélicoïdale", "rectiligne accélérée", "parabolique", "immobile"], 0, "La composante parallèle assure l'avancement et la composante perpendiculaire la rotation.", "Remarque, pages 11-12"),
      short("Calcule R pour un électron : m=9,1×10⁻³¹ kg, v=2,0×10⁷ m·s⁻¹, |q|=1,6×10⁻¹⁹ C et B=1,0×10⁻² T.", ["0,011375", "0.011375", "0,0114", "0.0114", "1,14 cm", "1.1375 cm"], "R=mv/(|q|B)=0,011375 m≈1,14 cm.", "Application guidée", 3),
      choice("Quelle phrase corrige le raisonnement imprimé page 10 ?", ["Le module de a est constant mais sa direction varie", "Le vecteur a est constant", "La trajectoire est une parabole", "La vitesse augmente linéairement"], 0, "Dans un cercle, le vecteur normal tourne avec la particule.", "Correction source, page 10", 2),
    ],
    corrections: [
      "Page 9 : le texte écrit que le poids est négligé « devant le poids » ; il faut lire « devant la force magnétique ». Le rapport annoncé de 48 milliards n'est pas vérifiable sans valeur de vitesse, absente de la phrase.",
      "Page 10 : le support traite le vecteur accélération comme un vecteur constant et l'intègre en une trajectoire parabolique. Seul son module est constant ; sa direction varie. La démonstration correcte utilise la puissance nulle puis le repère de Frenet.",
    ],
  },
  {
    id: "charged-particle-cyclotron-energy",
    title: "Piloter l'énergie et le rayon dans un cyclotron",
    summary: "Suivre les passages successifs, établir les lois en racine carrée et résoudre toute l'activité numérique du support.",
    pages: "21-23",
    section: "3.3.3 Effet cyclotron et activité d'application",
    durationMinutes: 32,
    xp: 105,
    body: String.raw`## Énergie gagnée à chaque passage

À chaque traversée de l'intervalle entre les dés, la particule gagne :

$$\Delta E_c=|qU|.$$

Si elle part presque du repos, après le $k$-ième passage dans un dé :

$$\boxed{E_{c,k}=k|qU|}$$

et :

$$\frac12mv_k^2=k|qU|.$$

En notant $v_1=\sqrt{2|qU|/m}$ :

$$\boxed{v_k=v_1\sqrt{k}}$$

Comme $R_k=mv_k/(|q|B)$ :

$$\boxed{R_k=R_1\sqrt{k}}$$

Le nombre de passages permettant d'atteindre un rayon $R_k$ est donc :

$$\boxed{k=\left(\frac{R_k}{R_1}\right)^2}.$$

Un tour comporte deux traversées de l'intervalle. Après $n$ tours complets, on compte $2n$ passages et :

$$E_c=2n|qU|,\qquad v=v_1\sqrt{2n},\qquad R=R_1\sqrt{2n}.$$

## Extraction à la périphérie

Si chaque dé a pour rayon maximal $R_D$, la particule quitte tangentiellement le cyclotron lorsque son orbite atteint cette valeur. Alors :

$$\boxed{v_{\max}=\frac{|q|BR_D}{m}}$$

$$\boxed{E_{c,\max}=\frac{|q|^2B^2R_D^2}{2m}}$$

Cette dernière expression est indépendante de la tension $U$ : à géométrie et champ fixés, $U$ détermine surtout le **nombre de passages** nécessaires pour atteindre l'énergie maximale.

## Activité officielle complète

On donne :

$$B=1{,}0\ \mathrm T,\quad q=3{,}2\times10^{-19}\ \mathrm C,$$

$$m=0{,}33\times10^{-26}\ \mathrm{kg}=3{,}3\times10^{-27}\ \mathrm{kg},\quad U=10^5\ \mathrm V.$$

Première traversée :

$$E_{c,1}=qU=3{,}2\times10^{-14}\ \mathrm J$$

$$v_1=\sqrt{\frac{2qU}{m}}\approx4{,}40\times10^6\ \mathrm{m\,s^{-1}}$$

$$R_1=\frac1B\sqrt{\frac{2mU}{q}}\approx4{,}54\times10^{-2}\ \mathrm m=4{,}54\ \mathrm{cm}.$$

Après la deuxième traversée :

$$v_2=v_1\sqrt2\approx6{,}23\times10^6\ \mathrm{m\,s^{-1}}$$

$$R_2=R_1\sqrt2\approx6{,}42\ \mathrm{cm}.$$

Pour $R_{\max}=40$ cm :

$$E_{c,\max}=\frac{q^2B^2R_{\max}^2}{2m}\approx\boxed{2{,}48\times10^{-12}\ \mathrm J}$$

soit environ $1{,}55\times10^7$ eV $=15{,}5$ MeV pour une particule de charge $2e$.

> **Astuce mémoire.** Énergie $\propto k$, mais vitesse et rayon $\propto\sqrt{k}$.

> **Précision.** Ne confonds pas le nombre de **passages** $k$ et le nombre de **tours** $n$ : $k=2n$.`,
    keyPoint: "Après k passages : Ec,k = k|qU|, vk = v₁√k et Rk = R₁√k ; Ec,max = |q|²B²RD²/(2m).",
    example: "Avec les données officielles, v₁≈4,40×10⁶ m·s⁻¹, R₁≈4,54 cm et, pour RD=40 cm, Ec,max≈2,48×10⁻¹² J.",
    methodSteps: [
      "Décide si l'indice compte les passages ou les tours.",
      "Écris le gain |qU| par traversée de l'intervalle.",
      "Déduis Ec,k, puis vk=v₁√k.",
      "Utilise Rk=R₁√k pour la géométrie des orbites.",
      "À la périphérie, remplace v par |q|BRD/m dans ½mv².",
    ],
    interaction: timeline([
      { label: "1er passage", shortLabel: "Ec=|qU|", detail: "La particule entre dans le premier dé avec v₁ et décrit un demi-cercle de rayon R₁." },
      { label: "2e passage", shortLabel: "Ec=2|qU|", detail: "La nouvelle vitesse est v₁√2 et le nouveau rayon R₁√2." },
      { label: "k-ième passage", shortLabel: "Rk=R₁√k", detail: "La loi en racine carrée transforme le gain linéaire d'énergie en rayons croissants." },
      { label: "n tours", shortLabel: "k=2n", detail: "Deux passages accélérateurs ont lieu par tour complet." },
      { label: "Extraction", shortLabel: "R=RD", detail: "À la périphérie, la particule sort tangentiellement avec l'énergie maximale imposée par B, RD, q et m." },
    ], "Les étapes énergétiques du cyclotron", "Avance du premier passage jusqu'à l'extraction.", "La tension règle la rapidité avec laquelle on atteint la périphérie ; le champ et le rayon maximal fixent l'énergie finale."),
    questions: [
      choice("Quel gain d'énergie cinétique a lieu à chaque traversée de l'intervalle ?", ["|qU|", "2|qU|", "|q|B", "mv"], 0, "Le travail électrique d'une traversée vaut |qU|.", "3.3.1, pages 19-20"),
      choice("Après k passages depuis le repos, l'énergie vaut…", ["k|qU|", "k²|qU|", "√k|qU|", "|qU|/k"], 0, "Chaque passage ajoute le même quantum classique d'énergie.", "3.3.3, page 21"),
      choice("La vitesse au k-ième passage vaut…", ["v₁√k", "kv₁", "v₁/k", "v₁k²"], 0, "L'énergie est proportionnelle à v².", "3.3.3, page 21", 2),
      choice("Le rayon au k-ième passage vaut…", ["R₁√k", "kR₁", "R₁/k", "R₁k²"], 0, "R est proportionnel à v.", "3.3.3, page 21", 2),
      choice("Après n tours complets, combien de passages accélérateurs ont eu lieu ?", ["2n", "n", "n/2", "4n"], 0, "La particule traverse l'intervalle deux fois par tour.", "Précision, page 21"),
      choice("L'énergie maximale géométrique vaut…", ["|q|²B²RD²/(2m)", "m²/(2|q|BRD)", "|q|UBRD", "2mB/|q|"], 0, "On utilise vmax=|q|BRD/m dans ½mvmax².", "3.3.3, page 21", 2),
      short("Calcule Ec,1 avec q=3,2×10⁻¹⁹ C et U=10⁵ V.", ["3,2×10^-14", "3.2×10^-14", "3,2e-14", "3.2e-14", "3,2×10^-14 J"], "Ec,1=qU=3,2×10⁻¹⁴ J.", "Activité II.1, pages 22-23", 2),
      short("Calcule v₁ à trois chiffres significatifs.", ["4,40×10^6", "4.40×10^6", "4,4e6", "4.4e6", "4400000"], "v₁=√(2qU/m)≈4,40×10⁶ m·s⁻¹.", "Activité II.1, pages 22-23", 3),
      short("Calcule R₁ en centimètres au centième près.", ["4,54", "4.54", "4,54 cm", "4.54 cm"], "R₁≈0,04541 m=4,54 cm.", "Activité II.2.b, pages 22-23", 3),
      short("Donne v₂ après la deuxième traversée, à trois chiffres significatifs.", ["6,23×10^6", "6.23×10^6", "6,23e6", "6.23e6", "6230000"], "v₂=v₁√2≈6,23×10⁶ m·s⁻¹.", "Activité II.3.a, page 22", 3),
      short("Donne R₂ en centimètres au centième près.", ["6,42", "6.42", "6,42 cm", "6.42 cm"], "R₂=R₁√2≈6,42 cm.", "Activité II.3.b, page 22", 3),
      short("Pour Rmax=40 cm, calcule Ec,max en joules à trois chiffres significatifs.", ["2,48×10^-12", "2.48×10^-12", "2,48e-12", "2.48e-12", "2,48×10^-12 J"], "Ec,max=q²B²Rmax²/(2m)≈2,48×10⁻¹² J.", "Activité II.4, page 22", 3),
    ],
    corrections: [
      "Pages 21-22 : le symbole n est employé tantôt pour le nombre de passages dans un dé, tantôt dans une formulation évoquant les tours. La progression distingue k passages et n tours, avec k=2n.",
    ],
  },
  {
    id: "charged-particle-wien-filter",
    title: "Sélectionner une vitesse avec le filtre de Wien",
    summary: "Équilibrer force électrique et force magnétique pour ne laisser passer qu'une vitesse déterminée.",
    pages: "23-26",
    section: "3.4 Filtre de Wien et activité sur les isotopes du lithium",
    durationMinutes: 26,
    xp: 115,
    body: String.raw`## Deux champs croisés

Le filtre de Wien contient un champ électrique uniforme $\vec E$ et un champ magnétique uniforme $\vec B$, perpendiculaires entre eux. Les particules entrent avec une vitesse $\vec v$ telle que :

$$\vec v\perp\vec E,\qquad \vec v\perp\vec B,\qquad \vec E\perp\vec B.$$

Elles subissent :

$$\vec F_e=q\vec E$$

et :

$$\vec F_m=q\vec v\times\vec B.$$

Le montage est orienté pour que ces forces soient opposées. La particule n'est pas déviée si :

$$\vec F_e+\vec F_m=\vec0.$$

En valeurs :

$$|q|E=|q|vB.$$

La vitesse sélectionnée est donc :

$$\boxed{v_p=\frac EB}$$

Si le champ électrique provient de deux plaques séparées par une distance $d$ et soumises à une tension $U$ :

$$E=\frac{|U|}{d}$$

donc :

$$\boxed{v_p=\frac{|U|}{Bd}}.$$

La masse et la valeur de la charge se simplifient. Des isotopes différents peuvent donc traverser ensemble s'ils possèdent la même vitesse.

## Que deviennent les autres vitesses ?

Dans l'orientation du support :

- si $v<v_p$, alors $F_m=|q|vB<F_e$ : la déviation suit la force électrique ;
- si $v>v_p$, alors $F_m>F_e$ : la déviation suit la force magnétique ;
- si $v=v_p$, la résultante est nulle : mouvement rectiligne uniforme jusqu'à l'ouverture.

Une particule neutre n'est soumise ni à $q\vec E$ ni à $q\vec v\times\vec B$ ; elle peut traverser si sa trajectoire géométrique vise l'ouverture, mais sa vitesse n'est pas sélectionnée par le dispositif.

## Activité officielle : $^6\mathrm{Li}^+$ et $^7\mathrm{Li}^+$

Le champ électrique est vertical, la vitesse est horizontale et le champ magnétique est perpendiculaire au plan. On donne :

$$B=0{,}20\ \mathrm T,\qquad E=1{,}2\times10^4\ \mathrm{V\,m^{-1}}.$$

La vitesse non déviée vaut :

$$v_0=\frac EB=\frac{1{,}2\times10^4}{0{,}20}$$

$$\boxed{v_0=6{,}0\times10^4\ \mathrm{m\,s^{-1}}}$$

Les deux isotopes passent à cette même vitesse : le filtre ne les sépare pas selon leur masse. Un spectrographe placé après le filtre pourra effectuer cette deuxième étape.

> **Astuce mémoire.** Wien ne demande ni $m$ ni $q$ dans le résultat final : **vitesse = électrique / magnétique**, $v=E/B$.

> **Attention au sens.** La formule $E/B$ donne une valeur. Le sens de $\vec B$ se détermine en imposant $q\vec E+q\vec v\times\vec B=\vec0$.`,
    keyPoint: "Filtre de Wien : forces opposées et égales pour vp = E/B = |U|/(Bd) ; plus lent, Fe domine ; plus rapide, Fm domine.",
    example: "Avec E=1,2×10⁴ V·m⁻¹ et B=0,20 T, seuls les ions de vitesse 6,0×10⁴ m·s⁻¹ ne sont pas déviés.",
    methodSteps: [
      "Dessine v, E et les forces électriques sur la charge considérée.",
      "Choisis B pour que Fm s'oppose à Fe.",
      "Écris |q|E=|q|vB pour le trajet non dévié.",
      "Simplifie |q| et calcule vp=E/B.",
      "Compare ensuite v à vp pour connaître le côté de déviation.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Filtre interactif",
      title: "Le couloir de vitesse de Wien",
      instruction: "Explore les forces et l'ouverture de sortie.",
      observation: "Une seule vitesse équilibre exactement les forces ; les autres particules heurtent l'une des plaques.",
      caption: "Filtre de Wien redessiné d'après les pages 23 à 26.",
      viewBox: "0 0 500 270",
      shapes: [
        { shape: "line", x1: 75, y1: 65, x2: 400, y2: 65, tone: "outline" },
        { shape: "line", x1: 75, y1: 205, x2: 400, y2: 205, tone: "outline" },
        { shape: "text", x: 90, y: 48, content: "+U", anchor: "middle" },
        { shape: "text", x: 90, y: 228, content: "−", anchor: "middle" },
        { shape: "line", x1: 115, y1: 135, x2: 330, y2: 135, tone: "accent" },
        { shape: "path", d: "M330 135 L312 126 L312 144 Z", tone: "fill" },
        { shape: "text", x: 190, y: 120, content: "v = E/B", anchor: "middle" },
        { shape: "line", x1: 235, y1: 110, x2: 235, y2: 76, tone: "accent" },
        { shape: "path", d: "M235 76 L226 94 L244 94 Z", tone: "fill" },
        { shape: "text", x: 250, y: 88, content: "Fm", anchor: "start" },
        { shape: "line", x1: 235, y1: 160, x2: 235, y2: 194, tone: "accent" },
        { shape: "path", d: "M235 194 L226 176 L244 176 Z", tone: "fill" },
        { shape: "text", x: 250, y: 187, content: "Fe", anchor: "start" },
        { shape: "circle", cx: 350, cy: 95, r: 9, tone: "muted" },
        { shape: "line", x1: 344, y1: 89, x2: 356, y2: 101, tone: "muted" },
        { shape: "line", x1: 356, y1: 89, x2: 344, y2: 101, tone: "muted" },
        { shape: "line", x1: 400, y1: 65, x2: 400, y2: 118, tone: "outline" },
        { shape: "line", x1: 400, y1: 152, x2: 400, y2: 205, tone: "outline" },
      ],
      hotspots: [
        { id: "electric", number: 1, label: "Force électrique", detail: "Pour la charge positive représentée, qE est dirigée vers la plaque négative.", x: 235, y: 185 },
        { id: "magnetic", number: 2, label: "Force magnétique", detail: "Le champ est choisi pour que qv×B s'oppose à qE.", x: 235, y: 85 },
        { id: "balance", number: 3, label: "Vitesse sélectionnée", detail: "À v=E/B, les modules sont égaux et la trajectoire reste droite.", x: 290, y: 135 },
        { id: "aperture", number: 4, label: "Ouverture", detail: "Seules les particules non déviées atteignent l'ouverture centrale.", x: 400, y: 135 },
      ],
    },
    questions: [
      choice("Dans un filtre de Wien, les trois vecteurs v, E et B sont…", ["deux à deux perpendiculaires", "tous parallèles", "tous nuls", "coplanaires et de même sens"], 0, "C'est la géométrie des champs croisés.", "3.4, page 23"),
      choice("La force électrique vaut…", ["qE", "qv×B", "mv", "E/B"], 0, "C'est la force exercée par le champ électrique.", "3.4, page 24"),
      choice("La condition de non-déviation est…", ["Fe + Fm = 0", "Fe = Fm dans le même sens", "B = 0", "v = 0"], 0, "Les deux forces doivent être opposées et de même module.", "3.4, page 25", 2),
      choice("La vitesse sélectionnée vaut…", ["E/B", "B/E", "qE/m", "mB/q"], 0, "|q| se simplifie dans |q|E=|q|vB.", "3.4, page 25", 2),
      choice("Cette vitesse dépend-elle de la masse de l'ion ?", ["Non", "Oui, comme √m", "Oui, comme 1/m", "Seulement pour les isotopes"], 0, "La masse n'apparaît pas dans E/B.", "Limites, page 25"),
      choice("Si v < E/B dans l'orientation du support, quelle force domine ?", ["La force électrique", "La force magnétique", "Le poids", "Aucune"], 0, "|q|vB<|q|E.", "Remarque, page 25"),
      choice("Si v > E/B, quelle force domine ?", ["La force magnétique", "La force électrique", "Le poids", "La réaction"], 0, "|q|vB>|q|E.", "Remarque, page 25"),
      short("Calcule la vitesse sélectionnée pour E=1,2×10⁴ V·m⁻¹ et B=0,20 T.", ["6×10^4", "6,0×10^4", "6.0×10^4", "60000", "60000 m/s"], "v=E/B=1,2×10⁴/0,20=6,0×10⁴ m·s⁻¹.", "Activité, question 3, page 26", 3),
      choice("Les ions ⁶Li⁺ et ⁷Li⁺ de même vitesse sélectionnée…", ["traversent tous deux le filtre", "sont séparés par leur masse dans le filtre", "sont tous deux immobiles", "perdent leur charge"], 0, "La condition v=E/B est indépendante de m.", "Activité, page 26", 2),
      choice("Pourquoi le dispositif est-il appelé filtre de vitesse ?", ["Il écarte les vitesses différentes de E/B", "Il mesure directement toutes les masses", "Il change les charges", "Il annule toute vitesse"], 0, "L'ouverture ne laisse passer sans déviation que la vitesse choisie.", "Activité, question 4, page 26", 2),
    ],
    corrections: [
      "Page 25 : l'affirmation sur les particules neutres est valable dans le modèle où les autres forces sont négligées et seulement si leur trajectoire vise géométriquement l'ouverture ; elles ne sont pas sélectionnées en vitesse.",
    ],
  },
  {
    id: "charged-particle-instruments-mission",
    title: "Mission finale : sélectionner puis séparer des ions",
    summary: "Combiner le filtre de Wien et l'analyseur magnétique pour transformer une vitesse choisie en séparation isotopique mesurable.",
    pages: "15-26",
    section: "Synthèse des applications — spectrographe, cyclotron et filtre de Wien",
    durationMinutes: 34,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Mission — concevoir une chaîne d'analyse

Un laboratoire reçoit un faisceau contenant les ions $^6\mathrm{Li}^+$ et $^7\mathrm{Li}^+$ avec des vitesses dispersées. Il veut d'abord ne conserver qu'une vitesse, puis séparer les deux isotopes.

La chaîne comporte :

1. un **filtre de Wien** avec $E=1{,}2\times10^4$ V·m$^{-1}$ et $B_f=0{,}20$ T ;
2. un **analyseur magnétique** avec $B_a=0{,}20$ T, où les ions décrivent des demi-cercles ;
3. un détecteur placé sur la ligne des diamètres.

On donne $q=e=1{,}6\times10^{-19}$ C et $1\,\mathrm u=1{,}67\times10^{-27}$ kg.

## Étape 1 — choisir la vitesse

Dans le filtre, les forces électrique et magnétique sont opposées. La condition de passage est :

$$v_p=\frac E{B_f}=\frac{1{,}2\times10^4}{0{,}20}=\boxed{6{,}0\times10^4\ \mathrm{m\,s^{-1}}}.$$

Les deux isotopes peuvent passer : à ce stade, la masse ne joue aucun rôle.

## Étape 2 — transformer la masse en rayon

Après le filtre, les deux isotopes ont la même vitesse $v_p$. Dans l'analyseur :

$$R=\frac{mv_p}{eB_a}.$$

Pour le lithium 6 :

$$m_6=6\times1{,}67\times10^{-27}=1{,}002\times10^{-26}\ \mathrm{kg}$$

$$R_6=\frac{1{,}002\times10^{-26}\times6{,}0\times10^4}{1{,}6\times10^{-19}\times0{,}20}$$

$$\boxed{R_6\approx1{,}879\times10^{-2}\ \mathrm m=1{,}879\ \mathrm{cm}}$$

Pour le lithium 7 :

$$m_7=1{,}169\times10^{-26}\ \mathrm{kg}$$

$$\boxed{R_7\approx2{,}192\times10^{-2}\ \mathrm m=2{,}192\ \mathrm{cm}}$$

Le lithium 7, plus massif, suit le plus grand demi-cercle.

## Étape 3 — prévoir la séparation

Chaque demi-cercle conduit à un déplacement égal à son diamètre. La distance entre les impacts est :

$$d=2(R_7-R_6)$$

$$d\approx2(2{,}192-1{,}879)\ \mathrm{cm}$$

$$\boxed{d\approx0{,}626\ \mathrm{cm}=6{,}26\ \mathrm{mm}}$$

Un détecteur dont la résolution spatiale est meilleure que $6$ mm distinguera donc les deux pics.

## Quel instrument pour quel objectif ?

| Instrument | Grandeur exploitée | Effet principal |
|---|---|---|
| déflexion sur écran | $q/m$ | mesure une charge massique |
| spectrographe | $m/q$ après accélération | sépare des isotopes |
| cyclotron | synchronisation et rayon croissant | produit un faisceau énergétique |
| filtre de Wien | $v=E/B$ | sélectionne une vitesse |

> **Stratégie gagnante.** Wien homogénéise la vitesse, puis l'analyseur transforme directement $m/q$ en rayon. Sans le filtre, une différence de rayon pourrait venir de la masse **ou** de la vitesse.

> **Bilan.** À aucun moment le champ magnétique ne fournit l'énergie : il rend les différences observables en courbant les trajectoires.`,
    keyPoint: "Chaîne Wien + analyseur : vp=E/Bf, Ri=mivp/(eBa), puis d=2|R₂−R₁| ; ici d≈6,26 mm.",
    example: "Le filtre impose 6,0×10⁴ m·s⁻¹ ; l'analyseur donne R₆≈1,879 cm, R₇≈2,192 cm et une séparation d'environ 6,26 mm.",
    methodSteps: [
      "Calcule d'abord la vitesse commune imposée par le filtre de Wien.",
      "Convertis chaque masse isotopique de u vers kg.",
      "Calcule chaque rayon avec la même vitesse et le même champ analyseur.",
      "Classe les rayons et double leur différence pour les demi-cercles.",
      "Compare la séparation à la résolution du détecteur et conclus.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Chaîne expérimentale",
      title: "De la source aux deux impacts",
      instruction: "Sélectionne chaque module pour comprendre sa responsabilité.",
      observation: "La chaîne sépare volontairement les rôles : sélectionner v, courber selon m/q, puis mesurer les impacts.",
      rootLabel: "Faisceau de ⁶Li⁺ et ⁷Li⁺",
      rootDetail: "Les ions ont la même charge, des masses différentes et, avant filtrage, des vitesses dispersées.",
      nodes: [
        { id: "wien", group: "Préparation", label: "Filtre de Wien", role: "Sélectionne v=E/B", detail: "Seuls les ions de vitesse 6,0×10⁴ m·s⁻¹ poursuivent en ligne droite." },
        { id: "analyzer", group: "Analyse", label: "Champ analyseur", role: "Convertit m/q en rayon", detail: "À vitesse identique, R=mv/(qB) est plus grand pour l'isotope le plus lourd." },
        { id: "lithium-six", group: "Trajectoires", label: "Lithium 6", role: "R₆≈1,879 cm", detail: "Sa masse plus faible produit le demi-cercle intérieur." },
        { id: "lithium-seven", group: "Trajectoires", label: "Lithium 7", role: "R₇≈2,192 cm", detail: "Sa masse plus forte produit le demi-cercle extérieur." },
        { id: "detector", group: "Mesure", label: "Détecteur", role: "Sépare 6,26 mm", detail: "La différence des diamètres vaut 2(R₇−R₆)." },
      ],
    },
    questions: [
      choice("Quel dispositif doit être placé en premier pour imposer une vitesse commune ?", ["Le filtre de Wien", "Le détecteur", "Le cyclotron seul", "Une balance"], 0, "Le filtre sélectionne v=E/B.", "Mission de synthèse", 2),
      short("Calcule la vitesse sélectionnée avec E=1,2×10⁴ V·m⁻¹ et Bf=0,20 T.", ["60000", "6×10^4", "6,0×10^4", "60000 m/s"], "vp=E/Bf=6,0×10⁴ m·s⁻¹.", "Mission, étape 1", 2),
      choice("Pourquoi les deux isotopes passent-ils le filtre à la même vitesse ?", ["La condition E/B ne dépend pas de la masse", "Ils ont la même masse", "Le champ magnétique est nul", "Leur charge disparaît"], 0, "La charge et la masse ne figurent pas dans vp.", "Mission, étape 1", 2),
      short("Convertis la masse de ⁶Li en kilogrammes.", ["1,002×10^-26", "1.002×10^-26", "1,002e-26", "1.002e-26", "1,002×10^-26 kg"], "m₆=6×1,67×10⁻²⁷=1,002×10⁻²⁶ kg.", "Mission, étape 2", 2),
      short("Convertis la masse de ⁷Li en kilogrammes.", ["1,169×10^-26", "1.169×10^-26", "1,169e-26", "1.169e-26", "1,169×10^-26 kg"], "m₇=7×1,67×10⁻²⁷=1,169×10⁻²⁶ kg.", "Mission, étape 2", 2),
      choice("Après Wien, quel rayon faut-il utiliser ?", ["R=mv/(|q|B)", "R=(1/B)√(2mU/|q|) nécessairement", "R=E/B", "R=2πm/(|q|B)"], 0, "La vitesse est déjà connue et commune ; la forme directe est la plus adaptée.", "Mission, étape 2", 2),
      short("Calcule R₆ en centimètres au millième près.", ["1,879", "1.879", "1,879 cm", "1.879 cm", "1,88", "1.88"], "R₆≈0,0187875 m=1,87875 cm.", "Mission, étape 2", 3),
      short("Calcule R₇ en centimètres au millième près.", ["2,192", "2.192", "2,192 cm", "2.192 cm", "2,19", "2.19"], "R₇≈0,02191875 m=2,191875 cm.", "Mission, étape 2", 3),
      choice("Quel isotope décrit le plus grand rayon ?", ["⁷Li⁺", "⁶Li⁺", "les deux ont le même rayon", "aucun"], 0, "À v et q égaux, R est proportionnel à m.", "Mission, étape 2"),
      choice("Pourquoi la séparation des impacts vaut-elle deux fois la différence des rayons ?", ["Chaque trajectoire est un demi-cercle et l'impact est déplacé d'un diamètre", "La vitesse double", "La charge double", "Le champ effectue un travail"], 0, "Le diamètre d'une orbite vaut 2R.", "Mission, étape 3", 2),
      short("Calcule la séparation d en millimètres au centième près.", ["6,26", "6.26", "6,26 mm", "6.26 mm", "6,263", "6.263"], "d=2(R₇−R₆)=0,0062625 m≈6,26 mm.", "Mission, étape 3", 3),
      choice("Pourquoi le filtre améliore-t-il l'interprétation de l'analyseur ?", ["Une différence de rayon traduit alors la masse, pas une vitesse inconnue", "Il augmente toutes les masses", "Il annule le champ analyseur", "Il rend les ions neutres"], 0, "Les ions arrivent avec la même vitesse connue.", "Bilan de mission", 3),
    ],
    corrections: [
      "Mission de synthèse : les données du filtre de Wien des pages 23 à 26 sont prolongées par un analyseur magnétique explicite afin de relier sans ambiguïté les deux applications du support. Les schémas et calculs sont originaux.",
    ],
  },
];

const levelOrder = [
  "charged-particle-lorentz-force",
  "charged-particle-lorentz-orientation",
  "charged-particle-circular-motion",
  "charged-particle-magnetic-deflection",
  "charged-particle-mass-spectrograph",
  "charged-particle-cyclotron-principle",
  "charged-particle-cyclotron-energy",
  "charged-particle-wien-filter",
  "charged-particle-instruments-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error(`Niveau de particule chargée introuvable : ${id}`);
  return officialLevel(index, level);
});

export const chargedParticlePath: LearningPath = {
  id: "terminale-cd-charged-particle-magnetic-field",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Leçon 07 en Terminale C • Leçon 06 en Terminale D • Physique",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 7,
  chapterNumberByLevel: { "terminale-c": 7, "terminale-d": 6 },
  title: "Mouvement d’une particule chargée dans un champ magnétique uniforme",
  description: "Construire la force de Lorentz, démontrer le mouvement circulaire uniforme puis maîtriser la déflexion, le spectrographe, le cyclotron et le filtre de Wien.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Écrire, calculer et orienter la force de Lorentz.",
    "Démontrer le mouvement circulaire uniforme d'une charge lorsque v est perpendiculaire à B.",
    "Calculer le rayon, la période, la fréquence, la pulsation et la quantité de mouvement.",
    "Établir et exploiter l'expression de la déflexion magnétique.",
    "Expliquer et calculer la séparation isotopique dans un spectrographe de masse.",
    "Analyser la synchronisation, l'énergie et le rayon dans un cyclotron.",
    "Sélectionner une vitesse dans un filtre de Wien et combiner les instruments.",
  ],
  modules: [{
    id: "charged-particle-magnetic-field-mastery",
    title: "Maîtriser le mouvement d'une particule chargée",
    description: "De la règle de la main droite à une chaîne complète de sélection et de séparation isotopique.",
    lessons: builtLevels,
  }],
};

export const chargedParticlePaths: LearningPath[] = [chargedParticlePath];
