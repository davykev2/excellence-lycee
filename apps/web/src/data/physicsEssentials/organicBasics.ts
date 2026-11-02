import { section } from "./types";

export const matterReminder = section("pc-organic-matter", "I", "Rappels : quantité de matière et composition", [372], String.raw`
| Donnée disponible | Quantité de matière $n$ |
|---|---|
| Masse $m$ et masse molaire $M$ | $n=m/M$ |
| Volume d’un gaz et volume molaire dans les mêmes conditions | $n=V/V_m$ |
| Solution de concentration molaire $C$ et volume $V$ | $n=CV$ |

Avec $C$ en $\mathrm{mol\,L^{-1}}$, il faut prendre $V$ en litres. Avec $m$ en grammes, $M$ est en $\mathrm{g\,mol^{-1}}$.

La densité d’un solide ou d’un liquide par rapport à l’eau est $d=\rho/\rho_{\mathrm{eau}}$, sans unité. Pour un gaz comparé à l’air dans les mêmes conditions, $d\simeq M/29$ si $M$ est en $\mathrm{g\,mol^{-1}}$.

Pour $\mathrm{C_xH_yO_z}$, avec les masses molaires scolaires $12$, $1$ et $16$ :
$$M=12x+y+16z.$$
En notant $p_C,p_H,p_O$ les pourcentages massiques :
$$p_C=\frac{1200x}{M},\quad p_H=\frac{100y}{M},\quad
p_O=\frac{1600z}{M},\quad p_C+p_H+p_O=100.$$
On en déduit :
$$x=\frac{p_CM}{1200},\qquad y=\frac{p_HM}{100},\qquad z=\frac{p_OM}{1600}.$$
`);
export const combustionReminder = section("pc-organic-combustion", "II", "Rappels : combustion et rendement", [372,373], String.raw`
La combustion complète d’un composé contenant seulement C, H et O s’écrit :
$$\mathrm{C_xH_yO_z}
+\left(x+\frac y4-\frac z2\right)\mathrm{O_2}
\to x\mathrm{CO_2}+\frac y2\mathrm{H_2O}.$$
Les quantités consommées et formées sont proportionnelles aux coefficients :
$$n_{\text{composé}}=\frac{n_{\mathrm{CO_2}}}{x}
=\frac{n_{\mathrm{H_2O}}}{y/2}.$$
Pour une masse $m$ brûlée :
$$m_C=\frac{12}{44}m_{\mathrm{CO_2}},\quad
m_H=\frac2{18}m_{\mathrm{H_2O}},\quad
m_O=m-m_C-m_H.$$
La dernière relation suppose que le composé ne contient que C, H et O.

| Famille acyclique | Formule | Exemple |
|---|---|---|
| Alcane | $\mathrm{C_nH_{2n+2}}$ | Éthane $\mathrm{C_2H_6}$ |
| Alcène à une double liaison | $\mathrm{C_nH_{2n}}$ | Éthène $\mathrm{C_2H_4}$ |
| Alcyne à une triple liaison | $\mathrm{C_nH_{2n-2}}$ | Éthyne $\mathrm{C_2H_2}$ |

Le coefficient de $\mathrm{O_2}$ dans leur combustion vaut respectivement $(3n+1)/2$, $3n/2$ et $(3n-1)/2$.

Le rendement est :
$$r=\frac{n_{\text{produit obtenu}}}{n_{\text{produit théorique}}}\times100.$$
La quantité théorique se déduit du réactif limitant et des coefficients stœchiométriques ; elle n’est pas toujours égale à la quantité initiale d’un réactif.
`);
