export interface FrenchReference { title:string;publisher:string;url:string }
export type FrenchSection="figures"|"argumentation";
export interface FrenchApplication {
  text:string;prompt:string;answer:string;distractors:[string,string,string];explanation:string;
}
export interface FrenchCard {
  id:string;section:FrenchSection;label:string;definition:string;distractors:[string,string,string];
  aliases?:string[];tip:string;reference:FrenchReference;
  identify:FrenchApplication;interpret:FrenchApplication;
  completion?:{prompt:string;before:string;after:string;answer:string;aliases:string[];explanation:string};
  /** Only the requested technical term is machine-marked, never a free interpretation. */
  recallPrompt?:string;
}
