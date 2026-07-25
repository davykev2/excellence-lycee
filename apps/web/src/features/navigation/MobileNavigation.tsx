import { Coins } from "@phosphor-icons/react";
import type { NavigationId } from "../../domain/learning";
import { navigationItems } from "../../config/navigation";
import { AppIcon } from "../../ui/AppIcon";
import officialLogo from "../../assets/logo-excellence-officiel.png";

interface MobileNavigationProps {
  activeItem: NavigationId;
  onNavigate: (id: NavigationId) => void;
  canAccessAdmin?: boolean;
  unreadMessages?: number;
}

export function MobileHeader({ goldBalance = null, onOpenStore }: { goldBalance?: number | null; onOpenStore?: () => void }) {
  return (
    <header className="mobile-header">
      <span className="mobile-logo-crop">
        <img src={officialLogo} alt="Logo officiel Excellence" />
      </span>
      <span>Excellence Lycée</span>
      <button className="mobile-wallet" type="button" aria-label={`Solde : ${goldBalance ?? 0} or. Ouvrir la boutique.`} onClick={onOpenStore}>
        <Coins size={18} weight="fill" />
        <strong>{goldBalance === null ? "…" : goldBalance.toLocaleString("fr-FR")}</strong>
      </button>
    </header>
  );
}

export function MobileNavigation({ activeItem, onNavigate, canAccessAdmin = false, unreadMessages = 0 }: MobileNavigationProps) {
  return (
    <nav className="mobile-navigation" aria-label="Navigation principale mobile">
      {navigationItems.filter((item) => item.id !== "admin" || canAccessAdmin).map((item) => (
        <button
          key={item.id}
          type="button"
          data-tour-id={`nav-${item.id}`}
          aria-label={item.label}
          className={activeItem === item.id ? "is-active" : ""}
          aria-current={activeItem === item.id ? "page" : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <AppIcon name={item.icon} size={23} weight={activeItem === item.id ? "fill" : "regular"} />
          <span>{item.mobileLabel ?? item.label}</span>
          {item.id === "messages" && unreadMessages > 0 && <b className="navigation-unread is-mobile" aria-hidden="true">{Math.min(unreadMessages, 99)}</b>}
        </button>
      ))}
    </nav>
  );
}
