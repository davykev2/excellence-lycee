import type {PhilosophyDocumentSeed} from "./model";
const loaders:Record<string,()=>Promise<PhilosophyDocumentSeed>>={
 "terminale-philo-l1-dissertation":()=>import("./dissertation").then(m=>m.document),
 "terminale-philo-l2-text-commentary":()=>import("./commentary").then(m=>m.document),
 "terminale-philo-l3-knowledge-of-man":()=>import("./humanKnowledge").then(m=>m.document),
 "terminale-philo-l4-social-life":()=>import("./socialLife").then(m=>m.document),
 "terminale-philo-l5-god-religion":()=>import("./religion").then(m=>m.document),
 "terminale-philo-l6-history-humanity":()=>import("./historyHumanity").then(m=>m.document),
 "terminale-philo-l7-value-philosophy":()=>import("./philosophyValue").then(m=>m.document),
 "terminale-philo-l8-progress-happiness":()=>import("./progressHappiness").then(m=>m.document),
 "terminale-philo-l9-language-truth":()=>import("./languageTruth").then(m=>m.document),
 "terminale-philo-l10-scientific-knowledge":()=>import("./scientificKnowledge").then(m=>m.document),
};
const cache=new Map<string,Promise<PhilosophyDocumentSeed>>();
export const philosophyDocumentIds=Object.keys(loaders);
export function loadPhilosophyDocument(id:string):Promise<PhilosophyDocumentSeed>{
 const loader=loaders[id];if(!loader)return Promise.reject(new Error("Document de philosophie indisponible"));
 const old=cache.get(id);if(old)return old;
 const pending=loader().catch(error=>{cache.delete(id);throw error;});cache.set(id,pending);return pending;
}
