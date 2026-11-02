/**
 * Reader-only edits: internal source errata stay in the canonical lesson metadata,
 * while learners read the corrected statement directly. No historic lesson changes.
 */
const edits: readonly [RegExp,string][] = [
  [/Le document remplace accidentellement[^\n]+/g,""],
  [/> \*\*Correction de classement\.\*\*[^\n]+/g,""],
  [/> \*\*Corrections de source\.\*\*[^\n]+/g,""],
  [/> \*\*Précision\.\*\* Le tableau source contient[^\n]+/g,""],
  [/Le PDF affiche par endroits[^\n]+/g,"On peut tester une formule candidate par ses unités. Par exemple, $a/(iD)$ aurait pour dimension :"],
  [/Analyse dimensionnelle de la correction de l’exercice 1/g,"Vérifier la formule par les dimensions"],
  [/cette application reprend donc tout l'exercice officiel[^\n]+/g,"Vérifier l’unité de $h$, la relation énergie–longueur d’onde et le rôle de la lumière absorbée ou diffusée."],
  [/Le PDF écrit[^\n]+/g,"Une **perte de masse** et une énergie **libérée** sont annoncées positives."],
  [/Le PDF trouve environ[^\n]+/g,"Utiliser $1\\ \\mathrm{u}\\,c^2=931{,}5\\ \\mathrm{MeV}$ pour convertir directement le défaut de masse en énergie."],
  [/La source calcule dans l'ordre inverse[^\n]+/g,"Pour calculer l’énergie **libérée**, prendre la différence positive entre la masse initiale et la masse finale :"],
  [/Mais l'énoncé imprimé de l'exercice 5[^\n]+/g,"Le tableau donne le coefficient de proportionnalité $B/I$. Pour en déduire numériquement $\\mu_0$ par $\\mu_0=(B/I)(L/N)$, il faut également connaître la longueur $L$ et le nombre de spires $N$."],
  [/> \*\*Correction essentielle du support\.\*\* ([^\n]+?) Cette étape imprimée[^\n]+/g,"> **Attention.** $1"],
  [/> \*\*Astuce mémoire\.\*\* Le texte imprimé[^\n]+/g,"> **À retenir.** $\\sin(2\\alpha)$ désigne le sinus du double de l’angle."],
  [/Le document remplace parfois l’intégrale Joule par \$ri\^2t\$ ; cette simplification n’est valable que si \$i\$ est constant sur toute la durée considérée\./g,"L’énergie dissipée par effet Joule s’écrit $\\int ri^2\\,dt$. Elle se réduit à $ri^2t$ seulement si le courant reste constant pendant toute la durée."],
  [/Le document arrondit ensuite \$L\$ à[^\n]+/g,"Si l’on arrondit $L$ à $0{,}01$ H avant le calcul, on obtient $E_m=0{,}125$ J. Pour un résultat plus précis, garder la valeur non arrondie de $L$."],
  [/ La correction imprimée[^\n]+/g,""],
  [/Le premier oscillogramme du document[^\n]+/g,"La voie $Y_A$ est en avance sur la voie $Y_B$ : repérer deux passages correspondants permet de déterminer le sens du déphasage."],
  [/La grille imprimée[^\n]+/g,""],
  [/La valeur \$1729[^\n]+/g,"Conserver les valeurs non arrondies jusqu’à la fin donne environ $1730\\ \\Omega$."],
  [/Le texte ne donne pas explicitement les sensibilités de l’oscilloscope\. La solution imprimée suppose :/g,"On utilise les réglages d’oscilloscope suivants :"],
  [/Sous les sensibilités supposées par la correction :/g,"Avec ces réglages :"],
  [/## 3\. Capacité corrigée/g,"## 3. Calcul de la capacité"],
  [/La valeur \$2\{,\}73[^\n]+/g,""],
  [/Avec les réglages supposés par la source :[^\n]+/g,"Avec les réglages indiqués : $T=5\\ \\mathrm{ms}$, $f=200\\ \\mathrm{Hz}$, $Z=100\\ \\Omega$ et $C\\approx8{,}68\\ \\mu\\mathrm F$."],
  [/Le document annonce Radio Fréquence 2[^\n]+/g,"La bande FM usuelle s’étend de $87{,}5$ à $108\\ \\mathrm{MHz}$. On utilisera la fréquence $92{,}0\\ \\mathrm{MHz}$ dans l’application radio."],
  [/et non \$90\$ Hz et[^\n]+/g,"Cette seconde série est une courbe expérimentale distincte. Pour comparer ses pics à ceux de la première, il faut également connaître la tension efficace appliquée, puisque $I_0=U/R$."],
  [/La route demandée par le corrigé passe par/g,"Le calcul fondé sur les amplitudes utilise"],
  [/Le document arrondit correctement à environ[^\n]+/g,"On obtient environ $38$ V."],
  [/Le support obtient \$344[^\n]+/g,"Conserver $Q$ non arrondi jusqu’à la dernière étape."],
  [/Le contrôle UC=QU₀ prédit[^\n]+/g,"La relation $U_C=QU_0$ permet de vérifier la cohérence entre la tension du condensateur et les autres grandeurs du circuit."],
  [/La valeur \$40\{,\}9[^\n]+/g,"Avec les valeurs non arrondies, le facteur de qualité est voisin de $40{,}9$."],
  [/Étape 4 — capacité manquante dans la solution imprimée/g,"Étape 4 — déterminer la capacité"],
  [/> \*\*Correction de notation\.\*\*[^\n]+/g,"> **Notation.** $p(t)$ est la puissance instantanée ; $P$ est la puissance moyenne."],
  [/> \*\*Contrôle d’unités\.\*\*[^\n]+/g,"> **Contrôle d’unités.** $R$, $L\\omega$ et $1/(C\\omega)$ s’expriment tous en ohms."],
  [/> \*\*Rangement réparé\.\*\*[^\n]+/g,"> **À retenir.** $f_1$ est la fréquence de coupure basse, $f_2$ la fréquence de coupure haute : la largeur de bande vaut $f_2-f_1>0$."],
  [/Le résultat \$10\/12[^\n]+/g,"Le facteur de puissance du circuit complet tient compte de la résistance interne $r$ de la bobine, puisqu’elle dissipe aussi de l’énergie."],
  [/> \*\*Audit\.\*\*[^\n]+/g,""],
  [/> \*\*Correction algébrique\.\*\*[^\n]+/g,"> **Contrôle d’unités.** Dans $\\lambda=ai/D$, $a$, $i$ et $D$ sont des longueurs ; le résultat est bien une longueur."],
  [/La première valeur du corrigé source,[^\n]+/g,"La première longueur d’onde vaut $420$ nm. Les frontières des couleurs sont conventionnelles : le résultat numérique reste prioritaire."],
  [/Le corrigé source affiche une fois[^\n]+/g,""],
  [/Cette radiation se situe dans l'\*\*ultraviolet extrême\*\*\.[^\n]+/g,"Cette radiation se situe dans l’**ultraviolet extrême**."],
  [/Le texte de l'exercice imprime[^\n]+/g,"Pour l’atome d’hydrogène, on utilise :"],
  [/ Le facteur \$e\$ manque[^\n]+/g,""],
  [/> \*\*Correction majeure du support\.\*\*[^\n]+/g,""],
  [/Les figures documentaires du PDF[^\n]+/g,""],
  [/Le corrigé simplifié de la deuxième désintégration[^\n]+/g,"Vérifier la conservation du nombre de masse et du numéro atomique permet d’identifier le noyau fils."],
  [/Le corrigé source écrit \*\*x=8\*\*[^\n]+/g,"Le symbole de l’yttrium est Y ; son numéro atomique est $Z=39$."],
  [/Le support trouve une valeur proche,[^\n]+/g,"L’énergie libérée est positive. Les résultats approchés peuvent varier légèrement avec les arrondis des masses."],
  [/Le corrigé du PDF écrit[^\n]+/g,"Le nombre de masse de l’yttrium est donc **94**."],
  [/Le corrigé la classe comme une fusion\.[^\n]+/g,"Deux noyaux entrent et deux noyaux ressortent : c’est une **transmutation provoquée de type $(\\alpha,p)$**, et non une fusion."],
  [/ Le PDF l'ajoute automatiquement[^\n]+/g,""],
  [/ ; les signes négatifs du corrigé source sont rectifiés\./g,"."],
  [/ Les mentions « n=1 » et « n=2 » du corrigé[^\n]+/g," Sur le diagramme du sodium, les repères $n=1$ et $n=2$ désignent seulement les deux niveaux représentés. La formule $-13{,}6/n^2$ est réservée à l’hydrogène."],
  [/3\. La question « détermine l'énergie de l'atome »[^\n]+/g,"3. L’**énergie d’ionisation** depuis le niveau fondamental vaut :"],
  [/ Le corrigé arrondit à[^\n]+/g,""],
  [/ — c'est le sens cohérent avec l'équation et le corrigé,[^\n]+/g,"."],
  [/Le peptide représenté dans le corrigé est Val-B/g,"Le peptide recherché est Val-B"],
  [/> \*\*Coquille majeure du document\.\*\*[^\n]+/g,"> **Bilan.** On dénombre **quatre amines primaires, trois secondaires et une tertiaire**."],
  [/, l'isomère secondaire oublié par le corrigé source\./g,"."],
  [/C’est le calcul le plus utile de cette leçon — et celui que le document source rate à deux reprises\. /g,""],
  [/> \*\*Astuce mémoire de Davy\.\*\* Ne recopie[^\n]+/g,"> **Méthode.** Recalculer la masse molaire d’un triglycéride : trois masses molaires d’acide gras plus celle du glycérol, moins celles de trois molécules d’eau."],
  [/Avec 103,5 g et 11,4 g,[^\n]+/g,"Le rapport des masses de savon et de glycérol vaut $103{,}5/11{,}4\\approx9{,}1$, conformément aux coefficients stœchiométriques."],
  [/[,;] à comparer aux 366 annoncés par le document\./g,"."],
  [/, et non les [^\n]+du document[^\n]+/g,"."],
  [/> \*\*Correction essentielle\.\*\* La page 2[^\n]+/g,"> **À retenir.** En milieu basique, l’ion dipolaire cède un proton et donne la forme anionique."],
  [/ Les erreurs du document source viennent toutes de l’un ou de l’autre\./g,""],
  [/ C’est exactement l’erreur que commet le [^\n]+/g,""],
  [/ — la partie que le document laisse sans corrigé\./g,"."],
];

export function physicsReadingText(value: string) {
  let result=value.replace(/\r\n/g,"\n");
  for(const [pattern,replacement] of edits) result=result.replace(pattern,replacement);
  return result.replace(/(?<![\p{L}])(?:Mission finale|Mission Davy|Mission réussie si…)/giu,"Application")
    .replace(/\bMission( [AB])?\s*[—:-]/g,"Application$1 —")
    .replace(/\bDans cette mission\b/gi,"Dans cette application")
    .replace(/\bcette mission\b/gi,"cette application")
    .replace(/\bla mission\b/gi,"l’application")
    .replace(/\bles deux missions\b/gi,"les deux applications")
    .replace(/\bpremière mission\b/gi,"première application")
    .replace(/\bDans une mission longue\b/gi,"Dans une étude complète")
    .replace(/(?<![\p{L}])Mission(?![\p{L}])/gu,"Application").replace(/(?<![\p{L}])mission(?![\p{L}])/gu,"application")
    .replace(/Astuce mémoire de Davy|Astuce Davy/gi,"À retenir")
    .replace(/\bquiz\b/gi,"exemple")
    .replace(/du dernier niveau/g,"de l’application finale")
    .replace(/de ce niveau/g,"de cette partie")
    .replace(/Exemple guidé\s*\(activité \d+\)/gi,"Exemple guidé")
    .replace(/Activité (?:officielle(?: complétée| complète)?|entièrement résolue|d[’']application)/gi,"Application")
    .replace(/Correction de l’activité/g,"Application")
    .replace(/correction de la documentation/g,"synthèse")
    .replace(/officielle corrigée/g,"numérique").replace(/direct corrigé/g,"direct")
    .replace(/Exercice (\d+) corrigé/g,"Exercice $1")
    .replace(/Ex\.4 corrigé/g,"Application 4")
    .replace(/Tableau corrigé/g,"Longueurs d’onde").replace(/masse molaire corrigée/g,"masse molaire")
    .replace(/\\lambda_0\$ corrigée/g,"\\lambda_0$")
    .replace(/Avec les masses nucléaires utilisées dans le corrigé/g,"Avec les masses nucléaires données")
    .replace(/\\mathrm\{triglycéride \+ 3\\,\(Na\^\+ \+ OH\^-\) \\longrightarrow glycérol \+ 3\\ carboxylate\\ de\\ sodium\}/g,String.raw`\text{triglycéride}+3\,(\mathrm{Na}^++\mathrm{OH}^-)\longrightarrow\text{glycérol}+3\,(\mathrm{RCOO}^-+\mathrm{Na}^+)`)
    .replace(/\\mathrm\{butyrine \+ 3\(Na\^\+ \+ OH\^-\) \\longrightarrow glycérol \+ 3\\,\(C_3H_7\\text\{-\}COO\^- \+ Na\^\+\)\}/g,String.raw`\text{butyrine}+3\,(\mathrm{Na}^++\mathrm{OH}^-)\longrightarrow\text{glycérol}+3\,(\mathrm{C_3H_7COO}^-+\mathrm{Na}^+)`)
    .replace(/\$\$[\s\S]*?\$\$|\$[^$]+\$/g,formula=>formula.replace(/\\\|/g,String.raw`\Vert `).replace(/(?<!\\)\|/g,String.raw`\vert `))
    .replace(/\n{3,}/g,"\n\n").trim();
}

/** A consistent worked case, using only the coherent subset already established. */
export const physicsSummaryBodyOverrides: Record<string,string> = {
  "resonance-official-evaluation-audit": String.raw`## Étude d’une bobine

**1. Résistance interne.** En régime permanent continu, on mesure $U=15\ \mathrm V$ et $I=2{,}0\ \mathrm A$. L’inductance n’intervient plus dans la tension :

$$r=\frac UI=\frac{15}{2{,}0}=\boxed{7{,}5\ \Omega}.$$

**2. Inductance.** On associe la bobine à $R=400\ \Omega$ et $C=6{,}1\ \mu\mathrm F$. La tension du générateur et celle du résistor sont en phase à $f_0=148\ \mathrm{Hz}$. La tension du résistor étant en phase avec le courant, le circuit est à la résonance d’intensité :

$$L=\frac1{C(2\pi f_0)^2}=\frac1{6{,}1\times10^{-6}(2\pi\times148)^2}\approx\boxed{0{,}1896\ \mathrm H}.$$

**3. Intensité maximale.** Pour une tension efficace $U_0=2{,}0\ \mathrm V$, la résistance totale est $R_t=R+r=407{,}5\ \Omega$. À la résonance, l’impédance vaut $R_t$ :

$$I_0=\frac{U_0}{R_t}=\frac2{407{,}5}\approx\boxed{4{,}91\ \mathrm{mA}}.$$

**4. Facteur de qualité et bande passante.**

$$Q=\frac{2\pi f_0L}{R_t}\approx0{,}4326,\qquad \Delta f=\frac{f_0}{Q}\approx\boxed{342\ \mathrm{Hz}}.$$

Garder les valeurs non arrondies dans le calcul intermédiaire.

**5. Tension aux bornes du condensateur.** La relation $U_C=QU_0$ donne :

$$U_C\approx0{,}4326\times2\approx\boxed{0{,}865\ \mathrm V}.$$

**6. Branchement de l’oscilloscope.** Une voie mesure $u_R=Ri$, l’autre la tension du générateur. Les deux masses se relient au même point de référence.`,
};
