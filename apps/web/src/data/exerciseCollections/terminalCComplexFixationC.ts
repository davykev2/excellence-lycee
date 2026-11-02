import { complexExercise as ex,complexExact,short,written,tf } from "./terminalCComplexBuilders";
const roots=(label:string,z:string,n:number,r:string,t:string)=>{
 const base:Record<string,readonly[string,string]>={"i":["1",String.raw`\pi/2`],"1+i":[String.raw`\sqrt2`,String.raw`\pi/4`],[String.raw`\sqrt3+i`]:["2",String.raw`\pi/6`],"1":["1","0"],"1-i":[String.raw`\sqrt2`,String.raw`-\pi/4`],"-2":["2",String.raw`\pi`]};
 const [R,theta]=base[z];
 return written(label,"Déterminer les racines "+(n===2?"carrées":n===3?"cubiques":"quatrièmes")+" de $"+z+"$.",String.raw`**1. Forme du nombre donné.** À partir de ses deux coordonnées, on calcule son module $R=${R}$. Les rapports partie réelle/R et partie imaginaire/R donnent un argument $${theta}$. Donc $Z=${R}e^{i(${theta})}$.

**2. Module et angles des racines.** Si $w^{${n}}=Z$, alors $|w|^{${n}}=R$, donc $|w|=${r}$. Les arguments vérifient $${n}\arg(w)=${theta}+2k\pi$.

**3. Solutions.** Les $${n}$ solutions distinctes sont :
$$\boxed{z_k=${r}e^{i(${t}+2k\pi/${n})},\quad k=0,\ldots,${n-1}.}$$
Leurs arguments diffèrent de $2\pi/${n}$. En élevant chaque expression à la puissance $${n}$, on retrouve le nombre donné.`);
};
export const complexFixationC=[
 ex(36,"Formes trigonométriques de produits et quotients","Écrire sous forme trigonométrique.",[
  written("1.",String.raw`$(2+2i)(1-i)$.`,String.raw`On développe : $2-2i+2i-2i^2=4$. Le résultat est réel positif, de module 4 et d’argument 0. Sa forme trigonométrique est $\boxed{4(\cos0+i\sin0)}$.`),
  written("2.",String.raw`$(\sqrt3+i)/(2i)$.`,String.raw`Le numérateur a pour module 2 et argument $\pi/6$. Le dénominateur a pour module 2 et argument $\pi/2$. Le quotient a donc pour module 1 et argument $\pi/6-\pi/2=-\pi/3$. Ainsi $\boxed{\cos(-\pi/3)+i\sin(-\pi/3)}$.`),
  written("3.",String.raw`$(\sqrt6-i\sqrt2)/(2(1-i))$.`,String.raw`Le numérateur a pour module $\sqrt{6+2}=2\sqrt2$ et pour argument $-\pi/6$, car les coordonnées réduites sont $\sqrt3/2$ et $-1/2$. Le dénominateur a pour module $2\sqrt2$ et pour argument $-\pi/4$. Le quotient a donc pour module 1 et argument $-\pi/6+\pi/4=\pi/12$. D’où $\boxed{\cos(\pi/12)+i\sin(\pi/12)}$.`),
  written("4.",String.raw`$(1-i)^4$.`,String.raw`$1-i=\sqrt2e^{-i\pi/4}$. Moivre donne $(1-i)^4=4e^{-i\pi}=-4$. On peut prendre l’argument principal $\pi$ : $\boxed{4(\cos\pi+i\sin\pi)}$.`)
 ]),
 ex(37,"Revenir à la forme algébrique","Écrire sous forme algébrique.",[
  complexExact("1.",String.raw`$\sqrt2(\cos(2\pi/3)+i\sin(2\pi/3))$.`,String.raw`-\frac{\sqrt2}2+i\frac{\sqrt6}2`,"-sqrt2/2+i*sqrt6/2",String.raw`$\cos(2\pi/3)=-1/2$ et $\sin(2\pi/3)=\sqrt3/2$. En distribuant $\sqrt2$, on obtient $\boxed{-\sqrt2/2+i\sqrt6/2}$.`),
  complexExact("2.",String.raw`$2(\cos(\pi/4)+i\sin(\pi/4))$.`,String.raw`\sqrt2+i\sqrt2`,"sqrt2+i*sqrt2",String.raw`Les deux valeurs trigonométriques valent $\sqrt2/2$. Multipliées par 2, elles donnent $\boxed{\sqrt2+i\sqrt2}$.`),
  complexExact("3.",String.raw`$3(\cos(\pi/6)+i\sin(\pi/6))$.`,String.raw`\frac{3\sqrt3}2+\frac32i`,"3sqrt3/2+3i/2",String.raw`$\cos(\pi/6)=\sqrt3/2$ et $\sin(\pi/6)=1/2$. On obtient $\boxed{3\sqrt3/2+3i/2}$.`)
 ]),
 ex(38,"Reconnaître une forme exponentielle",String.raw`$\theta$ est réel. Une forme exponentielle s’écrit $re^{it}$ avec $r>0$. Indiquer si chaque écriture respecte cette convention.`,[
  tf("1.",String.raw`$2e^{i\theta}$.`,true,"Le coefficient 2 est strictement positif."),
  tf("2.",String.raw`$-3e^{i\theta}$.`,false,String.raw`Le coefficient est négatif. On peut réécrire $3e^{i(\theta+\pi)}$.`),
  tf("3.",String.raw`$7e^{-i\theta}$.`,true,String.raw`Le module est 7 et l’argument $-\theta$ est réel.`),
  tf("4.",String.raw`$-4e^{-i\theta\pi/4}$.`,false,String.raw`Le module doit être positif : écrire $4e^{i(\pi-\theta\pi/4)}$.`)
 ]),
 ex(39,"Écriture exponentielle","Écrire chaque complexe sous forme exponentielle.",[
  written("a.",String.raw`$2(\cos(2\pi/3)+i\sin(2\pi/3))$.`,String.raw`La définition donne directement $\boxed{2e^{2i\pi/3}}$.`),
  written("b.","$1+i$.",String.raw`Le module est $\sqrt2$ et un argument est $\pi/4$. Donc $\boxed{\sqrt2e^{i\pi/4}}$.`),
  written("c.",String.raw`$3+i\sqrt3$.`,String.raw`Le module vaut $\sqrt{9+3}=2\sqrt3$. Les coordonnées divisées par ce module sont $\sqrt3/2$ et $1/2$, donc un argument est $\pi/6$. Ainsi $\boxed{2\sqrt3e^{i\pi/6}}$.`)
 ]),
 ex(40,"Arguments de quotients","Donner une forme trigonométrique.",[
  written("1.",String.raw`$\frac{\cos(\pi/12)+i\sin(\pi/12)}{\cos(2\pi/3)+i\sin(2\pi/3)}$.`,String.raw`Les deux modules valent 1. Pour le quotient, on soustrait les angles : $\pi/12-2\pi/3=-7\pi/12$. Donc $\boxed{\cos(-7\pi/12)+i\sin(-7\pi/12)}$.`),
  written("2.",String.raw`$\frac{1+i\sqrt3}{1+i}$.`,String.raw`$1+i\sqrt3=2e^{i\pi/3}$ et $1+i=\sqrt2e^{i\pi/4}$. Le module du quotient est $2/\sqrt2=\sqrt2$ et son argument $\pi/3-\pi/4=\pi/12$. Ainsi $\boxed{\sqrt2(\cos(\pi/12)+i\sin(\pi/12))}$.`),
  written("3.",String.raw`$\frac{\sin(\pi/12)-i\cos(\pi/12)}{\sin(\pi/12)+i\cos(\pi/12)}$.`,String.raw`Posons $\alpha=\pi/12$. Le numérateur vaut $-ie^{i\alpha}$ ; le dénominateur vaut $ie^{-i\alpha}$. Ils ont chacun pour module 1. Leur quotient vaut $-e^{2i\alpha}=e^{i(2\alpha-\pi)}$. Comme $2\alpha-\pi=-5\pi/6$, on obtient $\boxed{\cos(-5\pi/6)+i\sin(-5\pi/6)}$.`),
  written("4.",String.raw`$-2(\cos(2\pi/3)+i\sin(2\pi/3))$.`,String.raw`Pour rendre le module positif, on remplace le facteur −1 par $e^{i\pi}$. L’angle devient $2\pi/3+\pi=5\pi/3$, équivalent à $-\pi/3$. La forme demandée est $\boxed{2(\cos(-\pi/3)+i\sin(-\pi/3))}$.`)
 ]),
 ex(41,"Formule de Moivre","Écrire chaque puissance sous forme trigonométrique.",[
  written("1.",String.raw`$(1+i\sqrt3)^2$.`,String.raw`$1+i\sqrt3=2e^{i\pi/3}$. En élevant au carré, on élève le module au carré et on double l’angle : $\boxed{4(\cos(2\pi/3)+i\sin(2\pi/3))}$.`),
  written("2.",String.raw`$\left(\frac{\sqrt3+i}{1+i}\right)^3$.`,String.raw`Le quotient a pour module $2/\sqrt2=\sqrt2$ et pour argument $\pi/6-\pi/4=-\pi/12$. Son cube vaut donc $\boxed{2\sqrt2(\cos(-\pi/4)+i\sin(-\pi/4))}$.`),
  written("3.",String.raw`$\left(\frac{\sqrt6-i\sqrt2}{1-i}\right)^3$.`,String.raw`Le quotient a pour module $2\sqrt2/\sqrt2=2$ et pour argument $-\pi/6+\pi/4=\pi/12$. Son cube vaut $\boxed{8(\cos(\pi/4)+i\sin(\pi/4))}$.`)
 ]),
 ex(42,"Angles multiples",String.raw`Exprimer en fonction de $\cos x$ et $\sin x$.`,[
  written("a.",String.raw`$\cos3x$.`,String.raw`On développe $(\cos x+i\sin x)^3$ puis on prend la partie réelle :
$$\cos3x=\cos^3x-3\cos x\sin^2x.$$
Avec $\sin^2x=1-\cos^2x$, on trouve aussi $\boxed{\cos3x=4\cos^3x-3\cos x}$.`),
  written("b.",String.raw`$\cos2x+\cos3x$.`,String.raw`$\cos2x=2\cos^2x-1$ et $\cos3x=4\cos^3x-3\cos x$. En additionnant :
$$\boxed{4\cos^3x+2\cos^2x-3\cos x-1.}$$`)
 ]),
 ex(43,"Formules d’Euler","Écrire sous forme algébrique.",[
  short("1.",String.raw`$(e^{i\pi/3}+e^{-i\pi/3})/2$.`,"1/2",["1/2"],String.raw`La demi-somme vaut $\cos(\pi/3)=\boxed{1/2}$.`),
  short("2.",String.raw`$(e^{i\pi/6}-e^{-i\pi/6})/(2i)$.`,"1/2",["1/2"],String.raw`La différence divisée par $2i$ vaut $\sin(\pi/6)=\boxed{1/2}$.`),
  short("3.",String.raw`$e^{3i\pi/4}+e^{-3i\pi/4}$.`,String.raw`$-\sqrt2$`,["-sqrt2"],String.raw`La somme vaut $2\cos(3\pi/4)=2(-\sqrt2/2)=\boxed{-\sqrt2}$.`)
 ]),
 ex(44,"Factoriser par l’angle moitié",String.raw`Pour $0<\theta<\pi$, écrire les nombres sous forme trigonométrique.`,[
  written("1.",String.raw`$e^{i\theta}+1$.`,String.raw`Factorisons par $e^{i\theta/2}$ :
$$e^{i\theta}+1=e^{i\theta/2}(e^{i\theta/2}+e^{-i\theta/2})
=2\cos(\theta/2)e^{i\theta/2}.$$
Comme $0<\theta/2<\pi/2$, le module est bien positif. La forme trigonométrique est $\boxed{2\cos(\theta/2)(\cos(\theta/2)+i\sin(\theta/2))}$.`),
  written("2.",String.raw`$e^{i\theta}-1$.`,String.raw`Même factorisation :
$$e^{i\theta}-1=2i\sin(\theta/2)e^{i\theta/2}
=2\sin(\theta/2)e^{i(\theta/2+\pi/2)}.$$
Le module $2\sin(\theta/2)$ est positif. On remplace ensuite l’exponentielle par cosinus plus $i$ sinus du même angle. Attention au décalage $+\pi/2$ dû au facteur $i$.`),
  written("3.",String.raw`$e^{-i\theta}+1$.`,String.raw`C’est le conjugué du premier résultat : $\boxed{2\cos(\theta/2)e^{-i\theta/2}}$. Le module ne change pas et l’argument change de signe. La forme trigonométrique correspondante utilise l’angle $-\theta/2$.`)
 ]),
 ex(45,"Linéarisation",String.raw`Linéariser chaque expression. Les formules d’Euler permettent de développer puis de regrouper les exponentielles opposées.`,[
  written("1.",String.raw`$\cos^3x$.`,String.raw`$8\cos^3x=e^{3ix}+3e^{ix}+3e^{-ix}+e^{-3ix}$. Chaque paire donne deux fois un cosinus. Donc $\boxed{\cos^3x=(\cos3x+3\cos x)/4}$.`),
  written("2.",String.raw`$\sin^2x\cos^3x$.`,String.raw`On utilise $\sin^2x=(1-\cos2x)/2$ et $\cos^3x=(3\cos x+\cos3x)/4$. Puis on remplace les produits par $2\cos a\cos b=\cos(a+b)+\cos(a-b)$. Après regroupement :
$$\boxed{\sin^2x\cos^3x=(2\cos x-\cos3x-\cos5x)/16.}$$`),
  written("3.",String.raw`$\cos^4x$.`,String.raw`$\cos^4x=(1+2\cos2x+\cos^2(2x))/4$. En remplaçant le dernier carré par $(1+\cos4x)/2$ :
$$\boxed{\cos^4x=(3+4\cos2x+\cos4x)/8.}$$`),
  written("4.",String.raw`$\sin^5x$.`,String.raw`$32i\sin^5x=(e^{5ix}-e^{-5ix})-5(e^{3ix}-e^{-3ix})+10(e^{ix}-e^{-ix})$. Chaque différence vaut $2i$ fois le sinus correspondant. Ainsi $\boxed{\sin^5x=(\sin5x-5\sin3x+10\sin x)/16}$.`)
 ]),
 ex(46,"Racines carrées","Déterminer les deux racines de chaque complexe.",[
  roots("1.","i",2,"1",String.raw`\pi/4`),
  roots("2.","1+i",2,String.raw`2^{1/4}`,String.raw`\pi/8`),
  roots("3.",String.raw`\sqrt3+i`,2,String.raw`\sqrt2`,String.raw`\pi/12`)
 ]),
 ex(47,"Racines cubiques","Déterminer les trois racines de chaque nombre.",[
  roots("1.","1",3,"1","0"),roots("2.","i",3,"1",String.raw`\pi/6`),
  roots("3.","1+i",3,String.raw`2^{1/6}`,String.raw`\pi/12`)
 ]),
 ex(48,"Racines cubiques et points images","Déterminer les racines puis placer leurs points images.",[
  roots("1.","1",3,"1","0"),roots("2.","1-i",3,String.raw`2^{1/6}`,String.raw`-\pi/12`),
  roots("3.","-2",3,String.raw`\sqrt[3]2`,String.raw`\pi/3`),
  written("4.","Placer les trois groupes de points.",String.raw`Pour chaque nombre, tracer le cercle centré en O du rayon calculé. Placer le premier point avec l’argument donné, puis avancer deux fois de $2\pi/3$ dans le sens direct. Chaque triplet forme un triangle équilatéral ; les trois groupes n’ont pas nécessairement le même rayon.`)
 ],true),
 ex(49,"Racines quatrièmes de l’unité","Déterminer les racines quatrièmes de 1 et placer leurs points images.",[
  written("1.","Résoudre et construire.",String.raw`$z^4=1$ donne $z_k=e^{ik\pi/2}$ pour $k=0,1,2,3$. Donc $\boxed{S=\{1,i,-1,-i\}}$. Les images sont $(1;0),(0;1),(-1;0),(0;-1)$ : elles forment un carré sur le cercle unité.`)
 ],true),
 ex(50,"Somme des racines",String.raw`Pour $n\ge2$, justifier que la somme des n racines n-ièmes d’un complexe non nul est 0.`,[
  written("1.","Démontrer.",String.raw`Notons $a$ une des racines et $q=e^{2i\pi/n}$. Les racines sont $a,aq,\ldots,aq^{n-1}$. Or $q\ne1$ car $n\ge2$, et $q^n=1$. La somme géométrique donne :
$$a(1+q+\cdots+q^{n-1})=a\frac{1-q^n}{1-q}=\boxed0.$$
L’hypothèse $n\ge2$ est indispensable.`)
 ]),
 ex(51,"La racine j",String.raw`On pose $j=-\frac12+i\frac{\sqrt3}2$. Vérifier les identités puis calculer la puissance.`,[
  written("1.a",String.raw`$\bar j=-1-j$.`,String.raw`$1+j+\bar j=1-1/2-1/2+i(\sqrt3/2-\sqrt3/2)=0$. Donc $\boxed{\bar j=-1-j}$.`),
  written("1.b",String.raw`$j\bar j=1$.`,String.raw`$j\bar j=|j|^2=1/4+3/4=\boxed1$.`),
  written("1.c",String.raw`$j^6=1$.`,String.raw`$j=e^{2i\pi/3}$, donc $j^3=e^{2i\pi}=1$ et $j^6=(j^3)^2=\boxed1$.`),
  written("2.",String.raw`$j^{2024}$.`,String.raw`$2024=3\times674+2$. Ainsi $j^{2024}=(j^3)^{674}j^2=\boxed{j^2=\bar j=-1/2-i\sqrt3/2}$.`)
 ]),
 ex(52,"Équations du second degré","Résoudre dans ℂ.",[
  written("1.","$z^2+z+1=0$.",String.raw`$\Delta=1-4=-3=(i\sqrt3)^2$. Les deux racines sont donc $\boxed{(-1+i\sqrt3)/2}$ et $\boxed{(-1-i\sqrt3)/2}$, soit $j$ et $\bar j$.`),
  written("2.","$z^2+(3i-4)z+1-7i=0$.",String.raw`$\Delta=(3i-4)^2-4(1-7i)=3+4i=(2+i)^2$. Donc
$$z=\frac{4-3i\pm(2+i)}2.$$
En séparant les deux signes : $\boxed{S=\{1-2i,3-i\}}$.`),
  written("3.",String.raw`$iz^2-i\sqrt3z+1=0$.`,String.raw`Ici $a=i$, $b=-i\sqrt3$, $c=1$ et $\Delta=-3-4i=(1-2i)^2$. Les racines sont :
$$\frac{i\sqrt3+(1-2i)}{2i}=\frac{\sqrt3}2-1-\frac i2,$$
$$\frac{i\sqrt3-(1-2i)}{2i}=\frac{\sqrt3}2+1+\frac i2.$$
Leur somme est bien $\sqrt3$ et leur produit $1/i=-i$.`)
 ]),
 ex(53,"Cercles et médiatrices","Déterminer les ensembles de points M d’affixe z.",[
  written("1.",String.raw`$|z-i|=2$.`,String.raw`Le module représente la distance du point M au point I d’affixe $i$. C’est donc le cercle de centre $I(0;1)$ et de rayon 2, d’équation $\boxed{x^2+(y-1)^2=4}$.`),
  written("2.",String.raw`$|z-1+2i|=|z+2-i|$.`,String.raw`On reconnaît les distances aux points $A(1;-2)$ et $B(-2;1)$. L’ensemble est la médiatrice de [AB]. En développant :
$$(x-1)^2+(y+2)^2=(x+2)^2+(y-1)^2
\iff -6x+6y=0.$$
Donc $\boxed{y=x}$.`)
 ],true),
 ex(54,"Triangle équilatéral indirect",String.raw`$A(1)$, $B(1+2i)$, $C(1+\sqrt3+i)$. Démontrer que ABC est équilatéral de sens indirect.`,[
  written("1.","Démontrer par un quotient.",String.raw`$z_B-z_A=2i\ne0$ et :
$$\frac{z_C-z_A}{z_B-z_A}=\frac{\sqrt3+i}{2i}=\frac12-i\frac{\sqrt3}2=e^{-i\pi/3}.$$
Le module 1 donne $AC=AB$. L’angle $(\overrightarrow{AB};\overrightarrow{AC})=-\pi/3$ donne le sens indirect. Avec deux côtés égaux et un angle de $60^\circ$, ABC est équilatéral. On peut aussi vérifier $AB=AC=BC=2$.`)
 ],true)
];
