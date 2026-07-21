import type { NavigationItem } from "../domain/learning";

export const navigationItems: NavigationItem[] = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "paths", label: "Parcours", icon: "paths" },
  { id: "arena", label: "Arène", icon: "arena" },
  { id: "ranking", label: "Classement", mobileLabel: "Rang", icon: "ranking" },
  { id: "messages", label: "Messages", icon: "messages" },
  { id: "profile", label: "Profil", icon: "profile" },
  { id: "admin", label: "Admin", icon: "admin" },
];
