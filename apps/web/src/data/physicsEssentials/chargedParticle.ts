import { section, sheet } from "./types";

export default sheet("charged-particle", "Particule chargée dans un champ magnétique uniforme", [267,268,269,270,271], [
  section("pc-particle-force", "I", "Force magnétique de Lorentz", [267], String.raw`
Une particule de charge $q$, animée de la vitesse $\vec v$ dans le champ $\vec B$, subit :
$$\vec F_m=q\,\vec v\wedge\vec B.$$
La force est perpendiculaire à $\vec v$ et à $\vec B$. Son sens est celui du produit vectoriel $(q\vec v)\wedge\vec B$ ; inverser le signe de la charge inverse donc le sens de la force.
$$F_m=|q|vB|\sin\theta|,\qquad \theta=(\vec v,\vec B).$$
Si $\vec v\perp\vec B$, $F_m=|q|vB$. Si les vecteurs sont parallèles, la force est nulle.

Pour lire un schéma, $\odot$ représente un vecteur qui sort de la feuille et $\otimes$ un vecteur qui y entre.

La puissance de cette force est nulle :
$$\mathcal P=\vec F_m\cdot\vec v=0.$$
Un champ magnétique seul modifie la direction de la vitesse, pas sa valeur.
`, "charged-particle"),
  section("pc-particle-circle", "II", "Pourquoi le mouvement est circulaire et uniforme", [268,269], String.raw`
On néglige le poids et les frottements ; le champ est uniforme, la vitesse initiale lui est perpendiculaire et l’étude se fait dans un référentiel galiléen.
$$m\vec a=q\,\vec v\wedge\vec B.$$

**1. Mouvement plan.** On choisit l’axe $z$ parallèle à $\vec B$. La force n’a pas de composante selon $z$, donc $a_z=0$. Comme $v_{z0}=0$, on garde $v_z=0$ puis $z=z_0$ : le mouvement reste dans le plan initial perpendiculaire au champ.

**2. Mouvement uniforme.** Le travail de la force magnétique est nul. Le théorème de l’énergie cinétique donne :
$$\frac12mv^2-\frac12mv_0^2=0\quad\Longrightarrow\quad v=v_0.$$

**3. Trajectoire circulaire.** L’accélération est normale à la trajectoire :
$$\frac{v_0^2}{R}=\frac{|q|v_0B}{m}
\quad\Longrightarrow\quad R=\frac{mv_0}{|q|B}.$$
Le rayon est constant. La pulsation et la période sont :
$$\omega=\frac{|q|B}{m},\qquad T=\frac{2\pi m}{|q|B}.$$
Ces relations utilisent le modèle non relativiste à masse constante. Si la vitesse possède une composante parallèle au champ, la trajectoire n’est plus ce cercle : elle est hélicoïdale.
`),
  section("pc-particle-filter", "III", "Filtrer les vitesses avec deux champs", [269], String.raw`
Dans un sélecteur de vitesse, les champs électrique et magnétique sont croisés. Ils sont orientés de façon que les deux forces soient opposées :
$$q\vec E+q\,\vec v\wedge\vec B=\vec0.$$
Pour $\vec v\perp\vec B$, la condition de passage sans déviation est :
$$|q|E=|q|vB\quad\Longrightarrow\quad v=\frac EB.$$
Les particules de cette vitesse traversent la fente suivant une droite ; les autres sont déviées. Il faut vérifier le sens des forces, pas seulement égaler leurs valeurs.
`),
  section("pc-particle-deflection", "IV", "Déflexion magnétique", [269,270], String.raw`
Une particule entre horizontalement dans une zone de champ magnétique, de largeur $\ell$. Elle y décrit un arc de cercle de rayon $R=mv_0/(|q|B)$, puis continue en ligne droite suivant la tangente à la sortie.

Si $\alpha$ est l’angle de sortie :
$$\sin\alpha=\frac{\ell}{R}.$$
Pour une petite déviation, avec un écran éloigné et situé à une distance $L$ du point d’entrée, on obtient l’approximation :
$$D_m\simeq\frac{\ell L}{R}
=\frac{\ell L|q|B}{mv_0}.$$
Cette expression donne une distance positive. Le côté de déviation dépend du signe de $q$ et du sens du champ. L’approximation suppose $\alpha$ petit et une distance de l’écran grande devant les dimensions de la zone de champ.
`),
  section("pc-particle-spectrometer", "V", "Spectromètre de masse", [270], String.raw`
Le dispositif comprend une chambre d’ionisation, une chambre d’accélération, une zone de déviation magnétique et un détecteur, le tout sous vide.

Les ions partent avec une vitesse négligeable. Si la tension accélératrice leur fournit l’énergie $|q|U$, avec $U>0$ :
$$\frac12mv_0^2=|q|U
\quad\Longrightarrow\quad v_0=\sqrt{\frac{2|q|U}{m}}.$$
Dans le champ magnétique, ils décrivent un demi-cercle de diamètre :
$$D=2R=\frac1B\sqrt{\frac{8mU}{|q|}}.$$
Pour un ion de nombre de masse $A$ et de charge $q=\pm ne$, on utilise les approximations :
$$m\simeq Au,\quad |q|=ne,\quad
u\simeq1{,}66\times10^{-27}\ \mathrm{kg},\quad e\simeq1{,}60\times10^{-19}\ \mathrm C,$$
d’où $D=B^{-1}\sqrt{8AuU/(ne)}$.

**Exemple :** pour $\mathrm{{}^{16}O^{2-}}$, on prend $A=16$, $n=2$ et $q=-2e$ ; c’est bien $|q|=2e$ qui intervient dans le diamètre.

À $U$ et $B$ fixés, le diamètre dépend de $\sqrt{m/|q|}$. Des ions de même charge mais de masses différentes peuvent ainsi être séparés.
`),
  section("pc-particle-cyclotron", "VI", "Cyclotron", [271], String.raw`
Deux électrodes creuses en forme de D, les « dees », sont placées dans un champ magnétique uniforme perpendiculaire à leur plan. Entre elles, une tension alternative accélère les particules à chaque passage.

- Dans un dee, le champ magnétique courbe la trajectoire sans fournir de travail.
- Dans l’intervalle entre les dees, le champ électrique accélère la particule.
- Après chaque accélération, la vitesse et le rayon de la trajectoire augmentent.

Dans le modèle non relativiste, l’oscillateur est réglé sur :
$$T=\frac{2\pi m}{|q|B}.$$
Le champ électrique change de sens pendant chaque demi-tour. Pour un rayon utile maximal $R_m$ :
$$v_{\max}=\frac{|q|BR_m}{m},\qquad
E_{c,\max}=\frac{q^2B^2R_m^2}{2m}.$$
À $B$ et $R_m$ fixés, cette énergie maximale ne dépend pas directement de la tension accélératrice ; celle-ci règle le gain d’énergie à chaque passage. Le synchronisme précédent cesse d’être valable si les effets relativistes deviennent importants.
`),
], [
  "Cours267–271 repris ; exercices272 et suivants exclus.",
  "Schémas de signe de charge incohérents remplacés par la règle qv×B ; rayon et diamètre utilisent |q|.",
  "Spectromètre : ions de même charge mais de masses différentes, et non de même charge mais de charges différentes.",
  "Déflexion limitée aux faibles angles/écran lointain ; cyclotron limité au domaine non relativiste.",
]);
