import { section, sheet } from "./types";

const ester = section("pc-acids-esters", "IV", "Esters : reconnaître et nommer", [395], String.raw`
Un ester possède le groupe $\mathrm{R{-}COO{-}R'}$. Pour un monoester saturé acyclique, la formule brute est $\mathrm{C_nH_{2n}O_2}$.

Son nom associe la partie provenant de l’acide, terminée en **-oate**, puis le groupe lié à l’oxygène :

| Formule semi-développée | Nom |
|---|---|
| $\mathrm{CH_3CH_2COOCH_2CH_3}$ | Propanoate d’éthyle |
| $\mathrm{CH_3COOCH_2CH_2CH_3}$ | Éthanoate de propyle |
| $\mathrm{CH_3CH(CH_3)CH_2COOCH_2CH_2C_6H_5}$ | 3-méthylbutanoate de 2-phényléthyle |
| $\mathrm{CH_3CH_2CH_2CH(CH_3)COOCH_2CH(CH_3)CH_2CH_2CH_2CH_3}$ | 2-méthylpentanoate de 2-méthylhexyle |

On sépare les deux côtés au niveau de $\mathrm{COO}$ : le carbone du carbonyle appartient à la partie acide.
`);
const esterification = section("pc-acids-esterification", "V", "Estérification directe, équilibre et rendement", [395,396], String.raw`
Un acide carboxylique réagit avec un alcool :
$$\mathrm{RCOOH+R'OH\rightleftharpoons RCOOR'+H_2O}.$$
La réaction est lente, limitée et réversible. Dans le modèle scolaire étudié, son effet thermique est faible. Chauffer ou ajouter un catalyseur permet d’atteindre plus vite l’équilibre ; un catalyseur ne déplace pas cet équilibre.

Pour un mélange initial équimolaire contenant $n$ moles de chaque réactif et sans produit au départ :

| État | Acide | Alcool | Ester | Eau |
|---|---|---|---|---|
| Initial | $n$ | $n$ | $0$ | $0$ |
| Avancement $x$ | $n-x$ | $n-x$ | $x$ | $x$ |
| Exemple $x=2n/3$ | $n/3$ | $n/3$ | $2n/3$ | $2n/3$ |

Le montage à reflux permet de chauffer sans perdre les vapeurs condensées. L’exemple expérimental associe 10 mL de butan-1-ol,6 mL d’acide éthanoïque et 1 mL d’acide sulfurique concentré comme catalyseur, dans un montage de laboratoire encadré.

Le rendement vaut :
$$\eta=\frac{n_{\text{ester obtenu}}}{n_{\text{ester théorique}}}
=\frac{m_{\text{ester obtenu}}}{m_{\text{ester théorique}}}.$$
Il est compris entre0 et1 ; on multiplie par100 pour l’exprimer en pourcentage. On calcule la quantité théorique avec le **réactif limitant**.

Les valeurs indicatives de la fiche pour un mélange équimolaire sont67 % avec un alcool primaire,60 % avec un secondaire et 5 % avec un tertiaire. Ce ne sont pas des constantes universelles pour tous les couples de réactifs.

**Exemple de calcul.** On utilise30,0 mL d’éthanol de masse volumique $0{,}785\ \mathrm{g\,mL^{-1}}$ et15,0g d’acide méthanoïque ; il se forme0,26 mol d’ester.
$$n_{\text{éthanol}}=\frac{30{,}0\times0{,}785}{46}\simeq0{,}512\ \mathrm{mol},$$
$$n_{\mathrm{acide}}=\frac{15{,}0}{46}\simeq0{,}326\ \mathrm{mol}.$$
Les coefficients sont1:1 : l’acide est limitant. Ainsi $\eta=0{,}26/0{,}326\simeq0{,}80$, soit environ 80 %.

Un excès d’un réactif ou l’élimination d’un produit peut augmenter la conversion. Pour les alcools primaires et secondaires usuels, un marquage isotopique montre que l’oxygène de l’eau formée provient du groupe OH de l’acide.
`);
const soapReaction = section("pc-soap-hydrolysis", "I", "Hydrolyse des esters et saponification", [397], String.raw`
L’hydrolyse d’un ester par l’eau est la réaction inverse de l’estérification directe :
$$\mathrm{RCOOR'+H_2O\rightleftharpoons RCOOH+R'OH}.$$
Elle est lente et limitée dans les conditions étudiées.

L’hydrolyse en milieu basique, appelée **saponification**, donne un carboxylate et un alcool :
$$\mathrm{RCOOR'+OH^-\to RCOO^-+R'OH}.$$
Elle est considérée totale dans le cadre étudié. Elle peut être lente ; le chauffage l’accélère.

Tous les carboxylates ne sont pas des savons : on appelle savons les sels de sodium ou de potassium d’acides gras à longue chaîne.
`);
const triglycerides = section("pc-soap-triglycerides", "II", "Saponifier un corps gras", [393,394,397], String.raw`
Un triglycéride est un triester du glycérol et d’acides gras. Trois liaisons ester réagissent avec trois ions hydroxyde :
$$\mathrm{C_3H_5(OOC{-}R)_3+3OH^-
\to C_3H_5(OH)_3+3RCOO^-}.$$
On obtient du glycérol et des ions carboxylate ; avec la soude, les contre-ions sont $\mathrm{Na^+}$.

| Acide gras | Formule | Nature de la chaîne |
|---|---|---|
| Stéarique,18carbones | $\mathrm{C_{17}H_{35}COOH}$ | Saturée |
| Palmitique,16carbones | $\mathrm{C_{15}H_{31}COOH}$ | Saturée |
| Oléique,18carbones | $\mathrm{CH_3(CH_2)_7CH{=}CH(CH_2)_7COOH}$ | Insaturée |

Dans l’exemple de laboratoire,10g d’huile sont mis en présence de 20 mL de solution de soude à $10\ \mathrm{mol\,L^{-1}}$ et 20 mL d’alcool, sous chauffage à reflux. Après réaction, l’ajout d’eau salée diminue la solubilité du savon : c’est le **relargage**. Le solide peut alors être séparé par filtration. Ces étapes décrivent un montage encadré, pas une manipulation à réaliser seul.
`);

export default sheet("carboxylic-acids", "Acides carboxyliques et dérivés", [393,394,395,396,397,398,399,400,401,402], [
  section("pc-acids-structure", "I", "Groupe carboxyle et nomenclature", [393,394], String.raw`
Un acide carboxylique possède le groupe **carboxyle** $\mathrm{-COOH}$, associant un carbonyle et un hydroxyle. Sa formule générale est $\mathrm{RCOOH}$.

Pour un monoacide saturé acyclique comportant $n$ carbones au total, la formule brute est $\mathrm{C_nH_{2n}O_2}$. Le carbone du groupe COOH porte le numéro1 et le nom se termine par **acide…oïque**.

| Formule | Nom |
|---|---|
| $\mathrm{HCOOH}$ | Acide méthanoïque |
| $\mathrm{CH_3COOH}$ | Acide éthanoïque |
| $\mathrm{C_6H_5COOH}$ | Acide benzoïque |
| $\mathrm{C_6H_5CH_2COOH}$ | Acide phényléthanoïque |
| $\mathrm{HOOC{-}COOH}$ | Acide éthanedioïque |
| $\mathrm{HOOC(CH_2)_4COOH}$ | Acide hexanedioïque |
| $\mathrm{C_6H_4(COOH)_2}$, groupes en 1,4 ou 1,2 | Acide benzène-1,4-dicarboxylique ou benzène-1,2-dicarboxylique |

Un diacide possède deux groupes COOH. Les acides gras possèdent une longue chaîne carbonée, saturée ou insaturée.

Le groupe carboxyle est plan. Les valeurs indicatives de la fiche sont : C=O121pm, C–O134pm et O–H97pm ; les angles autour du carbone sont environ124°,125° et111°.
`),
  section("pc-acids-acidity", "II", "Acidité et obtention", [394], String.raw`
Un acide carboxylique cède un proton à l’ion hydroxyde :
$$\mathrm{RCOOH+OH^-\to RCOO^-+H_2O}.$$
L’ion carboxylate $\mathrm{RCOO^-}$ est plan ; ses deux liaisons C–O sont équivalentes, de longueur voisine de127pm, avec des angles proches de120°.

Les acides carboxyliques sont des acides faibles dans l’eau :

- Acide méthanoïque : $C=10^{-1}\ \mathrm{mol\,L^{-1}}$, pH 2,4, supérieur à $-\log C=1$.
- Acide éthanoïque : $C=10^{-2}\ \mathrm{mol\,L^{-1}}$, pH 3,4, supérieur à $-\log C=2$.

Dans ces conditions, $[\mathrm{H_3O^+}]<C$ : la réaction avec l’eau n’est pas totale. On peut obtenir ces acides par oxydation d’alcools primaires ou d’aldéhydes, ou par hydrolyse de leurs dérivés.
`),
  section("pc-acids-derivatives", "III", "Reconnaître les dérivés d’acides", [394,402], String.raw`
Les dérivés possèdent le groupe acyle $\mathrm{R{-}CO{-}}$. On remplace formellement OH de l’acide par un autre groupe.

| Famille | Forme | Nomenclature |
|---|---|---|
| Acide | $\mathrm{RCOOH}$ | Acide alcanoïque |
| Chlorure d’acyle | $\mathrm{RCOCl}$ | Chlorure d’alcanoyle |
| Anhydride | $\mathrm{RCOOCOR'}$ | Anhydride d’acide |
| Ester | $\mathrm{RCOOR'}$ | Alcanoate d’alkyle |
| Amide | $\mathrm{RCONH_2}$, $\mathrm{RCONHR'}$, $\mathrm{RCONR'R''}$ | Alcanamide, substituants sur N signalés par N- |

Ne pas confondre une amide, où N est lié à un carbonyle, et une amine, qui ne possède pas cette liaison N–CO comme groupe caractéristique.
`), ester, esterification,
  section("pc-acids-indirect", "VI", "Estérification indirecte, hydrolyse et polyesters", [396,397], String.raw`
Avec un chlorure d’acyle ou un anhydride, l’estérification est rapide et considérée totale :
$$\mathrm{RCOCl+R'OH\to RCOOR'+HCl},$$
$$\mathrm{(RCO)_2O+R'OH\to RCOOR'+RCOOH}.$$
La réaction avec un chlorure d’acyle est exothermique.

**Exemple de l’aspirine :** l’anhydride éthanoïque réagit avec le groupe OH de l’acide salicylique pour donner l’acide acétylsalicylique et l’acide éthanoïque. Le bilan est :
$$\mathrm{C_4H_6O_3+C_7H_6O_3\to C_9H_8O_4+C_2H_4O_2}.$$

Un ester peut subir une hydrolyse, une saponification ou une réaction avec l’ammoniac donnant un amide et un alcool.

Un polyester résulte de condensations répétées entre fonctions adaptées. Par exemple, l’éthane-1,2-diol et l’acide téréphtalique donnent le polyéthylène téréphtalate, PET, avec élimination **d’eau**. Le méthanol serait éliminé si l’on partait de l’ester méthylique correspondant.
`),
  section("pc-acids-acyl-chlorides", "VII", "Chlorures d’acyle", [398], String.raw`
La formule est $\mathrm{RCOCl}$. Pour un chlorure d’alcanoyle saturé acyclique à $n$ carbones au total : $\mathrm{C_nH_{2n-1}ClO}$.

Exemples : $\mathrm{CH_3CH_2COCl}$, chlorure de propanoyle ; $\mathrm{C_6H_5COCl}$, chlorure de benzoyle ; $\mathrm{(CH_3)_2CHCH_2COCl}$, chlorure de3-méthylbutanoyle ; $\mathrm{CH_3CH_2CH_2CH(C_6H_5)CH_2COCl}$, chlorure de3-phénylhexanoyle.

On peut transformer un acide à l’aide d’un agent chlorurant :
$$\mathrm{RCOOH+PCl_5\to RCOCl+POCl_3+HCl},$$
$$\mathrm{3RCOOH+PCl_3\to3RCOCl+H_3PO_3},$$
$$\mathrm{RCOOH+SOCl_2\to RCOCl+SO_2+HCl}.$$

L’hydrolyse est rapide, totale et exothermique :
$$\mathrm{RCOCl+H_2O\to RCOOH+HCl}.$$
L’alcoolyse donne un ester ; la réaction avec l’ammoniac ou une amine primaire/secondaire permet de former une amide. Un carboxylate peut conduire à un anhydride.
`),
  section("pc-acids-anhydrides", "VIII", "Anhydrides d’acides", [399], String.raw`
Un anhydride possède deux groupes acyle reliés par un oxygène : $\mathrm{RCO{-}O{-}COR'}$. Il est symétrique si $\mathrm{R=R'}$, mixte sinon.

Exemples : $\mathrm{(CH_3CO)_2O}$, anhydride éthanoïque ; $\mathrm{(CH_3CH_2CO)_2O}$, anhydride propanoïque ; $\mathrm{CH_3COOCOCH_2CH_3}$, anhydride éthanoïque et propanoïque. L’acide benzène-1,2-dicarboxylique peut former un anhydride cyclique, l’anhydride phtalique.

La déshydratation de deux fonctions acides donne, comme bilan simplifié :
$$\mathrm{RCOOH+R'COOH\to RCOOCOR'+H_2O}.$$
Un déshydratant comme $\mathrm{P_4O_{10}}$ favorise cette transformation. On peut aussi utiliser :
$$\mathrm{RCOCl+R'COOH\to RCOOCOR'+HCl},$$
$$\mathrm{RCOCl+R'COO^-\to RCOOCOR'+Cl^-}.$$
Un anhydride saturé acyclique à $n$ carbones au total a pour formule $\mathrm{C_nH_{2n-2}O_3}$.

Avec l’eau, il redonne deux acides :
$$\mathrm{RCOOCOR'+H_2O\to RCOOH+R'COOH}.$$
Avec un alcool, il forme un ester et un acide ; avec l’ammoniac, il peut former une amide.
`),
  section("pc-acids-amides", "IX", "Amides : structure et transformations", [400,401], String.raw`
| Substitution de l’azote | Formule | Exemple |
|---|---|---|
| Non substituée | $\mathrm{RCONH_2}$ | Butanamide $\mathrm{CH_3CH_2CH_2CONH_2}$ ; benzamide $\mathrm{C_6H_5CONH_2}$ |
| Monosubstituée | $\mathrm{RCONHR'}$ | N-phénylbutanamide $\mathrm{CH_3CH_2CH_2CONHC_6H_5}$ |
| Disubstituée | $\mathrm{RCONR'R''}$ | N-éthyl-N-méthylpropanamide $\mathrm{CH_3CH_2CON(CH_3)C_2H_5}$ |

Pour une monoamide saturée acyclique, la formule globale est $\mathrm{C_nH_{2n+1}NO}$.

**Préparation :**
$$\mathrm{RCOO^-+NH_4^+\to RCONH_2+H_2O}$$
par déshydratation appropriée du carboxylate d’ammonium ;
$$\mathrm{(RCO)_2O+NH_3\to RCONH_2+RCOOH},$$
$$\mathrm{RCOCl+2NH_3\to RCONH_2+NH_4^++Cl^-},$$
$$\mathrm{RCOOR'+NH_3\to RCONH_2+R'OH}.$$
Les amines primaires et secondaires permettent aussi l’acylation ; une amine tertiaire ne fournit pas directement une amide neutre par ce mécanisme, faute de liaison N–H.

**Hydrolyse :** lente sans conditions adaptées ; le bilan et les espèces dépendent du milieu.
$$\mathrm{RCONH_2+H_3O^+\to RCOOH+NH_4^+},$$
$$\mathrm{RCONH_2+OH^-\to RCOO^-+NH_3}.$$

L’ensemble des transformations relie donc acide, chlorure d’acyle, anhydride, ester et amide ; l’eau ramène leurs dérivés vers la famille acide ou carboxylate selon le milieu.
`),
], [
  "Cours393–402 uniquement, exercice403 exclu. La carte Savons réutilise397 et les acides gras393–394.",
  "Carboxyle non carbonyle seul ; total de carbones explicite dans les formules brutes ; géométries indicatives conservées.",
  "Ester du 4e exemple :2-méthylpentanoate, et non3. Produit d’estérification RCOOR′ ; rendements indicatifs et tertiaire5 % corrigé.",
  "Exemple rendement396 résolu explicitement : éthanol0,512 mol, méthanoïque0,326 mol, acide limitant, environ 80 %.",
  "Hydrolyse du chlorure redonne RCOOH, pas RCOCl ; PET depuis diol+diacide libère H2O, non méthanol.",
  "Tout carboxylate n’est pas un savon ; exemples de402 à valence erronée non reproduits : pentan-2-one=CH3COCH2CH2CH3 et N-méthyléthanamide=CH3CONHCH3.",
]);
export const soapSheet = sheet("soap", "Saponification et savons", [393,394,397], [soapReaction,triglycerides], [
  "Contenu397 et acides gras393–394 ; pas d’exercice supplémentaire. Bilans avec trois fonctions ester équilibrés.",
  "Distinction entre saponification d’un ester quelconque et obtention d’un savon à longue chaîne ; relargage par baisse de solubilité.",
]);
