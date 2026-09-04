import { ArrowRight, Coffee, HandHeart } from "@phosphor-icons/react";

interface SupportCardProps {
  location: "dashboard" | "profile";
  onOpen: () => void;
}

export function SupportCard({ location, onOpen }: SupportCardProps) {
  return (
    <section className={`support-entry-card support-entry-card--${location}`} aria-labelledby={`support-entry-title-${location}`}>
      <span className="support-entry-card__icon" aria-hidden="true">
        {location === "profile" ? <HandHeart size={25} weight="duotone" /> : <Coffee size={25} weight="duotone" />}
      </span>
      <div className="support-entry-card__copy">
        <p>Soutenir le projet</p>
        <h2 id={`support-entry-title-${location}`}>Offrir un café à l’équipe</h2>
        <span>Une contribution libre pour nous aider à héberger la plateforme et créer de nouveaux cours.</span>
      </div>
      <button type="button" onClick={onOpen}>
        <span>Découvrir</span>
        <ArrowRight size={19} weight="bold" aria-hidden="true" />
      </button>
    </section>
  );
}
