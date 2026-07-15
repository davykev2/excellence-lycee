-- ============================================================================
-- EXCELLENCE LYCÉE — résumés maths / Terminale (séries C)
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
  (1, 'L1 — Limites et continuité', 'Fonctions numériques · composée, monotone bornée, TVI, bijection, racine n-ième'),
  (2, 'L2 — Barycentre et lignes de niveau', 'Géométrie du plan · barycentre, réduction, coordonnées, lignes de niveau'),
  (3, 'L3 — Divisibilité dans Z', 'Arithmétique · division euclidienne, congruences, numération, nombres premiers'),
  (4, 'L4 — Dérivabilité et étude de fonctions', 'Fonctions numériques · dérivée à gauche/droite, composée, réciproque, accroissements finis'),
  (5, 'L5 — Géométrie analytique de l''espace', 'Géométrie de l''espace · vecteur normal, équations, distances, positions relatives'),
  (6, 'L6 — Primitives', 'Fonctions numériques · primitives usuelles, opérations, composition'),
  (7, 'L7 — Coniques', 'Géométrie du plan · parabole, ellipse, hyperbole, équations réduites'),
  (8, 'L8 — Fonction logarithme népérien', 'Fonctions numériques · propriétés, limites, dérivée de ln u, base a'),
  (9, 'L9 — Nombres complexes', 'Calculs algébriques · forme algébrique, module, argument, Moivre, Euler, équations'),
  (10, 'L10 — Fonction exponentielle et puissance', 'Fonctions numériques · exp, base a, fonction puissance, croissances comparées'),
  (11, 'L11 — PPCM et PGCD', 'Arithmétique · Euclide, Bézout, Gauss, équations diophantiennes'),
  (12, 'L12 — Suites numériques', 'Fonctions numériques · récurrence, convergence, croissances comparées, suite récurrente'),
  (13, 'L13 — Nombres complexes et géométrie du plan', 'Transformations du plan · configurations, transformations, similitude directe'),
  (14, 'L14 — Isométries du plan', 'Transformations du plan · symétries, rotations, symétrie glissée, déplacements'),
  (15, 'L15 — Calcul intégral', 'Fonctions numériques · intégrale, Chasles, IPP, aires, valeur moyenne'),
  (16, 'L16 — Similitudes directes du plan', 'Transformations du plan · rapport, angle, forme réduite, écriture complexe'),
  (17, 'L17 — Probabilité conditionnelle et variable aléatoire', 'Phénomène aléatoire · conditionnelle, indépendance, loi binomiale, espérance'),
  (18, 'L18 — Équations différentielles', 'Fonctions numériques · y''+ay=b, y''''±ω²y=0, conditions initiales'),
  (19, 'L19 — Statistique à deux variables', 'Traitement des données · covariance, corrélation, moindres carrés, régression')
) as x(ordre, titre, description) on true
where m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre et description resynchronisés au passage)

-- ---- L1 — Limites et continuité ----
update public.chapitres c set
  titre = 'L1 — Limites et continuité',
  description = 'Fonctions numériques · composée, monotone bornée, TVI, bijection, racine n-ième',
  resume = $md$*Thème : Fonctions numériques*

## 1. Limite d'une fonction composée

Si $\lim\limits_{x\to a} f(x)=b$ et $\lim\limits_{x\to b} g(x)=\ell$, alors $\lim\limits_{x\to a} (g\circ f)(x)=\ell$.

## 2. Limite d'une fonction monotone sur un intervalle

- Si $f$ est **croissante et majorée** par $M$ sur $]a,b[$, alors $f$ admet une **limite finie** $\ell$ en $b$, avec $\ell \le M$.
- Si $f$ est **décroissante et minorée** par $m$ sur $]a,b[$, alors $f$ admet une limite finie $\ell$ en $b$, avec $\ell \ge m$.

## 3. Branches paraboliques

Quand $\lim\limits_{x\to+\infty} f(x)=\pm\infty$ :

- si $\lim\limits_{x\to+\infty}\dfrac{f(x)}{x}=0$ → branche parabolique de direction **(OI)** (l'axe des abscisses) ;
- si $\lim\limits_{x\to+\infty}\dfrac{f(x)}{x}=\pm\infty$ → branche parabolique de direction **(OJ)** (l'axe des ordonnées).

## 4. Continuité

- $f$ est **continue sur $I$** si elle est continue en tout point de $I$. Les fonctions **polynômes, rationnelles, $\sin$, $\cos$, $\sqrt{\ }$, puissance, $|\ |$, $\tan$** sont continues sur tout intervalle de leur ensemble de définition.
- **Prolongement par continuité** : si $a\notin D_f$ et $f$ admet une limite finie $\ell$ en $a$, alors $f$ est prolongeable par continuité en $a$ par la fonction $g$ telle que $g(x)=f(x)$ sur $D_f$ et $g(a)=\ell$.
- **Image d'un intervalle** : l'image d'un intervalle par une fonction continue est un **intervalle** (ou un singleton). Si $f$ est continue et **strictement monotone** sur $[a,b]$, alors $f([a,b])=[f(a),f(b)]$ (croissante) ou $[f(b),f(a)]$ (décroissante).
- **Opérations** : la somme, le produit, $f^n$, $|f|$, le quotient (si $g$ ne s'annule pas), $\sqrt{f}$ (si $f\ge 0$) et la **composée** $g\circ f$ de fonctions continues sont continues.

## 5. Fonction continue et strictement monotone : bijection

Si $f$ est **continue et strictement monotone** sur $I$ :

- $f$ réalise une **bijection** de $I$ sur $f(I)$ ; sa réciproque $f^{-1}$ est continue, strictement monotone, de **même sens de variation** ;
- les courbes de $f$ et $f^{-1}$ sont **symétriques par rapport à la droite** $y=x$.

**Théorème des valeurs intermédiaires (TVI)** : $f$ continue sur $I$, $a,b\in I$. Pour tout $m$ entre $f(a)$ et $f(b)$, l'équation $f(x)=m$ admet **au moins une solution** entre $a$ et $b$.

**Corollaire (bijection)** : si de plus $f$ est **strictement monotone**, la solution est **unique**. En particulier, si $f(a)\cdot f(b)<0$, alors $f(x)=0$ admet une **unique solution** $\alpha$ dans $]a,b[$.

**Valeur approchée de $\alpha$** : méthode de **balayage** (pas régulier) ou de **dichotomie** (on divise l'intervalle en deux et on garde la moitié où $f$ change de signe).

## 6. Racine n-ième et puissance d'exposant rationnel

- **Racine n-ième** ($n\ge 2$) : réciproque de $x\mapsto x^n$ sur $[0;+\infty[$, notée $\sqrt[n]{x}=x^{1/n}$. On a $(\sqrt[n]{x})^n=x$ et $\sqrt[n]{x^n}=x$.
- **Puissance rationnelle** ($a>0$, $p\in\mathbb{Z}^*$, $q\ge 2$) : $a^{p/q}=\left(a^{1/q}\right)^p=\sqrt[q]{a^p}$.
- **Règles** (pour $a,b>0$, $r,r'$ rationnels) : $a^r a^{r'}=a^{r+r'}$, $\dfrac{a^r}{a^{r'}}=a^{r-r'}$, $(a^r)^{r'}=a^{rr'}$, $a^r b^r=(ab)^r$, $\left(\dfrac{a}{b}\right)^r=\dfrac{a^r}{b^r}$.

---

### 📌 L'essentiel à retenir

- **Composée** : $\lim g\circ f = \ell$ si $\lim f = b$ et $\lim_{b} g=\ell$ ;
- Fonction **monotone bornée** → limite finie ;
- **Branche parabolique** : direction (OI) si $f(x)/x\to 0$, (OJ) si $f(x)/x\to\pm\infty$ ;
- **TVI + stricte monotonie** → solution **unique** ; $f(a)f(b)<0$ → un zéro dans $]a,b[$ (balayage/dichotomie) ;
- $f$ continue strictement monotone = **bijection**, $f^{-1}$ symétrique par rapport à $y=x$ ;
- $a^{p/q}=\sqrt[q]{a^p}$ et règles des puissances.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 1;

-- ---- L2 — Barycentre et lignes de niveau ----
update public.chapitres c set
  titre = 'L2 — Barycentre et lignes de niveau',
  description = 'Géométrie du plan · barycentre, réduction, coordonnées, lignes de niveau',
  resume = $md$*Thème : Géométrie du plan*

## 1. Barycentre de n points pondérés

Soit $(A_1,\alpha_1),(A_2,\alpha_2),\dots,(A_n,\alpha_n)$ des points pondérés.

- Si $\alpha_1+\alpha_2+\dots+\alpha_n \ne 0$, il existe un **unique** point $G$ tel que $\displaystyle\sum_{i=1}^{n}\alpha_i\,\overrightarrow{GA_i}=\vec{0}$. Ce point est le **barycentre** des points pondérés.
- Si $\alpha_1+\alpha_2+\dots+\alpha_n = 0$, le barycentre **n'existe pas**.

**Construction** : $\displaystyle\overrightarrow{A_1G}=\frac{\alpha_2}{\sum\alpha_i}\overrightarrow{A_1A_2}+\dots+\frac{\alpha_n}{\sum\alpha_i}\overrightarrow{A_1A_n}$. Pour deux points : $\overrightarrow{AG}=\dfrac{\beta}{\alpha+\beta}\overrightarrow{AB}$.

Notation : $G=\text{bar}\{(A_1,\alpha_1),\dots,(A_n,\alpha_n)\}$.

## 2. Isobarycentre

Barycentre de $n$ points affectés de **coefficients égaux** ($\alpha\ne 0$).
- $n=2$ : $G$ est le **milieu** de $[A_1A_2]$.
- $n=3$ (points non alignés) : $G$ est le **centre de gravité** du triangle.

## 3. Propriétés

- **Homogénéité** : le barycentre est inchangé si on multiplie **tous** les coefficients par un même réel $k\ne 0$.
- **Réduction** : pour tout point $M$, si $\sum\alpha_i\ne 0$ alors $\displaystyle\sum_{i=1}^{n}\alpha_i\overrightarrow{MA_i}=\Big(\sum\alpha_i\Big)\overrightarrow{MG}$. Si $\sum\alpha_i=0$, la somme $\sum\alpha_i\overrightarrow{MA_i}$ est un **vecteur constant** (indépendant de $M$).
- **Coordonnées** : $\displaystyle x_G=\frac{\sum\alpha_i x_i}{\sum\alpha_i}$, $y_G=\frac{\sum\alpha_i y_i}{\sum\alpha_i}$, $z_G=\frac{\sum\alpha_i z_i}{\sum\alpha_i}$.
- **Barycentre partiel** : on ne change pas $G$ en remplaçant $p$ points ($1<p<n$, de somme de coefficients non nulle) par leur barycentre $H$ affecté de cette somme.

## 4. Lignes de niveau

Ligne de niveau $k$ de $f$ : ensemble des points $M$ tels que $f(M)=k$.

- $\boldsymbol{M\mapsto \sum\alpha_i MA_i^2}$ : si $\sum\alpha_i\ne 0$, la ligne de niveau est $\varnothing$, $\{G\}$ ou un **cercle** de centre $G$ ; si $\sum\alpha_i=0$, c'est $\varnothing$, le plan, ou une **droite** de vecteur normal $\sum\alpha_i\overrightarrow{OA_i}$.
- $\boldsymbol{M\mapsto \dfrac{MA}{MB}}$ : si $k\ne 1$, **cercle** de diamètre $[G_1G_2]$ avec $G_1=\text{bar}\{(A,1),(B,k)\}$, $G_2=\text{bar}\{(A,1),(B,-k)\}$ ; si $k=1$, **médiatrice** de $[AB]$.
- $\boldsymbol{M\mapsto \text{Mes}(\overrightarrow{MA},\overrightarrow{MB})}$ : $=0$ droite $(AB)$ privée de $[AB]$ ; $=\pi$ segment $[AB]$ privé de $A,B$ ; $=\alpha$ **arc de cercle** d'extrémités $A$ et $B$.

---

### 📌 L'essentiel à retenir

- $G$ existe **ssi** $\sum\alpha_i\ne 0$, et alors $\sum\alpha_i\overrightarrow{GA_i}=\vec 0$ ;
- **Réduction** : $\sum\alpha_i\overrightarrow{MA_i}=(\sum\alpha_i)\overrightarrow{MG}$ (vecteur constant si $\sum\alpha_i=0$) ;
- Coordonnées de $G$ = **moyenne pondérée** des coordonnées ;
- **Homogénéité** + **barycentre partiel** simplifient les constructions ;
- Lignes de niveau : $\sum\alpha_i MA_i^2\to$ cercle/droite ; $\frac{MA}{MB}\to$ cercle ou médiatrice.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 2;

-- ---- L3 — Divisibilité dans Z ----
update public.chapitres c set
  titre = 'L3 — Divisibilité dans Z',
  description = 'Arithmétique · division euclidienne, congruences, numération, nombres premiers',
  resume = $md$*Thème : Arithmétique*

## 1. Divisibilité dans $\mathbb{Z}$

Soit $a,b\in\mathbb{Z}$, $b\ne 0$. On dit que **$b$ divise $a$** (noté $b\,|\,a$) s'il existe $k\in\mathbb{Z}$ tel que $a=kb$.

**Propriétés** ($a,b,c$ non nuls) :
- si $b\,|\,a$ alors $|b|\le|a|$ ;
- si $a\,|\,b$ et $b\,|\,a$ alors $a=b$ ou $a=-b$ ;
- si $a\,|\,b$ et $b\,|\,c$ alors $a\,|\,c$ ;
- si $a\,|\,b$ et $a\,|\,c$ alors $a\,|\,(pb+qc)$ pour tous $p,q\in\mathbb{Z}$ (**combinaison linéaire**).

## 2. Division euclidienne

Pour $a\in\mathbb{Z}$, $b\in\mathbb{Z}^*$, il existe un **unique** couple $(q,r)$ avec $q\in\mathbb{Z}$, $r\in\mathbb{N}$ tel que :
$$a=bq+r,\qquad 0\le r<|b|.$$
$q$ est le **quotient**, $r$ le **reste** (toujours positif). $b\,|\,a \iff r=0$.

## 3. Congruences modulo $n$

$a\equiv b\ [n]$ signifie $n\,|\,(a-b)$.

**Propriétés** (réflexive, symétrique, transitive) et compatibilité : si $a\equiv b\ [n]$ et $c\equiv d\ [n]$, alors
$$a+c\equiv b+d\ [n],\quad a\times c\equiv b\times d\ [n],\quad a^k\equiv b^k\ [n].$$
De plus $a\equiv a'\ [n] \iff a$ et $a'$ ont le **même reste** dans la division par $n$.

## 4. Numération

Tout entier $x>0$ s'écrit de façon unique en base $b\ge 2$ :
$$x=\overline{a_n a_{n-1}\dots a_1 a_0}^{\,b}=\sum_{k=0}^{n}a_k b^k,\quad 0\le a_k<b,\ a_n\ne 0.$$
Bases usuelles : 2 (binaire), 8 (octale), 10 (décimale), 16 (hexadécimale : $A=10,\dots,F=15$).

**Critères de divisibilité** (base 10) : par 2/5 (chiffre des unités), par 3/9 (somme des chiffres), par 4/25 (deux derniers chiffres), par 8 (trois derniers), par 11 (différence alternée des chiffres).

## 5. Nombres premiers

$p$ est **premier** s'il a exactement deux diviseurs positifs : 1 et $p$.
- Si $n>1$ n'est pas premier, il admet un diviseur premier $p$ tel que $2\le p\le\sqrt{n}$.
- Il existe une **infinité** de nombres premiers.
- **Décomposition unique** : $n=p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_k^{\alpha_k}$. Le nombre de diviseurs positifs est $(1+\alpha_1)(1+\alpha_2)\cdots(1+\alpha_k)$.

---

### 📌 L'essentiel à retenir

- $b\,|\,a \iff \exists k,\ a=kb$ ; un diviseur commun divise toute **combinaison linéaire** ;
- **Division euclidienne** : $a=bq+r$, $0\le r<|b|$, unique, reste $\ge 0$ ;
- Les congruences sont compatibles avec $+$, $\times$ et les **puissances** : $a\equiv b\ [n]\Rightarrow a^k\equiv b^k\ [n]$ ;
- Écriture en base $b$ : $x=\sum a_k b^k$ ; critères de divisibilité par 2, 3, 4, 5, 8, 9, 11, 25 ;
- $n$ non premier $\Rightarrow$ diviseur premier $\le\sqrt n$ ; nombre de diviseurs $=\prod(1+\alpha_i)$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 3;

-- ---- L4 — Dérivabilité et étude de fonctions ----
update public.chapitres c set
  titre = 'L4 — Dérivabilité et étude de fonctions',
  description = 'Fonctions numériques · dérivée à gauche/droite, composée, réciproque, accroissements finis',
  resume = $md$*Thème : Fonctions numériques*

## 1. Dérivabilité à gauche / à droite

$f$ est **dérivable à gauche** (resp. à droite) en $x_0$ si $\lim\limits_{\substack{x\to x_0 \\ x<x_0}}\dfrac{f(x)-f(x_0)}{x-x_0}$ (resp. $x>x_0$) existe et est **finie**. On note $f'_g(x_0)$ (resp. $f'_d(x_0)$).

- $f$ est **dérivable en $x_0$** $\iff$ $f'_g(x_0)$ et $f'_d(x_0)$ existent et $f'_g(x_0)=f'_d(x_0)$.
- Si $\dfrac{f(x)-f(x_0)}{x-x_0}$ tend vers $\pm\infty$, la courbe admet une **demi-tangente verticale** en $x_0$.

## 2. Dérivée d'une composée

Si $g$ est dérivable en $x_0$ et $f$ dérivable en $g(x_0)$ :
$$(f\circ g)'(x_0)=g'(x_0)\times f'\big(g(x_0)\big).$$

**Conséquences** ($u$ dérivable sur $K$) :

| Fonction | Dérivée |
|---|---|
| $u^n$ ($n\in\mathbb{Q}^*$) | $nu'u^{n-1}$ |
| $\sqrt{u}$ ($u>0$) | $\dfrac{u'}{2\sqrt{u}}$ |
| $\cos u$ | $-u'\sin u$ |
| $\sin u$ | $u'\cos u$ |
| $\tan u$ | $u'(1+\tan^2 u)=\dfrac{u'}{\cos^2 u}$ |

## 3. Dérivée d'une bijection réciproque

Si $f$ est dérivable et **strictement monotone** sur $K$, $y_0=f(x_0)$ et $f'(x_0)\ne 0$, alors $f^{-1}$ est dérivable en $y_0$ et :
$$\big(f^{-1}\big)'(y_0)=\frac{1}{f'\big(f^{-1}(y_0)\big)}=\frac{1}{f'(x_0)}.$$

## 4. Dérivées successives

$f'$ (dérivée première), $f''$ (seconde), …, $f^{(n)}=\dfrac{d^n f}{dx^n}$ (dérivée d'ordre $n$).

## 5. Inégalité des accroissements finis

- Si $\forall x\in[a,b],\ m\le f'(x)\le M$, alors $m(b-a)\le f(b)-f(a)\le M(b-a)$.
- Si $\forall x\in I,\ |f'(x)|\le M$, alors $|f(b)-f(a)|\le M|b-a|$ pour tous $a,b\in I$.

## 6. Étude de fonctions

Le signe de $f'$ donne les **variations** ($f'>0$ croissante, $f'<0$ décroissante) ; $f'$ s'annule en changeant de signe → **extremum**. On utilise limites, asymptotes, branches paraboliques, tangentes pour tracer la courbe.

---

### 📌 L'essentiel à retenir

- Dérivable en $x_0$ $\iff$ $f'_g(x_0)=f'_d(x_0)$ (finis) ; limite infinie → **demi-tangente verticale** ;
- **Composée** : $(f\circ g)'=g'\cdot(f'\circ g)$ ; d'où $(u^n)'=nu'u^{n-1}$, $(\sqrt u)'=\frac{u'}{2\sqrt u}$… ;
- **Réciproque** : $(f^{-1})'(y_0)=\dfrac{1}{f'(x_0)}$ si $f'(x_0)\ne 0$ ;
- **Accroissements finis** : $|f(b)-f(a)|\le M|b-a|$ si $|f'|\le M$ ;
- Étude complète : signe de $f'$ → variations et extremums.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 4;

-- ---- L5 — Géométrie analytique de l'espace ----
update public.chapitres c set
  titre = 'L5 — Géométrie analytique de l''espace',
  description = 'Géométrie de l''espace · vecteur normal, équations, distances, positions relatives',
  resume = $md$*Thème : Géométrie de l'espace — repère orthonormé $(O,\vec\imath,\vec\jmath,\vec k)$*

## 1. Vecteur normal et équation cartésienne d'un plan

- Un **vecteur normal** à un plan $(P)$ est un vecteur non nul $\vec n$ orthogonal à deux vecteurs directeurs de $(P)$. Pour $A\in(P)$ : $M\in(P)\iff \overrightarrow{AM}\cdot\vec n=0$.
- Tout plan de vecteur normal $\vec n(a,b,c)\ne\vec 0$ a une **équation cartésienne** $ax+by+cz+d=0$, et réciproquement.
- Deux plans de normaux $\vec n,\vec n'$ : **parallèles** $\iff\vec n,\vec n'$ colinéaires ; **perpendiculaires** $\iff\vec n\cdot\vec n'=0$.

## 2. Distance d'un point à un plan

Pour $A(x_0,y_0,z_0)$ et $(P):ax+by+cz+d=0$ :
$$d(A,P)=\frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}.$$

## 3. Représentation paramétrique d'une droite

Droite passant par $A(x_0,y_0,z_0)$, de vecteur directeur $\vec u(a,b,c)$ :
$$\begin{cases}x=x_0+ta\\ y=y_0+tb\\ z=z_0+tc\end{cases},\quad t\in\mathbb{R}.$$

## 4. Positions relatives

- **Deux droites** ($\vec u,\vec v$) : parallèles $\iff\vec u,\vec v$ colinéaires ; sinon **sécantes** (si $\overrightarrow{AB},\vec u,\vec v$ coplanaires) ou **non coplanaires**. Orthogonales $\iff\vec u\cdot\vec v=0$.
- **Droite et plan** ($\vec u,\vec n$) : si $\vec u\cdot\vec n=0$, $(D)$ **parallèle** à $(P)$ (incluse si un point de $(D)\in(P)$) ; si $\vec u\cdot\vec n\ne 0$, **sécants** ; orthogonaux si $\vec u,\vec n$ colinéaires.
- **Deux plans** ($\vec n,\vec n'$) : parallèles $\iff\vec n,\vec n'$ colinéaires ; sinon **sécants** suivant une droite. Perpendiculaires $\iff\vec n\cdot\vec n'=0$.

---

### 📌 L'essentiel à retenir

- Plan $\leftrightarrow$ **équation** $ax+by+cz+d=0$ avec $\vec n(a,b,c)$ **normal** ;
- **Distance** point-plan : $d=\dfrac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}$ ;
- Droite : **paramétrique** $x=x_0+ta,\dots$ avec $\vec u(a,b,c)$ directeur ;
- Positions relatives : tester la **colinéarité** de ($\vec u,\vec v$) / ($\vec n,\vec n'$) et le **produit scalaire** ($\vec u\cdot\vec n$) ;
- Intersection de deux plans sécants = droite (poser $z=\lambda$ pour la paramétrer).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 5;

-- ---- L6 — Primitives ----
update public.chapitres c set
  titre = 'L6 — Primitives',
  description = 'Fonctions numériques · primitives usuelles, opérations, composition',
  resume = $md$*Thème : Fonctions numériques*

## 1. Notion de primitive

$F$ est une **primitive** de $f$ sur un intervalle $I$ si $F$ est dérivable sur $I$ et $F'(x)=f(x)$ pour tout $x\in I$.

- **Existence** : toute fonction **continue** sur $I$ admet une primitive sur $I$.
- **Ensemble des primitives** : si $F$ est une primitive de $f$, toutes les primitives sont de la forme $x\mapsto F(x)+c$, $c\in\mathbb{R}$ (une **infinité**).
- **Condition initiale** : il existe une **unique** primitive prenant une valeur donnée $y_0$ en un point $x_0$.

## 2. Primitives des fonctions usuelles

| $f(x)$ | Primitive $F(x)$ |
|---|---|
| $a$ | $ax$ |
| $x^r$ ($r\in\mathbb{Q}\setminus\{-1\}$) | $\dfrac{1}{r+1}x^{r+1}$ |
| $\dfrac{1}{x^r}$ ($r\ne 1$) | $\dfrac{-1}{(r-1)x^{r-1}}$ |
| $\dfrac{1}{\sqrt{x}}$ | $2\sqrt{x}$ |
| $\cos x$ | $\sin x$ |
| $\sin x$ | $-\cos x$ |
| $1+\tan^2 x=\dfrac{1}{\cos^2 x}$ | $\tan x$ |

(à une constante $c$ près)

## 3. Opérations et composition

Si $U,V$ sont des primitives de $u,v$ et $k\in\mathbb{R}$ :
- $U+V$ est une primitive de $u+v$ ; $kU$ est une primitive de $ku$.

**Composition** : une primitive de $u'\times(v'\circ u)$ est $v\circ u$. En particulier :

| $f$ | Primitive $F$ | Condition |
|---|---|---|
| $u'u^r$ ($r\ne-1$) | $\dfrac{1}{r+1}u^{r+1}$ | $u>0$ |
| $\dfrac{u'}{\sqrt{u}}$ | $2\sqrt{u}$ | $u>0$ |
| $u'\cos u$ | $\sin u$ | |
| $u'\sin u$ | $-\cos u$ | |
| $\cos(ax+b)$ | $\dfrac{1}{a}\sin(ax+b)$ | $a\ne 0$ |
| $\sin(ax+b)$ | $-\dfrac{1}{a}\cos(ax+b)$ | $a\ne 0$ |

---

### 📌 L'essentiel à retenir

- $F$ primitive de $f$ $\iff$ $F'=f$ ; toute fonction **continue** admet des primitives ;
- Deux primitives diffèrent d'une **constante** : $x\mapsto F(x)+c$ ;
- **Une seule** primitive vérifie une condition initiale donnée ;
- Bien reconnaître les formes $u'u^r$, $\dfrac{u'}{\sqrt u}$, $u'\cos u$, $u'\sin u$ pour intégrer une composée ;
- $\displaystyle\int$ de $\cos(ax+b)$ et $\sin(ax+b)$ fait apparaître le facteur $\dfrac{1}{a}$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 6;

-- ---- L7 — Coniques ----
update public.chapitres c set
  titre = 'L7 — Coniques',
  description = 'Géométrie du plan · parabole, ellipse, hyperbole, équations réduites',
  resume = $md$*Thème : Géométrie du plan*

## 1. Définition par foyer et directrice

Soit une droite $(\mathcal{D})$, un point $F\notin(\mathcal{D})$ et un réel $e>0$. La **conique** de foyer $F$, directrice $(\mathcal{D})$ et excentricité $e$ est l'ensemble des points $M$ tels que $\dfrac{MF}{MH}=e$, où $H$ est le projeté orthogonal de $M$ sur $(\mathcal{D})$.

- $e=1$ → **parabole** ;
- $0<e<1$ → **ellipse** ;
- $e>1$ → **hyperbole**.

L'**axe focal** $(\Delta)$ (passant par $F$, $\perp(\mathcal{D})$) est un axe de symétrie. Sommets sur $(\Delta)$ : $A=\text{bar}\{(F,1),(K,e)\}$, $A'=\text{bar}\{(F,1),(K,-e)\}$ ($K$ = projeté de $F$ sur $(\mathcal{D})$).

## 2. Équation réduite de la parabole

Dans un repère de sommet $S$ : $\boxed{y^2=2px}$ (paramètre $p=KF>0$), foyer $F\left(\tfrac{p}{2};0\right)$, directrice $x=-\tfrac{p}{2}$. En échangeant les axes : $x^2=2py$.

## 3. Équations réduites des coniques à centre ($e\ne 1$)

Centre $O$ = milieu de $[AA']$, $a=OA$, $c=OF$, $e=\dfrac{c}{a}$ :

- **Ellipse** ($0<e<1$, $c<a$) : $\boxed{\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1}$ avec $b^2=a^2-c^2$. Foyers $(\pm c;0)$, directrices $x=\pm\dfrac{a^2}{c}$. Si $a=b$ : **cercle**.
- **Hyperbole** ($e>1$, $c>a$) : $\boxed{\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1}$ avec $b^2=c^2-a^2$. Foyers $(\pm c;0)$, **asymptotes** $y=\pm\dfrac{b}{a}x$. Si $a=b$ : hyperbole **équilatère**.

## 4. Régionnement

$M$ **intérieur** à la conique si $MF<eMH$ ; **extérieur** si $MF>eMH$. Le foyer est intérieur ; tout point de la directrice est extérieur.

---

### 📌 L'essentiel à retenir

- Une conique = $\dfrac{MF}{MH}=e$ : **parabole** ($e=1$), **ellipse** ($e<1$), **hyperbole** ($e>1$) ;
- **Parabole** : $y^2=2px$, foyer $(\frac p2;0)$, directrice $x=-\frac p2$ ;
- **Ellipse** : $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$, $b^2=a^2-c^2$, $e=\frac ca$ ;
- **Hyperbole** : $\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$, $b^2=c^2-a^2$, asymptotes $y=\pm\frac ba x$ ;
- Une équation générale se ramène à la forme réduite par **mise sous forme canonique** (translation du centre).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 7;

-- ---- L8 — Fonction logarithme népérien ----
update public.chapitres c set
  titre = 'L8 — Fonction logarithme népérien',
  description = 'Fonctions numériques · propriétés, limites, dérivée de ln u, base a',
  resume = $md$*Thème : Fonctions numériques*

## 1. Définition et conséquences

La fonction **logarithme népérien** $\ln$ est la primitive sur $]0;+\infty[$ de $x\mapsto\dfrac{1}{x}$ qui **s'annule en 1**.

- $\ln 1=0$ ; $D_{\ln}=]0;+\infty[$ ;
- $\ln$ est dérivable sur $]0;+\infty[$ et $\ln'(x)=\dfrac{1}{x}>0$ → **strictement croissante**.

## 2. Propriétés algébriques

Pour $a,b>0$ et $r\in\mathbb{Q}$ :
$$\ln(ab)=\ln a+\ln b,\quad \ln\frac1b=-\ln b,\quad \ln\frac ab=\ln a-\ln b,$$
$$\ln(a^r)=r\ln a,\quad \ln\sqrt a=\tfrac12\ln a.$$

## 3. Équations et inéquations

Pour $a,b>0$ : $\ln a=\ln b\iff a=b$ ; $\ln a>\ln b\iff a>b$.
- $\ln x=0\iff x=1$ ; $\ln x<0\iff 0<x<1$ ; $\ln x>0\iff x>1$.
- **Le nombre $e$** : unique réel tel que $\ln e=1$, $e\approx 2{,}718$. Ainsi $\ln(e^r)=r$.
- Toujours déterminer l'**ensemble de validité** ($u(x)>0$) avant de résoudre. Type $a(\ln x)^2+b\ln x+c=0$ : poser $X=\ln x$.

## 4. Limites

$$\lim_{x\to+\infty}\ln x=+\infty,\quad \lim_{x\to 0^+}\ln x=-\infty\ (\text{asymptote } x=0),$$
$$\lim_{x\to+\infty}\frac{\ln x}{x}=0,\quad \lim_{x\to 0^+}x\ln x=0,\quad \lim_{x\to 0}\frac{\ln(1+x)}{x}=1,\quad \lim_{x\to 1}\frac{\ln x}{x-1}=1.$$
Tangente en 1 : $y=x-1$, et pour tout $x>0$, $\ln x\le x-1$.

## 5. Fonction $\ln u$ et primitive de $\frac{u'}{u}$

- Si $u>0$ dérivable : $(\ln u)'=\dfrac{u'}{u}$ ; si $u$ ne s'annule pas : $(\ln|u|)'=\dfrac{u'}{u}$.
- Une primitive de $\dfrac{u'}{u}$ est $\ln|u|$.

## 6. Logarithme de base $a$

Pour $a>0$, $a\ne 1$ : $\log_a(x)=\dfrac{\ln x}{\ln a}$. Le **logarithme décimal** $\log x=\dfrac{\ln x}{\ln 10}$ vérifie $\log(10^n)=n$.

---

### 📌 L'essentiel à retenir

- $\ln$ = primitive de $\frac1x$ nulle en 1 ; **strictement croissante**, $D=]0;+\infty[$ ;
- $\ln(ab)=\ln a+\ln b$, $\ln\frac ab=\ln a-\ln b$, $\ln(a^r)=r\ln a$ ;
- $e$ : $\ln e=1$ ; résoudre avec l'**ensemble de validité** et le changement $X=\ln x$ ;
- Croissances comparées : $\dfrac{\ln x}{x}\to 0$, $x\ln x\to 0$, $\dfrac{\ln(1+x)}{x}\to 1$ ;
- $(\ln|u|)'=\dfrac{u'}{u}$ → primitive de $\dfrac{u'}{u}$ = $\ln|u|$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 8;

-- ---- L9 — Nombres complexes ----
update public.chapitres c set
  titre = 'L9 — Nombres complexes',
  description = 'Calculs algébriques · forme algébrique, module, argument, Moivre, Euler, équations',
  resume = $md$*Thème : Calculs algébriques*

## 1. Forme algébrique

Un **nombre complexe** s'écrit de façon unique $z=a+ib$ ($a,b\in\mathbb{R}$, $i^2=-1$). $a=\mathcal{R}e(z)$, $b=\mathcal{I}m(z)$. Les calculs se font comme dans $\mathbb{R}$ avec $i^2=-1$.

- $z$ **imaginaire pur** $\iff \mathcal{R}e(z)=0$ ; $z$ **réel** $\iff \mathcal{I}m(z)=0$.
- Puissances de $i$ : $i^{4n}=1$, $i^{4n+1}=i$, $i^{4n+2}=-1$, $i^{4n+3}=-i$.

## 2. Conjugué et module

**Conjugué** : $\overline{z}=a-ib$. On a $z+\overline z=2\mathcal{R}e(z)$, $z-\overline z=2i\,\mathcal{I}m(z)$, $z\overline z=a^2+b^2$, $\overline{z+z'}=\overline z+\overline{z'}$, $\overline{zz'}=\overline z\,\overline{z'}$, $\overline{z^n}=\overline z^n$.
- $z\in\mathbb{R}\iff z=\overline z$ ; $z\in i\mathbb{R}\iff z=-\overline z$.

**Module** : $|z|=\sqrt{a^2+b^2}=\sqrt{z\overline z}$. Propriétés : $|zz'|=|z||z'|$, $|z^n|=|z|^n$, $\left|\frac{z'}{z}\right|=\frac{|z'|}{|z|}$, et **inégalité triangulaire** $|z+z'|\le|z|+|z'|$. Géométriquement $|z|=OM$ et $|z_B-z_A|=AB$.

## 3. Argument et formes trigonométrique / exponentielle

Pour $z\ne 0$, un **argument** $\theta$ vérifie $\cos\theta=\frac{a}{|z|}$, $\sin\theta=\frac{b}{|z|}$. C'est une mesure de $(\vec u,\overrightarrow{OM})$.

- **Forme trigonométrique** : $z=r(\cos\theta+i\sin\theta)$, $r=|z|$.
- **Forme exponentielle** : $z=re^{i\theta}$ où $e^{i\theta}=\cos\theta+i\sin\theta$.
- $\arg(zz')=\arg z+\arg z'$, $\arg\frac{z'}{z}=\arg z'-\arg z$, $\arg(z^n)=n\arg z$ (modulo $2\pi$).
- Produit/quotient/puissance : $re^{i\theta}\cdot r'e^{i\varphi}=rr'e^{i(\theta+\varphi)}$, $(re^{i\theta})^n=r^n e^{in\theta}$.

## 4. Moivre et Euler

- **Moivre** : $(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta)$.
- **Euler** : $\cos\theta=\dfrac{e^{i\theta}+e^{-i\theta}}{2}$, $\sin\theta=\dfrac{e^{i\theta}-e^{-i\theta}}{2i}$ (servent à **linéariser** $\cos^n,\sin^n$).

## 5. Équations dans $\mathbb{C}$

- **Racines carrées** de $z_0$ : poser $z=x+iy$, résoudre $x^2+y^2=|z_0|$, $x^2-y^2=\mathcal{R}e(z_0)$, $2xy=\mathcal{I}m(z_0)$ (deux racines opposées).
- **Second degré** $az^2+bz+c=0$ : $\Delta=b^2-4ac$, $\delta$ une racine carrée de $\Delta$, $z=\dfrac{-b\pm\delta}{2a}$. Si $a,b,c$ réels et $\Delta<0$ : solutions **conjuguées**.
- **Racines $n$-ièmes** de $z_0=Re^{i\theta}$ : $z_k=\sqrt[n]{R}\,e^{i\frac{\theta+2k\pi}{n}}$, $k\in\{0,\dots,n-1\}$ (sommets d'un **polygone régulier**). Racines de l'unité : $z_k=e^{i\frac{2k\pi}{n}}$, de somme nulle.

---

### 📌 L'essentiel à retenir

- $z=a+ib$, $\overline z=a-ib$, $|z|=\sqrt{a^2+b^2}=\sqrt{z\overline z}$ ;
- Formes : trigonométrique $r(\cos\theta+i\sin\theta)$ et exponentielle $re^{i\theta}$ ; produits/puissances **ajoutent/multiplient les arguments** ;
- **Moivre** $(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$ ; **Euler** pour linéariser ;
- Second degré : $\Delta$, racine carrée $\delta$, $z=\frac{-b\pm\delta}{2a}$ ;
- Racines $n$-ièmes de $Re^{i\theta}$ : $\sqrt[n]{R}\,e^{i(\theta+2k\pi)/n}$ → polygone régulier.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 9;

-- ---- L10 — Fonction exponentielle et puissance ----
update public.chapitres c set
  titre = 'L10 — Fonction exponentielle et puissance',
  description = 'Fonctions numériques · exp, base a, fonction puissance, croissances comparées',
  resume = $md$*Thème : Fonctions numériques*

## 1. La fonction exponentielle népérienne

$\exp$ est la **bijection réciproque** de $\ln$, notée $\exp(x)=e^x$, définie sur $\mathbb{R}$.

- $e^x=y\iff x=\ln y$ (pour $y>0$) ; $e^{\ln x}=x$ ($x>0$) ; $\ln(e^y)=y$.
- $e^x>0$ pour tout $x$ ; $e^0=1$, $e^1=e$ ; **strictement croissante**.

**Propriétés algébriques** ($r\in\mathbb{Q}$) :
$$e^a e^b=e^{a+b},\quad e^{-b}=\frac{1}{e^b},\quad \frac{e^a}{e^b}=e^{a-b},\quad (e^a)^r=e^{ar}.$$

**Équations/inéquations** : $e^a=e^b\iff a=b$ ; $e^a<e^b\iff a<b$. Type $e^{2x}+e^x+c=0$ : poser $X=e^x>0$.

## 2. Limites et dérivée

$$\lim_{x\to-\infty}e^x=0,\quad \lim_{x\to+\infty}e^x=+\infty,\quad \lim_{x\to-\infty}xe^x=0,\quad \lim_{x\to+\infty}\frac{e^x}{x}=+\infty,\quad \lim_{x\to 0}\frac{e^x-1}{x}=1.$$

Dérivée : $(e^x)'=e^x$. Plus généralement $(e^u)'=u'e^u$, et une primitive de $u'e^u$ est $e^u+c$.

## 3. Exponentielle de base $a$ et fonction puissance

- **Exponentielle de base $a$** ($a>0$) : $a^x=e^{x\ln a}$. Dérivée $(a^x)'=\ln(a)\,a^x$. Croissante si $a>1$, décroissante si $0<a<1$.
- **Fonction puissance** d'exposant $\alpha\ne 0$ : $x^\alpha=e^{\alpha\ln x}$ (définie sur $]0;+\infty[$).

## 4. Croissances comparées

Pour $\alpha>0$ :
$$\lim_{x\to+\infty}\frac{\ln x}{x^\alpha}=0,\quad \lim_{x\to 0^+}x^\alpha\ln x=0,\quad \lim_{x\to+\infty}\frac{e^x}{x^\alpha}=+\infty,\quad \lim_{x\to+\infty}x^\alpha e^{-x}=0.$$
(l'exponentielle « l'emporte » sur les puissances, qui « l'emportent » sur le logarithme.)

---

### 📌 L'essentiel à retenir

- $\exp$ = réciproque de $\ln$ ; $e^x>0$, **strictement croissante**, $(e^x)'=e^x$ ;
- $e^ae^b=e^{a+b}$, $\frac{e^a}{e^b}=e^{a-b}$, $(e^a)^r=e^{ar}$ ; résoudre en posant $X=e^x>0$ ;
- Limites clés : $\dfrac{e^x-1}{x}\to 1$, $xe^x\to 0$ (en $-\infty$), $\dfrac{e^x}{x}\to+\infty$ ;
- $a^x=e^{x\ln a}$, $(a^x)'=\ln(a)a^x$ ; $x^\alpha=e^{\alpha\ln x}$ ;
- **Croissances comparées** : $e^x\gg x^\alpha\gg\ln x$ en $+\infty$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 10;

-- ---- L11 — PPCM et PGCD ----
update public.chapitres c set
  titre = 'L11 — PPCM et PGCD',
  description = 'Arithmétique · Euclide, Bézout, Gauss, équations diophantiennes',
  resume = $md$*Thème : Arithmétique*

## 1. PPCM

Le **PPCM** de $a,b$ (non nuls) est le plus petit élément strictement positif de $a\mathbb{Z}\cap b\mathbb{Z}$.
- $\text{PPCM}(a;b)=\text{PPCM}(|a|;|b|)$ ; $\max\{a;b\}\le\text{PPCM}(a;b)\le ab$.
- $a\mathbb{Z}\cap b\mathbb{Z}=\mu\mathbb{Z}$ où $\mu=\text{PPCM}(a;b)$.
- $\text{PPCM}(ka;kb)=|k|\,\text{PPCM}(a;b)$.

## 2. PGCD

Le **PGCD** de $a,b$ est le plus grand diviseur commun.
- $1\le\text{PGCD}(a;b)\le\min\{a;b\}$ ; $\mathcal{D}(a;b)=\mathcal{D}(\delta)$ où $\delta=\text{PGCD}(a;b)$.
- $\text{PGCD}(ka;kb)=|k|\,\text{PGCD}(a;b)$.
- **Algorithme d'Euclide** : si $r$ est le reste de $a$ par $b$, alors $\text{PGCD}(a;b)=\text{PGCD}(b;r)$ (et $=b$ si $r=0$).
- **Relation** : $\text{PPCM}(a;b)\times\text{PGCD}(a;b)=ab$.

## 3. Nombres premiers entre eux

$a$ et $b$ sont **premiers entre eux** si $\text{PGCD}(a;b)=1$.

- **Théorème de Bézout** : $a,b$ premiers entre eux $\iff \exists\,u,v\in\mathbb{Z},\ au+bv=1$. (Cas général : $au+bv=d$ a une solution avec $d=\text{PGCD}(a;b)$.)
- **Théorème de Gauss** : si $a\,|\,bc$ et $\text{PGCD}(a;b)=1$, alors $a\,|\,c$.
- Conséquences : si $a\wedge b=1$ et $a\wedge c=1$ alors $a\wedge bc=1$ ; si $a\,|\,c$, $b\,|\,c$ et $a\wedge b=1$ alors $ab\,|\,c$ ; si $a\wedge b=1$ alors $\text{PPCM}(a;b)=ab$.

## 4. Équations diophantiennes

- $ax+by=c$ (dans $\mathbb{Z}^2$) admet des solutions $\iff \text{PGCD}(a;b)$ divise $c$. Méthode : solution particulière + théorème de Gauss pour la solution générale.
- $ax\equiv b\ [n]$ admet des solutions $\iff \text{PGCD}(a;n)$ divise $b$ (résolution par tableau de congruence).

---

### 📌 L'essentiel à retenir

- $\text{PPCM}\times\text{PGCD}=ab$ ; PGCD par l'**algorithme d'Euclide** ;
- **Bézout** : $a\wedge b=1\iff \exists u,v,\ au+bv=1$ ;
- **Gauss** : $a\,|\,bc$ et $a\wedge b=1\Rightarrow a\,|\,c$ ;
- $ax+by=c$ soluble $\iff \text{PGCD}(a;b)\,|\,c$ ; solution générale = particulière + Gauss ;
- $ax\equiv b\ [n]$ soluble $\iff \text{PGCD}(a;n)\,|\,b$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 11;

-- ---- L12 — Suites numériques ----
update public.chapitres c set
  titre = 'L12 — Suites numériques',
  description = 'Fonctions numériques · récurrence, convergence, croissances comparées, suite récurrente',
  resume = $md$*Thème : Fonctions numériques*

## 1. Rappels : suites arithmétiques et géométriques

| | Arithmétique | Géométrique |
|---|---|---|
| Récurrence | $u_{n+1}=u_n+r$ | $u_{n+1}=q\,u_n$ |
| Terme général | $u_n=u_0+nr$ | $u_n=u_0 q^n$ |
| | $u_n=u_p+(n-p)r$ | $u_n=u_p q^{n-p}$ |
| Somme | $(n{+}1)\dfrac{u_0+u_n}{2}$ | $u_0\dfrac{1-q^{n+1}}{1-q}$ ($q\ne1$) |

## 2. Raisonnement par récurrence

Pour montrer $P(n)$ vraie pour $n\ge n_0$ : **initialisation** ($P(n_0)$ vraie), **hérédité** ($P(k)\Rightarrow P(k+1)$), **conclusion**.

## 3. Sens de variation

- **Algébrique** : signe de $u_{n+1}-u_n$ ; ou comparer $\dfrac{u_{n+1}}{u_n}$ à 1 (si $u_n>0$).
- **Par une fonction** : si $u_n=f(n)$, la suite a le même sens de variation que $f$.

## 4. Suites majorées, minorées, bornées

$(u_n)$ **majorée** si $\exists M,\ u_n\le M$ ; **minorée** si $\exists m,\ u_n\ge m$ ; **bornée** si les deux.

## 5. Convergence

- $(u_n)$ **convergente** = admet une limite finie (unique) ; sinon **divergente**.
- Si $u_n=f(n)$ et $\lim\limits_{x\to+\infty}f(x)=\ell$, alors $\lim u_n=\ell$.
- **Suites monotones** : toute suite **croissante majorée** converge ; **décroissante minorée** converge ; croissante non majorée $\to+\infty$ ; décroissante non minorée $\to-\infty$.

## 6. Comparaison et croissances comparées

- **Encadrement (gendarmes)** : si $v_n\le u_n\le w_n$ et $(v_n),(w_n)\to\ell$, alors $u_n\to\ell$. Conséquence : si $|u_n-\ell|\le v_n$ et $v_n\to 0$, alors $u_n\to\ell$.
- **Croissances comparées** ($a>1$, $\alpha>0$) : $\lim\dfrac{\ln n}{n^\alpha}=0$, $\lim\dfrac{n^\alpha}{a^n}=0$. Suite géométrique $a^n$ : $\to 0$ si $|a|<1$, $\to+\infty$ si $a>1$, pas de limite si $a\le-1$.
- **$v_n=f(u_n)$** : si $u_n\to a$ et $\lim\limits_{x\to a}f(x)=\ell$, alors $v_n\to\ell$.

## 7. Suite récurrente $u_{n+1}=f(u_n)$

Si $f$ est **continue** et $(u_n)$ **converge** vers $\ell$, alors $\ell$ est solution de $f(x)=x$ (point fixe).

---

### 📌 L'essentiel à retenir

- Arithmétique $u_n=u_0+nr$ ; géométrique $u_n=u_0q^n$ ; sommes associées ;
- **Récurrence** : initialisation → hérédité → conclusion ;
- Variation : signe de $u_{n+1}-u_n$ ou quotient $\frac{u_{n+1}}{u_n}$ ;
- **Croissante majorée** (ou décroissante minorée) $\Rightarrow$ **convergente** ;
- Théorème des **gendarmes** + croissances comparées $\frac{\ln n}{n^\alpha}\to 0$, $\frac{n^\alpha}{a^n}\to 0$ ;
- Suite récurrente convergente : la limite vérifie $f(\ell)=\ell$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 12;

-- ---- L13 — Nombres complexes et géométrie du plan ----
update public.chapitres c set
  titre = 'L13 — Nombres complexes et géométrie du plan',
  description = 'Transformations du plan · configurations, transformations, similitude directe',
  resume = $md$*Thème : Transformations du plan (plan complexe, repère orthonormé direct)*

## 1. Interprétations de $\dfrac{z_A-z_B}{z_C-z_D}$

Pour des points d'affixes $z_A,z_B,z_C,z_D$ ($A\ne B$, $C\ne D$) :
$$\arg\!\left(\frac{z_A-z_B}{z_C-z_D}\right)=\text{Mes}\big(\overrightarrow{DC},\overrightarrow{BA}\big),\qquad \left|\frac{z_A-z_B}{z_C-z_D}\right|=\frac{AB}{CD}.$$

## 2. Ensembles de points

- $|z-z_A|=r$ : **cercle** de centre $A$, rayon $r$.
- $|z-z_A|=\lambda|z-z_B|$ : **médiatrice** de $[AB]$ si $\lambda=1$ ; **cercle** de diamètre $[G_1G_2]$ si $\lambda\ne1$ (barycentres).
- $\arg\frac{z-z_B}{z-z_A}=k\pi$ : droite $(AB)$ privée de $A,B$ ; $=\frac\pi2+k\pi$ : cercle de diamètre $[AB]$ privé de $A,B$.

## 3. Configurations et nombres complexes

Pour $A,B,C,D$ d'affixes distinctes :
- $(AB)\parallel(CD)\iff \dfrac{z_A-z_B}{z_C-z_D}\in\mathbb{R}^*$ ; **alignement** de $A,B,C$ $\iff\dfrac{z_A-z_B}{z_C-z_B}\in\mathbb{R}^*$.
- $(AB)\perp(CD)\iff \dfrac{z_A-z_B}{z_C-z_D}\in i\mathbb{R}^*$.
- $A,B,C,D$ **cocycliques** (ou alignés) $\iff \dfrac{z_C-z_A}{z_D-z_A}:\dfrac{z_C-z_B}{z_D-z_B}\in\mathbb{R}^*$.

**Triangles** (en $A$) : rectangle $\iff\frac{z_B-z_A}{z_C-z_A}\in i\mathbb{R}^*$ ; rectangle isocèle $\iff\frac{z_B-z_A}{z_C-z_A}=\pm i$ ; équilatéral $\iff\frac{z_B-z_A}{z_C-z_A}=e^{\pm i\pi/3}$.

## 4. Écritures complexes des transformations

| Transformation | Écriture complexe |
|---|---|
| Symétrie d'axe $(OI)$ | $z'=\overline z$ |
| Symétrie d'axe $(OJ)$ | $z'=-\overline z$ |
| Symétrie centrale de centre $\Omega(\omega)$ | $z'-\omega=-(z-\omega)$ |
| Translation de vecteur d'affixe $b$ | $z'=z+b$ |
| Homothétie de centre $\omega$, rapport $k$ | $z'-\omega=k(z-\omega)$ |
| Rotation de centre $\omega$, angle $\theta$ | $z'-\omega=e^{i\theta}(z-\omega)$ |

## 5. Similitude plane directe

Écriture complexe $z'=az+b$ ($a\in\mathbb{C}^*$, $b\in\mathbb{C}$).
- Si $a=1$ : **translation** de vecteur d'affixe $b$.
- Si $a\ne1$ : similitude de **centre** d'affixe $\dfrac{b}{1-a}$, **rapport** $|a|$, **angle** $\arg(a)$.
- Cas particuliers : $a\in\mathbb{R}^*\setminus\{1\}$ → homothétie ; $|a|=1$ → rotation.
- **Décomposition canonique** : $s=r\circ h=h\circ r$ (rotation et homothétie de même centre).

---

### 📌 L'essentiel à retenir

- $\arg\frac{z_A-z_B}{z_C-z_D}$ = angle ; $\left|\frac{z_A-z_B}{z_C-z_D}\right|=\frac{AB}{CD}$ ;
- Parallèles $\iff$ quotient $\in\mathbb{R}^*$ ; perpendiculaires $\iff$ quotient $\in i\mathbb{R}^*$ ; cocycliques $\iff$ birapport $\in\mathbb{R}^*$ ;
- Triangle rectangle isocèle en $A$ $\iff\frac{z_B-z_A}{z_C-z_A}=\pm i$ ; équilatéral $\iff e^{\pm i\pi/3}$ ;
- Rotation : $z'-\omega=e^{i\theta}(z-\omega)$ ; homothétie : $z'-\omega=k(z-\omega)$ ;
- **Similitude directe** $z'=az+b$ : centre $\frac{b}{1-a}$, rapport $|a|$, angle $\arg a$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 13;

-- ---- L14 — Isométries du plan ----
update public.chapitres c set
  titre = 'L14 — Isométries du plan',
  description = 'Transformations du plan · symétries, rotations, symétrie glissée, déplacements',
  resume = $md$*Thème : Transformations du plan*

## 1. Définition

Une **isométrie plane** est une application du plan dans le plan qui **conserve la distance**. Les translations, symétries orthogonales et rotations sont des isométries (l'homothétie de rapport $\ne\pm1$ n'en est pas une).

**Conservation** : toute isométrie est une bijection qui conserve le produit scalaire, le barycentre, le parallélisme, l'orthogonalité, les angles géométriques, le contact ; elle transforme droite en droite, cercle en cercle de même rayon.

## 2. Décomposition (symétries orthogonales)

- **Axes parallèles** : $s_{(\Delta)}\circ s_{(D)}$ est une **translation** de vecteur $2\overrightarrow{HK}$ ($H\in(D)$, $K$ projeté sur $(\Delta)$). Réciproquement toute translation se décompose ainsi.
- **Axes sécants en $O$**, d'angle $\alpha$ entre eux : $s_{(D)}\circ s_{(\Delta)}$ est une **rotation** de centre $O$, angle $2\alpha$. Si $\perp$ : **symétrie centrale** de centre $O$.

## 3. Composées d'isométries

- Translation ∘ rotation (angle $\ne0$) = **rotation** de même angle.
- **Symétrie glissée** : composée d'une symétrie d'axe $(D)$ et d'une translation de vecteur $\vec u$ **directeur** de $(D)$ (sans point invariant ; le milieu de $[MM']$ est sur l'axe).
- Translation ∘ symétrie d'axe $(\Delta)$ : **symétrie orthogonale** si $\vec u\perp(\Delta)$, sinon **symétrie glissée**.
- Symétrie ∘ rotation de centre $K$ : symétrie orthogonale si $K\in(D)$, sinon symétrie glissée.

## 4. Classification par points invariants

| Points invariants | Isométrie |
|---|---|
| Plan entier | identité |
| Droite $(D)$ | symétrie orthogonale d'axe $(D)$ |
| Un seul point $A$ | rotation de centre $A$ |
| Aucun | translation ou symétrie glissée |

## 5. Déplacements et antidéplacements

- **Déplacement** : conserve les angles orientés = translation ou rotation.
- **Antidéplacement** : change l'angle orienté en son opposé = symétrie orthogonale ou symétrie glissée.
- Déplacement ∘ déplacement (ou antidép. ∘ antidép.) = déplacement ; déplacement ∘ antidéplacement = antidéplacement.

## 6. Détermination

Pour $AB=A'B'$, $A\ne B$ :
- **Déplacement unique** $f$ avec $f(A)=A'$, $f(B)=B'$ : translation si $\overrightarrow{AB}=\overrightarrow{A'B'}$, sinon rotation d'angle $(\overrightarrow{AB},\overrightarrow{A'B'})$.
- **Antidéplacement unique** : symétrie orthogonale si $[AA']$ et $[BB']$ ont la **même médiatrice**, sinon symétrie glissée.

---

### 📌 L'essentiel à retenir

- **Isométrie** = conserve la distance (et produit scalaire, barycentre, angles) ;
- 2 symétries d'axes **parallèles** → translation ; **sécants** → rotation d'angle $2\alpha$ (perpendiculaires → symétrie centrale) ;
- **Symétrie glissée** = symétrie + translation de vecteur directeur de l'axe (aucun point fixe) ;
- Classification par points invariants : plan→Id, droite→symétrie, un point→rotation, aucun→translation/symétrie glissée ;
- **Déplacement** (translation, rotation) conserve les angles orientés ; **antidéplacement** (symétrie, symétrie glissée) les inverse.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 14;

-- ---- L15 — Calcul intégral ----
update public.chapitres c set
  titre = 'L15 — Calcul intégral',
  description = 'Fonctions numériques · intégrale, Chasles, IPP, aires, valeur moyenne',
  resume = $md$*Thème : Fonctions numériques*

## 1. Intégrale d'une fonction continue

Soit $f$ continue sur $K$, $F$ une primitive de $f$, $a,b\in K$ :
$$\int_a^b f(x)\,dx=\big[F(x)\big]_a^b=F(b)-F(a).$$
$x$ est une **variable muette**. On a $\int_a^a f=0$ et $\int_b^a f=-\int_a^b f$.

**Interprétation géométrique** : si $f\ge 0$ sur $[a,b]$, $\int_a^b f(x)\,dx$ est l'**aire** (en u.a.) sous la courbe entre $x=a$ et $x=b$.

## 2. Propriétés

- **Chasles** : $\int_a^b f=\int_a^c f+\int_c^b f$.
- **Linéarité** : $\int_a^b(f+g)=\int_a^b f+\int_a^b g$ et $\int_a^b\alpha f=\alpha\int_a^b f$.
- **Positivité/comparaison** : $f\ge 0\Rightarrow\int_a^b f\ge 0$ ; $f\le g\Rightarrow\int_a^b f\le\int_a^b g$.
- **Inégalité de la moyenne** : $m\le f\le M\Rightarrow m(b-a)\le\int_a^b f\le M(b-a)$.
- **Valeur moyenne** de $f$ sur $[a,b]$ : $\mu=\dfrac{1}{b-a}\int_a^b f(x)\,dx$.

## 3. Techniques de calcul

- **Primitives** : reconnaître les formes $\frac{u'}{u}$, $u'e^u$, $u'u^n$…
- **Intégration par parties** : $\displaystyle\int_a^b u v'=\big[uv\big]_a^b-\int_a^b u'v$.
- **Changement de variable affine** : pour $\int_a^b f(\alpha x+\beta)\,dx$, poser $t=\alpha x+\beta$.
- **Parité/périodicité** : si $f$ paire, $\int_{-a}^a f=2\int_0^a f$ ; si $f$ impaire, $\int_{-a}^a f=0$ ; si $f$ $T$-périodique, $\int_a^{a+T}f=\int_0^T f$.

## 4. Calcul d'aires

- $f\ge 0$ : $\mathcal{A}=\int_a^b f\ \text{u.a.}$ ; $f\le 0$ : $\mathcal{A}=-\int_a^b f$ ; sinon subdiviser selon le signe.
- Entre deux courbes ($f\le g$) : $\mathcal{A}=\int_a^b\big(g(x)-f(x)\big)\,dx$.

## 5. Fonction $x\mapsto\int_a^x f(t)\,dt$

Si $f$ est continue sur $K$, $x\mapsto\int_a^x f(t)\,dt$ est la **primitive de $f$ qui s'annule en $a$** ; donc $F'(x)=f(x)$.

---

### 📌 L'essentiel à retenir

- $\int_a^b f=F(b)-F(a)$ ; aire sous la courbe si $f\ge 0$ ;
- **Chasles**, **linéarité**, **comparaison**, inégalité de la moyenne ;
- Techniques : primitives, **IPP** $\int uv'=[uv]-\int u'v$, changement de variable affine, parité/périodicité ;
- Aire entre courbes ($f\le g$) : $\int_a^b(g-f)$ ;
- $x\mapsto\int_a^x f(t)\,dt$ est la primitive de $f$ nulle en $a$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 15;

-- ---- L16 — Similitudes directes du plan ----
update public.chapitres c set
  titre = 'L16 — Similitudes directes du plan',
  description = 'Transformations du plan · rapport, angle, forme réduite, écriture complexe',
  resume = $md$*Thème : Transformations du plan*

## 1. Définition

Une **similitude directe** est la composée d'une homothétie et d'un déplacement. C'est une transformation qui **conserve les angles orientés et le rapport des distances**.

Pour tous $M,N$ d'images $M',N'$ : $M'N'=k\,MN$ (rapport $k>0$) et $\text{Mes}(\overrightarrow{MN},\overrightarrow{M'N'})=\theta$ (angle $\theta$).

**Exemples** : translation ($k=1$, $\theta=0$), rotation d'angle $\theta$ ($k=1$), homothétie de rapport $k>0$ (angle nul), de rapport $k<0$ (rapport $|k|$, angle $\pi$).

## 2. Composition et propriétés

- Composée : rapports **multipliés** ($k_1k_2$), angles **additionnés** ($\theta_1+\theta_2$).
- Réciproque : rapport $\frac1k$, angle $-\theta$.
- Une similitude directe **conserve** : alignement, parallélisme, orthogonalité, contact, barycentre, angles orientés, rapport de distances. Elle **multiplie** les distances par $k$ et les **aires par $k^2$** ; transforme un cercle de rayon $r$ en cercle de rayon $kr$.

## 3. Éléments caractéristiques

Toute similitude directe autre qu'une translation a un **unique point invariant** : son **centre** $\Omega$. **Forme réduite** (décomposition canonique) :
$$S=h_{(\Omega,k)}\circ r_{(\Omega,\theta)}=r_{(\Omega,\theta)}\circ h_{(\Omega,k)}.$$
Elle est déterminée par : **centre, rapport $k$, angle $\theta$**.

## 4. Écriture complexe

Une application est une similitude directe $\iff$ son écriture complexe est $z'=az+b$ ($a\in\mathbb{C}^*$, $b\in\mathbb{C}$).

- Si $a=1$ : **translation** de vecteur d'affixe $b$.
- Si $a\ne1$ : centre d'affixe $\dfrac{b}{1-a}$, **rapport** $|a|$, **angle** $\arg(a)$.
  - $a\in\mathbb{R}^*\setminus\{1\}$ → homothétie ; $|a|=1$ → rotation ; sinon similitude « propre ».
- Réciproquement, la similitude de centre $A(z_A)$, rapport $k$, angle $\theta$ : $z'=ke^{i\theta}(z-z_A)+z_A$.

## 5. Détermination

- Par centre $A$, un point $M$ et son image $M'$ ($A\ne M$, $A\ne M'$) : **unique** similitude. Les triangles $AMM'$ sont tous de même nature et même sens.
- Par deux points et leurs images ($A\to C$, $B\to D$) : **unique** similitude directe.
- Deux triangles de même sens avec $\frac{A'B'}{AB}=\frac{A'C'}{AC}$ et $\hat A=\hat{A'}$ sont **directement semblables**.

---

### 📌 L'essentiel à retenir

- Similitude directe = conserve **angles orientés** + **rapport des distances** ; multiplie distances par $k$, aires par $k^2$ ;
- Composée : $k_1k_2$, $\theta_1+\theta_2$ ; réciproque : $\frac1k$, $-\theta$ ;
- **Forme réduite** : $S=h_{(\Omega,k)}\circ r_{(\Omega,\theta)}$ (centre, rapport, angle) ;
- Écriture complexe $z'=az+b$ : centre $\frac{b}{1-a}$, rapport $|a|$, angle $\arg a$ ;
- Une similitude directe est déterminée par **deux points et leurs images**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 16;

-- ---- L17 — Probabilité conditionnelle et variable aléatoire ----
update public.chapitres c set
  titre = 'L17 — Probabilité conditionnelle et variable aléatoire',
  description = 'Phénomène aléatoire · conditionnelle, indépendance, loi binomiale, espérance',
  resume = $md$*Thème : Modélisation d'un phénomène aléatoire*

## 1. Probabilité conditionnelle

Pour $P(B)\ne 0$ : $\displaystyle P_B(A)=P(A/B)=\frac{P(A\cap B)}{P(B)}$.

D'où la **formule des probabilités composées** : $P(A\cap B)=P(B)\,P_B(A)=P(A)\,P_A(B)$.

## 2. Indépendance

$A$ et $B$ sont **indépendants** si $P(A\cap B)=P(A)\times P(B)$, c'est-à-dire $P_B(A)=P(A)$ : la réalisation de l'un n'influence pas l'autre. (À ne pas confondre avec **incompatibles**.) Si $A,B$ indépendants, alors $\bar A,B$ ; $A,\bar B$ ; $\bar A,\bar B$ le sont aussi.

## 3. Probabilités totales

Si $B_1,\dots,B_n$ forment une **partition** de $\Omega$ (deux à deux disjoints, de réunion $\Omega$), avec $P(B_i)\ne 0$ :
$$P(A)=\sum_{i=1}^n P(A\cap B_i)=\sum_{i=1}^n P_{B_i}(A)\,P(B_i).$$
Un **arbre pondéré** résume ces probabilités conditionnelles.

## 4. Variable aléatoire

Une **variable aléatoire** $X$ est une application de $\Omega$ dans $\mathbb{R}$. Sa **loi de probabilité** associe à chaque valeur $x_i$ la probabilité $P(X=x_i)=p_i$ (avec $\sum p_i=1$).

- **Espérance** : $E(X)=\sum_i x_i p_i$ (gain moyen ; jeu avantageux si $E(X)>0$, équitable si $=0$).
- **Variance** : $V(X)=\sum_i(x_i-E(X))^2 p_i=E(X^2)-[E(X)]^2$.
- **Écart type** : $\sigma(X)=\sqrt{V(X)}$.
- **Fonction de répartition** : $F(x)=P(X\le x)$ (fonction en escalier, croissante).

## 5. Bernoulli et loi binomiale

- **Épreuve de Bernoulli** : deux issues, succès ($p$) / échec ($1-p$). **Schéma** : $n$ répétitions indépendantes.
- Probabilité d'exactement $k$ succès : $\displaystyle C_n^k\,p^k(1-p)^{n-k}$.
- La v.a. $X$ = nombre de succès suit la **loi binomiale** $\mathcal{B}(n;p)$ : $P(X=k)=C_n^k p^k(1-p)^{n-k}$, avec $E(X)=np$ et $V(X)=np(1-p)$.

---

### 📌 L'essentiel à retenir

- $P_B(A)=\dfrac{P(A\cap B)}{P(B)}$ ; $P(A\cap B)=P(B)P_B(A)$ ;
- **Indépendance** : $P(A\cap B)=P(A)P(B)$ ;
- **Probabilités totales** (arbre) : $P(A)=\sum P_{B_i}(A)P(B_i)$ ;
- $E(X)=\sum x_i p_i$, $V(X)=E(X^2)-[E(X)]^2$, $\sigma=\sqrt V$ ;
- **Loi binomiale** $\mathcal{B}(n;p)$ : $P(X=k)=C_n^k p^k(1-p)^{n-k}$, $E(X)=np$, $V(X)=np(1-p)$.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 17;

-- ---- L18 — Équations différentielles ----
update public.chapitres c set
  titre = 'L18 — Équations différentielles',
  description = 'Fonctions numériques · y''+ay=b, y''''±ω²y=0, conditions initiales',
  resume = $md$*Thème : Fonctions numériques*

## 1. Définition

Une **équation différentielle** est une équation dont l'inconnue est une fonction et où figure au moins une de ses dérivées. **Résoudre** sur un intervalle $K$ = déterminer toutes les fonctions solutions sur $K$.

## 2. Équations du premier ordre $y'+ay=b$

- **Cas $b=0$** : les solutions de $y'+ay=0$ ($a\in\mathbb{R}$) sont $\boxed{x\mapsto ke^{-ax}}$, $k\in\mathbb{R}$.
- **Cas $b\ne0$** : les solutions de $y'+ay=b$ ($a\ne0$) sont $\boxed{x\mapsto ke^{-ax}+\dfrac{b}{a}}$, $k\in\mathbb{R}$.
- **Condition initiale** : il existe une **unique** solution telle que $y(x_0)=y_0$.
- **Cas $a=0$** : $y'=b$ → $x\mapsto bx+c$.

## 3. Équations du second ordre $y''+my=0$

- **$m=0$** : $y''=0$ → $x\mapsto ax+b$.
- **$m<0$**, $m=-\omega^2$ : $y''-\omega^2 y=0$ → $\boxed{x\mapsto ae^{-\omega x}+be^{\omega x}}$.
- **$m>0$**, $m=\omega^2$ : $y''+\omega^2 y=0$ → $\boxed{x\mapsto a\cos(\omega x)+b\sin(\omega x)}$.
- **Conditions initiales** : il existe une **unique** solution telle que $y(x_0)=y_0$ et $y'(x_0)=z_0$.

## 4. Équations avec second membre (méthode)

Pour $y'+ay=g(x)$ : chercher une **solution particulière** $g_0$ ; alors $f$ est solution $\iff f-g_0$ est solution de l'équation homogène $y'+ay=0$. La solution générale = solution particulière + solutions de l'homogène.

---

### 📌 L'essentiel à retenir

- $y'+ay=0$ → $ke^{-ax}$ ; $y'+ay=b$ → $ke^{-ax}+\frac ba$ ;
- $y''-\omega^2 y=0$ → $ae^{-\omega x}+be^{\omega x}$ (exponentielles) ;
- $y''+\omega^2 y=0$ → $a\cos\omega x+b\sin\omega x$ (trigonométrique) ;
- Une **condition initiale** (ordre 1) ou **deux** (ordre 2) déterminent une solution **unique** ;
- Avec second membre : **solution particulière + solution homogène**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 18;

-- ---- L19 — Statistique à deux variables ----
update public.chapitres c set
  titre = 'L19 — Statistique à deux variables',
  description = 'Traitement des données · covariance, corrélation, moindres carrés, régression',
  resume = $md$*Thème : Organisation et traitement des données — statistique à deux variables*

## 1. Série statistique double

Deux caractères quantitatifs $X$ et $Y$ sur une même population : ensemble des triplets $(x_i,y_j,n_{ij})$. Le **tableau de contingence** (double entrée) donne les effectifs ; en sommant lignes/colonnes on obtient les **séries marginales** de $X$ et de $Y$.

Le **nuage de points** est l'ensemble des points $(x_i;y_j)$ d'effectif non nul.

## 2. Point moyen

$G(\bar X;\bar Y)$ avec $\displaystyle\bar X=\frac{1}{n}\sum x_i$, $\bar Y=\frac{1}{n}\sum y_i$.

## 3. Covariance et corrélation

- **Covariance** : $\displaystyle\text{Cov}(X,Y)=\frac1n\sum(x_i-\bar X)(y_i-\bar Y)=\frac1n\sum x_i y_i-\bar X\,\bar Y$.
- **Variance** : $\displaystyle V(X)=\frac1n\sum x_i^2-\bar X^2$.
- **Coefficient de corrélation linéaire** : $\displaystyle r=\frac{\text{Cov}(X,Y)}{\sqrt{V(X)}\sqrt{V(Y)}}$, avec $-1\le r\le 1$ (même signe que la covariance).
- **Forte corrélation** si $|r|$ proche de 1 (en pratique $0{,}87\le|r|\le 1$).

## 4. Ajustement par les moindres carrés

- **Droite de régression de $Y$ en $X$** : $y=ax+b$ avec $a=\dfrac{\text{Cov}(X,Y)}{V(X)}$ et $b=\bar Y-a\bar X$.
- **Droite de régression de $X$ en $Y$** : $x=a'y+b'$ avec $a'=\dfrac{\text{Cov}(X,Y)}{V(Y)}$ et $b'=\bar X-a'\bar Y$.
- Les deux droites passent par le **point moyen $G$**. On a $aa'=r^2$ et $|r|=\sqrt{aa'}$.
- **Estimation** : l'équation de la droite permet d'estimer $y$ connaissant $x$ (et réciproquement).

---

### 📌 L'essentiel à retenir

- **Point moyen** $G(\bar X;\bar Y)$ ; les droites de régression passent par $G$ ;
- $\text{Cov}(X,Y)=\frac1n\sum x_i y_i-\bar X\bar Y$ ; $V(X)=\frac1n\sum x_i^2-\bar X^2$ ;
- **Corrélation** $r=\dfrac{\text{Cov}(X,Y)}{\sqrt{V(X)V(Y)}}\in[-1;1]$ ; forte si $|r|\ge 0{,}87$ ;
- Régression de $Y$ en $X$ : $a=\frac{\text{Cov}(X,Y)}{V(X)}$, $b=\bar Y-a\bar X$ ;
- $aa'=r^2$ ; la droite d'ajustement sert à **estimer/prévoir** une valeur.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'maths' and n.nom = 'Terminale' and s.nom in ('C')
  and c.ordre = 19;

-- Contrôle : liste des résumés publiés pour la matière
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille_resume, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = 'maths' and n.nom = 'Terminale'
order by s.nom, c.ordre;
