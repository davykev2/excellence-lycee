import type { NavigationId } from "../../domain/learning";
import { navigationItems, primaryNavigationFor, primaryNavigationItems } from "../../config/navigation";
import { AppIcon } from "../../ui/AppIcon";
import officialLogo from "../../assets/logo-excellence-officiel.png";
import sidebarDecoration from "../../assets/sidebar-math-decoration.png";

interface SidebarProps {
  activeItem: NavigationId;
  onNavigate: (id: NavigationId) => void;
  canAccessAdmin?: boolean;
  unreadMessages?: number;
}

export function Sidebar({ activeItem, onNavigate, canAccessAdmin = false, unreadMessages = 0 }: SidebarProps) {
  const primaryItem = primaryNavigationFor(activeItem);
  const renderNavigationItem = (item: (typeof navigationItems)[number]) => (
    <button
      className={`nav-item ${item.id === "admin" ? "is-admin-item" : ""} ${primaryItem === item.id ? "is-active" : ""}`}
      key={item.id}
      type="button"
      data-tour-id={`nav-${item.id}`}
      aria-current={primaryItem === item.id ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <AppIcon name={item.icon} size={26} weight={primaryItem === item.id ? "duotone" : "regular"} />
      <span>{item.label}</span>
      {item.id === "space" && unreadMessages > 0 && <b className="navigation-unread" aria-label={`${unreadMessages} message${unreadMessages > 1 ? "s" : ""} non lu${unreadMessages > 1 ? "s" : ""}`}>{Math.min(unreadMessages, 99)}</b>}
    </button>
  );
  const adminItem = navigationItems.find((item) => item.id === "admin");

  return (
    <aside className="sidebar" aria-label="Navigation principale">
      {activeItem === "home" && <div className="brand-lockup">
        <span className="brand-logo-crop">
          <img className="brand-logo" src={officialLogo} alt="Logo officiel Excellence" />
        </span>
        <span className="brand-name">Excellence<br />Lycée</span>
      </div>}

      <nav className="sidebar-nav" aria-label="Sections principales">
        {primaryNavigationItems.map(renderNavigationItem)}
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
