import { complexExercise as ex,complexShort as cs,complexExact,short,written,choice,complexTex,complexProductSolution } from "./terminalCComplexBuilders";
import { complexAdd,complexMultiply,complexDivide,complexPower,complexConjugate } from "../courseDocuments/complexWriting";
import type { ComplexPair } from "../../features/mathematics/complexMath";
const pairs:readonly (readonly[ComplexPair,ComplexPair])[]=[[[2,1],[3,2]],[[-4,3],[5,-8]],[[-1,-1],[-7,-17]]];
export const complexFixationA=[
 ex(1,"Forme algébrique et conjugué","Choisir la bonne réponse pour chaque affirmation.",[
  choice("1.",String.raw`La forme algébrique de $\frac{5-2i}{4+3i}$ est :`,[String.raw`$\frac{15}{25}+\frac3{25}i$`,String.raw`$\frac{26}{25}+\frac7{25}i$`,String.raw`$\frac{14}{25}-\frac{23}{25}i$`],2,String.raw`On multiplie par le conjugué $4-3i$ :
$$\frac{5-2i}{4+3i}=\frac{(5-2i)(4-3i)}{25}
=\frac{20-15i-8i+6i^2}{25}
=\boxed{\frac{14}{25}-\frac{23}{25}i}.$$`),
  choice("2.",String.raw`Le conjugué de $\frac{1-z}{1-i}$ est :`,[String.raw`$\frac{1+z}{1-i}$`,String.raw`$\frac{1+\bar z}{1+i}$`,String.raw`$\frac{1-\bar z}{1+i}$`],2,String.raw`Le conjugué d’un quotient est le quotient des conjugués. Ici $\overline{1-z}=1-\bar z$ et $\overline{1-i}=1+i$, donc on obtient $(1-\bar z)/(1+i)$.`)
 ]),
 ex(2,"Partie imaginaire","Choisir la partie imaginaire du nombre donné.",[
  choice("1.",String.raw`$\sqrt2-4i$.`,["−4i","√2−4","−4"],2,String.raw`La forme $a+ib$ a pour partie imaginaire le réel $b$. Ici $b=-4$, pas $-4i$.`)
 ]),
 ex(3,"Parties réelle et imaginaire",String.raw`On donne $z_1=i$, $z_2=7-9i$ et $z_3=(2i-5)/3$. Déterminer les deux parties de chacun.`,
  ([[0,1],[7,-9],[-5/3,2/3]] as ComplexPair[]).flatMap((z,i)=>[
   short((i+1)+".a",String.raw`Partie réelle de $z_{${i+1}}$.`,"$"+complexTex([z[0],0])+"$",[String(z[0])],String.raw`On écrit $z_{${i+1}}=${complexTex(z)}$. Le terme sans $i$ est $${complexTex([z[0],0])}$.`),
   short((i+1)+".b",String.raw`Partie imaginaire de $z_{${i+1}}$.`,"$"+complexTex([z[1],0])+"$",[String(z[1])],String.raw`Le coefficient réel de $i$ est $${complexTex([z[1],0])}$. C’est la partie imaginaire. Cette réponse ne contient pas $i$.`)
  ])),
 ex(4,"Réel ou imaginaire pur","Déterminer le réel x dans chaque cas.",[
  short("1.",String.raw`$2+(3-x)i$ est réel.`,"3",["3"],String.raw`Un complexe est réel si sa partie imaginaire est nulle : $3-x=0$, donc $\boxed{x=3}$.`),
  short("2.",String.raw`$(2x-1)+4i$ est imaginaire pur.`,"$1/2$",["1/2"],String.raw`Sa partie réelle doit s’annuler : $2x-1=0$, donc $\boxed{x=1/2}$.`)
 ]),
 ex(5,"Sept repères sur les complexes","Choisir la bonne proposition.",[
  choice("1.",String.raw`Le module de $5-i\sqrt2$ est :`,["27",String.raw`$\sqrt{27}$`,String.raw`$\sqrt{29}$`],1,String.raw`$|5-i\sqrt2|=\sqrt{5^2+(-\sqrt2)^2}=\sqrt{25+2}=\sqrt{27}$.`),
  choice("2.",String.raw`Un argument de $-\sqrt3+i\sqrt3$ est :`,[String.raw`$3\pi/4$`,String.raw`$-\pi/4$`,String.raw`$-3\pi/4$`],0,String.raw`La partie réelle est négative et la partie imaginaire positive : deuxième quadrant. Les valeurs absolues étant égales, l’angle est $3\pi/4$.`),
  choice("3.",String.raw`Un argument de $-2(\cos(\pi/6)-i\sin(\pi/6))$ est :`,[String.raw`$-\pi/6$`,String.raw`$-5\pi/6$`,String.raw`$5\pi/6$`],2,String.raw`La parenthèse a pour argument $-\pi/6$. Le facteur négatif ajoute $\pi$ : $-\pi/6+\pi=5\pi/6$.`),
  choice("4.",String.raw`La forme exponentielle de $\frac{5\sqrt3}2(\frac12+i\frac{\sqrt3}2)$ est :`,[String.raw`$\frac{15}2e^{i\pi/3}$`,String.raw`$\frac{5\sqrt3}2e^{i\pi/6}$`,String.raw`$\frac{5\sqrt3}2e^{i\pi/3}$`],2,String.raw`La parenthèse a pour module $1$ et argument $\pi/3$. Le facteur positif $5\sqrt3/2$ est le module.`),
  choice("5.",String.raw`$(1+i)^{72}$ vaut :`,[String.raw`$2^{72}$`,String.raw`$2^{36}$`,"0"],1,String.raw`$1+i=\sqrt2e^{i\pi/4}$. Donc $(1+i)^{72}=2^{36}e^{18i\pi}=2^{36}$.`),
  choice("6.",String.raw`Avec $A(2+i)$ et $B(2-4i)$, le triangle OAB est :`,["Rectangle","Équilatéral","Isocèle"],0,String.raw`Les vecteurs $\overrightarrow{OA}=(2;1)$ et $\overrightarrow{OB}=(2;-4)$ ont pour produit scalaire $4-4=0$. Le triangle est rectangle en O. Ses deux côtés issus de O n’ont pas la même longueur. `),
  choice("7.",String.raw`Le lieu $|z-1+i|=|z+2i|$ est :`,["Un cercle",String.raw`La médiatrice de $[AB]$, $A(-1+i),B(2i)$`,String.raw`La médiatrice de $[AB]$, $A(1-i),B(-2i)$`],2,String.raw`On écrit $|z-(1-i)|=|z-(-2i)|$. Ce sont les distances à $A(1;-1)$ et $B(0;-2)$ : l’ensemble est leur médiatrice. `)
 ]),
 ex(6,"Égalité de deux complexes",String.raw`On donne $z=2+(x-1)i$, avec $x$ réel. Trouver x pour que $z=2+i$.`,[
  short("1.","Déterminer x.","2",["2"],String.raw`Les parties réelles sont déjà égales. Pour les parties imaginaires : $x-1=1$, donc $\boxed{x=2}$.`)
 ]),
 ex(7,"Opposés",String.raw`Déterminer l’opposé de $17-9i$, $-\sqrt2i$ et $-5-6i$.`,[
  cs("1.",String.raw`Opposé de $17-9i$.`,[-17,9],String.raw`On change les deux signes : $-(17-9i)=\boxed{-17+9i}$.`),
  complexExact("2.",String.raw`Opposé de $-\sqrt2i$.`,String.raw`\sqrt2i`,"sqrt(2)*i",String.raw`L’opposé est $\boxed{\sqrt2i}$. Sa somme avec le nombre initial vaut zéro.`),
  cs("3.",String.raw`Opposé de $-5-6i$.`,[5,6],String.raw`On change le signe des deux parties : $-(-5-6i)=\boxed{5+6i}$. La somme des deux nombres vaut zéro.`)
 ]),
 ex(8,"Sommes","Calculer z₁+z₂ sous forme algébrique dans chaque cas.",pairs.map(([a,b],i)=>cs(String(i+1),"$z_1="+complexTex(a)+"$, $z_2="+complexTex(b)+"$.",complexAdd(a,b),String.raw`On additionne séparément les parties réelles et imaginaires :
$$ (${complexTex(a)})+(${complexTex(b)})=\boxed{${complexTex(complexAdd(a,b))}.}$$`))),
 ex(9,"Produits","Calculer z₁z₂ sous forme algébrique dans chaque cas.",pairs.map(([a,b],i)=>cs(String(i+1),"$z_1="+complexTex(a)+"$, $z_2="+complexTex(b)+"$.",complexMultiply(a,b),complexProductSolution(a,b)))),
 ex(10,"Inverses","Déterminer l’inverse de chaque complexe sous forme algébrique.",([[1,1],[-4,3],[-8,8]] as ComplexPair[]).map((z,i)=>cs(String(i+1),"$1/("+complexTex(z)+")$.",complexDivide([1,0],z),String.raw`Le dénominateur est non nul. On multiplie par son conjugué :
$$\frac1{${complexTex(z)}}=\frac{${complexTex(complexConjugate(z))}}{${z[0]**2+z[1]**2}}=\boxed{${complexTex(complexDivide([1,0],z))}.}$$`))),
 ex(11,"Puissances entières","Écrire chaque puissance sous forme algébrique.",([[2,3,2],[2,3,-2],[1,1,4],[1,1,-4]] as const).map(([a,b,n],i)=>cs(String(i+1),String.raw`$(${complexTex([a,b])})^{${n}}$.`,complexPower([a,b],n),n<0?String.raw`Une puissance négative est un inverse :
$$z^{${n}}=\frac1{z^{${-n}}}.$$
On calcule la puissance positive puis on multiplie par le conjugué du dénominateur. On obtient $\boxed{${complexTex(complexPower([a,b],n))}}$.`:String.raw`On commence par le carré, avec $i^2=-1$ : $z^2=${complexTex(complexPower([a,b],2))}$. ${n===4?"On élève ce résultat au carré une seconde fois.":""} Ainsi $\boxed{z^{${n}}=${complexTex(complexPower([a,b],n))}}$.`))),
 ex(12,"Cycle des puissances de i","Calculer les puissances.",[403,2030,2022,2001].map((n,i)=>cs(String(i+1),"$i^{"+n+"}$.",([ [1,0],[0,1],[-1,0],[0,-1] ] as ComplexPair[])[n%4],String.raw`$${n}=4\times${Math.floor(n/4)}+${n%4}$. La puissance a donc la même valeur que $i^{${n%4}}$, soit $\boxed{${["1","i","-1","-i"][n%4]}}$.`))),
 ex(13,"Produit nul","Compléter et justifier.",[
  written("1.",String.raw`Compléter : $zz'\ne0\iff\ldots$`,String.raw`Un produit est non nul si et seulement si ses deux facteurs sont non nuls :
$$\boxed{zz'\ne0\iff z\ne0\ \text{et}\ z'\ne0.}$$
Il s’agit de la négation de « $z=0$ ou $z'=0$ ».`),
  written("2.",String.raw`On suppose $z'\ne0$ et $zz'=0$. Justifier $z=0$.`,String.raw`L’égalité $zz'=0$ impose $z=0$ ou $z'=0$. La deuxième possibilité est exclue. Donc $\boxed{z=0}$. On peut aussi multiplier l’égalité par $1/z'$.`)
 ]),
 ex(14,"Résoudre un produit nul",String.raw`Résoudre $(3z-2-i)(z+2i)=0$ dans $\mathbb C$.`,[
  written("1.","Donner toutes les solutions.",String.raw`On annule séparément les facteurs :
$$3z-2-i=0\quad\text{ou}\quad z+2i=0.$$
Ainsi $\boxed{S=\{(2+i)/3;\ -2i\}}$. Chaque valeur annule effectivement un facteur. `)
 ]),
 ex(15,"Conjugués","Déterminer le conjugué de chaque nombre.",([[0,0],[1,1],[1,-1],[7,0],[-19,0],[3,-4],[-38,6]] as ComplexPair[]).map((z,i)=>cs(String(i+1),"$\\overline{"+complexTex(z)+"}$.",complexConjugate(z),String.raw`On conserve la partie réelle et on change le signe de la partie imaginaire :
$$\boxed{\overline{${complexTex(z)}}=${complexTex(complexConjugate(z))}.}$$`))),
 ex(16,"Produit avec le conjugué","Soit z un nombre complexe. Justifier que z z̄ est un réel positif ou nul.",[
  written("1.","Justifier la propriété.",String.raw`Écrivons $z=a+ib$, avec $a,b$ réels. Alors :
$$z\bar z=(a+ib)(a-ib)=a^2-(ib)^2=a^2+b^2.$$
Cette somme est réelle et positive ou nulle. Elle est nulle seulement pour $z=0$.`)
 ]),
 ex(17,"Trois expressions avec le conjugué","Calculer z+z̄, z−z̄ et z z̄ dans les deux cas.",([[3,2],[7,1]] as ComplexPair[]).flatMap((z,i)=>[
  cs((i+1)+".a","$z="+complexTex(z)+"$ : $z+\\bar z$.",[2*z[0],0],String.raw`$z+\bar z=2\operatorname{Re}(z)=\boxed{${2*z[0]}}$.`),
  cs((i+1)+".b","$z="+complexTex(z)+"$ : $z-\\bar z$.",[0,2*z[1]],String.raw`$z-\bar z=2i\operatorname{Im}(z)=\boxed{${2*z[1]}i}$.`),
  cs((i+1)+".c","$z="+complexTex(z)+"$ : $z\\bar z$.",[z[0]**2+z[1]**2,0],String.raw`Le produit par le conjugué est la somme des carrés des deux parties : $z\bar z=${z[0]}^2+${z[1]}^2=\boxed{${z[0]**2+z[1]**2}}$. Le résultat est réel positif.`)
 ])),
 ex(18,"Conjuguer des opérations",String.raw`On donne $z=2+3i$, $z'=-1+5i$. Calculer les expressions sous forme algébrique.`,[
  cs("1.",String.raw`$\overline{z+z'}$.`,[1,-8],String.raw`$z+z'=1+8i$, donc $\boxed{\overline{z+z'}=1-8i}$.`),
  cs("2.",String.raw`$\overline{zz'}$.`,[-17,-7],String.raw`$zz'=(2+3i)(-1+5i)=-17+7i$. Son conjugué vaut $\boxed{-17-7i}$.`),
  cs("3.",String.raw`$\overline{z/z'}$.`,[.5,.5],String.raw`$\frac{z}{z'}=\frac{(2+3i)(-1-5i)}{26}=\frac{13-13i}{26}=\frac12-\frac i2$. Ainsi $\boxed{\overline{z/z'}=\frac12+\frac i2}$.`)
 ])
];
