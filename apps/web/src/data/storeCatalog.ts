// Catalogue d'affichage de la boutique.
//
// Les identifiants et les prix doivent rester synchronisés avec les deux sources
// backend : apps/api/src/storeCatalog.ts et la migration Supabase
// 20260725120000_store_gold_shop.sql. Même discipline « trois sources » que l'XP.
//
// L'API renvoie aussi le prix faisant foi (champ `items` de GET /store) ; ce
// fichier fournit surtout la présentation (description, emoji, accent).

export type StoreItemCategory = "frame" | "theme" | "badge" | "title";

export interface StoreCatalogItem {
  id: string;
  category: StoreItemCategory;
  title: string;
  description: string;
  price: number;
  emoji: string;
  accent: string;
}

export interface StoreCategoryMeta {
  id: StoreItemCategory;
  label: string;
  tagline: string;
}

export const storeCategories: StoreCategoryMeta[] = [
  { id: "frame", label: "Cadres de profil", tagline: "Encadre ta photo avec style." },
  { id: "theme", label: "Thèmes de couleur", tagline: "Change l’ambiance de ton espace." },
  { id: "badge", label: "Badges", tagline: "Affiche tes qualités d’élève." },
  { id: "title", label: "Titres", tagline: "Un titre à afficher sous ton nom." },
];

export const storeCatalog: StoreCatalogItem[] = [
  { id: "frame-gold", category: "frame", title: "Cadre Or", description: "Un liseré doré, discret et prestigieux.", price: 60, emoji: "🥇", accent: "#f4c430" },
  { id: "frame-neon", category: "frame", title: "Cadre Néon", description: "Un contour lumineux qui claque.", price: 60, emoji: "💫", accent: "#22d3ee" },
  { id: "frame-laurel", category: "frame", title: "Cadre Laurier", description: "Les lauriers des champions.", price: 60, emoji: "🌿", accent: "#34d399" },
  { id: "theme-ocean", category: "theme", title: "Thème Océan", description: "Des bleus profonds et apaisants.", price: 150, emoji: "🌊", accent: "#3b82f6" },
  { id: "theme-sunset", category: "theme", title: "Thème Coucher de soleil", description: "Des oranges chauds et vibrants.", price: 150, emoji: "🌅", accent: "#fb7185" },
  { id: "theme-forest", category: "theme", title: "Thème Forêt", description: "Des verts naturels et reposants.", price: 150, emoji: "🌲", accent: "#22c55e" },
  { id: "badge-studious", category: "badge", title: "Badge Studieux", description: "Pour l’élève qui ne lâche rien.", price: 40, emoji: "📚", accent: "#8b5cf6" },
  { id: "badge-perfectionist", category: "badge", title: "Badge Perfectionniste", description: "Pour les scores parfaits.", price: 40, emoji: "🎯", accent: "#ef4444" },
  { id: "badge-streak", category: "badge", title: "Badge Assidu", description: "Pour la régularité au quotidien.", price: 40, emoji: "🔥", accent: "#f97316" },
  { id: "title-rigorous", category: "title", title: "Le/La Rigoureux·se", description: "Un titre pour les esprits méthodiques.", price: 80, emoji: "🧭", accent: "#0ea5e9" },
  { id: "title-bac-ace", category: "title", title: "As du BAC", description: "Le titre des futurs bacheliers d’exception.", price: 80, emoji: "🏆", accent: "#eab308" },
  { id: "title-scholar", category: "title", title: "Érudit·e", description: "Pour la soif de savoir.", price: 80, emoji: "🦉", accent: "#a855f7" },
];
