import { useEffect, useId, useState, type ReactNode } from "react";
import {
  aboCross, biologyEssentialPresets, biologyFlows, bounded, cycleCurves, interpolate,
  linkageProbabilities, potentialPoints, punnettCross, recruitmentModel, twitchPoints,
  type BiologyEssentialPreset,
} from "../../../domain/biologyEssentialModels";

const blue="#245abd", green="#087d69", purple="#8d3ba6", gray="#778694", red="#ad3e41";
const fmt=(n:number,d=1)=>new Intl.NumberFormat("fr-FR",{maximumFractionDigits:d}).format(n);

export function BiologyEssentialFigure({preset}:{preset:string}) {
  const id=useId().replace(/:/g,"");
  const [value,setValue]=useState(0),[alternate,setAlternate]=useState(false);
  const [parent1,setParent1]=useState("Aa"),[parent2,setParent2]=useState("Aa");
  const [verticalFlow,setVerticalFlow]=useState(()=>typeof window!=="undefined"&&window.matchMedia("(max-width: 600px)").matches);
  useEffect(()=>{
    const media=window.matchMedia("(max-width: 600px)"),update=()=>setVerticalFlow(media.matches);
    update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);
  },[]);
  if (!(biologyEssentialPresets as readonly string[]).includes(preset)) return null;
  const key=preset as BiologyEssentialPreset, flow=biologyFlows[key];
  let title="",body:ReactNode,caption:ReactNode,controls:ReactNode;
  const range=(label:string,min:number,max:number,step=1)=><label htmlFor={id+"-range"}>{label}<input id={id+"-range"} type="range" min={min} max={max} step={step} value={bounded(value,min,max)} onChange={event=>setValue(Number(event.target.value))}/></label>;
  const toggle=(label:string)=><button type="button" className="physics-figure-toggle" aria-pressed={alternate} onClick={()=>setAlternate(v=>!v)}>{label}</button>;
  const arrow=(x1:number,y1:number,x2:number,y2:number,color=blue)=><path d={"M"+x1+" "+y1+"L"+x2+" "+y2} stroke={color} strokeWidth="3" fill="none" markerEnd={"url(#"+id+"-arrow)"}/>;
  const words=(text:string,x:number,y:number,max=25)=> {
    const lines:string[]=[]; let line="";
    for(const word of text.split(" ")) {if(line.length+word.length>max&&line){lines.push(line);line="";}line+=(line?" ":"")+word;}if(line)lines.push(line);
    return <text x={x} y={y}>{lines.map((part,index)=><tspan key={index} x={x} dy={index?20:0}>{part}</tspan>)}</text>;
  };
  const axes=(xlabel:string,ylabel:string)=><g stroke={gray} fill="none"><path d="M55 295H560M55 295V50"/><text x="70" y="28" stroke="none">{ylabel}</text><text x="430" y="328" stroke="none">{xlabel}</text></g>;
  const plot=(fn:(x:number)=>number,max:number,color:string,minY=0,maxY=1)=> <polyline points={Array.from({length:121},(_,i)=>{const x=max*i/120;return (55+500*i/120)+","+(295-225*(fn(x)-minY)/(maxY-minY));}).join(" ")} fill="none" stroke={color} strokeWidth="3"/>;
  if(flow) {
    title=flow.title;
    const selected=Math.round(bounded(value,0,flow.steps.length-1));
    body=<>{flow.steps.map((step,index)=>{const x=verticalFlow?20:25+(index%2)*292,y=35+(verticalFlow?index:Math.floor(index/2))*103;return <g key={index}>
      <rect x={x} y={y} width="258" height="78" rx="12" fill={index===selected?"#dcefe8":"#f4f7fa"} stroke={index===selected?green:"#a8bac6"} strokeWidth={index===selected?3:1}/>
      <circle cx={x+23} cy={y+25} r="14" fill={index===selected?green:blue}/><text x={x+18} y={y+31} fill="white">{index+1}</text>
      {words(step[0],x+46,y+30,23)}
    </g>;})}</>;
    controls=range("Étape "+(selected+1)+" : "+flow.steps[selected][0],0,flow.steps.length-1);
    caption=<><strong>{flow.steps[selected][0]}.</strong> {flow.steps[selected][1]}{["energy-pathways","glycemia","immune-cooperation","mineral-deposits"].includes(preset)&&<span> Les cases présentent des voies ou situations distinctes ; elles ne décrivent pas une chaîne unique obligatoire.</span>}</>;
  } else if(key==="neuron") {
    title="Dendrites, corps cellulaire et axone";
    body=<><path d="M65 55L145 155L55 220M75 125L145 155L90 300M40 165L145 155" stroke={green} strokeWidth="3" fill="none"/>
      <ellipse cx="170" cy="170" rx="45" ry="55" fill="#e2f1e9" stroke={green} strokeWidth="3"/><circle cx="170" cy="165" r="18" fill="#b4d4cb"/>
      <path d="M210 170H515M515 170L555 125M515 170L555 210" stroke={blue} strokeWidth="4" fill="none"/>
      {[245,310,375,440].map(x=><rect key={x} x={x} y="151" width="47" height="38" rx="17" fill="#dce6f7" stroke={blue}/>)}
      <text x="25" y="32">Dendrites</text><text x="80" y="330">Corps cellulaire</text><text x="325" y="128">Myéline</text><text x="325" y="218">Axone</text><text x="453" y="280">Terminaisons</text>
      {arrow(225,75,480,75)}<text x="235" y="55">Propagation vers la terminaison</text></>;
    caption="La myéline entoure des segments de l’axone ; les interruptions sont les nœuds de Ranvier. Schéma d’un neurone myélinisé, sans échelle anatomique.";
  } else if(key==="action-potential") {
    title="Un potentiel d’action : modèle de forme";
    const t=bounded(value,0,6), v=interpolate(potentialPoints,t);
    body=<>{axes("Temps (ms)","Potentiel membranaire (mV)")}{[-80,-70,-55,0,30].map(y=><g key={y}><path d={"M55 "+(295-225*(y+90)/130)+"H560"} stroke="#d5dde4" strokeDasharray="4 4"/><text x="12" y={300-225*(y+90)/130}>{y}</text></g>)}{plot(x=>interpolate(potentialPoints,x),6,blue,-90,40)}
      <circle cx={55+500*t/6} cy={295-225*(v+90)/130} r="6" fill={green}/><text x="70" y="350">0</text><text x="545" y="350">6</text></>;
    controls=range("Temps : "+fmt(t)+" ms ; potentiel : "+fmt(v)+" mV",0,6,.1);
    caption="Valeurs illustratives : repos voisin de −70 mV, dépolarisation, repolarisation puis hyperpolarisation. La forme et les durées dépendent du type de cellule ; ce n’est pas un enregistrement clinique.";
  } else if(key==="recruitment") {
    title="Fibre isolée et nerf : deux réponses différentes";
    const m=recruitmentModel(value);
    body=<>{axes("Intensité relative (%)","Amplitude relative de la réponse")}{plot(x=>recruitmentModel(x).nerve,100,blue)}{plot(x=>recruitmentModel(x).single,100,purple)}<text x="85" y="55" fill={blue}>Nerf : recrutement</text><text x="285" y="85" fill={purple}>Fibre isolée : tout ou rien</text><path d={"M"+(55+5*value)+" 60V295"} stroke={green} strokeDasharray="5 5"/><text x="53" y="320">0</text><text x="540" y="320">100</text></>;
    controls=range("Intensité "+value+" % · fibre "+fmt(100*m.single,0)+" % · nerf "+fmt(100*m.nerve,0)+" %",0,100);
    caption="Une fibre atteint une réponse de type tout ou rien au-delà de son seuil. Dans un nerf, plusieurs fibres peuvent être recrutées progressivement. Seuils et amplitudes sont normalisés pour comparer les principes.";
  } else if(key==="muscle-twitch") {
    title="La secousse musculaire";
    const t=bounded(value,0,8);
    body=<>{axes("Temps relatif","Tension relative")}{plot(x=>interpolate(twitchPoints,x),8,blue)}<path d="M55 295v-25" stroke={red} strokeWidth="4"/><text x="70" y="275">Stimulation</text><text x="75" y="70">Latence</text><text x="200" y="50">Contraction</text><text x="370" y="120">Relâchement</text><circle cx={55+500*t/8} cy={295-225*interpolate(twitchPoints,t)} r="6" fill={green}/></>;
    controls=range("Repère temporel relatif : "+fmt(t),0,8,.1);
    caption="La réponse mécanique est retardée par rapport à la stimulation. Le tracé illustre une secousse isolée ; il ne fixe pas sa durée pour tous les muscles.";
  } else if(key==="sarcomere") {
    title="Glissement des filaments dans le sarcomère";
    const left=65+value*.7,right=535-value*.7;
    body=<><path d={"M"+left+" 80V270M"+right+" 80V270"} stroke={purple} strokeWidth="5"/>
      {[125,175,225].map(y=><path key={y} d={"M"+left+" "+y+"H"+(left+170)+"M"+right+" "+y+"H"+(right-170)} stroke={green} strokeWidth="5"/>)}
      {[150,200].map(y=><path key={y} d={"M195 "+y+"H405"} stroke={blue} strokeWidth="12"/>)}
      <text x={left-5} y="60">Z</text><text x={right-5} y="60">Z</text><text x="226" y="110" fill={blue}>Myosine</text><text x="225" y="255" fill={green}>Actine</text><path d="M195 310H405" stroke={blue} strokeWidth="3"/><text x="215" y="339">Bande A constante</text></>;
    controls=range("Raccourcissement relatif : "+value+" %",0,100);
    caption="Les filaments ne raccourcissent pas : ils glissent. Les stries Z se rapprochent ; les bandes I et la zone H diminuent, tandis que la longueur de la bande A reste constante. Schéma non à l’échelle.";
  } else if(key==="nephron") {
    title="Filtrer, réabsorber et sécréter";
    body=<><ellipse cx="120" cy="85" rx="62" ry="43" fill="#f9e6e6" stroke={red}/><path d="M35 65H80q65 70 0 10H35" fill="none" stroke={red} strokeWidth="4"/>
      <path d="M163 100C260 20 260 140 210 150V265Q210 325 270 265V150C310 100 360 200 400 145V320" fill="none" stroke="#368ca1" strokeWidth="15"/>
      <path d="M310 70V300" stroke={red} strokeWidth="9"/><text x="50" y="25">Glomérule</text><text x="405" y="160">Collecteur</text><text x="410" y="320">Urine</text><text x="335" y="45">Sang</text>
      {arrow(125,125,195,140)}{arrow(235,180,290,180,green)}{arrow(290,225,245,225,purple)}
      <text x="30" y="175">Filtration</text><text x="330" y="215" fill={green}>Réabsorption</text><text x="330" y="255" fill={purple}>Sécrétion</text><text x="70" y="348">Transferts schématiques : tubule ↔ sang</text></>;
    caption="Le filtrat glomérulaire est modifié le long du néphron. Réabsorption : tubule vers sang ; sécrétion : sang/cellules vers tubule. Le dessin montre les directions, pas toute l’anatomie vasculaire.";
  } else if(key==="heart-circuit") {
    title="Les deux circuits d’un cœur de mammifère";
    const labels=["Organes","Cœur droit","Poumons","Cœur gauche"], xs=[35,175,315,455];
    body=<>{labels.map((label,i)=><g key={label}><rect x={xs[i]} y="120" width="110" height="85" rx="14" fill={i<2?"#dfeafa":"#f8e3e4"} stroke={i<2?blue:red}/>{words(label,xs[i]+10,156,12)}{i<3&&arrow(xs[i]+112,162,xs[i]+134,162,i<2?blue:red)}</g>)}
      <path d="M510 207V270H90V207" stroke={red} strokeWidth="3" fill="none" markerEnd={"url(#"+id+"-arrow)"}/><text x="110" y="80">Circulation pulmonaire et systémique</text><text x="150" y="315">Le sang passe dans les deux circuits</text></>;
    caption="Cœur droit → poumons → cœur gauche → organes → cœur droit. Les artères partent du cœur ; les veines y reviennent. Le sens artère/veine ne dépend pas du degré d’oxygénation.";
  } else if(key==="immune-memory") {
    title="Premier contact et réponse mémoire";
    body=<>{axes("Temps relatif","Réponse spécifique relative")}
      {plot(x=>.4*Math.exp(-(((x-3.6)/1.5)**2))+.95*Math.exp(-(((x-8)/1.1)**2)),10,blue,0,1.2)}
      {[1,6].map((x,i)=><g key={x}><path d={"M"+(55+x*50)+" 295v-40"} stroke={green} strokeWidth="3"/><text x={50+x*50} y="345">{i+1}{i===0?"er":"e"} contact</text></g>)}
      <text x="155" y="170">Primaire</text><text x="395" y="65">Secondaire</text></>;
    caption="Pour un même antigène, la mémoire permet généralement une réponse plus rapide et plus importante au second contact. Courbe qualitative ; la réponse réelle dépend de l’antigène et de l’immunisation.";
  } else if(key==="hiv-course") {
    title="VIH non traité : tendances historiques";
    const curves=[{name:"Charge virale",color:red,data:[[0,.15],[1,1],[2,.28],[5,.35],[8,.8]]},{name:"Lymphocytes T CD4",color:blue,data:[[0,.95],[1,.4],[2,.7],[5,.5],[8,.08]]}];
    body=<>{curves.map((curve,i)=><g key={curve.name}><text x="45" y={30+i*160} fill={curve.color}>{curve.name} · échelle relative propre</text><path d={"M50 "+(145+i*160)+"H550"} stroke={gray}/><polyline points={Array.from({length:81},(_,j)=>(50+j*6.2)+","+(145+i*160-95*interpolate(curve.data as [number,number][],j/10))).join(" ")} fill="none" stroke={curve.color} strokeWidth="3"/></g>)}
      <text x="55" y="345">Primo-infection → phase chronique → stade avancé</text></>;
    caption="Les deux échelles ne sont pas des unités comparables. Aucun calendrier individuel n’est imposé. Un traitement efficace modifie ces tendances et peut empêcher l’évolution vers une immunodéficience avancée.";
  } else if(key==="female-cycle") {
    title="Un cycle ovulatoire de 28 jours : modèle";
    const day=bounded(value,1,28);
    body=<>{axes("Jour du cycle","Amplitude relative par hormone")}
      {Object.entries(cycleCurves).map(([name,data],i)=><g key={name}>{plot(x=>interpolate(data,x*27/28+1),28,[blue,green,purple][i])}<text x={65+i*160} y="48" fill={[blue,green,purple][i]}>{["Œstradiol","Progestérone","LH"][i]}</text></g>)}
      <path d={"M"+(55+500*(day-1)/27)+" 60V295"} stroke={gray} strokeDasharray="5 5"/><text x="45" y="320">1</text><text x="285" y="320">14</text><text x="540" y="320">28</text></>;
    controls=range("Jour "+day+" · "+(day<14?"phase folliculaire":day===14?"repère ovulatoire du modèle":"phase lutéale"),1,28);
    caption="Chaque hormone est normalisée séparément : les hauteurs ne comparent pas leurs concentrations. Les courbes expliquent l’enchaînement ; elles ne prédisent pas la date d’ovulation d’une personne.";
  } else if(key==="flower") {
    title="Une fleur d’angiosperme";
    body=<><path d="M300 320V170" stroke={green} strokeWidth="15"/>
      {[-1,1].map(sign=><g key={sign}><ellipse cx={300+sign*100} cy="155" rx="70" ry="105" transform={"rotate("+(sign*40)+" "+(300+sign*100)+" 155)"} fill="#f6e4f3" stroke={purple}/><path d={"M"+(300+sign*95)+" 245V120"} stroke={green} strokeWidth="4"/><ellipse cx={300+sign*95} cy="112" rx="18" ry="30" fill="#f6dba5" stroke="#ad8033"/></g>)}
      <ellipse cx="300" cy="250" rx="40" ry="52" fill="#d8eee5" stroke={green} strokeWidth="3"/><path d="M300 200V75" stroke={green} strokeWidth="10"/><ellipse cx="300" cy="70" rx="28" ry="12" fill={green}/>
      {[235,260,280].map(y=><circle key={y} cx="305" cy={y} r="6" fill="#b48338"/>)}
      <text x="345" y="70">Stigmate</text><text x="345" y="180">Style</text><text x="345" y="255">Ovaire et ovules</text><text x="55" y="100">Anthère</text><text x="50" y="285">Pétale</text><text x="320" y="335">Pédoncule</text></>;
    caption="Disposition simplifiée des organes : les étamines portent les anthères ; les carpelles renferment les ovules dans l’ovaire. Nombre et aspect des pièces varient selon l’espèce.";
  } else if(key==="punnett"||key==="abo") {
    title=key==="abo"?"Croisements du système ABO":"Échiquier à un locus";
    const isAbo=key==="abo", a=isAbo?(parent1==="Aa"?"AO":parent1):parent1,b=isAbo?(parent2==="Aa"?"BO":parent2):parent2;
    const result=isAbo?aboCross(a,b):punnettCross(a,b), labels=isAbo?["AA","AO","BB","BO","AB","OO"]:["AA","Aa","aa"];
    body=<>{words("Chaque case : une probabilité de 1/4",15,28,30)}
      {[...a].map((letter,i)=><text key={i} x={95+i*110} y="95">{letter}</text>)}
      {[...b].map((letter,i)=><text key={i} x="20" y={160+i*105}>{letter}</text>)}
      {result.map((outcome,i)=><g key={i}><rect x={55+(i%2)*110} y={110+Math.floor(i/2)*105} width="100" height="90" rx="8" fill="#e0eee9" stroke={green}/><text x={95+(i%2)*110} y={162+Math.floor(i/2)*105}>{outcome}</text></g>)}</>;
    controls=<div className="biology-parent-options">{[a,b].map((parent,index)=><label key={index} htmlFor={id+"-parent-"+index}>Parent {index+1}<select id={id+"-parent-"+index} value={parent} onChange={e=>(index?setParent2:setParent1)(e.target.value)}>{labels.map(label=><option key={label} value={label}>{label}</option>)}</select></label>)}</div>;
    caption=isAbo?"Notation compacte : A = Iᴬ, B = Iᴮ, O = i. Les cases indiquent ici les groupes phénotypiques, pas les règles de transfusion.":"Les lettres des cases indiquent les génotypes. La dominance intervient ensuite pour déterminer les phénotypes.";
  } else if(key==="linkage") {
    title="Test-cross d’un double hétérozygote";
    const probabilities=linkageProbabilities(value,alternate),names=["AB","Ab","aB","ab"];
    body=<>{names.map((name,i)=><g key={name}><text x="30" y={80+i*70}>{name}</text><rect x="90" y={55+i*70} width={probabilities[i]*800} height="35" fill={(alternate?i===1||i===2:i===0||i===3)?blue:green}/><text x={100+probabilities[i]*800} y={80+i*70}>{fmt(100*probabilities[i])} %</text></g>)}</>;
    controls=<>{range("Recombinaison : "+value+" %",0,50)}{toggle(alternate?"Trans Ab/aB · passer en cis":"Cis AB/ab · passer en trans")}</>;
    caption="Bleu : classes parentales ; vert : recombinées. Le partenaire aabb révèle les associations des gamètes du double hétérozygote. À 50 %, les quatre classes ont la même fréquence attendue.";
  } else if(key==="soil") {
    title="Texture et structure du sol";
    body=<><rect x="70" y="60" width="460" height="240" rx="15" fill="#f1e9d8" stroke="#9b8162"/>
      {Array.from({length:30},(_,i)=>{const x=100+(i%6)*75,y=90+Math.floor(i/6)*43;return <g key={i}><circle cx={x} cy={y} r={alternate?10:16} fill={i%3?"#bda37d":"#80654a"}/>{alternate&&<circle cx={x+15} cy={y+7} r="7" fill="#bda37d"/>}</g>;})}
      <text x="100" y="335">{alternate?"Agrégats et espaces poreux":"Particules : tailles et proportions"}</text></>;
    controls=toggle(alternate?"Voir les particules":"Voir une organisation en agrégats");
    caption="La texture décrit les proportions granulométriques ; la structure décrit l’assemblage. Les espaces entre agrégats peuvent laisser circuler l’air et l’eau. Schéma qualitatif, sans mesure de porosité.";
  } else {
    title="Deux modes d’accès à une minéralisation";
    body=<><path d="M20 70H580" stroke={green} strokeWidth="5"/><text x="25" y="45">Surface</text>
      <path d="M70 70L100 120H135L165 170H200L230 220H265L300 70" fill="#e6d1b6" stroke="#8d7459" strokeWidth="3"/><ellipse cx="195" cy="235" rx="45" ry="23" fill="#b98e2f"/>
      <path d="M410 70V270H540M410 170H505" stroke="#947d69" strokeWidth="18" fill="none"/><ellipse cx="535" cy="270" rx="38" ry="30" fill="#b98e2f"/><text x="65" y="325">Fosse à ciel ouvert</text><text x="365" y="325">Puits et galeries</text></>;
    caption="La géométrie, la stabilité, la profondeur, les coûts et les impacts guident le choix. Le schéma ne fixe pas de seuil universel entre ciel ouvert et souterrain.";
  }
  const compact=key==="abo"||key==="punnett"||Boolean(flow&&verticalFlow);
  const svgWidth=compact?300:600,svgHeight=flow&&verticalFlow?35+flow.steps.length*103:360;
  return <figure className={"essential-circle physics-essential-figure biology-essential-figure"+(compact?" is-compact":"")} data-biology-figure={preset}>
    <div className="essential-circle-scroll" tabIndex={0} role="region" aria-label={title}>
      <svg style={{width:svgWidth,minWidth:svgWidth}} width={svgWidth} height={svgHeight} viewBox={"0 0 "+svgWidth+" "+svgHeight} role="img" aria-labelledby={id+"-title"}>
        <title id={id+"-title"}>{title}</title><defs><marker id={id+"-arrow"} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={blue}/></marker></defs>{body}
      </svg>
    </div>
    <figcaption><strong>{title}</strong>{controls}<p aria-live="polite">{caption}</p></figcaption>
  </figure>;
}
