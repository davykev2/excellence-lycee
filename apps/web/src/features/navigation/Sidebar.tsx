import { Coins } from "@phosphor-icons/react";
import type { NavigationId } from "../../domain/learning";
import { navigationItems } from "../../config/navigation";
import { AppIcon } from "../../ui/AppIcon";
import officialLogo from "../../assets/logo-excellence-officiel.png";
import sidebarDecoration from "../../assets/sidebar-math-decoration.png";

interface SidebarProps {
  activeItem: NavigationId;
  onNavigate: (id: NavigationId) => void;
  canAccessAdmin?: boolean;
  unreadMessages?: number;
  goldBalance?: number | null;
}

export function Sidebar({ activeItem, onNavigate, canAccessAdmin = false, unreadMessages = 0, goldBalance = null }: SidebarProps) {
  const renderNavigationItem = (item: (typeof navigationItems)[number]) => (
    <button
      className={`nav-item ${item.id === "admin" ? "is-admin-item" : ""} ${activeItem === item.id ? "is-active" : ""}`}
      key={item.id}
      type="button"
      data-tour-id={`nav-${item.id}`}
      aria-current={activeItem === item.id ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <AppIcon name={item.icon} size={28} weight={activeItem === item.id ? "duotone" : "regular"} />
      <span>{item.label}</span>
      {item.id === "messages" && unreadMessages > 0 && <b className="navigation-unread" aria-label={`${unreadMessages} message${unreadMessages > 1 ? "s" : ""} non lu${unreadMessages > 1 ? "s" : ""}`}>{Math.min(unreadMessages, 99)}</b>}
    </button>
  );
  const adminItem = navigationItems.find((item) => item.id === "admin");

  return (
    <aside className="sidebar" aria-label="Navigation principale">
      <div className="brand-lockup">
        <span className="brand-logo-crop">
          <img className="brand-logo" src={officialLogo} alt="Logo officiel Excellence" />
        </span>
        <span className="brand-name">Excellence<br />Lycée</span>
      </div>

      <button
        className={`sidebar-wallet${activeItem === "store" ? " is-active" : ""}`}
        type="button"
        aria-label={`Solde : ${goldBalance ?? 0} or. Ouvrir la boutique.`}
        onClick={() => onNavigate("store")}
      >
        <Coins size={22} weight="fill" />
        <strong>{goldBalance === null ? "…" : goldBalance.toLocaleString("fr-FR")}</strong>
        <span>or</span>
      </button>

      <nav className="sidebar-nav" aria-label="Sections principales">
        {navigationItems.filter((item) => item.id !== "admin").map(renderNavigationItem)}
      </nav>

      {canAccessAdmin && adminItem && (
        <nav className="sidebar-admin-nav" aria-label="Administration">
          {renderNavigationItem(adminItem)}
        </nav>
      )}

      <img className="sidebar-decoration" src={sidebarDecoration} alt="" aria-hidden="true" />
    </aside>
  );
}
