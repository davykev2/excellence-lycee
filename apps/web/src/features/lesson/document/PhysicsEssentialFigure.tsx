import { useId, useState, type ReactNode } from "react";
import { MathText } from "../../../components/MathText";
import { acidBaseMeasurements, conjugateFractions, oscillatorFractions, physicsEssentialPresets, projectileModel, resonanceMeasurements } from "../../../domain/physicsEssentialModels";

const blue = "#245abd", green = "#0e806d", purple = "#943bbb";
const round = (value: number, digits = 2) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(Math.abs(value) < 1e-10 ? 0 : value);

/** Native, bounded explorations: source measurements or explicitly identified models. */
export function PhysicsEssentialFigure({ preset }: { preset: string }) {
  const id = useId().replace(/:/g, "");
  const [value, setValue] = useState(preset === "ph" ? 7 : preset === "predominance" ? 0 : preset === "resonance" ? 5 : preset === "titration" ? 15 : preset === "induction" ? 1 : 35);
  const [reverse, setReverse] = useState(false);
  const [form, setForm] = useState(1);
  if (!(physicsEssentialPresets as readonly string[]).includes(preset)) return null;
  let title = "", content: ReactNode, caption: ReactNode, controls: ReactNode;
  const arrow = (x1:number,y1:number,x2:number,y2:number,color:string,label="") => <g><path d={`M${x1},${y1}L${x2},${y2}`} fill="none" stroke={color} strokeWidth="3" markerEnd={`url(#${id}-${color.slice(1)})`}/>{label && <text x={x2+8} y={y2-8} fill={color}>{label}</text>}</g>;
  const range = (label: string, min: number, max: number, step = 1) => <label htmlFor={`${id}-range`}>{label}<input id={`${id}-range`} type="range" min={min} max={max} step={step} value={value} onChange={event => setValue(Number(event.target.value))}/></label>;
  const flip = (normal: string, flipped: string) => <button type="button" className="physics-figure-toggle" aria-pressed={reverse} onClick={() => setReverse(flag => !flag)}>{reverse ? flipped : normal}</button>;
  const axes = (xLabel: string, yLabel: string) => <g stroke="#8493a4" fill="none"><path d="M50 295H465M50 295V35"/><text x="410" y="327" stroke="none">{xLabel}</text><text x="18" y="25" stroke="none">{yLabel}</text><text x="27" y="315" stroke="none">0</text></g>;
  if (preset === "position" || preset === "frenet") {
    title = preset === "position" ? "Vecteur-position et coordonnées" : "Vitesse tangentielle et accélération normale";
    const a = value*Math.PI/180, x = 250+115*Math.cos(a), y=185-115*Math.sin(a);
    content = <>{preset === "position" ? <>
      <path d="M70 285H455M90 305V40" fill="none" stroke="#8493a4"/><text x="455" y="310">x</text><text x="65" y="35">y</text><text x="65" y="310">O</text>
      <path d={`M${x} 285V${y}H90`} fill="none" stroke="#a2afbc" strokeDasharray="5 5"/>
      {arrow(90,285,x,y,blue,"OM")}<text x={x-10} y="312">x(t)</text><text x="20" y={y}>y(t)</text>
    </> : <>
      <circle cx="250" cy="185" r="115" stroke="#b5c9d0" fill="none" strokeWidth="2"/><text x="227" y="208">O</text>
      <path d={`M250 185L${x} ${y}`} stroke="#b5c9d0" strokeDasharray="5 5"/>
      {arrow(x,y,x-75*Math.sin(a),y-75*Math.cos(a),blue,"v")}
      {arrow(x,y,x-65*Math.cos(a),y+65*Math.sin(a),green,"aₙ")}
    </>}<circle cx={x} cy={y} r="5" fill={purple}/><text x={x+10} y={y+23}>M</text></>;
    controls=range(`Position angulaire : ${value}°`,15,160);
    caption=<MathText>{preset==="position"?String.raw`$\overrightarrow{OM}=x\vec i+y\vec j$ ; les pointillés donnent les projections.`:String.raw`En mouvement circulaire uniforme, $\vec v$ est tangente et $\vec a=(v^2/R)\vec n$ pointe vers le centre.`}</MathText>;
  } else if (preset === "forces") {
    title="Poids et réaction normale sur un support horizontal";
    const mass=value/10;
    content=<><path d="M80 220H420" stroke="#8493a4" strokeWidth="4"/><rect x="210" y="135" width="80" height="85" rx="5" fill="#dbe9f4" stroke={blue}/><circle cx="250" cy="178" r="4" fill={purple}/>{arrow(250,178,250,80,green,"Rₙ")}{arrow(250,178,250,276,purple,"P")}<text x="225" y="122">G</text></>;
    controls=range(`Masse : ${round(mass)} kg`,10,100);
    caption=`Au repos, sans autre force verticale : P = mg = ${round(mass*9.81)} N et Rₙ = P. Modèle : g = 9,81 m/s² ; flèches schématiques.`;
  } else if (preset === "projectile") {
    title="Trajectoire d’un projectile";
    const model=projectileModel(value);
    const points=Array.from({length:81},(_,index)=>{const t=model.duration*index/80; return `${50+9*model.vx*t},${295-9*(model.vz*t-9.81*t*t/2)}`;}).join(" ");
    content=<>{axes("x (m)","z (m)")}<polyline points={points} stroke={blue} fill="none" strokeWidth="3"/><circle cx={50+9*model.range} cy="295" r="5" fill={green}/><text x="70" y="55">v₀ = 20 m/s ; g = 9,81 m/s²</text></>;
    controls=range(`Angle du tir : ${value}°`,15,75);
    caption=`Sans frottement, départ et arrivée à la même altitude : portée ${round(model.range)} m ; hauteur maximale ${round(model.height)} m. Les deux axes ont la même échelle.`;
  } else if (preset === "electric-field") {
    title="Signe de la charge et déviation électrique";
    const sign=reverse?-1:1;
    content=<><path d="M110 65H400M110 270H400" stroke={blue} strokeWidth="6"/><text x="115" y="50">Plaque +</text><text x="115" y="303">Plaque −</text>{[150,250,350].map(x=><g key={x}>{arrow(x,95,x,230,green)}</g>)}{arrow(25,170,110,170,blue,"v₀")}<path d={`M110 170Q210 170 350 ${170+sign*65}`} stroke={purple} fill="none" strokeWidth="4"/><text x="420" y="173">E</text><text x="350" y={reverse?90:260}>q {reverse?"<":">"} 0</text></>;
    controls=flip("Charge positive · inverser","Charge négative · inverser");
    caption=<MathText>{String.raw`À vitesse d’entrée horizontale, la force $\vec F=q\vec E$ est dans le sens du champ pour une charge positive et dans le sens opposé pour une charge négative. Schéma qualitatif.`}</MathText>;
  } else if (preset === "oscillator" || preset === "lc") {
    title=preset==="lc"?"Énergie du condensateur et de la bobine":"Position et échange d’énergie du solide–ressort";
    const model=oscillatorFractions(value), x=260+75*model.displacement;
    content=<>{preset==="lc"?<>
      <path d="M95 60H205M225 60H405V155H95V60M205 35V85M225 35V85" fill="none" stroke={blue} strokeWidth="3"/>
      <rect x="220" y="140" width="70" height="30" fill="#f9fbfd"/><path d="M220 155q7-30 14 0t14 0t14 0t14 0t14 0" stroke={green} fill="none" strokeWidth="3"/><text x="244" y="42">C</text><text x="246" y="204">L</text>
    </>:<>
      <path d="M60 55V180M60 180H430" stroke="#8493a4" strokeWidth="3"/>
      <path d={`M60 132L${x-100} 132l10-15 10 30 10-30 10 30 10-30 10 30 10-15H${x}`} fill="none" stroke={green} strokeWidth="3"/>
      <rect x={x} y="105" width="55" height="75" rx="5" fill="#dbe9f4" stroke={blue}/><path d="M260 75V200" stroke="#8493a4" strokeDasharray="5 5"/><text x="234" y="225">x = 0</text>
    </>}<text x="45" y="260">{preset==="lc"?"Électrique":"Potentielle"}</text><rect x="180" y="240" width={250*model.potential} height="24" fill={blue}/><text x="45" y="305">{preset==="lc"?"Magnétique":"Cinétique"}</text><rect x="180" y="285" width={250*model.kinetic} height="24" fill={green}/></>;
    controls=range(`Phase : ${value}°`,0,360);
    caption=`Répartition de l’énergie totale : ${round(100*model.potential,1)} % et ${round(100*model.kinetic,1)} %. Leur somme reste 100 %. Modèle idéal sans pertes ; valeurs normalisées.`;
  } else if (preset === "magnetic") {
    title="Sens du courant et faces d’un solénoïde";
    content=<><rect x="100" y="90" width="300" height="135" fill="#eef5f4" stroke="#a2bfbd"/>{Array.from({length:9},(_,i)=><ellipse key={i} cx={110+i*35} cy="157" rx="13" ry="68" fill="none" stroke={blue} strokeWidth="2"/>)}{arrow(reverse?340:160,157,reverse?160:340,157,green,"B")}<text x="58" y="166">{reverse?"N":"S"}</text><text x="420" y="166">{reverse?"S":"N"}</text><text x="123" y="285">Champ intérieur : de S vers N</text></>;
    controls=flip("Sens du courant · inverser","Courant inversé · rétablir");
    caption="Inverser le courant inverse le champ et échange les faces nord et sud. La main droite donne le sens du champ à l’intérieur.";
  } else if (preset === "superposition") {
    title="Superposition de deux champs perpendiculaires";
    const vertical=value*2.1, total=Math.hypot(100,value);
    content=<>{arrow(100,280,310,280,blue,"B₁")}{arrow(100,280,100,280-vertical,green,"B₂")}{arrow(100,280,310,280-vertical,purple,"B")}<path d={`M100 ${280-vertical}H310V280`} stroke="#9aacba" fill="none" strokeDasharray="5 5"/></>;
    controls=range(`B₂ : ${value} unités ; B₁ : 100 unités`,0,100);
    caption=`B = √(B₁² + B₂²) = ${round(total)} unités. La somme se construit avec les vecteurs, pas avec leurs seules valeurs.`;
  } else if (preset === "charged-particle" || preset === "laplace") {
    title=preset==="laplace"?"Force de Laplace : courant et champ":"Courbure d’une particule : signe de la charge";
    const sign=reverse?-1:1;
    content=<>{[90,170,250,330,410].flatMap(x=>[60,140,220,300].map(y=><g key={`${x}-${y}`} stroke="#abbacb"><path d={`M${x-5} ${y-5}l10 10m-10 0l10-10`}/></g>))}<text x="330" y="35">B entrant ⊗</text>{preset==="laplace"?<>
      <path d="M250 80V270" stroke="#7a8d9e" strokeWidth="9"/>{arrow(250,reverse?100:240,250,reverse?240:100,blue,"I")}{arrow(250,175,250-sign*120,175,green,"F")}
    </>:<>
      {arrow(40,170,180,170,blue,"v₀")}
      <polyline points={Array.from({length:81},(_,i)=>{const a=sign*Math.PI/2-sign*i*Math.PI/80;return `${180+80*Math.cos(a)},${170-sign*80+80*Math.sin(a)}`;}).join(" ")} fill="none" stroke={purple} strokeWidth="4"/>
      {arrow(180,170,180,170-sign*60,green,"F")}
    </>}</>;
    controls=flip(preset==="laplace"?"Courant vers le haut · inverser":"Charge positive · inverser",preset==="laplace"?"Courant vers le bas · inverser":"Charge négative · inverser");
    caption=<MathText>{preset==="laplace"?String.raw`$\vec F=I\vec\ell\wedge\vec B$. Inverser le courant inverse la force.`:String.raw`$\vec F=q\vec v\wedge\vec B$. À masse et vitesse fixées, inverser $q$ inverse la courbure sans changer $R=mv/(|q|B)$.`}</MathText>;
  } else if (preset === "flux") {
    title="Flux et angle avec la normale";
    const a=value*Math.PI/180, flux=Math.cos(a);
    content=<>{arrow(40,160,140,160,blue,"B")}<path d={`M${290+95*Math.sin(a)} ${160+95*Math.cos(a)}L${290-95*Math.sin(a)} ${160-95*Math.cos(a)}`} stroke="#96acbd" strokeWidth="8"/>{arrow(290,160,290+75*Math.cos(a),160-75*Math.sin(a),green,"n")}<path d="M70 285H430M250 265V305" stroke="#8493a4"/><rect x={flux<0?250+150*flux:250} y="275" width={Math.abs(150*flux)} height="20" fill={flux<0?purple:blue}/><text x="50" y="327">−1</text><text x="245" y="327">0</text><text x="414" y="327">+1</text></>;
    controls=range(`Angle entre B et la normale : ${value}°`,0,180);
    caption=`Φ/(NBS) = cos θ = ${round(flux)}. Le flux est nul à 90°, positif dans un sens et négatif dans l’autre.`;
  } else if (preset === "induction") {
    title="Pente du courant et f.é.m. d’auto-induction";
    content=<><path d="M50 170H460M250 300V75" stroke="#8493a4" fill="none"/><text x="420" y="200">t (s)</text><text x="225" y="65">i (A)</text><text x="232" y="195">0</text><text x="55" y="200">−2</text><text x="420" y="155">2</text><path d={`M70 ${170+value*24}L430 ${170-value*24}`} fill="none" stroke={blue} strokeWidth="4"/><text x="75" y="35">Pente constante ; L = 0,5 H</text></>;
    controls=range(`di/dt : ${round(value)} A/s`,-4,4,.1);
    caption=`e = −L di/dt = ${round(-.5*value)} V. Courant croissant : f.é.m. négative ; courant décroissant : f.é.m. positive. Le zéro du temps est au milieu de la courbe.`;
  } else if (preset === "aop") {
    title=reverse?"Montage intégrateur idéal":"Montage dérivateur idéal";
    const triangle=(t:number)=>2/Math.PI*Math.asin(Math.sin(t)), square=(t:number)=>Math.cos(t)>=0?1:-1;
    const wave=(output:boolean)=>Array.from({length:161},(_,i)=>{const t=4*Math.PI*i/160;const height=reverse?(output?-triangle(t):square(t)):(output?-square(t):triangle(t));return `${(output?280:35)+i*1.1},${265-35*height}`;}).join(" ");
    content=<><path d="M220 65V155L320 110z" fill="#e5eef5" stroke={blue} strokeWidth="2"/><text x="228" y="89">−</text><text x="228" y="145">+</text><path d="M40 85H220M320 110H450M160 85V30H390V110M190 140H220M190 140V180" stroke={blue} fill="none" strokeWidth="2"/><rect x="95" y="70" width="70" height="30" fill="#fff"/><text x="115" y="92">{reverse?"R":"C"}</text><rect x="245" y="15" width="60" height="30" fill="#fff"/><text x="265" y="37">{reverse?"C":"R"}</text><text x="43" y="202">Entrée</text><text x="290" y="202">Sortie</text><polyline points={wave(false)} stroke={blue} fill="none" strokeWidth="3"/><polyline points={wave(true)} stroke={green} fill="none" strokeWidth="3"/></>;
    controls=flip("Dérivateur · voir l’intégrateur","Intégrateur · voir le dérivateur");
    caption=<MathText>{reverse?String.raw`$\dot u_s=-u_e/(RC)$. Signal rectangulaire → signal triangulaire de pente opposée. Traces normalisées en régime linéaire, sans saturation.`:String.raw`$u_s=-RC\,\dot u_e$. Signal triangulaire → signal rectangulaire de signe opposé à la pente. Traces normalisées.`}</MathText>;
  } else if (preset === "fresnel") {
    title="Diagramme de Fresnel d’un RLC série";
    const net=(value-50)*2, xl=100+net/2, xc=100-net/2;
    content=<>{arrow(100,230,280,230,blue)}{arrow(280,230,280,230-xl,green)}{arrow(280,230-xl,280,230-net,purple)}{arrow(100,230,280,230-net,blue)}<text x="160" y="265">RₜI</text><text x="300" y={230-xl/2}>Uₗ</text><text x="355" y={230-xl+xc/2}>Uc</text><text x="160" y={190-net/2}>U</text></>;
    controls=range(`Réactance nette Lω − 1/(Cω) : ${net} Ω`,0,100);
    caption=`Modèle Rₜ = 100 Ω : Z = ${round(Math.hypot(100,net))} Ω ; φ = ${round(Math.atan2(net,100)*180/Math.PI,1)}°. Les flèches représentent les tensions à un même courant.`;
  } else if (preset === "resonance") {
    title="Résonance : mesures du fascicule";
    const index=Math.min(10,Math.round(value));
    const x=(f:number)=>50+1.5*f,y=(i:number)=>295-1.5*i;
    content=<>{axes("N (Hz)","I (mA)")}<polyline points={resonanceMeasurements.frequency.map((f,i)=>`${x(f)},${y(resonanceMeasurements.current[i])}`).join(" ")} stroke={blue} fill="none" strokeWidth="3"/><path d={`M50 ${y(150/Math.SQRT2)}H450`} stroke={green} strokeDasharray="6 5"/><text x="310" y={y(150/Math.SQRT2)-8}>I₀/√2</text><circle cx={x(resonanceMeasurements.frequency[index])} cy={y(resonanceMeasurements.current[index])} r="7" fill={purple}/><text x="60" y="48">Maximum : 200 Hz ; 150 mA</text></>;
    controls=range(`Mesure : N = ${resonanceMeasurements.frequency[index]} Hz ; I = ${resonanceMeasurements.current[index]} mA`,0,10);
    caption="Points expérimentaux reliés pour guider la lecture. L’horizontale indique le seuil de la bande passante, environ 106 mA.";
  } else if (preset === "radioactivity") {
    title="Décroissance radioactive et demi-vie";
    const halves=value/10, px=50+65*halves, py=295-240*2**(-halves);
    content=<>{axes("t / T","N / N₀ (%)")}<polyline points={Array.from({length:101},(_,i)=>{const t=6*i/100;return `${50+65*t},${295-240*2**(-t)}`;}).join(" ")} fill="none" stroke={blue} strokeWidth="3"/>{[1,2,3].map(n=><g key={n}><path d={`M${50+65*n} 295V${295-240*2**(-n)}H50`} stroke="#b7c6d0" fill="none" strokeDasharray="4 4"/><text x={44+65*n} y="320">{n}</text></g>)}<circle cx={px} cy={py} r="7" fill={purple}/><text x="230" y="62">N(t) = N₀ × 2⁻ᵗ⁄ᵀ</text></>;
    controls=range(`Temps : ${round(halves,1)} demi-vie(s)`,0,60);
    caption=`Il reste ${round(100*2**(-halves))} % des noyaux initiaux. L’activité d’une même espèce suit la même proportion.`;
  } else if (preset === "carbonyl") {
    title=reverse?"Fonction cétone":"Fonction aldéhyde";
    content=<><text x="70" y="190">R</text><path d="M105 180H235M268 180H390M245 155V82M257 155V82" stroke={blue} strokeWidth="3"/><text x="238" y="193">C</text><text x="240" y="67">O</text><text x="400" y="190">{reverse?"R′":"H"}</text><text x="110" y="285">{reverse?"Carbonyle entre deux carbones":"Carbonyle en bout de chaîne"}</text></>;
    controls=flip("Aldéhyde · voir la cétone","Cétone · voir l’aldéhyde");
    caption=reverse?"DNPH positive. Pour les cétones simples étudiées, Schiff et Fehling sont négatifs.":"DNPH et Schiff positifs ; les aldéhydes réducteurs donnent également Fehling positif.";
  } else if (preset === "amino-forms") {
    title="Formes d’un acide α-aminé";
    const left=form===2?"NH₂":"NH₃⁺",right=form===0?"COOH":"COO⁻";
    content=<><text x="30" y="180">{left}</text><path d="M105 171H225M275 171H365M245 160V105M245 190V250" stroke={blue} strokeWidth="3"/><text x="238" y="185">C</text><text x="382" y="180">{right}</text><text x="236" y="91">R</text><text x="229" y="278">H</text><text x="105" y="320">Charge totale : {form===0?"+1":form===1?"0":"−1"}</text></>;
    controls=<div className="physics-figure-options">{["Cation","Amphion","Anion"].map((label,index)=><button key={label} type="button" aria-pressed={form===index} onClick={()=>setForm(index)}>{label}</button>)}</div>;
    caption="Chaîne R sans autre groupe ionisable : le cation prédomine à pH suffisamment bas, l’anion à pH suffisamment élevé. L’amphion porte deux charges opposées.";
  } else if (preset === "ph") {
    title="Échelle de pH à 25 °C";
    content=<><rect x="45" y="130" width="180" height="45" fill="#fde2d9"/><rect x="225" y="130" width="45" height="45" fill="#d6eee4"/><rect x="270" y="130" width="180" height="45" fill="#dce7fc"/><path d="M45 190H450" stroke="#8493a4"/>{[0,7,14].map(p=><text key={p} x={38+p*405/14} y="220">{p}</text>)}<text x="72" y="100">Acide</text><text x="302" y="100">Basique</text><path d={`M${45+value*405/14} 120v70`} stroke={purple} strokeWidth="4"/><text x="190" y="285">Neutre : pH7</text></>;
    controls=range(`pH : ${round(value,1)}`,0,14,.1);
    caption=<MathText>{String.raw`$[\mathrm{H_3O^+}]=10^{-`+value+String.raw`}\ \mathrm{mol\,L^{-1}}$ et $[\mathrm{OH^-}]=10^{`+round(value-14,1).replace(",",".")+String.raw`}\ \mathrm{mol\,L^{-1}}$. Modèle dilué à 25 °C.`}</MathText>;
  } else if (preset === "predominance") {
    title="Prédominance dans un couple acide/base";
    const fractions=conjugateFractions(value);
    content=<><text x="60" y="90">Acide : {round(100*fractions.acid,1)} %</text><text x="270" y="90">Base : {round(100*fractions.base,1)} %</text><rect x="50" y="130" width={400*fractions.acid} height="60" fill={blue}/><rect x={50+400*fractions.acid} y="130" width={400*fractions.base} height="60" fill={green}/><text x="95" y="260">pH − pKₐ = {round(value,1)}</text></>;
    controls=range(`Écart au pKₐ : ${round(value,1)}`,-3,3,.1);
    caption=`[Base]/[Acide] = 10^(pH − pKₐ) = ${round(fractions.ratio,3)}. La prédominance ne signifie pas que l’autre forme a disparu.`;
  } else {
    title=reverse?"Titrage d’une base forte par un acide fort":"Titrage d’un acide fort par une base forte";
    const volumes=reverse?acidBaseMeasurements.acidVolumes:acidBaseMeasurements.baseVolumes;
    const ph=reverse?acidBaseMeasurements.decreasingPh:acidBaseMeasurements.increasingPh;
    const index=Math.min(volumes.length-1,Math.round(value)),x=(v:number)=>50+400*v/volumes[volumes.length-1],y=(p:number)=>295-17*p;
    content=<>{axes("V (mL)","pH")}<path d={`M50 ${y(7)}H450`} stroke="#98b4a9" strokeDasharray="5 5"/><text x="20" y={y(7)+5}>7</text><polyline points={volumes.map((v,i)=>`${x(v)},${y(ph[i])}`).join(" ")} fill="none" stroke={blue} strokeWidth="3"/><circle cx={x(volumes[index])} cy={y(ph[index])} r="7" fill={purple}/></>;
    controls=<>{flip("Base ajoutée · inverser le titrage","Acide ajouté · inverser le titrage")}{range(`Mesure : V = ${round(volumes[index],1)} mL ; pH = ${round(ph[index])}`,0,volumes.length-1)}</>;
    caption=reverse?"Mesures du fascicule, reliées sans ajustement théorique. L’équivalence est voisine de 50 mL.":"Mesures du fascicule, reliées sans ajustement théorique. L’équivalence est voisine de 21 mL ; pH théorique 7 à 25 °C.";
  }
  return <figure className="essential-circle physics-essential-figure" data-physics-figure={preset}>
    <div className="essential-circle-scroll" tabIndex={0} role="region" aria-label={`Figure : ${title}`}>
      <svg viewBox="0 0 500 350" role="img" aria-label={title}>
        <defs>{[blue,green,purple].map(color=><marker key={color} id={`${id}-${color.slice(1)}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={color}/></marker>)}</defs>
        {content}
      </svg>
    </div>
    <figcaption>{controls}<p>{caption}</p></figcaption>
  </figure>;
}
