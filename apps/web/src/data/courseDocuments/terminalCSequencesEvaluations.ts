import type { CourseEvaluationGroup } from "../../domain/courseDocument";

export const terminalCSequencesEvaluations: CourseEvaluationGroup[] = [
  { id: "seq-bounds-evaluation", title: "Démontrer qu’une suite est bornée", pages: [150],
    method: String.raw`1. Pour un minorant $m$, étudie le signe de $u_n-m$ ; pour un majorant $M$, celui de $u_n-M$.
2. Si $u_n=f(n)$, les variations ou un encadrement de $f$ peuvent aider.
3. Pour une suite récurrente, démontre un encadrement par récurrence.
4. Conclus avec des bornes fixes, valables à tous les rangs demandés.`,
    examples: [{ id: "seq-negative-rational-worked", title: "Exemple corrigé", prompt: String.raw`Pour $u_n=-2n/(n+1)$, $n\ge0$, montrons que $-2<u_n\le0$.`, parts: [
      { id: "seq-negative-lower", label: "1.", prompt: "Montrer que −2 est un minorant.", solution: String.raw`Pour $n\ge0$, $n+1>0$. Calculons :

$$u_n+2=\frac{-2n+2(n+1)}{n+1}=\frac2{n+1}>0.$$

Donc $u_n>-2$, ce qui prouve que **$-2$ minore la suite**.` },
      { id: "seq-negative-upper", label: "2.", prompt: "Conclure que la suite est bornée.", solution: String.raw`Pour $n\ge0$, $-2n\le0$ et $n+1>0$, donc $u_n\le0$. L’égalité est atteinte au rang $0$.

Avec la première question : **$-2<u_n\le0$**. La suite est à la fois minorée et majorée, donc bornée.` },
    ] }], statement: String.raw`Soit $v_n=\cos n/n^2$, pour $n\ge1$.`, questions: [],
    writtenTasks: [{ id: "seq-cos-square-writing", topicId: "seq-bounds-summary", prompt: "Démontre que cette suite est bornée.", model: String.raw`Pour tout $n\ge1$, $-1\le\cos n\le1$ et $n^2>0$. Ainsi :

$$-\frac1{n^2}\le v_n\le\frac1{n^2}.$$

Puisque $n^2\ge1$, on a $1/n^2\le1$. On en déduit **$-1\le v_n\le1$** à tous les rangs.

Les deux réels fixes $-1$ et $1$ sont donc un minorant et un majorant : **la suite est bornée**.`, criteria: ["Je pars de −1 ≤ cos n ≤ 1.", "Je divise par n² > 0 sans inverser les inégalités.", "Je termine par deux bornes indépendantes de n."] }],
  },
  { id: "seq-variation-evaluation", title: "Étudier le sens de variation", pages: [150, 151],
    method: String.raw`1. Calcule $u_{n+1}-u_n$ puis étudie son signe.
2. Si tous les termes sont strictement positifs, tu peux comparer $u_{n+1}/u_n$ à $1$.
3. Pour $u_n=f(n)$, étudie $f$ sur un intervalle contenant les rangs.
4. Pour une récurrence, initialise la comparaison, puis propage-la en justifiant les variations de la fonction utilisée.`,
    examples: [{ id: "seq-variation-worked", title: "Trois méthodes sur le même exemple", prompt: String.raw`Pour $n\ge1$, étudions $u_n=2+1/n$.`, parts: [
      { id: "seq-variation-difference", label: "1.", prompt: "Par différence.", solution: String.raw`$$u_{n+1}-u_n=\frac1{n+1}-\frac1n=\frac{n-(n+1)}{n(n+1)}=-\frac1{n(n+1)}.$$

Le dénominateur est positif pour $n\ge1$. La différence est **strictement négative** : la suite est strictement décroissante.` },
      { id: "seq-variation-ratio", label: "2.", prompt: "Par quotient.", solution: String.raw`Chaque terme est strictement positif. On peut donc comparer le quotient à $1$ :

$$\frac{u_{n+1}}{u_n}=\frac{n(2n+3)}{(n+1)(2n+1)}.$$
$$\frac{u_{n+1}}{u_n}=1-\frac1{2n^2+3n+1}<1.$$

La suite est **strictement décroissante**.` },
      { id: "seq-variation-function", label: "3.", prompt: "Avec la fonction associée.", solution: String.raw`Posons $f(x)=2+1/x$ sur $]0;+\infty[$. Alors $f'(x)=-1/x^2<0$.

La fonction est strictement décroissante sur cet intervalle. Comme $u_n=f(n)$ pour $n\ge1$, **la suite est strictement décroissante**.` },
    ] }], statement: String.raw`Pour $n\ge1$, $u_n=1/[n(n+1)]$.`,
    questions: [{ id: "seq-variation-value", label: "2.a", topicId: "seq-monotonicity-summary", points: 1, prompt: "Calcule u₁.", expected: "$1/2$", answer: { kind: "short", accepted: ["1/2", "0.5"] }, correction: String.raw`On remplace $n$ par $1$ : $u_1=1/(1\times2)=\boxed{1/2}$.` }],
    writtenTasks: [{ id: "seq-variation-writing", topicId: "seq-monotonicity-summary", prompt: "Étudie le sens de variation de la suite.", model: String.raw`Pour $n\ge1$, tous les facteurs du dénominateur sont positifs :

$$u_{n+1}-u_n=\frac1{(n+1)(n+2)}-\frac1{n(n+1)}.$$
$$u_{n+1}-u_n=\frac{n-(n+2)}{n(n+1)(n+2)}=-\frac2{n(n+1)(n+2)}<0.$$

**La suite est strictement décroissante sur les rangs $n\ge1$.**`, criteria: ["Je calcule uₙ₊₁ avec n+1 à chaque place.", "Je réduis la différence au même dénominateur.", "Je justifie le signe du dénominateur avant de conclure."] }],
  },
  { id: "seq-convergence-evaluation", title: "Prouver la convergence puis calculer la limite", pages: [151, 152],
    method: String.raw`1. Prouve que la récurrence définit tous les termes.
2. Cherche une borne et un sens de variation.
3. Applique le théorème de convergence monotone.
4. La convergence étant prouvée, utilise la continuité pour écrire $\ell=f(\ell)$, ou trouve une formule explicite.`,
    examples: [{ id: "seq-affine-convergence-worked", title: "Exemple corrigé", prompt: String.raw`$u_0=2$ et $u_{n+1}=\frac12u_n+4$. Montrons que $u_n\le8$, puis étudions la convergence.`, parts: [
      { id: "seq-affine-bound", label: "1.", prompt: String.raw`Démontrer par récurrence que $u_n\le8$.`, solution: String.raw`**Initialisation.** $u_0=2\le8$.

**Hérédité.** Supposons $u_k\le8$. En multipliant par $1/2>0$ puis en ajoutant $4$ :

$$u_{k+1}=\frac12u_k+4\le\frac12\times8+4=8.$$

**Conclusion.** La propriété est vraie au rang $0$ et se transmet au rang suivant ; **$u_n\le8$ pour tout $n\ge0$**.` },
      { id: "seq-affine-increasing", label: "2.", prompt: "Déterminer le sens de variation.", solution: String.raw`$$u_{n+1}-u_n=4-\frac12u_n=\frac12(8-u_n).$$

La question précédente donne $8-u_n\ge0$. La différence est donc positive ou nulle : **la suite est croissante**.` },
      { id: "seq-affine-converges", label: "3.", prompt: "Prouver que la suite converge.", solution: String.raw`La suite est **croissante** et **majorée par $8$**. Le théorème de convergence monotone prouve qu’elle converge vers un réel $\ell\le8$.` },
      { id: "seq-affine-limit", label: "4.", prompt: "Calculer sa limite et obtenir une formule explicite.", solution: String.raw`La fonction $f(x)=x/2+4$ est continue sur $\mathbb R$. La convergence étant établie :

$$\ell=\frac12\ell+4\iff\frac12\ell=4\iff\boxed{\ell=8.}$$

On peut vérifier avec $v_n=u_n-8$ :

$$v_{n+1}=\frac12u_n+4-8=\frac12(u_n-8)=\frac12v_n.$$

La suite $(v_n)$ est géométrique de raison $1/2$ et $v_0=-6$. Ainsi $v_n=-6(1/2)^n$ et **$u_n=8-6(1/2)^n$**, ce qui confirme $u_n\to8$.` },
    ] }],
    statement: String.raw`$u_0=2$ et $u_{n+1}=(2u_n+1)/(u_n+3)$.`,
    questions: [{ id: "seq-fraction-u1", label: "3.2.a", topicId: "seq-recursion-summary", points: 1, prompt: "Calcule u₁.", expected: "$1$", answer: { kind: "short", accepted: ["1"] }, correction: String.raw`$u_1=(2\times2+1)/(2+3)=5/5=\boxed1$.` },
      { id: "seq-fraction-limit", label: "3.3.b", topicId: "seq-recursion-summary", points: 1, prompt: "Après ta preuve de convergence, donne la limite.", expected: String.raw`$(\sqrt5-1)/2$`, answer: { kind: "short", accepted: ["(sqrt(5)-1)/2", "(sqrt5-1)/2", "(√5-1)/2", "(√(5)-1)/2"] }, correction: String.raw`La limite positive vérifie $\ell=(2\ell+1)/(\ell+3)$, soit $\ell^2+\ell-1=0$. La racine compatible avec $\ell\ge0$ est **$(\sqrt5-1)/2$**. Cette équation ne remplace pas la preuve de convergence demandée.` }],
    writtenTasks: [
      { id: "seq-fraction-positivity", beforeQuestionId: "seq-fraction-u1", topicId: "seq-recursion-summary", prompt: "1. Démontre que tous les termes sont strictement positifs.", model: String.raw`**Initialisation.** $u_0=2>0$.

**Hérédité.** Si $u_k>0$, alors $2u_k+1>0$ et $u_k+3>0$. Le quotient est défini et $u_{k+1}>0$.

La récurrence prouve à la fois que **tous les termes existent** et qu’ils sont **strictement positifs**.`, criteria: ["Je vérifie u₀ > 0.", "Je justifie que le dénominateur est positif.", "Je conclus pour tous les rangs."] },
      { id: "seq-fraction-convergence", beforeQuestionId: "seq-fraction-limit", topicId: "seq-monotone-convergence-summary", prompt: "2.b–3.a. Démontre par récurrence que la suite décroît, puis prouve qu’elle converge.", model: String.raw`Posons $f(x)=(2x+1)/(x+3)$ pour $x>0$.

$$f'(x)=\frac{2(x+3)-(2x+1)}{(x+3)^2}=\frac5{(x+3)^2}>0.$$

La fonction $f$ est strictement croissante. **Initialisation :** $u_1=1<u_0=2$. **Hérédité :** si $u_{k+1}<u_k$, la croissance de $f$ donne $u_{k+2}=f(u_{k+1})<f(u_k)=u_{k+1}$.

Donc **la suite est strictement décroissante**. Elle est minorée par $0$, d’après la positivité. Elle converge donc vers un réel $\ell\ge0$. Comme $f$ est continue aussi en $0$, on peut ensuite utiliser l’équation de point fixe pour calculer $\ell$.`, criteria: ["Je calcule f′ et justifie sa croissance.", "Je pars de u₁ < u₀ pour la récurrence.", "Je cite décroissance et minorant avant de chercher la limite."] },
    ],
  },
];
