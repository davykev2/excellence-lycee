import { exercise, short, written } from "./builders";
const r = String.raw;

export const limitsDeepening = [
  exercise(55, "Étudier une branche de racine carrée", r`Soit $f(x)=\sqrt{x-3}$, définie sur $[3;+\infty[$, et $(C)$ sa courbe dans un repère $(O,I,J)$.`, [
    short("1.a)", r`Calcule $\displaystyle\lim_{x\to+\infty}f(x)$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Lorsque $x\to+\infty$, $x-3\to+\infty$. Par composition avec la racine carrée, **$f(x)\to+\infty$**.`),
    short("1.b)", r`Calcule $\displaystyle\lim_{x\to+\infty}\frac{f(x)}x$.`, "$0$", ["0"], r`Pour $x>3$, $\frac{\sqrt{x-3}}x=\frac{\sqrt{1-3/x}}{\sqrt x}$. Le numérateur tend vers $1$ et le dénominateur vers $+\infty$, donc **la limite vaut $0$**.`),
    written("2)", "Donne une interprétation graphique de ces résultats.", r`On a $f(x)\to+\infty$ et $f(x)/x\to0$ en $+\infty$. **La courbe $(C)$ possède donc une branche parabolique de direction $(OI)$.** Elle ne possède pas d’asymptote horizontale en $+\infty$, puisque sa hauteur n’a pas de limite finie. Il n’est pas nécessaire de tracer la courbe pour établir cette conclusion. Le mot « direction » ne signifie pas que la courbe se confond avec une droite.`),
  ]),
  exercise(56, "Comparer croissance quadratique et direction", r`Soit $f(x)=\sqrt{x^2+1}+x^2$, définie sur $\mathbb R$, et $(C)$ sa courbe dans un repère $(O,I,J)$.`, [
    short("1.a)", r`Calcule $\displaystyle\lim_{x\to+\infty}f(x)$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour tout $x$, $f(x)\ge x^2$. Comme $x^2\to+\infty$, **le théorème de comparaison donne $f(x)\to+\infty$**.`),
    short("1.b)", r`Calcule $\displaystyle\lim_{x\to+\infty}\frac{f(x)}x$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour $x>0$, $\frac{f(x)}x=\sqrt{1+1/x^2}+x$. Le premier terme tend vers $1$ et le second vers $+\infty$. **Le quotient tend vers $+\infty$.**`),
    written("2)", "Donne une interprétation graphique de ces résultats.", r`En $+\infty$, $f(x)\to+\infty$ et $f(x)/x\to+\infty$. **La courbe possède une branche parabolique de direction $(OJ)$.** Une asymptote oblique de pente finie ne peut pas correspondre à cette branche, car une telle asymptote imposerait une limite finie du quotient $f(x)/x$.`),
  ]),
  exercise(57, "Bijection, unicité et encadrement décimal", r`On considère $f:[-5;5]\to[-517;3]$ définie par $f(x)=(x-3)^3-5$.`, [
    written("1)", r`Démontre que $f$ est une bijection de $[-5;5]$ vers un intervalle à déterminer.`, r`La fonction $x\mapsto x-3$, la puissance troisième et la soustraction de $5$ sont continues et strictement croissantes. Leur composée $f$ l’est donc sur $[-5;5]$. Aux bornes, $f(-5)=(-8)^3-5=-517$ et $f(5)=2^3-5=3$. Le théorème de bijection donne **$f([-5;5])=[-517;3]$**, et $f$ est bijective entre ces deux segments.

On peut aussi calculer $f'(x)=3(x-3)^2\ge0$, mais le simple signe large ne doit pas remplacer une justification de la croissance stricte ; ici la croissance stricte du cube est immédiate.`),
    written("2.a)", r`Démontre que $f(x)=0$ admet une unique solution $\alpha$ dans $[-5;5]$.`, r`Le nombre $0$ appartient à $[-517;3]$. Comme $f$ est bijective, il possède exactement un antécédent $\alpha\in[-5;5]$. En résolvant $(\alpha-3)^3=5$, on obtient **$\alpha=3+\sqrt[3]5$**. L’unicité est déjà assurée par la bijection, indépendamment du calcul explicite.`),
    written("2.b)", r`Justifie que $4{,}7<\alpha<4{,}71$.`, r`Calculons sans arrondir les signes :
$$f(4{,}7)=1{,}7^3-5=4{,}913-5=-0{,}087<0,$$
$$f(4{,}71)=1{,}71^3-5=5{,}000211-5=0{,}000211>0.$$
Comme $f$ est continue et strictement croissante, son unique zéro est entre les deux abscisses. **$4{,}7<\alpha<4{,}71$.**`),
    written("3)", r`Démontre que $f(x)=-1$ admet une unique solution dans $[-5;5]$.`, r`Le réel $-1$ appartient à $[-517;3]$. La bijection donne exactement un antécédent. L’équation $(x-3)^3-5=-1$ équivaut à $(x-3)^3=4$, donc la solution est **$x=3+\sqrt[3]4\in[-5;5]$**. Il ne faut pas confondre ce nouvel antécédent avec le zéro $\alpha$.`),
  ]),
  exercise(58, "Montrer une asymptote par différence", r`Soit $f(x)=\frac{2x^3-3x^2+2x+5}{x^2+5}$ et $(C)$ sa courbe dans un repère $(O,I,J)$.`, [
    written("Démonstration", r`Démontre que la droite $y=2x-3$ est une asymptote à $(C)$.`, r`Le dénominateur $x^2+5$ est strictement positif. Calculons la différence avec l’équation de la droite :
$$f(x)-(2x-3)
=\frac{2x^3-3x^2+2x+5-(2x-3)(x^2+5)}{x^2+5}
=\frac{-8x+20}{x^2+5}.$$
En divisant par $x^2$,
$$\frac{-8x+20}{x^2+5}
=\frac{-8/x+20/x^2}{1+5/x^2}\longrightarrow0$$
en $-\infty$ comme en $+\infty$. **La droite $y=2x-3$ est donc une asymptote oblique aux deux infinis.** La seule limite de $f(x)/x$ ne suffirait pas à prouver que l’ordonnée à l’origine est $-3$.`),
  ]),
  exercise(59, "Lire des asymptotes sur un graphique", r`Dans un repère orthonormé $(O,I,J)$, la courbe $(C)$ d’une fonction $f$ est représentée ci-dessous, ainsi que les droites :
$$(D_1):x=1,\qquad(D_2):x=-1,\qquad(D_3):y=x+2.$$
La fonction est étudiée sur $\mathbb R\setminus\{-1;1\}$.`, [
    written("1 · D₁", r`En utilisant le graphique, traduis en termes de limites le fait que $(D_1)$ est asymptote à $(C)$.`, r`Au voisinage de $x=1$, la branche située à gauche monte sans borne et celle située à droite descend sans borne. On lit :
$$\boxed{\lim_{x\to1^-}f(x)=+\infty,\qquad\lim_{x\to1^+}f(x)=-\infty.}$$
Les signes sont lus sur les branches ; l’équation de l’asymptote seule ne les détermine pas.`),
    written("1 · D₂", r`Traduis de même le fait que $(D_2)$ est asymptote à $(C)$.`, r`À gauche de $-1$, la courbe descend sans borne ; à droite de $-1$, elle monte sans borne. Donc :
$$\boxed{\lim_{x\to-1^-}f(x)=-\infty,\qquad\lim_{x\to-1^+}f(x)=+\infty.}$$`),
    written("1 · D₃", r`Traduis de même le fait que $(D_3)$ est asymptote à $(C)$.`, r`La distance verticale entre la courbe et la droite $y=x+2$ tend vers zéro aux deux infinis. Cela signifie :
$$\boxed{\lim_{x\to-\infty}[f(x)-(x+2)]=0,\qquad\lim_{x\to+\infty}[f(x)-(x+2)]=0.}$$
Il ne faut pas écrire $f(x)\to x+2$ : une limite est une valeur réelle ou infinie, pas une expression variable de $x$.`),
    written("2)", r`Étudie graphiquement le signe de $f(x)-(x+2)$ sur $[-3;3]$.`, r`On compare la position verticale de $(C)$ à celle de $(D_3)$ :

- sur $[-3;-1[$, $(C)$ est en dessous de $(D_3)$, donc $f(x)-(x+2)<0$ ;
- sur $]-1;1[$, $(C)$ est au-dessus, donc $f(x)-(x+2)>0$ ;
- sur $]1;3]$, $(C)$ est en dessous, donc $f(x)-(x+2)<0$.

En $x=-1$ et $x=1$, $f$ n’est pas définie. **Ces points doivent rester exclus du tableau de signes.** Sur les branches dessinées, il n’y a pas d’intersection avec $(D_3)$.`),
  ], { figureKey: "tc-l1-asymptotes" }),
  exercise(60, "Étude complète d’une fonction homographique", r`Dans un repère orthonormé $(O,I,J)$, soit $f:]-5;+\infty[\to\mathbb R$ définie par $f(x)=\frac{2x-3}{x+5}$.`, [
    written("1)", r`Étudie les variations de $f$.`, r`Le dénominateur est non nul sur $]-5;+\infty[$. La dérivée du quotient vaut
$$f'(x)=\frac{2(x+5)-(2x-3)}{(x+5)^2}=\frac{13}{(x+5)^2}>0.$$
Ainsi **$f$ est strictement croissante** sur tout son intervalle de définition. De plus, $f(x)=2-\frac{13}{x+5}$ tend vers $-\infty$ en $-5^+$ et vers $2$ en $+\infty$. Son tableau comporte donc une seule flèche croissante de $-\infty$ à $2$, valeur non atteinte.`),
    written("2)", r`Démontre que $f$ réalise une bijection de $]-5;+\infty[$ sur un intervalle $K$ à déterminer.`, r`La fonction est continue et strictement croissante. Ses limites aux extrémités sont $-\infty$ et $2$. Elle réalise donc une bijection sur son image **$K=]-\infty;2[$**. La valeur $2$ est exclue car $f(x)=2-\frac{13}{x+5}<2$ pour chaque $x>-5$.`),
    written("3)", r`Détermine l’expression de la bijection réciproque $f^{-1}$.`, r`Pour $y<2$, résolvons $y=\frac{2x-3}{x+5}$ :
$$yx+5y=2x-3\Longleftrightarrow x(y-2)=-3-5y
\Longleftrightarrow x=\frac{5y+3}{2-y}.$$
Ainsi **$f^{-1}(y)=\frac{5y+3}{2-y}$ pour $y\in]-\infty;2[$**. On vérifie que $f^{-1}(y)+5=\frac{13}{2-y}>0$, donc les valeurs obtenues appartiennent bien à $]-5;+\infty[$.`),
    written("4)", r`Justifie que $x=-5$ est une asymptote verticale à la courbe de $f$.`, r`Lorsque $x\to-5^+$, $x+5\to0^+$ ; la forme $2-\frac{13}{x+5}$ donne $f(x)\to-\infty$. **La droite $x=-5$ est asymptote verticale**. Le domaine impose ici une approche uniquement par la droite. Il n’est pas nécessaire d’inventer une limite à gauche hors du domaine étudié.`),
    written("5)", r`Justifie que $y=2$ est une asymptote horizontale à la courbe de $f$.`, r`Quand $x\to+\infty$, $f(x)-2=-\frac{13}{x+5}\to0$. Par définition, **la droite $y=2$ est asymptote horizontale en $+\infty$**. La différence est négative, donc la courbe reste en dessous de cette asymptote sur tout son domaine. Cette précision de position est cohérente avec l’image $]-\infty;2[$.`),
  ]),
];

export const limitsComplex = [
  exercise(61, "Refroidissement : vérifier deux hypothèses", r`Lors d’une expérience, des élèves de Terminale étudient le refroidissement d’un objet chaud.

On note $f(t)$ sa température à l’instant $t$, en minutes, et l’on utilise, pour $t>0$, le modèle
$$f(t)=\frac{210}{t}+10.$$
Les élèves contrôlent la température chaque minute. Le premier contrôle, à $t=1$, a lieu le jeudi 08 avril 2021 à **08 h**.

Abou pense que la température passera en dessous de $11\,^\circ\mathrm C$ avant le vendredi 09 avril 2021 à 08 h. Konan pense qu’elle atteindra $10\,^\circ\mathrm C$ au bout d’une très longue période.

À l’aide d’une argumentation mathématique, donne ton avis sur chacune des deux hypothèses.`, [
    written("Argumentation", "Rédige une réponse complète aux deux élèves, avec les calculs et leur interprétation.", r`### Hypothèse d’Abou

Pour $t>0$,
$$f(t)<11\Longleftrightarrow\frac{210}{t}+10<11
\Longleftrightarrow\frac{210}{t}<1
\Longleftrightarrow t>210.$$
À $t=210$, la température vaut exactement $11\,^\circ\mathrm C$. Le premier contrôle entier en dessous de ce seuil a lieu à **$t=211$**. Comme le contrôle $t=1$ a lieu à 08 h, cela fait $211-1=210$ minutes, soit $3$ h $30$ plus tard : **jeudi à 11 h 30**. C’est bien avant vendredi à 08 h. **L’hypothèse d’Abou est donc correcte.**

### Hypothèse de Konan

Pour chaque instant fini $t>0$, $\frac{210}{t}>0$, donc **$f(t)>10$**. L’égalité $f(t)=10$ exigerait $210/t=0$, ce qui est impossible.

En revanche, $\lim_{t\to+\infty}f(t)=10$. **La température s’approche aussi près que l’on veut de $10\,^\circ\mathrm C$ selon le modèle, mais ne l’atteint à aucun instant fini. L’hypothèse de Konan, formulée comme une valeur atteinte, est fausse.**

Une limite à l’infini ne correspond pas à un « dernier instant ». Les conclusions portent sur le modèle fourni, sans extrapolation physique supplémentaire.`),
  ], { reviewCriteria: ["J’obtiens t > 210, sans remplacer l’inégalité stricte par t ≥ 210.", "Je distingue l’indice du contrôle et le temps écoulé depuis 08 h.", "Je distingue atteindre 10 °C et tendre vers 10 °C.", "Je réponds séparément à Abou et à Konan."] }),
  exercise(62, "Une pièce circulaire et deux aires égales", r`Une entreprise fabrique des pièces métalliques circulaires. Une commande impose les caractéristiques suivantes :

1. Le cercle a pour centre $O$ et pour rayon $OE=OF=1$.
2. $\operatorname{Mes}(\overrightarrow{OE},\overrightarrow{OF})=\alpha$, avec $\alpha\in]0;\pi[$.
3. L’aire du triangle $OEF$ doit être égale à celle de la région comprise entre la corde $[EF]$ et l’arc mineur $\widehat{EF}$.

Le point $E$ est déjà placé. L’entrepreneur cherche l’angle $\alpha$ qui permet de placer $F$.

À l’aide d’une production argumentée, détermine une valeur approchée en degrés de $\alpha$.`, [
    written("Production argumentée", "Modélise l’égalité des aires, justifie le choix de la solution et donne l’angle en degrés.", r`### 1. Exprimer les deux aires

Les deux côtés $OE$ et $OF$ valent $1$. Pour $0<\alpha<\pi$, l’aire du triangle est
$$A_{\triangle}=\frac12\,OE\times OF\times\sin\alpha=\frac{\sin\alpha}{2}.$$
L’angle est exprimé en **radians**. L’aire du secteur circulaire vaut $A_{\text{secteur}}=\frac{\alpha}{2}$. L’aire entre la corde et l’arc est donc
$$A_{\text{segment}}=\frac{\alpha-\sin\alpha}{2}.$$

### 2. Traduire l’égalité

$$A_{\triangle}=A_{\text{segment}}
\Longleftrightarrow\sin\alpha=\alpha-\sin\alpha
\Longleftrightarrow 2\sin\alpha-\alpha=0.$$
La valeur $0$ annule l’expression, mais **elle est exclue par $\alpha\in]0;\pi[$**.

### 3. Justifier l’unique solution admissible

Posons $H(x)=2\sin x-x$, continue sur $[0;\pi]$. Sa dérivée est $H'(x)=2\cos x-1$. Elle est positive sur $]0;\pi/3[$, nulle en $\pi/3$, puis négative sur $]\pi/3;\pi[$.

Ainsi $H$ croît depuis $H(0)=0$ jusqu’à $H(\pi/3)=\sqrt3-\pi/3>0$, puis décroît strictement vers $H(\pi)=-\pi<0$. Par le TVI et la stricte décroissance, **elle possède exactement une racine dans $]\pi/3;\pi[$**, et aucune autre dans $]0;\pi[$.

### 4. Approcher et convertir

Par dichotomie, $H(1{,}8954)>0$ et $H(1{,}8955)<0$. On obtient
$$\alpha\simeq1{,}895494267\text{ rad},\qquad
\alpha_{\text{degrés}}=\alpha\frac{180}{\pi}\simeq108{,}60^\circ.$$
**L’entrepreneur peut placer $F$ à environ $108{,}6^\circ$ de $OE$ dans le sens indiqué.** À cet angle, les deux aires valent environ $0{,}474$ unité d’aire. Il ne faut pas utiliser la formule du secteur avec un angle directement en degrés.`),
  ], { figureKey: "tc-l1-circle", reviewCriteria: ["J’exprime l’aire du triangle et celle du secteur avec α en radians.", "Je trouve 2 sin α = α et j’exclus α = 0.", "Je justifie l’existence et l’unicité de la solution dans ]0 ; π[.", "Je convertis en degrés et je conclus pour l’entrepreneur."] }),
];
