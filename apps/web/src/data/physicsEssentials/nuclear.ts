import { section, sheet } from "./types";

const nuclei = section("pc-nuclear-nuclei", "I", "Noyaux, nucléides et isotopes", [366], String.raw`
Le noyau contient des protons, chargés positivement, et des neutrons, électriquement neutres. Ces particules sont les nucléons. Les électrons, chargés négativement, se trouvent autour du noyau.

Le symbole $\mathrm{{}^{A}_{Z}X}$ indique :

| Symbole | Signification |
|---|---|
| $Z$ | Nombre de protons, ou numéro atomique |
| $A$ | Nombre de nucléons, ou nombre de masse |
| $N=A-Z$ | Nombre de neutrons |

Un nucléide est caractérisé par $A$ et $Z$. Des isotopes ont le même $Z$, mais des nombres $A$ différents.

Unités utiles :
$$1\ \mathrm{eV}\simeq1{,}60\times10^{-19}\ \mathrm J,\quad
1\ \mathrm{MeV}=10^6\ \mathrm{eV}\simeq1{,}60\times10^{-13}\ \mathrm J.$$
L’unité de masse atomique est le douzième de la masse d’un atome de carbone 12 :
$$1\ \mathrm u\simeq1{,}66\times10^{-27}\ \mathrm{kg}.$$
`);
const binding = section("pc-nuclear-binding", "II", "Défaut de masse et énergie de liaison", [366], String.raw`
La masse d’un noyau lié est inférieure à la somme des masses de ses nucléons séparés au repos :
$$\Delta m=Zm_p+(A-Z)m_n-m_{\mathrm{noyau}}.$$
L’énergie à fournir pour séparer complètement le noyau en nucléons est :
$$E_l=\Delta m\,c^2.$$
Avec les masses en kilogrammes et $c$ en $\mathrm{m\,s^{-1}}$, l’énergie obtenue est en joules.

L’énergie de liaison par nucléon vaut :
$$\varepsilon=\frac{E_l}{A}.$$
Plus elle est grande, plus le noyau est fortement lié par nucléon. C’est un indicateur de cohésion ; pour savoir si une transformation précise est possible, il faut comparer les énergies de l’état initial et de l’état final.

Ne pas mélanger masses de **noyaux** et masses d’**atomes** dans la même formule sans tenir compte des électrons.
`);
const conservation = section("pc-nuclear-conservation", "III", "Équilibrer une réaction nucléaire", [367], String.raw`
Dans une équation nucléaire, on conserve :

- la charge électrique : somme des nombres $Z$ à gauche et à droite ;
- le nombre de nucléons : somme des nombres $A$ ;
- l’énergie totale, y compris l’énergie de masse, l’énergie cinétique et le rayonnement ;
- la quantité de mouvement du système isolé.

Pour trouver un noyau inconnu, on calcule d’abord son $A$ et son $Z$, puis on identifie l’élément à partir de $Z$. La masse au repos, prise seule, n’est pas une grandeur conservée.
`);
const decay = section("pc-nuclear-decay", "IV", "Radioactivités α, β et γ", [366,367], String.raw`
La radioactivité est une transformation spontanée d’un noyau instable. Elle peut concerner des nucléides présents dans la nature ou produits artificiellement.

| Émission | Équation générale |
|---|---|
| $\alpha$ : noyau d’hélium | $\mathrm{{}^{A}_{Z}X\to{}^{A-4}_{Z-2}Y+{}^{4}_{2}He}$ |
| $\beta^-$ : électron et antineutrino | $\mathrm{{}^{A}_{Z}X\to{}^{A}_{Z+1}Y+{}^{0}_{-1}e}+\bar\nu_e$ |
| $\beta^+$ : positon et neutrino | $\mathrm{{}^{A}_{Z}X\to{}^{A}_{Z-1}Y+{}^{0}_{+1}e}+\nu_e$ |
| $\gamma$ : photon de désexcitation | $\mathrm{{}^{A}_{Z}X^*\to{}^{A}_{Z}X}+\gamma$ |

Dans la désintégration $\beta^-$, un neutron se transforme en proton. Dans la désintégration $\beta^+$, un proton du noyau se transforme en neutron. Le rayonnement $\gamma$ ne change ni $A$ ni $Z$.
`);
const halfLife = section("pc-nuclear-law", "V", "Décroissance, demi-vie et activité", [367], String.raw`
Pour une seule espèce radioactive, sans apport de nouveaux noyaux :
$$N(t)=N_0e^{-\lambda t},\qquad \lambda>0.$$
La demi-vie $T$ est définie par $N(T)=N_0/2$ :
$$T=\frac{\ln2}{\lambda},\qquad N(nT)=\frac{N_0}{2^n}.$$
La disparition d’un noyau individuel est aléatoire ; la loi décrit le comportement statistique d’un grand ensemble.

L’activité est le nombre moyen de désintégrations par seconde :
$$\mathcal A(t)=-\frac{dN}{dt}=\lambda N(t)=\mathcal A_0e^{-\lambda t}.$$
Elle s’exprime en becquerels : $1\ \mathrm{Bq}=1$ désintégration par seconde. Si le temps est en secondes, $\lambda$ doit être en $\mathrm{s^{-1}}$.
`, "radioactivity");
const reactions = section("pc-nuclear-provoked", "IV", "Réactions provoquées : fission et fusion", [367], String.raw`
Une réaction provoquée résulte de l’interaction d’un projectile avec un noyau cible.

**Fission.** Un noyau lourd se scinde en noyaux plus légers, avec éventuellement émission de neutrons. Exemple de canal équilibré :
$$\mathrm{{}^{235}_{92}U+{}^{1}_{0}n
\to{}^{148}_{57}La+{}^{85}_{35}Br+3\,{}^{1}_{0}n}.$$
On vérifie $235+1=148+85+3$ et $92=57+35$.

**Fusion.** Des noyaux légers s’unissent et forment des produits plus lourds. Exemple :
$$\mathrm{{}^{2}_{1}H+{}^{2}_{1}H\to{}^{3}_{1}H+{}^{1}_{1}H}.$$
Les nombres de masse et les charges sont conservés des deux côtés.

Pour calculer l’énergie libérée :
$$E_{\mathrm{lib}}=
\left(\sum m_{\text{réactifs}}-\sum m_{\mathrm{produits}}\right)c^2.$$
Une valeur positive correspond à une réaction exoénergétique ; une valeur négative indique un apport d’énergie nécessaire. Les fissions de noyaux lourds et les fusions de noyaux légers étudiées ici peuvent libérer de l’énergie lorsque leurs produits sont plus fortement liés.
`);
const notes = [
  "Deux pages366–367 réparties entre les deux cartes nucléaires existantes ; exercices368 et suivants exclus.",
  "Activité corrigée −dN/dt, positive ; distinction masse atomique/masse nucléaire et rappel demi-vie.",
  "Énergie de liaison par nucléon traitée comme cohésion, pas critère universel de stabilité radioactive. Équations source fission/fusion vérifiées A et Z.",
];
export default sheet("spontaneous-nuclear", "Réactions nucléaires spontanées", [366,367], [nuclei,binding,conservation,decay,halfLife], notes);
export const provokedSheet = sheet("provoked-nuclear", "Réactions nucléaires provoquées", [366,367], [nuclei,binding,conservation,reactions], notes);
