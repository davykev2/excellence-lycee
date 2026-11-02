import { ChatCircleDots, ShieldCheck } from "@phosphor-icons/react";
import type { NavigationId } from "../../domain/learning";
import { primaryNavigationFor, primaryNavigationItems } from "../../config/navigation";
import { AppIcon } from "../../ui/AppIcon";
import officialLogo from "../../assets/logo-excellence-officiel.png";

interface MobileNavigationProps {
  activeItem: NavigationId;
  onNavigate: (id: NavigationId) => void;
  unreadMessages?: number;
}

export function MobileHeader({ unreadMessages = 0, onOpenMessages, onOpenAdmin }: { unreadMessages?: number; onOpenMessages: () => void; onOpenAdmin?: () => void }) {
  return (
    <header className="mobile-header">
      <span className="mobile-logo-crop">
        <img src={officialLogo} alt="Logo officiel Excellence" />
      </span>
      <span>Excellence Lycée</span>
      <div className="mobile-header-actions">
        {onOpenAdmin && <button type="button" aria-label="Administration" onClick={onOpenAdmin}><ShieldCheck size={22} /></button>}
        <button type="button" aria-label={unreadMessages ? `Messages, ${unreadMessages} non lus` : "Messages"} onClick={onOpenMessages}>
          <ChatCircleDots size={23} />
          {unreadMessages > 0 && <b>{Math.min(unreadMessages, 99)}</b>}
        </button>
      </div>
    </header>
  );
}

export function MobileNavigation({ activeItem, onNavigate, unreadMessages = 0 }: MobileNavigationProps) {
  const primaryItem = primaryNavigationFor(activeItem);
  return (
    <nav className="mobile-navigation" aria-label="Navigation principale mobile">
      {primaryNavigationItems.map((item) => (
        <button
          key={item.id}
          type="button"
          data-tour-id={`nav-${item.id}`}
          aria-label={item.label}
          className={primaryItem === item.id ? "is-active" : ""}
          aria-current={primaryItem === item.id ? "page" : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <AppIcon name={item.icon} size={23} weight={primaryItem === item.id ? "fill" : "regular"} />
          <span>{item.mobileLabel ?? item.label}</span>
          {item.id === "space" && unreadMessages > 0 && <b className="navigation-unread is-mobile" aria-hidden="true">{Math.min(unreadMessages, 99)}</b>}
        </button>
      ))}
    </nav>
  );
}
