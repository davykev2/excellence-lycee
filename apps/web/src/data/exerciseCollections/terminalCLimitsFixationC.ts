import { choice, exercise, short, tf, written } from "./builders";
const r = String.raw;
const tviWords = ["réel compris", "Tout", "continue", "contenant", "antécédent", "intervalle", "au moins"];

export const limitsFixationC = [
  exercise(33, "Continuité d’une composée", r`Soient $f(x)=\sqrt{x^2+3}$ et $g(x)=-2x^2-3x+5$, définies sur $\mathbb R$.`, [
    written("Justification", r`Justifie que $g\circ f$ est continue sur $\mathbb R$.`, r`Pour tout $x\in\mathbb R$, $x^2+3\ge3>0$. Le polynôme $x\mapsto x^2+3$ et la racine carrée sont continus sur les domaines concernés : **$f$ est continue sur $\mathbb R$**. La fonction $g$ est polynomiale, donc continue sur $\mathbb R$, qui contient $f(\mathbb R)$. Par composition, **$g\circ f$ est continue sur $\mathbb R$**. Il n’est pas nécessaire de développer son expression. Le domaine de la fonction extérieure doit bien contenir les valeurs de la fonction intérieure.`),
  ]),
  exercise(34, "Vérifier le domaine avant de composer", r`On donne $g(x)=\sqrt{2x-3}$.`, [
    written("Justification", r`Justifie que $g$ est continue sur $]3/2;+\infty[$.`, r`La fonction affine $u(x)=2x-3$ est continue. Sur $]3/2;+\infty[$, $u(x)>0$ ; son image appartient donc au domaine où la racine carrée est continue. **La composée $g=\sqrt{\phantom{x}}\circ u$ est continue sur cet intervalle.** Elle est aussi continue à droite en $3/2$ dans son domaine $[3/2;+\infty[$.`),
  ]),
  exercise(35, "Reconstituer le théorème des valeurs intermédiaires", r`Complète le texte avec les mots ou groupes de mots :
**réel compris ; Tout ; continue ; contenant ; antécédent ; intervalle ; au moins.**

Soit $f$ une fonction **[1]** sur un **[2]** $I$, **[3]** $a$ et $b$. **[4]** nombre **[5]** entre $f(a)$ et $f(b)$ a **[6]** un **[7]** par $f$ compris entre $a$ et $b$.`, [
    ...[2, 5, 3, 1, 0, 6, 4].map((index, position) => choice(
      `[${position + 1}]`, `Choisis le groupe de mots pour l’emplacement [${position + 1}].`, tviWords, index,
      r`Le texte complet est : **Soit $f$ une fonction continue sur un intervalle $I$, contenant $a$ et $b$. Tout nombre réel compris entre $f(a)$ et $f(b)$ a au moins un antécédent par $f$ compris entre $a$ et $b$.** La continuité assure l’existence, pas nécessairement l’unicité.`, "select",
    )),
  ]),
  exercise(36, "Utiliser correctement le TVI", "Réponds Vrai ou Faux à chaque affirmation.", [
    tf("1)", r`Toute fonction polynôme du second degré admet au moins un zéro dans $\mathbb R$.`, false, r`La fonction $x\mapsto x^2+1$ est un contre-exemple : elle est strictement positive sur $\mathbb R$. La continuité seule ne garantit pas l’existence d’un zéro. **Faux.**`),
    tf("2)", r`L’équation $\frac{x^3-5x+3}{x^2+1}=0$ admet au moins une solution dans $[0;1]$.`, true, r`Le dénominateur $x^2+1$ ne s’annule pas : le quotient est continu sur $[0;1]$. Sa valeur en $0$ est $3>0$ et sa valeur en $1$ est $-\frac12<0$. Par le TVI, **il existe une solution dans $]0;1[$ : vrai**.`),
    tf("3)", r`L’équation $\sqrt{2x^2+x+3}=2{,}1$ admet au moins une solution dans $[-2;-1]$.`, true, r`On a $2x^2+x+3=2(x+\frac14)^2+\frac{23}8>0$, donc la fonction est continue. Aux bornes, ses valeurs sont $3$ et $2$. Puisque $2<2{,}1<3$, **le TVI assure une solution dans $]-2;-1[$ : vrai**.`),
  ]),
  exercise(37, "Prouver l’existence d’une solution", r`On considère l’équation $(E):x^5-3x+1=0$.`, [
    written("Justification", "Justifie qu’elle admet au moins une solution comprise entre 0 et 1.", r`Posons $P(x)=x^5-3x+1$. C’est un polynôme, donc une fonction continue sur $[0;1]$. On calcule $P(0)=1>0$ et $P(1)=-1<0$. Par le théorème des valeurs intermédiaires, **il existe $\alpha\in]0;1[$ tel que $P(\alpha)=0$**. On a prouvé l’existence ; on n’a pas eu besoin de résoudre l’équation ni d’affirmer l’unicité. « Au moins une » ne signifie pas « exactement une ».`),
  ]),
  exercise(38, "Encadrer un zéro d’un polynôme", r`Soit $f(x)=x^3-3x-1$, définie sur $\mathbb R$.`, [
    written("Justification", r`Justifie que l’équation $f(x)=0$ admet au moins une solution dans $[1;2]$.`, r`La fonction $f$ est polynomiale, donc continue sur $[1;2]$. Ses valeurs aux bornes sont $f(1)=-3<0$ et $f(2)=1>0$. Le TVI donne donc **au moins une solution dans $]1;2[$**, donc dans $[1;2]$. Il faut écrire à la fois la continuité et l’encadrement de $0$ par les valeurs aux bornes. Un changement de signe sans vérification de continuité ne suffirait pas. La solution n’est pas demandée sous forme exacte.`),
  ]),
  exercise(39, "Ce que permet vraiment une bijection", r`On sait uniquement que $f$ est une bijection de $E$ sur $F$. Dis si chaque déduction est vraie ou fausse.`, [
    tf("1)", r`$f$ est une application.`, true, r`Une bijection est, par définition, une application à la fois injective et surjective. **Vrai.**`),
    tf("2)", r`$f$ est strictement positive.`, false, r`La bijection identité de $\mathbb R$ sur $\mathbb R$ prend des valeurs négatives. La bijectivité n’impose aucun signe. **Faux.**`),
    tf("3)", r`$f$ est continue sur $E$.`, false, r`Une bijection peut être discontinue : sur $\mathbb R$, échanger les images de $0$ et de $1$ dans l’identité donne encore une bijection, mais discontinue en ces deux points. **Faux sans hypothèse supplémentaire.**`),
    tf("4)", r`$f$ est strictement monotone sur $E$.`, false, r`La même bijection qui échange $0$ et $1$ n’est ni croissante ni décroissante sur $\mathbb R$. Le théorème « continue et strictement monotone implique bijective sur son image » ne se lit pas à l’envers sans hypothèses. **Faux.**`),
    tf("5)", r`$f$ est toujours croissante.`, false, r`La fonction $x\mapsto-x$ est une bijection de $\mathbb R$ sur $\mathbb R$ et elle est strictement décroissante. **Faux.**`),
    tf("6)", r`La bijection réciproque de $f$ n’a pas le même sens de variation que $f$.`, false, r`Quand $f$ est strictement monotone, sa réciproque a **le même sens de variation**. L’identité et sa réciproque sont, par exemple, toutes deux croissantes. Pour une bijection générale non monotone, parler d’un sens de variation global n’est pas justifié. **Faux.**`),
  ]),
  exercise(40, "Construire une bijection sur une image", r`Soit $f(x)=\frac1{1-x^2}$, strictement croissante sur $]0;1[$.`, [
    written("Justification", r`Justifie que $f$ réalise une bijection de $]0;1[$ sur un intervalle $J$, à déterminer.`, r`Le dénominateur ne s’annule pas sur $]0;1[$, donc $f$ y est continue. Elle y est strictement croissante. Aux bornes, $\lim_{x\to0^+}f(x)=1$ et $\lim_{x\to1^-}f(x)=+\infty$. Les bornes sont exclues ; ainsi **$J=]1;+\infty[$**. Le théorème des fonctions continues strictement monotones assure que $f$ réalise une bijection de $]0;1[$ sur $J$.`),
  ]),
  exercise(41, "Existence et unicité par bijection", r`La fonction $f(x)=\frac1{1-x^2}$ réalise une bijection de $]0;1[$ sur $]1;+\infty[$.`, [
    written("Justification", r`Justifie que l’équation $f(x)=2$ a une seule solution dans $]0;1[$.`, r`Le réel $2$ appartient à $]1;+\infty[$. La surjectivité donne au moins un antécédent et l’injectivité au plus un : **$2$ a donc exactement un antécédent dans $]0;1[$**. Si l’on souhaite le calculer, $\frac1{1-x^2}=2$ équivaut à $x^2=\frac12$. Seule la valeur $x=\frac1{\sqrt2}$ appartient à $]0;1[$.`),
  ]),
  exercise(42, "Restreindre une réciproque", r`Soit $f$ continue et strictement croissante, réalisant une bijection de $]0;+\infty[$ sur $\mathbb R$. On donne $f(1)=0$ et on note $g$ la restriction de $f^{-1}$ à $]-\infty;0[$.`, [
    written("1)", r`Détermine $g(]-\infty;0[)$.`, r`La réciproque $f^{-1}$ est continue et strictement croissante, et $f^{-1}(0)=1$. Par croissance, $f(x)<0$ équivaut à $0<x<1$. La restriction $g$ envoie donc bijectivement $]-\infty;0[$ sur **$]0;1[$**. L’hypothèse que $f$ est surjective sur $\mathbb R$ assure ici que tous les réels négatifs appartiennent au domaine de $f^{-1}$.`),
    written("2)", r`Justifie que l’équation $g(x)=\frac12$ a une seule solution dans $]-\infty;0[$.`, r`On a $\frac12\in]0;1[$ et $g$ réalise une bijection de $]-\infty;0[$ sur $]0;1[$. Ce nombre admet donc exactement un antécédent. La solution est **$x=f(\frac12)<f(1)=0$** ; sa valeur numérique ne peut pas être calculée sans expression de $f$.`),
  ]),
  exercise(43, "Déterminer les asymptotes parallèles aux axes", r`On donne $f(x)=3-\frac1{\sqrt x-1}$. Détermine les équations des droites parallèles aux axes qui sont des asymptotes à sa courbe.`, [
    short("Verticale", "Équation de l’asymptote verticale", "$x=1$", ["x=1", "1"], r`Le domaine est $[0;+\infty[\setminus\{1\}$. Quand $x\to1^-$, $\sqrt x-1\to0^-$ et $f(x)\to+\infty$ ; à droite, $f(x)\to-\infty$. **L’asymptote verticale est $x=1$.** En $0$, $f(0)=4$ : il n’y a pas d’asymptote verticale.`),
    short("Horizontale", "Équation de l’asymptote horizontale", "$y=3$", ["y=3", "3"], r`Quand $x\to+\infty$, $\frac1{\sqrt x-1}\to0$, donc $f(x)\to3$. **La droite $y=3$ est asymptote horizontale en $+\infty$.**`),
  ]),
  exercise(44, "Justifier deux asymptotes", r`Soit $f(x)=\frac{3x-5}{1-2x}$, et $(C)$ sa courbe représentative.`, [
    written("1)", r`Justifie que la droite $x=\frac12$ est une asymptote verticale à $(C)$.`, r`Quand $x\to\frac12$, le numérateur tend vers $-\frac72<0$. Le dénominateur tend vers $0^+$ à gauche et $0^-$ à droite. Les limites valent donc respectivement $-\infty$ et $+\infty$. **La droite $x=\frac12$ est une asymptote verticale.**`),
    written("2)", r`Justifie que la droite $y=-\frac32$ est une asymptote horizontale à $(C)$.`, r`En divisant par $x$, $f(x)=\frac{3-5/x}{1/x-2}\to-\frac32$ en $+\infty$ comme en $-\infty$. **La droite $y=-\frac32$ est asymptote horizontale aux deux infinis.**`),
  ]),
  exercise(45, "Une asymptote oblique en −∞", r`On donne $g(x)=\sqrt{x^2+3x+4}$.`, [
    written("Justification", r`Justifie que la droite $y=-x-\frac32$ est une asymptote à la courbe de $g$ en $-\infty$.`, r`Il faut montrer que $g(x)-(-x-\frac32)\to0$. Pour $x$ négatif assez grand en valeur absolue, l’expression conjuguée donne :
$$\sqrt{x^2+3x+4}+x+\frac32
=\frac{x^2+3x+4-(x+\frac32)^2}{\sqrt{x^2+3x+4}-x-\frac32}
=\frac{7/4}{\sqrt{x^2+3x+4}-x-\frac32}.$$
Le dénominateur tend vers $+\infty$ en $-\infty$. Le quotient tend donc vers $0$ : **l’asymptote est bien $y=-x-\frac32$**. Le signe $|x|=-x$ en $-\infty$ explique celui de la pente. Penser uniquement à remplacer $\sqrt{x^2}$ par $x$ ferait perdre ce signe.`),
  ]),
  exercise(46, "Rechercher toutes les asymptotes", r`Dans chacun des cas, détermine les équations de toutes les asymptotes à la courbe représentative de $f$.`, [
    written("1)", r`$f(x)=-x+1-\frac1{x^2}$.`, r`Le domaine est $\mathbb R\setminus\{0\}$. Lorsque $x\to0^\pm$, $-1/x^2\to-\infty$, tandis que $-x+1$ reste fini : **$x=0$ est asymptote verticale**.

Aux deux infinis, $f(x)-(-x+1)=-1/x^2\to0$. **$y=-x+1$ est asymptote oblique en $-\infty$ et en $+\infty$**. Il n’y a pas d’asymptote horizontale car $f$ n’a pas de limite finie aux infinis.`),
    written("2)", r`$f(x)=\frac{2x-3}{2-x}$.`, r`Le domaine est $\mathbb R\setminus\{2\}$. Écrivons $f(x)=-2+\frac1{2-x}$. En $2^-$ et $2^+$, les limites sont $+\infty$ et $-\infty$, donc **$x=2$ est asymptote verticale**. Aux deux infinis, $1/(2-x)\to0$, donc **$y=-2$ est asymptote horizontale**. Il n’y a pas d’autre pôle ni d’asymptote oblique distincte. Aucun résultat graphique ne remplace la justification par les limites.`),
  ]),
  exercise(47, "Interpréter une branche infinie", r`Dans un repère $(O,I,J)$, on suppose que $\lim_{x\to-\infty}f(x)=-\infty$. Examine les trois affirmations ci-dessous et justifie ta réponse en vérifiant aussi la compatibilité des hypothèses.`, [
    written("1)", r`Si $\lim_{x\to-\infty}\frac{f(x)}x=-1$, alors la courbe admet une branche parabolique de direction la droite $y=-1$, parallèle à $(OI)$.`, r`Avec $x\to-\infty$ et $f(x)\to-\infty$, le quotient $f(x)/x$ est positif pour $x$ assez négatif : il ne peut pas tendre vers $-1$. **Les hypothèses de ce cas sont incompatibles : on ne peut en déduire une branche effectivement réalisable.** En outre, une limite finie non nulle $a$ du quotient désigne une direction de pente $a$, pas la droite horizontale $y=a$. Une branche parabolique de direction $(OI)$ requiert $f(x)/x\to0$.`),
    written("2)", r`Si $\lim_{x\to-\infty}\frac{x}{f(x)}=-\infty$, alors la courbe admet une branche parabolique de direction $(OI)$.`, r`Ici encore, $x$ et $f(x)$ sont tous deux négatifs pour $x$ assez négatif, donc $x/f(x)>0$. **La limite $-\infty$ annoncée n’est pas compatible avec les hypothèses initiales.** Le critère utilisable pour la direction $(OI)$ est $f(x)/x\to0$, avec une limite infinie de $f$. Pour une expression conditionnelle dont l’hypothèse est irréalisable, attribuer automatiquement Vrai ou Faux sans cette analyse serait trompeur.`),
    written("3)", r`Si $\lim_{x\to-\infty}\frac{f(x)}x=+\infty$, alors la courbe admet une branche parabolique de direction $(OJ)$.`, r`Les hypothèses sont compatibles : par exemple $f(x)=-x^2$ lorsque $x\to-\infty$. On a une limite infinie de $f$ et $f(x)/x\to+\infty$, c’est le critère d’une **branche parabolique de direction $(OJ)$**. Cette dernière affirmation décrit donc une situation effectivement possible. Aucun de ces raisonnements n’exige de calculer une asymptote. La direction d’une branche et l’équation d’une asymptote sont deux informations différentes.`),
  ]),
  exercise(48, "Déterminer la direction d’une branche", r`Soit $f$ définie sur $\mathbb R$ par $f(x)=x^2+\sqrt{x^2+1}$.`, [
    short("a)", r`Détermine la limite de $f$ en $+\infty$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Les deux termes sont positifs et $x^2\to+\infty$. Par comparaison, **$f(x)\to+\infty$**.`),
    short("b)", r`Détermine $\displaystyle\lim_{x\to+\infty}\frac{f(x)}x$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour $x>0$, $\frac{f(x)}x=x+\sqrt{1+1/x^2}$. La racine tend vers $1$ et $x\to+\infty$ ; **la limite est $+\infty$**.`),
    written("c)", "Interprète graphiquement ces résultats.", r`En $+\infty$, $f(x)\to+\infty$ et $f(x)/x\to+\infty$. **La courbe possède une branche parabolique de direction $(OJ)$**. Cela ne signifie pas que la courbe est elle-même une parabole. La conclusion concerne uniquement la direction de sa branche infinie.`),
  ]),
  exercise(49, "Une direction horizontale sans asymptote horizontale", r`Dans un repère orthonormé, soit $g(x)=\frac{x+1}{\sqrt x+2}$, définie pour $x\ge0$.`, [
    written("Justification", "Justifie que la courbe possède une branche parabolique et détermine sa direction.", r`En divisant numérateur et dénominateur par $\sqrt x$, on obtient
$$g(x)=\frac{\sqrt x+1/\sqrt x}{1+2/\sqrt x}\longrightarrow+\infty.$$
Ensuite, $\frac{g(x)}x=\frac{1+1/x}{\sqrt x+2}\to0$.

Ainsi **la courbe admet en $+\infty$ une branche parabolique de direction $(OI)$**. Ce n’est pas une asymptote horizontale : $g(x)$ tend vers $+\infty$, et non vers une valeur réelle. La limite du quotient renseigne sur la direction, celle de la fonction exclut ici une asymptote horizontale.`),
  ]),
  exercise(50, "Compléter des équivalences de puissances", r`$a$ et $b$ sont deux nombres réels strictement positifs. Complète les égalités et l’exposant demandés.`, [
    short("1)", r`$a=\sqrt[7]b\Longleftrightarrow b=\ldots$`, "$a^7$", ["a^7", "a⁷"], r`La racine septième est réciproque de la puissance septième sur les réels positifs. Ainsi **$a=\sqrt[7]b\Longleftrightarrow b=a^7$**.`),
    short("2)", r`$b^{10}=a\Longleftrightarrow a^{\,\ldots}=b$. Donne l’exposant manquant.`, "$1/10$", ["1/10", "0,1"], r`Comme $b>0$, extraire la racine dixième donne **$b=a^{1/10}$**. L’exposant attendu est donc $\frac1{10}$.`),
  ]),
  exercise(51, "Croissance d’une fonction racine", r`L’application $h$ de $\mathbb R_+$ dans $\mathbb R_+$ associe à tout $x$ le nombre $x^5$.`, [
    written("Justification", r`Justifie que $x\mapsto\sqrt[5]x$ est strictement croissante sur $\mathbb R_+$.`, r`La fonction $h:x\mapsto x^5$ est continue et strictement croissante sur $\mathbb R_+$ ; elle envoie $0$ sur $0$ et tend vers $+\infty$. Elle réalise donc une bijection de $\mathbb R_+$ sur $\mathbb R_+$. Sa réciproque $h^{-1}(x)=\sqrt[5]x$ garde le **même sens de variation**, donc est strictement croissante.

On peut aussi prendre $0\le u<v$ : si $\sqrt[5]u\ge\sqrt[5]v$, la croissance de la puissance cinquième donnerait $u\ge v$, contradiction. La preuve est valable au point $0$ sans utiliser une dérivée qui y serait délicate.`),
  ]),
  exercise(52, "Simplifier un quotient de racines", r`On donne $A=\frac{\sqrt[3]{1024}\times\sqrt[4]{64}}{\sqrt{\sqrt[3]{256}}}$.`, [
    written("Justification", r`Justifie que $A=8\sqrt2$.`, r`Écrivons tous les nombres comme puissances de $2$ : $1024=2^{10}$, $64=2^6$ et $256=2^8$.
$$A=\frac{2^{10/3}\times2^{6/4}}{2^{8/(3\times2)}}
=2^{10/3+3/2-4/3}=2^{7/2}=2^3\sqrt2.$$
Ainsi **$A=8\sqrt2$**. Le produit des indices dans la racine emboîtée donne bien $3\times2=6$ au dénominateur de l’exposant ; il ne faut pas additionner ces indices.`),
  ]),
  exercise(53, "Manipuler des exposants négatifs", r`Écris simplement $B=\frac{10^{3/2}}{25}\times\frac{8^{-4/3}}{4^{-7/2}}$.`, [
    short("Résultat", "Donne la forme simplifiée de B.", r`$\frac{16\sqrt{10}}5$`, ["16sqrt(10)/5", "16√10/5", "3.2sqrt(10)", "16/5*sqrt(10)"], r`On a $10^{3/2}=10\sqrt{10}$, $8^{-4/3}=(2^3)^{-4/3}=2^{-4}=\frac1{16}$ et $4^{-7/2}=(2^2)^{-7/2}=2^{-7}=\frac1{128}$. Par conséquent :
$$B=\frac{10\sqrt{10}}{25}\times\frac{1/16}{1/128}
=\frac{2\sqrt{10}}5\times8
=\boxed{\frac{16\sqrt{10}}5}.$$
Diviser par un nombre d’exposant négatif ne signifie pas garder son signe dans l’exposant : le quotient utilise ici son inverse.`),
  ]),
  exercise(54, "Identifier une racine emboîtée", r`On donne $A=\sqrt{\sqrt[4]{\sqrt[3]{256}}}$. Parmi les nombres proposés, choisis celui qui est égal à $A$. Justifie ta réponse dans ton brouillon.`, [
    choice("Choix", "Quelle expression représente A ?", [r`$3\sqrt2$`, r`$\sqrt{2^3}$`, r`$\sqrt[3]2$`, r`$\sqrt3$`], 2, r`Puisque $256=2^8$, les trois racines donnent successivement les exposants $\frac83$, $\frac8{12}$ puis $\frac8{24}=\frac13$. Donc **$A=2^{1/3}=\sqrt[3]2$ : proposition c)**. Les indices des racines se multiplient dans l’exposant ; ils ne s’additionnent pas.`),
  ]),
];
