import { useId,useState } from "react";
import { baseConversion,euclideanDivision,modPower,powerCycle,sieveValues,primalityTrials } from "./arithmeticModels";
import "../../styles/arithmetic-figures.css";
const text=(n:bigint|number)=>String(n);
function EuclidTool({bank=false}:{bank?:boolean}){
  const id=useId(),[a,setA]=useState(bank?"-87":"-43"),[b,setB]=useState(bank?"8":"7");
  let result:{q:bigint;r:bigint}|undefined,error="";
  try{if(!/^-?\d{1,30}$/.test(a)||!/^-?\d{1,30}$/.test(b))throw new Error("Saisir deux entiers, avec un signe moins si nécessaire.");result=euclideanDivision(BigInt(a),BigInt(b));}catch(e){error=(e as Error).message;}
  return <div className="arithmetic-tool" data-tool="euclid">
    <h4>Division euclidienne</h4><div className="arithmetic-fields">
      <label htmlFor={id+"a"}>Dividende<input id={id+"a"} inputMode="text" value={a} maxLength={31} onChange={e=>setA(e.target.value)}/></label>
      <label htmlFor={id+"b"}>Diviseur<input id={id+"b"} inputMode="text" value={b} maxLength={31} onChange={e=>setB(e.target.value)}/></label>
    </div>
    <div aria-live="polite">{result?<><p className="arithmetic-equation">{a} = ({b}) × ({text(result.q)}) + {text(result.r)}</p><p>Quotient : <strong>{text(result.q)}</strong> · Reste : <strong>{text(result.r)}</strong></p><p>0 ≤ {text(result.r)} &lt; |{b}|. Le reste reste positif ou nul, quels que soient les signes.</p></>:<p className="arithmetic-error">{error}</p>}</div>
  </div>;
}
function BaseTool({preset="base"}:{preset?:string}){
  const id=useId(),[input,setInput]=useState(preset==="11"?"402":preset==="38"?"36":preset==="10"?"425":"61"),
    [from,setFrom]=useState(preset==="11"?5:preset==="38"?8:10),[to,setTo]=useState(preset==="10"?7:preset==="38"?10:3);
  let result:ReturnType<typeof baseConversion>|undefined,error="";
  try{result=baseConversion(input,from,to);}catch(e){error=(e as Error).message;}
  const selector=(suffix:string,label:string,value:number,action:(n:number)=>void)=><label htmlFor={id+suffix}>{label}<select id={id+suffix} aria-label={label} value={value} onChange={e=>action(Number(e.target.value))}>{Array.from({length:15},(_,i)=><option key={i+2} value={i+2}>{i+2}</option>)}</select></label>;
  return <div className="arithmetic-tool" data-tool="base"><h4>Changer de base</h4><div className="arithmetic-fields">
    <label htmlFor={id+"value"}>Nombre à convertir<input id={id+"value"} value={input} maxLength={60} autoCapitalize="characters" spellCheck={false} onChange={e=>setInput(e.target.value)}/></label>
    {selector("from","Base de départ",from,setFrom)}{selector("to","Base d’arrivée",to,setTo)}
  </div><div aria-live="polite">{result?<><p className="arithmetic-equation">{input.toUpperCase()} (base {from}) = {result.decimal.toString()} (base 10) = <strong>{result.result} (base {to})</strong></p>
    <div className="arithmetic-table"><table><thead><tr><th>Dividende</th><th>Diviseur</th><th>Quotient</th><th>Reste</th></tr></thead><tbody>{result.steps.map((s,i)=><tr key={i}><td>{text(s.a)}</td><td>{to}</td><td>{text(s.q)}</td><td>{text(s.r)}</td></tr>)}</tbody></table></div>
    <p>Lire les restes de la dernière ligne à la première. A vaut 10, B vaut 11, …, F vaut 15.</p>
  </>:<p className="arithmetic-error">{error}</p>}</div></div>;
}
function PowerTool({preset}:{preset:string}){
  const defaults=preset==="power-nine"?[2,9]:preset==="power-11"?[4,11]:preset==="power-five"?[3,5]:[2,5];
  const id=useId(),[base,setBase]=useState(defaults[0]),[mod,setMod]=useState(defaults[1]),[n,setN]=useState(12);
  const cycle=powerCycle(base,mod),r=modPower(BigInt(base),n,BigInt(mod));
  return <div className="arithmetic-tool" data-tool="power"><h4>Explorer les cycles de restes</h4><div className="arithmetic-fields">
    <label htmlFor={id+"b"}>Base de la puissance<select id={id+"b"} aria-label="Base de la puissance" value={base} onChange={e=>setBase(Number(e.target.value))}>{Array.from({length:12},(_,i)=><option key={i+1}>{i+1}</option>)}</select></label>
    <label htmlFor={id+"m"}>Modulo<select id={id+"m"} aria-label="Modulo" value={mod} onChange={e=>setMod(Number(e.target.value))}>{Array.from({length:19},(_,i)=><option key={i+2}>{i+2}</option>)}</select></label>
    <label htmlFor={id+"n"}>Exposant n : {n}<input id={id+"n"} type="range" min="0" max="100" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/></label>
  </div><p className="arithmetic-equation" aria-live="polite">{base}<sup>{n}</sup> ≡ <strong>{text(r)}</strong> (mod {mod})</p>
  <div className="arithmetic-table"><table><thead><tr><th>Exposant</th>{cycle.values.map((_,i)=><th key={i}>{i}</th>)}</tr></thead><tbody><tr><th>Reste</th>{cycle.values.map((v,i)=><td key={i}>{v}</td>)}</tr></tbody></table></div>
  <p>{cycle.prefix.length?("Les "+cycle.prefix.length+" premiers termes précèdent le cycle. "):"Le cycle commence à l’exposant 0. "}Période : {cycle.period.length}. Restes du cycle : {cycle.period.join(", ")}.</p>
  </div>;
}
function Sieve({limit}:{limit:number}){
  const id=useId(),[step,setStep]=useState(0),primes=[2,3,5,7],values=sieveValues(limit);
  const removed=(v:number)=>v===1||primes.slice(0,step).some(p=>v!==p&&v%p===0);
  const done=step===4,remaining=values.filter(x=>!removed(x.value));
  return <div className="arithmetic-tool" data-tool="sieve"><h4>Crible d’Ératosthène · 1 à {limit}</h4>
    <div className="arithmetic-sieve" role="list" aria-label={"Crible des nombres de 1 à "+limit}>{values.map(({value})=><span role="listitem" key={value} className={removed(value)?"is-eliminated":done?"is-prime":""} aria-label={value+(removed(value)?" éliminé":done?" premier":" non éliminé")}>{value}</span>)}</div>
    <div className="arithmetic-actions"><button type="button" aria-controls={id} disabled={done} onClick={()=>setStep(s=>Math.min(4,s+1))}>{done?"Crible terminé":"Éliminer les multiples de "+primes[step]}</button><button type="button" onClick={()=>setStep(0)}>Recommencer</button></div>
    <p id={id} aria-live="polite">{done?"Nombres premiers : "+remaining.map(x=>x.value).join(", ")+".":"1 est écarté. Le nombre premier traité est conservé ; seuls ses autres multiples sont éliminés."}</p>
  </div>;
}
function PrimeTool(){
  const id=useId(),[input,setInput]=useState("103");let result:ReturnType<typeof primalityTrials>|undefined,error="";
  try{if(!/^\d{1,7}$/.test(input))throw new Error("Saisir un entier de 2 à 1 000 000.");result=primalityTrials(Number(input));}catch(e){error=(e as Error).message;}
  return <div className="arithmetic-tool" data-tool="prime"><h4>Tester la primalité</h4><label htmlFor={id}>Entier à tester<input id={id} value={input} inputMode="numeric" maxLength={7} onChange={e=>setInput(e.target.value)}/></label>
    <div aria-live="polite">{result?<><div className="arithmetic-table"><table><thead><tr><th>Premier p</th><th>Quotient</th><th>Reste</th></tr></thead><tbody>{result.rows.map(row=><tr key={row.p}><td>{row.p}</td><td>{row.q}</td><td>{row.r}</td></tr>)}</tbody></table></div>
    <p><strong>{input} {result.prime?"est premier.":"n’est pas premier."}</strong> {result.prime?"Aucun premier inférieur ou égal à sa racine carrée ne le divise.":"Le premier reste nul fournit un diviseur propre."}</p></>:<p className="arithmetic-error">{error}</p>}</div>
  </div>;
}
export function ArithmeticFigure({preset}:{preset:string|number}){
  const p=String(preset);
  if(p==="euclid"||p==="14")return <EuclidTool bank={p==="14"}/>;
  if(["base","10","11","38"].includes(p))return <BaseTool preset={p}/>;
  if(p==="24")return <PrimeTool/>;
  if(p==="sieve-50")return <Sieve limit={50}/>;
  if(p==="sieve-100")return <Sieve limit={100}/>;
  if(["power","power-nine","power-11","power-five","48","49"].includes(p))return <PowerTool preset={p==="48"?"power-11":p==="49"?"power-five":p}/>;
  return null;
}
