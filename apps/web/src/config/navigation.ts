import type { NavigationId, NavigationItem } from "../domain/learning";

export const navigationItems: NavigationItem[] = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "paths", label: "Mes cours", icon: "paths" },
  { id: "arena", label: "M’entraîner", mobileLabel: "Entraînement", icon: "arena" },
  { id: "space", label: "Mon espace", icon: "profile" },
  { id: "store", label: "Boutique", mobileLabel: "Boutique", icon: "store" },
  { id: "ranking", label: "Classement", mobileLabel: "Rang", icon: "ranking" },
  { id: "messages", label: "Messages", icon: "messages" },
  { id: "profile", label: "Profil", icon: "profile" },
  { id: "admin", label: "Admin", icon: "admin" },
];

export const primaryNavigationItems = navigationItems.filter((item) =>
  ["home", "paths", "arena", "space"].includes(item.id),
);

/** Historical destinations keep their URLs and belong to the personal space. */
export function primaryNavigationFor(id: NavigationId): NavigationId {
  return ["store", "ranking", "messages", "profile"].includes(id) ? "space" : id;
}
