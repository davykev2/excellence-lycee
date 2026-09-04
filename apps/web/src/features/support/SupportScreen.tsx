import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Coffee,
  HandHeart,
  LockKey,
  ShieldCheck,
  WaveSine,
} from "@phosphor-icons/react";
import logoExcellence from "../../assets/logo-excellence-officiel.png";

const waveMerchantPaymentUrl = "https://pay.wave.com/m/M_ci_M4N-baBQdy32/c/ci/";

function returnHome() {
  window.location.assign("/");
}

export default function SupportScreen() {
  return (
    <main className="support-page">
      <header className="support-header">
        <button type="button" onClick={returnHome} className="support-back-button">
          <ArrowLeft size={19} weight="bold" aria-hidden="true" />
          Retour à Excellence
        </button>
        <a className="support-brand" href="/" aria-label="Accueil Excellence Lycée">
          <img src={logoExcellence} alt="" />
          <span><strong>Excellence</strong><small>Lycée</small></span>
        </a>
        <span className="support-secure-label"><LockKey size={18} weight="duotone" aria-hidden="true" /> Paiement sur Wave</span>
      </header>

      <section className="support-layout">
        <aside className="support-story" aria-labelledby="support-page-title">
          <span className="support-story__icon" aria-hidden="true"><Coffee size={34} weight="duotone" /></span>
          <p className="support-eyebrow">Soutenir le projet</p>
          <h1 id="support-page-title">Un café peut faire grandir une leçon.</h1>
          <p>Ta contribution nous aide à financer l’hébergement, les outils pédagogiques et la création de nouveaux cours pour les lycéens.</p>
          <ul>
            <li><CheckCircle size={20} weight="fill" aria-hidden="true" /> Une contribution entièrement facultative</li>
            <li><CheckCircle size={20} weight="fill" aria-hidden="true" /> Aucun contenu, XP ou classement n’en dépend</li>
            <li><CheckCircle size={20} weight="fill" aria-hidden="true" /> Un paiement traité sur la page officielle Wave</li>
          </ul>
        </aside>

        <section className="support-panel" aria-labelledby="support-payment-title">
          <div className="support-panel__heading">
            <span aria-hidden="true"><HandHeart size={27} weight="duotone" /></span>
            <div>
              <p>Lien marchand officiel</p>
              <h2 id="support-payment-title">Choisis ton montant dans Wave</h2>
            </div>
          </div>

          <ol className="support-payment-steps" aria-label="Étapes du soutien">
            <li>
              <span aria-hidden="true">1</span>
              <div><strong>Ouvre Wave</strong><small>Le bouton lance le lien marchand officiel d’Excellence.</small></div>
            </li>
            <li>
              <span aria-hidden="true">2</span>
              <div><strong>Saisis librement le montant</strong><small>Tu choisis et confirmes le montant directement sur Wave.</small></div>
            </li>
            <li>
              <span aria-hidden="true">3</span>
              <div><strong>Vérifie avant de payer</strong><small>Contrôle le destinataire et le montant dans Wave, puis conserve ton reçu.</small></div>
            </li>
          </ol>

          <div className="support-consent-note">
            <ShieldCheck size={23} weight="duotone" aria-hidden="true" />
            <p><strong>Contribution volontaire.</strong> Si tu es mineur, demande l’accord d’un parent avant de continuer.</p>
          </div>

          <a
            className="primary-action support-submit support-merchant-action"
            href={waveMerchantPaymentUrl}
            referrerPolicy="no-referrer"
          >
            <WaveSine size={24} weight="bold" aria-hidden="true" />
            <span>Ouvrir le paiement Wave</span>
            <ArrowRight size={22} weight="bold" aria-hidden="true" />
          </a>
          <p className="support-redirect-note">Après le paiement, utilise le bouton Retour de ton navigateur pour revenir à Excellence.</p>

          <div className="support-payment-notice">
            <LockKey size={20} weight="duotone" aria-hidden="true" />
            <p>Excellence ne demande jamais ton code secret Wave. Avec ce lien marchand, seul le reçu affiché par Wave confirme le paiement.</p>
          </div>
        </section>
      </section>

      <footer className="support-footer">
        <span>Excellence Lycée · Programme ivoirien</span>
        <span>La contribution ne remplace aucun paiement scolaire et ne donne aucun avantage pédagogique.</span>
      </footer>
    </main>
  );
}
