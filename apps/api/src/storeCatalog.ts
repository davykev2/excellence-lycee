// Catalogue de la boutique — source de vérité côté API.
//
// L'or est une monnaie dépensable, reflet de l'XP gagné : GOLD_XP_RATE XP = 1 or.
// Le solde = floor(total_xp / GOLD_XP_RATE) − or dépensé. Le classement continue
// d'utiliser l'XP à vie, il n'est donc jamais affecté par les achats.
//
// Ces prix doivent rester synchronisés avec DEUX autres endroits :
//   1. la migration Supabase qui alimente la table public.store_items ;
//   2. le catalogue d'affichage du frontend (apps/web/src/data/storeCatalog.ts).
// C'est la même discipline « trois sources » que pour l'XP des leçons.

export const GOLD_XP_RATE = 50;

export type StoreItemCategory = "frame" | "theme" | "badge" | "title";

export interface StoreItem {
  id: string;
  category: StoreItemCategory;
  title: string;
  price: number;
}

export const storeItems: StoreItem[] = [
  // Cadres de photo de profil
  { id: "frame-gold", category: "frame", title: "Cadre Or", price: 60 },
  { id: "frame-neon", category: "frame", title: "Cadre Néon", price: 60 },
  { id: "frame-laurel", category: "frame", title: "Cadre Laurier", price: 60 },
  // Thèmes de couleur
  { id: "theme-ocean", category: "theme", title: "Thème Océan", price: 150 },
  { id: "theme-sunset", category: "theme", title: "Thème Coucher de soleil", price: 150 },
  { id: "theme-forest", category: "theme", title: "Thème Forêt", price: 150 },
  // Badges de profil
  { id: "badge-studious", category: "badge", title: "Badge Studieux", price: 40 },
  { id: "badge-perfectionist", category: "badge", title: "Badge Perfectionniste", price: 40 },
  { id: "badge-streak", category: "badge", title: "Badge Assidu", price: 40 },
  // Titres affichés
  { id: "title-rigorous", category: "title", title: "Le/La Rigoureux·se", price: 80 },
  { id: "title-bac-ace", category: "title", title: "As du BAC", price: 80 },
  { id: "title-scholar", category: "title", title: "Érudit·e", price: 80 },
];

const priceById = new Map(storeItems.map((item) => [item.id, item.price] as const));

export function getStoreItemPrice(itemId: string): number | undefined {
  return priceById.get(itemId);
}
