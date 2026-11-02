export const absInteger=(n:bigint)=>n<0n?-n:n;
export const positiveMod=(a:bigint,n:bigint)=>{if(n<=0n)throw new Error("Le modulo doit être strictement positif.");return((a%n)+n)%n;};
export function extendedGcd(a:bigint,b:bigint){
 if(a===0n&&b===0n)throw new Error("Au moins un entier doit être non nul.");
 let r=absInteger(a),s=absInteger(b),u=1n,v=0n,x=0n,y=1n;
 const rows:{a:bigint;b:bigint;q:bigint;r:bigint}[]=[];
 while(s!==0n){const q=r/s,t=r%s;rows.push({a:r,b:s,q,r:t});[r,s]=[s,t];[u,x]=[x,u-q*x];[v,y]=[y,v-q*y];}
 return{gcd:r,u:a<0n?-u:u,v:b<0n?-v:v,rows};
}
export function gcdValue(a:bigint,b:bigint){return extendedGcd(a,b).gcd;}
export function lcmValue(a:bigint,b:bigint){if(a===0n||b===0n)return 0n;return absInteger(a/gcdValue(a,b)*b);}
export function integerEquation(a:bigint,b:bigint,c:bigint){
 const z=extendedGcd(a,b);if(c%z.gcd!==0n)return null;
 return{...z,x:z.u*(c/z.gcd),y:z.v*(c/z.gcd),dx:b/z.gcd,dy:-a/z.gcd};
}
export function linearCongruence(a:bigint,b:bigint,n:bigint){
 if(n<=0n)throw new Error("Le modulo doit être strictement positif.");
 const z=extendedGcd(a,n);if(b%z.gcd!==0n)return null;
 const step=n/z.gcd;return{residue:positiveMod(z.u*(b/z.gcd),step),step,count:z.gcd};
}
export function primeFactorization(value:number){
 if(!Number.isSafeInteger(value)||value<1||value>1_000_000)throw new Error("Choisir un entier de 1 à 1 000 000.");
 let n=value;const factors:{prime:number;exponent:number}[]=[];
 for(let p=2;p*p<=n;p++){if(n%p)continue;let exponent=0;while(n%p===0){n/=p;exponent++;}factors.push({prime:p,exponent});}
 if(n>1)factors.push({prime:n,exponent:1});return factors;
}
export function divisors(value:number){let ds=[1];for(const{prime,exponent}of primeFactorization(value)){const old=[...ds];let power=1;for(let i=1;i<=exponent;i++){power*=prime;ds.push(...old.map(d=>d*power));}}return ds.sort((a,b)=>a-b);}
export function affineCipher(message:string,a:number,b:number,decode=false){
 const inverse=linearCongruence(BigInt(a),1n,26n);if(decode&&!inverse)throw new Error("Ce coefficient ne permet pas un décodage unique.");
 return message.toUpperCase().replace(/[A-Z]/g,c=>{const n=c.charCodeAt(0)-65;return String.fromCharCode(65+Number(positiveMod(decode?inverse!.residue*BigInt(n-b):BigInt(a*n+b),26n)));});
}
