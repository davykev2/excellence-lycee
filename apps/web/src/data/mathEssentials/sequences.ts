import { section, sheet } from "./types";

export default sheet("sequences", "Suites numériques", [103, 104, 105, 106, 107], [
  section("essential-sequence-generation", "I", "Définir et calculer les termes", [103, 104], String.raw`
Une suite numérique associe un réel $u_n$ à chaque entier $n$ à partir d’un certain rang. On note la suite $(u_n)$ et son terme de rang $n$, $u_n$.

**Formule explicite :** $u_n=f(n)$. On remplace $n$ par le rang voulu.

| Rang | $u_n=n^2-2n$ |
| --- | --- |
| $0$ | $0^2-2\times0=0$ |
| $1$ | $1^2-2\times1=-1$ |
| $2$ | $2^2-2\times2=0$ |
| $3$ | $3^2-2\times3=3$ |

Pour $v_n=(2n-3)/n$, le rang commence à $1$ :

$$v_1=-1,\quad v_2=\frac12,\quad v_3=1,\quad v_4=\frac54.$$

**Formule de récurrence :** un terme initial et une relation permettent de calculer les termes successifs.

Pour $u_0=0$ et $u_{n+1}=\frac12u_n+2$ :

$$u_1=\frac12\times0+2=2.$$

Pour la même relation avec $u_0=-2$ :

$$u_1=1,\qquad u_2=\frac52,\qquad u_3=\frac{13}4.$$

Pour représenter la suite dans un repère, placer les points **discrets** $(n;u_n)$. Ne pas confondre $u_n$ et $u_{n+1}$ dans un tableau de rangs.
`),
  section("essential-sequence-order", "II", "Variations et bornes", [103, 104], String.raw`
| Propriété | Condition pour tout rang concerné |
| --- | --- |
| Croissante | $u_{n+1}-u_n\ge0$ |
| Décroissante | $u_{n+1}-u_n\le0$ |
| Constante | $u_{n+1}-u_n=0$ |

Des inégalités strictes donnent des variations strictes.

**Si tous les termes sont strictement positifs**, on peut comparer $\frac{u_{n+1}}{u_n}$ à $1$ : supérieur à $1$ donne une croissance, inférieur à $1$ une décroissance, égal à $1$ une suite constante.

Si $u_n=f(n)$ et si $f$ est monotone sur l’intervalle des rangs, $(u_n)$ a le même sens de variation. Étudier $f$ est donc une méthode suffisante, sans être une condition nécessaire.

| Borne | Définition |
| --- | --- |
| Minorée par $m$ | $m\le u_n$ pour tous les rangs |
| Majorée par $M$ | $u_n\le M$ pour tous les rangs |
| Bornée | Minorée et majorée |

Une suite croissante est minorée par son premier terme. Une suite décroissante est majorée par son premier terme.
`),
  section("essential-sequence-arithmetic", "III", "Suites arithmétiques", [104, 105], String.raw`
Une suite est arithmétique de raison $r$ si

$$u_{n+1}=u_n+r,\qquad u_{n+1}-u_n=r.$$

**Terme général**, à partir d’un rang $p$ :

$$u_n=u_p+(n-p)r.$$

**Somme de $N=d-p+1$ termes consécutifs :**

$$u_p+u_{p+1}+\cdots+u_d
=\frac N2(u_p+u_d).$$

On multiplie le nombre de termes par la moyenne du premier et du dernier.

| Raison | Variation |
| --- | --- |
| $r>0$ | Strictement croissante |
| $r<0$ | Strictement décroissante |
| $r=0$ | Constante |

**a) Reconnaître la raison.** Pour $v_n=2n-4$ :

$$v_{n+1}-v_n=\big(2(n+1)-4\big)-(2n-4)=2.$$

La raison est $2$ et le premier terme est $v_0=-4$.

**b) Avec $r=\frac12$ et $u_4=10$ :**

$$u_n=10+\frac{n-4}{2}=8+\frac n2.$$

**c) Avec $u_0=5$ et $u_5=-10$ :**

$$-10=5+5r\ \Longrightarrow\ r=-3,\qquad u_n=5-3n.$$

La somme de $u_0$ à $u_n$ contient $n+1$ termes :

$$S_n=\frac{n+1}{2}(5+5-3n)=\frac{(n+1)(10-3n)}2.$$
`),
  section("essential-sequence-geometric", "IV", "Suites géométriques", [105, 106], String.raw`
Une suite est géométrique de raison $q$ si

$$v_{n+1}=qv_n.$$

La définition reste valable pour $q=1$ et pour des termes nuls. Le quotient $v_{n+1}/v_n$ ne s’utilise que si $v_n\ne0$.

**Terme général**, pour $n\ge p$ :

$$v_n=v_pq^{n-p}.$$

Si $q=0$, lire séparément le terme initial : tous les termes suivants sont nuls.

**Somme de $N$ termes à partir de $v_p$, si $q\ne1$ :**

$$v_p+v_{p+1}+\cdots+v_{p+N-1}
=v_p\frac{1-q^N}{1-q}.$$

Si $q=1$, la somme est simplement $Nv_p$.

**a) Reconnaître la raison.** Si $v_n=-4\times3^n$, alors

$$v_{n+1}=-4\times3^{n+1}=3v_n.$$

La raison est $3$.

**b) Avec $q=\frac12$ et $v_0=-2$ :**

$$v_n=-2\left(\frac12\right)^n,\qquad
v_4=-2\times\frac1{16}=-\frac18.$$

**c) Avec $v_1=-6$ et $v_4=48$ :**

$$48=-6q^3\ \Longrightarrow\ q^3=-8\ \Longrightarrow\ q=-2.$$

**d) Avec $q=3$ et $v_5=10$ :**

$$10=v_1\,3^4\ \Longrightarrow\ v_1=\frac{10}{81}.$$

Pour $S_n=v_1+\cdots+v_n$, il y a $n$ termes, donc

$$S_n=\frac{10}{81}\frac{1-3^n}{1-3}
=\frac5{81}(3^n-1).$$
`),
  section("essential-sequence-limits", "V", "Convergence et comparaison", [107], String.raw`
Une suite est **convergente** si elle possède une limite réelle finie. Sinon, elle est divergente : elle peut tendre vers un infini ou n’avoir aucune limite.

**Convergence monotone :**

- toute suite croissante et majorée converge ;
- toute suite décroissante et minorée converge.

Pour $u_n=f(n)$, si $f(x)$ possède une limite quand $x\to+\infty$, la suite possède cette même limite.

Pour $u_{n+1}=g(u_n)$, si l’on a établi $u_n\to\ell$ **et si $g$ est continue en $\ell$**, alors

$$g(\ell)=\ell.$$

Résoudre cette équation ne prouve pas, à lui seul, que la suite converge.

**Comparer, à partir d’un certain rang :**

| Hypothèses | Conclusion |
| --- | --- |
| $u_n\le v_n$ et $u_n\to+\infty$ | $v_n\to+\infty$ |
| $u_n\ge v_n$ et $u_n\to-\infty$ | $v_n\to-\infty$ |
| $v_n\le u_n\le w_n$, avec $v_n,w_n\to\ell$ | $u_n\to\ell$ |
| $u_n\le v_n$ et les deux suites convergent | $\lim u_n\le\lim v_n$ |

Les règles de somme, produit et quotient des limites s’appliquent aussi aux suites, hors formes indéterminées.
`),
  section("essential-sequence-powers", "VI", "Puissances et raisonnement par récurrence", [107], String.raw`
| Valeur de $q$ | Comportement de $q^n$ |
| --- | --- |
| $-1<q<1$ | $q^n\to0$ |
| $q=1$ | $q^n=1$ |
| $q>1$ | $q^n\to+\infty$ |
| $q=-1$ | Alternance entre $1$ et $-1$, sans limite |
| $q<-1$ | Signes alternés et valeur absolue croissante, sans limite |

Pour $q=0$, les puissances sont nulles à partir de $n=1$.

**Démontrer une propriété $P(n)$ par récurrence :**

1. **Initialisation :** vérifier $P(n_0)$ au premier rang.
2. **Hérédité :** choisir un rang $n\ge n_0$, supposer $P(n)$ vraie et démontrer $P(n+1)$.
3. **Conclusion :** $P(n)$ est vraie pour tout entier $n\ge n_0$.

L’hypothèse de récurrence doit apparaître précisément à l’étape où elle est utilisée.
`),
], [
  "P103–104 : u_n=n²−2n ; v0=−4 ; majoration u_n≤M ; récurrence u0=−2 recalculée en1,5/2,13/4.",
  "P105 : somme arithmétique avec somme des extrêmes, pas différence. P106 : N termes et somme(10/81)3^(k−1)=5(3^n−1)/81.",
  "P107 : q=1 convergent ; continuité requise au point fixe ; comparaison vers −∞ rectifiée.",
]);
