import type { CourseEvaluationGroup,CourseWrittenTask } from "../../domain/courseDocument";
const task=(id:string,prompt:string,model:string,preset:string):CourseWrittenTask=>({
  id,prompt,model,topicId:"bary-partial",nativeFigure:{kind:"barycenter",preset},
  criteria:["Je vérifie les sommes de coefficients avant d’utiliser un barycentre.","J’écris les regroupements et les relations vectorielles utiles.","Je conclus sur l’alignement, la concurrence ou la construction demandée."],
});
export const barycenterEvaluations:CourseEvaluationGroup[]=[
  {id:"bary-alignment-method",title:"Démontrer un alignement",pages:[26],
    method:String.raw`1. Traduire les milieux, symétries et relations vectorielles en barycentres.
2. Utiliser l’homogénéité pour obtenir des coefficients compatibles.
3. Regrouper pour écrire l’un des trois points comme barycentre des deux autres, avec une somme non nulle.
4. Conclure que ce point appartient à leur droite.`,
    examples:[{id:"bary-align-worked",title:"Trois points P, Q et R",prompt:String.raw`$ABC$ est un triangle. $P$ est le symétrique de $B$ par rapport à $C$, $\overrightarrow{CQ}=\frac13\overrightarrow{CA}$ et $R$ est le milieu de $[AB]$. Démontrer que $P,Q,R$ sont alignés.`,
      parts:[
        {id:"bary-align-translations",label:"1.",prompt:"Traduire les données.",solution:String.raw`La symétrie donne $P=2C-B$, donc $P=\operatorname{bar}\{(B,1),(C,-2)\}$, de somme $-1$.

La relation $\overrightarrow{CQ}=\frac13\overrightarrow{CA}$ donne $Q=\operatorname{bar}\{(A,1),(C,2)\}$.

Enfin $2R=A+B$, donc $A=2R-B=\operatorname{bar}\{(B,1),(R,-2)\}$.`},
        {id:"bary-align-grouping",label:"2.",prompt:"Regrouper puis conclure.",solution:String.raw`Par homogénéité, $Q=\operatorname{bar}\{(A,-1),(C,-2)\}$.

Le groupe $(B,1),(R,-2)$ a pour somme $-1$ et pour barycentre $A$. En le substituant :
$$Q=\operatorname{bar}\{(B,1),(R,-2),(C,-2)\}.$$
Regroupons maintenant $(B,1),(C,-2)$ en $(P,-1)$ :
$$Q=\operatorname{bar}\{(P,-1),(R,-2)\}=\operatorname{bar}\{(P,1),(R,2)\}.$$
Ainsi $\overrightarrow{PQ}=\frac23\overrightarrow{PR}$ et **P, Q, R sont alignés**. Chaque somme utilisée ($-1,-3$) est non nulle.`},
      ],nativeFigure:{kind:"barycenter",preset:"alignment-worked"}}],
    statement:String.raw`Application. $ABD$ est un triangle et $M$ est le milieu de $[AD]$. Construire $I,C$ tels que $\overrightarrow{AI}=\frac23\overrightarrow{AB}$ et $\overrightarrow{DC}=\frac34\overrightarrow{DI}$, puis démontrer que $B,C,M$ sont alignés.`,
    questions:[],writtenTasks:[
      task("bary-app-construction","1. Construire les points I et C.",String.raw`Partager $[AB]$ en trois parts égales et placer $I$ au deuxième tiers à partir de $A$.

Partager ensuite $[DI]$ en quatre parts égales : $C$ est au troisième quart à partir de $D$. Les deux coefficients $\frac23$ et $\frac34$ sont compris entre $0$ et $1$, donc $I\in[AB]$ et $C\in[DI]$.

On a $I=\operatorname{bar}\{(A,1),(B,2)\}$ et $C=\operatorname{bar}\{(D,1),(I,3)\}$.`,"alignment-application"),
      task("bary-app-alignment","2. Démontrer que B, C et M sont alignés.",String.raw`Comme $I=\operatorname{bar}\{(A,1),(B,2)\}$, le groupe de somme $3$ peut remplacer $(I,3)$ :
$$C=\operatorname{bar}\{(D,1),(A,1),(B,2)\}.$$
Or $M$ est le milieu de $[AD]$, donc $(D,1),(A,1)$ se regroupe en $(M,2)$.
$$C=\operatorname{bar}\{(M,2),(B,2)\}=\operatorname{bar}\{(M,1),(B,1)\}.$$
**C est le milieu de [BM]** ; les trois points sont donc alignés. Cette conclusion précise même la position de $C$.`,"alignment-application"),
    ],
  },
  {id:"bary-concurrence-method",title:"Démontrer une concurrence",pages:[27],
    method:String.raw`1. Écrire les points situés sur les côtés comme barycentres des deux sommets.
2. Choisir des coefficients pour un même point $G$, puis vérifier leur somme.
3. Par trois regroupements, montrer que $G$ appartient aux trois droites.
4. Conclure qu’elles sont concourantes en $G$. Ne pas oublier la condition de somme non nulle.`,
    examples:[{id:"bary-concurrent-worked",title:"Trois droites d’un triangle",prompt:String.raw`Dans le triangle $ABC$, $K$ est le milieu de $[AC]$, $\overrightarrow{AI}=\frac13\overrightarrow{AB}$ et $\overrightarrow{CJ}=\frac13\overrightarrow{CB}$. Démontrer que $(CI),(AJ),(BK)$ sont concourantes.`,
      parts:[
        {id:"bary-concurrent-points",label:"1.",prompt:"Choisir un barycentre commun.",solution:String.raw`Les données donnent :
$$I=\operatorname{bar}\{(A,2),(B,1)\},\quad
J=\operatorname{bar}\{(B,1),(C,2)\},\quad
K=\operatorname{bar}\{(A,1),(C,1)\}.$$
Choisissons $G=\operatorname{bar}\{(A,2),(B,1),(C,2)\}$. La somme $5$ est non nulle. Les coefficients sont compatibles avec les trois points précédents.`},
        {id:"bary-concurrent-lines",label:"2.",prompt:"Établir les trois appartenances.",solution:String.raw`En regroupant $A,B$ :
$$G=\operatorname{bar}\{(I,3),(C,2)\}\in(CI).$$
En regroupant $B,C$ :
$$G=\operatorname{bar}\{(A,2),(J,3)\}\in(AJ).$$
Enfin $(A,2),(C,2)$ a pour barycentre $K$ et pour somme $4$ :
$$G=\operatorname{bar}\{(K,4),(B,1)\}\in(BK).$$
Les trois droites sont donc **concourantes en G**. Chaque somme partielle vaut $3$ ou $4$, jamais $0$.`},
      ],nativeFigure:{kind:"barycenter",preset:"concurrence-worked"}}],
    statement:String.raw`Application. Dans un triangle $ABC$, les points $I,J,K$ vérifient $\overrightarrow{AI}=\frac13\overrightarrow{AB}$, $\overrightarrow{CJ}=\frac14\overrightarrow{CB}$ et $\overrightarrow{CK}=\frac25\overrightarrow{CA}$. Démontrer que $(CI),(AJ),(BK)$ sont concourantes.`,
    questions:[],writtenTasks:[task("bary-app-concurrence","Démontrer la concurrence des trois droites.",String.raw`Les relations données se traduisent par :
$$I=\operatorname{bar}\{(A,2),(B,1)\},\quad
J=\operatorname{bar}\{(B,1),(C,3)\},$$
$$K=\operatorname{bar}\{(A,2),(C,3)\}.$$
Posons $G=\operatorname{bar}\{(A,2),(B,1),(C,3)\}$ ; sa somme vaut $6\ne0$.

On obtient successivement :
$$G=\operatorname{bar}\{(I,3),(C,3)\}\in(CI),$$
$$G=\operatorname{bar}\{(A,2),(J,4)\}\in(AJ),$$
$$G=\operatorname{bar}\{(B,1),(K,5)\}\in(BK).$$
Ainsi **les trois droites sont concourantes en G**. Dans la première écriture, on voit aussi que $G$ est le milieu de $[IC]$.`,"concurrence-application")],
  },
];
