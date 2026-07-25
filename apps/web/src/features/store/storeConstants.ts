// Taux de conversion XP → or, identique au backend (apps/api/src/storeCatalog.ts
// et la migration Supabase). 50 XP = 1 or. Utilisé côté client uniquement pour
// l'affichage (progression vers le prochain or) ; le solde faisant foi vient de l'API.
export const GOLD_XP_RATE = 50;
