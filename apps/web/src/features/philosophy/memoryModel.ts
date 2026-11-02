export interface PhiloNotion { id:string; title:string; description:string; coursePathId:string }
interface MemoryItem {
  id:string; notions:string[];
  /** Optional adapters for other subjects; absent on the historical philosophy bank. */
  formats?:MemoryFormat[]; reviewSignature?:string; requireRecall?:boolean;
}
export interface PhiloQuotation extends MemoryItem {
  kind:"quote"; text:string; author:string; work:string; location:string; edition:string; url:string;
  gaps:string[]; explanation:string; application:string;
  meaning:string; distractors:[string,string,string];
}
export interface PhiloDefinition extends MemoryItem {
  kind:"definition"; label:string; text:string; distractors:[string,string,string]; explanation:string; example:string;
}
export type PhiloMemoryItem=PhiloQuotation|PhiloDefinition;
export type MemoryFormat="meaning"|"cloze"|"author"|"completion"|"work"|"order"|"definition"|"recognition";
export interface MemoryQuestion {
  id:string; itemId:string; format:MemoryFormat; prompt:string; quotation?:string;
  options?:string[]; expected:string[]; acceptedAnswers?:string[][]; parts?:string[]; prefix?:string; suffix?:string; chunks?:string[];
}
export interface MemoryReview {
  fingerprint:string; attempts:number; successes:number; lapses:number; box:number; dueAt:number; lastAt:number;
  days:number[]; recall:boolean; understood:boolean;
}
export type MemoryAnswer=string[];
export interface MemoryResponse { questionId:string; answer:MemoryAnswer; assisted:boolean; at:number }
export interface MemorySession {
  seed:string; bankSignature:string; notion:string; mode:"notion"|"daily"|"errors"; queue:string[]; index:number;
  responses:MemoryResponse[]; draft:MemoryAnswer; assisted:boolean;
}
export interface MemoryState { version:1; reviews:Record<string,MemoryReview>; session:MemorySession|null }
