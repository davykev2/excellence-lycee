import{useId,useState}from"react";
import{extendedGcd,integerEquation,linearCongruence,lcmValue,primeFactorization,affineCipher,gcdValue}from"./gcdMath";
import"../../styles/arithmetic-figures.css";
import"../../styles/gcd-figures.css";
function IntegerField({label,value,onChange}:{label:string;value:string;onChange:(s:string)=>void}){
 const id=useId();return <label htmlFor={id}>{label}<input id={id} inputMode="text" maxLength={16} value={value} onChange={e=>onChange(e.target.value)}/></label>;
}
const parse=(s:string)=>{if(!/^-?\d{1,15}$/.test(s))throw new Error("Saisir un entier de 15 chiffres au maximum.");return BigInt(s);};
function Euclid({preset}:{preset:string}){
 const pairs:Record<string,[string,string]>={"18":["2096","3182"],"19":["14865","7976"],"20":["756","990"],"25":["29","-11"],"26":["324","-245"],"27":["1048","-543"],bezout:["51","-43"]};
 const defaults=pairs[preset]??["92276","30621"],[a,setA]=useState(defaults[0]),[b,setB]=useState(defaults[1]),[step,setStep]=useState(1);
 let z:ReturnType<typeof extendedGcd>|undefined,error="";try{z=extendedGcd(parse(a),parse(b));}catch(e){error=(e as Error).message;}
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="euclid"><h4>Euclide et Bézout</h4>
 <div className="arithmetic-fields"><IntegerField label="Entier a" value={a} onChange={s=>{setA(s);setStep(1);}}/><IntegerField label="Entier b" value={b} onChange={s=>{setB(s);setStep(1);}}/></div>
 {z?<><div className="arithmetic-table"><table><thead><tr><th>Dividende</th><th>Diviseur</th><th>Quotient</th><th>Reste</th></tr></thead><tbody>{z.rows.slice(0,step).map((r,i)=><tr key={i}><td>{String(r.a)}</td><td>{String(r.b)}</td><td>{String(r.q)}</td><td>{String(r.r)}</td></tr>)}</tbody></table></div>
 <div className="arithmetic-actions"><button type="button" disabled={step>=z.rows.length} onClick={()=>setStep(n=>n+1)}>Division suivante</button><button type="button" onClick={()=>setStep(z!.rows.length)}>Toutes les divisions</button><button type="button" onClick={()=>setStep(1)}>Recommencer</button></div>
 <div aria-live="polite">{step>=z.rows.length&&<><p>PGCD : <strong>{String(z.gcd)}</strong></p><p className="arithmetic-equation">({a}) × ({String(z.u)}) + ({b}) × ({String(z.v)}) = {String(z.gcd)}</p><p>Cette identité utilise les signes des entiers saisis. Les coefficients ne sont pas uniques.</p></>}</div></>:<p className="arithmetic-error" role="status">{error}</p>}</div>;
}
function Factors({multiples=false,bank=false}:{multiples?:boolean;bank?:boolean}){
 const[a,setA]=useState(multiples?"4":bank?"3500":"28"),[b,setB]=useState(multiples?"6":bank?"225":"1323");
 let model:{a:number;b:number;rows:{p:number;a:number;b:number}[];g:bigint;m:bigint}|undefined,error="";
 try{const x=Number(parse(a)),y=Number(parse(b)),fa=primeFactorization(x),fb=primeFactorization(y);model={a:x,b:y,g:gcdValue(BigInt(x),BigInt(y)),m:lcmValue(BigInt(x),BigInt(y)),rows:[...new Set([...fa,...fb].map(f=>f.prime))].sort((p,q)=>p-q).map(p=>({p,a:fa.find(f=>f.prime===p)?.exponent??0,b:fb.find(f=>f.prime===p)?.exponent??0}))};}catch(e){error=(e as Error).message;}
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="factors"><h4>{multiples?"Multiples communs":"Exposants, PGCD et PPCM"}</h4><div className="arithmetic-fields"><IntegerField label="Entier positif a" value={a} onChange={setA}/><IntegerField label="Entier positif b" value={b} onChange={setB}/></div>
 {model?<><div className="arithmetic-table"><table><thead><tr><th>Premier</th><th>Exposant dans a</th><th>Exposant dans b</th><th>Minimum</th><th>Maximum</th></tr></thead><tbody>{model.rows.map(r=><tr key={r.p}><th>{r.p}</th><td>{r.a}</td><td>{r.b}</td><td>{Math.min(r.a,r.b)}</td><td>{Math.max(r.a,r.b)}</td></tr>)}</tbody></table></div><p aria-live="polite">PGCD : <strong>{String(model.g)}</strong> · PPCM : <strong>{String(model.m)}</strong></p>
 <p className="arithmetic-equation">{String(model.g)} × {String(model.m)} = {String(BigInt(model.a)*BigInt(model.b))}</p>
 {multiples&&<><p>Les cinq premiers multiples communs strictement positifs :</p><p className="arithmetic-equation">{[1n,2n,3n,4n,5n].map(k=>String(k*model!.m)).join(" ; ")}</p><p>Zéro et les opposés de ces nombres sont aussi des multiples communs.</p></>}</>:<p className="arithmetic-error" role="status">{error}</p>}</div>;
}
function Equation({preset}:{preset:string}){
 const defaults:Record<string,[number,number,number]>={"28":[1048,-543,5],"29":[323,589,38],"eval-equation":[748,-59,12],equation:[10,4,18]};
 const[a0,b0,c0]=defaults[preset]??defaults.equation,[a,setA]=useState(String(a0)),[b,setB]=useState(String(b0)),[c,setC]=useState(String(c0)),[k,setK]=useState(0),id=useId();
 let z:ReturnType<typeof integerEquation>|undefined,error="";try{z=integerEquation(parse(a),parse(b),parse(c));}catch(e){error=(e as Error).message;}
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="equation"><h4>Solutions entières de ax + by = c</h4><div className="arithmetic-fields"><IntegerField label="Coefficient a" value={a} onChange={setA}/><IntegerField label="Coefficient b" value={b} onChange={setB}/><IntegerField label="Second membre c" value={c} onChange={setC}/></div>
 {error?<p className="arithmetic-error">{error}</p>:z===null?<p role="status">Aucune solution entière : le PGCD ne divise pas le second membre.</p>:z&&<><p>PGCD : {String(z.gcd)}. Un couple particulier est ({String(z.x)} ; {String(z.y)}).</p><p className="arithmetic-equation">x = {String(z.x)} + ({String(z.dx)})k ; y = {String(z.y)} + ({String(z.dy)})k</p><label htmlFor={id}>Paramètre entier k : {k}<input id={id} type="range" min="-10" max="10" value={k} onChange={e=>setK(Number(e.target.value))}/></label><p className="arithmetic-equation" aria-live="polite">({a}) × ({String(z.x+z.dx*BigInt(k))}) + ({b}) × ({String(z.y+z.dy*BigInt(k))}) = {c}</p></>}</div>;
}
function Congruence({preset}:{preset:string}){
 const defaults:Record<string,[number,number,number]>={"37":[2,-1,5],"46":[4,1,9],"48":[8,6,10]},[x,y,m]=defaults[preset]??[8,6,10];
 const[a,setA]=useState(String(x)),[b,setB]=useState(String(y)),[n,setN]=useState(String(m));let z:ReturnType<typeof linearCongruence>|undefined,error="";
 try{z=linearCongruence(parse(a),parse(b),parse(n));}catch(e){error=(e as Error).message;}
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="congruence"><h4>Résoudre ax ≡ b (mod n)</h4><div className="arithmetic-fields"><IntegerField label="Coefficient a" value={a} onChange={setA}/><IntegerField label="Second membre b" value={b} onChange={setB}/><IntegerField label="Modulo n" value={n} onChange={setN}/></div>
 <div aria-live="polite">{error?<p className="arithmetic-error">{error}</p>:z===null?<p>Aucune solution : le PGCD ne divise pas b.</p>:z&&<><p className="arithmetic-equation">x ≡ {String(z.residue)} (mod {String(z.step)})</p><p>Tous les entiers x = {String(z.residue)} + {String(z.step)}k, avec k entier. Cela représente {String(z.count)} classe(s) distincte(s) modulo {n}.</p></>}</div></div>;
}
function Cipher(){
 const[message,setMessage]=useState("GAUSS"),[a,setA]=useState(5),[decode,setDecode]=useState(false),id=useId();let result="",error="";
 try{result=affineCipher(message,a,7,decode);}catch(e){error=(e as Error).message;}
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="cipher"><h4>Chiffrement affine · modulo 26</h4><div className="arithmetic-fields"><label>Coefficient a<select aria-label="Coefficient a du codage" value={a} onChange={e=>setA(Number(e.target.value))}><option value="5">5 · codage injectif</option><option value="18">18 · collisions possibles</option></select></label><label>Opération<select aria-label="Opération" value={decode?"decode":"encode"} onChange={e=>setDecode(e.target.value==="decode")}><option value="encode">Coder</option><option value="decode">Décoder</option></select></label><label htmlFor={id}>Texte<input id={id} value={message} maxLength={100} onChange={e=>setMessage(e.target.value)}/></label></div><p>b = 7 ; A porte l’indice 0 et Z l’indice 25.</p><p aria-live="polite" className={error?"arithmetic-error":"arithmetic-equation"}>{error||result}</p>{a===18&&<p>Attention : K et X deviennent tous deux F. Le décodage unique est impossible.</p>}</div>;
}
function Grid({mode,a=8,b=8}:{mode:number;a?:number;b?:number}){
 const scale=Math.min(30,260/Math.max(a,b)),sx=(x:number)=>45+scale*x,sy=(y:number)=>295-scale*y;
 const isMarked=(x:number,y:number)=>mode===1?x%3===2&&y%3===1:mode===2?(x+y)%3===1:mode===3?(x-y)%3===0:mode===4?7*x-4*y===1:a*y===b*x;
 return <div className="gcd-grid-scroll"><svg width="360" height="340" viewBox="0 0 360 340" role="img" aria-label={mode===5?"Points entiers de la diagonale du rectangle":mode===4?"Solutions entières de 7x moins 4y égale1 dans le réseau4 par 7":"Réseau8 par 8, condition"+mode}>
 {Array.from({length:a+1},(_,x)=><line key={"x"+x} x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(b)} stroke="#d8e2df"/>)}{Array.from({length:b+1},(_,y)=><line key={"y"+y} x1={sx(0)} x2={sx(a)} y1={sy(y)} y2={sy(y)} stroke="#d8e2df"/>)}
 <line x1={sx(0)} x2={sx(a)+15} y1={sy(0)} y2={sy(0)} stroke="#334754"/><line x1={sx(0)} x2={sx(0)} y1={sy(0)} y2={sy(b)-15} stroke="#334754"/>
 {mode===5&&<line x1={sx(0)} y1={sy(0)} x2={sx(a)} y2={sy(b)} stroke="#256c93" strokeWidth="2"/>}
 {Array.from({length:a+1},(_,x)=>Array.from({length:b+1},(_,y)=><circle key={x+"-"+y} cx={sx(x)} cy={sy(y)} r={isMarked(x,y)?4:1.5} fill={isMarked(x,y)?"#14693e":"#8c9b98"}><title>({x};{y}){isMarked(x,y)?" · solution":""}</title></circle>))}
 {Array.from({length:a+1},(_,x)=><text key={x} x={sx(x)} y={sy(0)+23} textAnchor="middle" fontSize="16">{x}</text>)}{Array.from({length:b+1},(_,y)=><text key={y} x={sx(0)-12} y={sy(y)+5} textAnchor="end" fontSize="16">{y}</text>)}
 <text x={sx(a)+20} y={sy(0)+5} fontSize="16">x</text><text x={sx(0)-5} y={sy(b)-20} fontSize="16">y</text>
 </svg></div>;
}
function Network(){
 const[mode,setMode]=useState(1),[a,setA]=useState(6),[b,setB]=useState(4);
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="network"><h4>Points entiers dans un réseau</h4><label>Configuration<select aria-label="Configuration du réseau" value={mode} onChange={e=>setMode(Number(e.target.value))}><option value="1">A.1 · x ≡ 2 et y ≡ 1 modulo 3</option><option value="2">A.2 · x + y ≡ 1 modulo 3</option><option value="3">A.3 · x ≡ y modulo 3</option><option value="4">B · 7x − 4y = 1</option><option value="5">C · Diagonale</option></select></label>
 {mode===5&&<div className="arithmetic-fields">{[["Largeur a",a,setA],["Hauteur b",b,setB]].map(([label,value,set])=><label key={String(label)}>{String(label)}<select aria-label={String(label)} value={value as number} onChange={e=>(set as(n:number)=>void)(Number(e.target.value))}>{Array.from({length:8},(_,i)=><option key={i+1}>{i+1}</option>)}</select></label>)}</div>}
 <Grid mode={mode} a={mode===4?4:mode===5?a:8} b={mode===4?7:mode===5?b:8}/><p aria-live="polite">{mode===5?("PGCD(a;b) = "+String(gcdValue(BigInt(a),BigInt(b)))+" ; "+String(gcdValue(BigInt(a),BigInt(b))+1n)+" points entiers sur le segment, extrémités comprises."):mode===4?"Le seul point solution du réseau est (3 ; 5).":mode===1?"Les 9 points solutions sont verts.":"Les 27 points solutions sont verts."}</p></div>;
}
function PrimeCheck(){
 const rows=[];for(let p=2;p<=251;p++){let prime=true;for(let d=2;d*d<=p;d++)if(p%d===0){prime=false;break;}if(prime)rows.push({p,r:65537%p});}
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="prime-check"><h4>65537 : vérifier les diviseurs premiers</h4><p>La racine carrée est comprise entre256 et257. Il suffit de tester les 54 nombres premiers ci-dessous. Aucun reste n’est nul.</p><div className="arithmetic-table"><table><thead><tr><th>Diviseur premier</th><th>Quotient</th><th>Reste</th></tr></thead><tbody>{rows.map(r=><tr key={r.p}><td>{r.p}</td><td>{Math.floor(65537/r.p)}</td><td>{r.r}</td></tr>)}</tbody></table></div></div>;
}
function Periods({celestial}:{celestial:boolean}){
 const[k,setK]=useState(0),id=useId(),first=celestial?735:92,step=celestial?2835:420,t=first+k*step;
 return <div className="arithmetic-tool gcd-tool" data-gcd-tool="periods"><h4>{celestial?"Apparitions simultanées":"Signaux simultanés"}</h4><label htmlFor={id}>Rencontre numéro {k+1}<input id={id} type="range" min="0" max="4" value={k} onChange={e=>setK(Number(e.target.value))}/></label><p aria-live="polite">{t} {celestial?"jours depuis le 7décembre 2019":" secondes depuis minuit"}</p><p className="arithmetic-equation">{celestial?t+" = 105 × "+t/105+" ; "+t+" − 6 = 81 × "+(t-6)/81:t+" − 2 = 15 × "+(t-2)/15+" ; "+t+" − 8 = 28 × "+(t-8)/28}</p><p>Période commune : {step} {celestial?"jours":" secondes"}.</p></div>;
}
export function GcdFigure({preset}:{preset:string|number}){
 const p=String(preset);
 if(["multiples","factors","40"].includes(p))return <Factors multiples={p==="multiples"} bank={p==="40"}/>;
 if(["euclid","bezout","18","19","20","25","26","27"].includes(p))return <Euclid preset={p}/>;
 if(["equation","eval-equation","28","29"].includes(p))return <Equation preset={p}/>;
 if(["congruence","37","46","48"].includes(p))return <Congruence preset={p}/>;
 if(p==="79")return <PrimeCheck/>;if(p==="80")return <Cipher/>;if(p==="81")return <Network/>;
 if(p==="74"||p==="82")return <Periods celestial={p==="82"}/>;
 return null;
}
