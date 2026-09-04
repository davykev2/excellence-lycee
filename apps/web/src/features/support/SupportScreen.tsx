import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CircleNotch,
  Coffee,
  HandHeart,
  LockKey,
  ShieldCheck,
  WarningCircle,
  WaveSine,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import logoExcellence from "../../assets/logo-excellence-officiel.png";
import { apiRequest, describeApiFailure } from "../../lib/api";

const fallbackSuggestedAmounts = [500, 1_000, 2_000, 5_000] as const;
const checkoutRequestStorageKey = "excellence-donation-checkout-request";
const fallbackMinimumAmountXof = 100;
const fallbackMaximumAmountXof = 1_000_000;

type SupportPhase = "form" | "checking" | "pending" | "paid" | "failed" | "expired" | "verification-error";

interface CheckoutResponse {
  reference: string;
  waveLaunchUrl: string;
}

interface DonationStatusResponse {
  status: "pending" | "paid" | "failed" | "expired";
  amountXof?: number;
}

interface DonationConfigResponse {
  available: boolean;
  currency: "XOF";
  suggestedAmounts: number[];
  minAmount: number;
  maxAmount: number;
}

interface StoredCheckoutRequest {
  amountXof: number;
  createdAt: number;
  requestId: string;
}

function formatXof(amount: number) {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} F CFA`;
}

function readStoredRequest(amountXof: number): StoredCheckoutRequest | null {
  try {
    const raw = window.sessionStorage.getItem(checkoutRequestStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredCheckoutRequest>;
    const isFresh = typeof parsed.createdAt === "number" && Date.now() - parsed.createdAt < 10 * 60 * 1_000;
    if (parsed.amountXof !== amountXof || typeof parsed.requestId !== "string" || !isFresh) return null;
    return parsed as StoredCheckoutRequest;
  } catch {
    return null;
  }
}

function checkoutRequestFor(amountXof: number) {
  const existing = readStoredRequest(amountXof);
  if (existing) return existing;
  const request = { amountXof, createdAt: Date.now(), requestId: crypto.randomUUID() };
  try {
    window.sessionStorage.setItem(checkoutRequestStorageKey, JSON.stringify(request));
  } catch {
    // Le serveur conserve aussi l'idempotence lorsque le stockage du navigateur est indisponible.
  }
  return request;
}

function clearStoredRequest() {
  try {
    window.sessionStorage.removeItem(checkoutRequestStorageKey);
  } catch {
    // Aucun blocage utilisateur si le stockage de session est indisponible.
  }
}

function returnHome() {
  window.location.assign("/");
}

export default function SupportScreen() {
  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const reference = search.get("reference")?.trim() ?? "";
  const [phase, setPhase] = useState<SupportPhase>(reference ? "checking" : "form");
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(1_000);
  const [customAmount, setCustomAmount] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const [verificationRound, setVerificationRound] = useState(0);
  const [configuration, setConfiguration] = useState<DonationConfigResponse | null>(null);
  const [configurationError, setConfigurationError] = useState<string | null>(null);
  const [configurationRound, setConfigurationRound] = useState(0);
  const customInputRef = useRef<HTMLInputElement>(null);

  const displayedAmounts = configuration?.suggestedAmounts.length
    ? configuration.suggestedAmounts
    : [...fallbackSuggestedAmounts];
  const minimumAmountXof = configuration?.minAmount ?? fallbackMinimumAmountXof;
  const maximumAmountXof = configuration?.maxAmount ?? fallbackMaximumAmountXof;
  const amountXof = selectedAmount === "custom" ? Number(customAmount) : selectedAmount;

  useEffect(() => {
    const controller = new AbortController();
    setConfigurationError(null);
    void apiRequest<DonationConfigResponse>(
      "/donations/config",
      { signal: controller.signal, timeoutMs: 12_000 },
      false,
    ).then((result) => {
      setConfiguration(result);
      if (
        selectedAmount !== "custom"
        && result.suggestedAmounts.length
        && !result.suggestedAmounts.includes(selectedAmount)
      ) {
        setSelectedAmount(result.suggestedAmounts[0]);
      }
    }).catch((reason) => {
      if (controller.signal.aborted) return;
      const failure = describeApiFailure(reason, "Nous ne pouvons pas vérifier la disponibilité de Wave pour le moment.");
      setConfigurationError(failure.message);
    });
    return () => controller.abort();
  }, [configurationRound]);

  useEffect(() => {
    if (selectedAmount === "custom") customInputRef.current?.focus();
  }, [selectedAmount]);

  useEffect(() => {
    if (!reference || !configuration?.available) return;
    const controller = new AbortController();
    let retryTimer: number | undefined;
    let attempt = 0;

    const verify = async () => {
      if (attempt === 0) {
        setPhase("checking");
        setVerificationError(null);
      }
      attempt += 1;
      try {
        const result = await apiRequest<DonationStatusResponse>(
          `/donations/${encodeURIComponent(reference)}/status`,
          { signal: controller.signal, timeoutMs: 15_000 },
          false,
        );
        if (typeof result.amountXof === "number") setConfirmedAmount(result.amountXof);
        if (result.status === "paid") {
          clearStoredRequest();
          setPhase("paid");
          return;
        }
        if (result.status === "failed" || result.status === "expired") {
          clearStoredRequest();
          setPhase(result.status);
          return;
        }
        setPhase("pending");
        if (attempt < 10) retryTimer = window.setTimeout(() => void verify(), 3_000);
      } catch (reason) {
        if (controller.signal.aborted) return;
        const failure = describeApiFailure(reason, "Nous ne pouvons pas encore vérifier cette contribution.");
        setVerificationError(failure.message);
        setPhase("verification-error");
      }
    };

    void verify();
    return () => {
      controller.abort();
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [configuration?.available, reference, verificationRound]);

  const chooseAmount = (amount: number | "custom") => {
    setSelectedAmount(amount);
    setFormError(null);
  };

  const startCheckout = async () => {
    if (checkoutBusy) return;
    if (!configuration?.available) {
      setFormError("La connexion au compte marchand Wave est encore en préparation.");
      return;
    }
    if (!Number.isInteger(amountXof) || amountXof < minimumAmountXof || amountXof > maximumAmountXof) {
      setFormError(`Choisis un montant entier entre ${formatXof(minimumAmountXof)} et ${formatXof(maximumAmountXof)}.`);
      return;
    }
    setCheckoutBusy(true);
    setFormError(null);
    const checkoutRequest = checkoutRequestFor(amountXof);
    try {
      const result = await apiRequest<CheckoutResponse>(
        "/donations/checkout",
        {
          method: "POST",
          body: JSON.stringify({ requestId: checkoutRequest.requestId, amountXof }),
          timeoutMs: 20_000,
        },
        false,
      );
      if (!result.reference || !result.waveLaunchUrl) throw new Error("La session Wave reçue est incomplète.");
      const launchUrl = new URL(result.waveLaunchUrl);
      if (launchUrl.origin !== "https://pay.wave.com") {
        throw new Error("L’adresse de paiement reçue n’est pas une adresse Wave officielle.");
      }
      window.location.assign(launchUrl.toString());
    } catch (reason) {
      const failure = describeApiFailure(reason, reason instanceof Error ? reason.message : "Le paiement Wave n’a pas pu être préparé.");
      setFormError(failure.message);
      setCheckoutBusy(false);
    }
  };

  const restart = () => {
    clearStoredRequest();
    window.location.replace("/soutenir");
  };

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
        <span className="support-secure-label"><LockKey size={18} weight="duotone" aria-hidden="true" /> Paiement sécurisé</span>
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

        <section className="support-panel" aria-live="polite">
          {!configuration && !configurationError ? (
            <div className="support-status support-status--checking" role="status">
              <CircleNotch className="support-spinner" size={48} aria-hidden="true" />
              <p className="support-eyebrow">Connexion sécurisée</p>
              <h2>Vérification de Wave…</h2>
              <p>Nous vérifions que le compte marchand est prêt avant de te proposer un paiement.</p>
            </div>
          ) : configurationError ? (
            <div className="support-status support-status--verification-error" role="alert">
              <WarningCircle size={52} weight="duotone" aria-hidden="true" />
              <p className="support-eyebrow">Service momentanément indisponible</p>
              <h2>Wave ne peut pas être vérifié</h2>
              <p>{configurationError}</p>
              <div className="support-status__actions">
                <button className="primary-action is-compact" type="button" onClick={() => setConfigurationRound((current) => current + 1)}>
                  Réessayer
                </button>
                <button className="secondary-action" type="button" onClick={returnHome}>Retour à Excellence</button>
              </div>
            </div>
          ) : configuration && !configuration.available ? (
            <div className="support-status support-status--unavailable" role="status">
              <Coffee size={52} weight="duotone" aria-hidden="true" />
              <p className="support-eyebrow">Bientôt disponible</p>
              <h2>Connexion Wave en préparation</h2>
              <p>Le compte marchand n’est pas encore prêt à recevoir les contributions. Reviens bientôt : aucun paiement ne peut être lancé pour le moment.</p>
              <div className="support-status__actions">
                <button className="primary-action is-compact" type="button" onClick={() => setConfigurationRound((current) => current + 1)}>
                  Vérifier à nouveau
                </button>
                <button className="secondary-action" type="button" onClick={returnHome}>Retour à Excellence</button>
              </div>
            </div>
          ) : phase === "form" ? (
            <form onSubmit={(event) => { event.preventDefault(); void startCheckout(); }}>
              <div className="support-panel__heading">
                <span aria-hidden="true"><HandHeart size={27} weight="duotone" /></span>
                <div><p>Montant du soutien</p><h2>Choisis librement</h2></div>
              </div>

              <fieldset className="support-amount-fieldset">
                <legend>Montant en francs CFA</legend>
                <div className="support-amount-grid">
                  {displayedAmounts.map((amount) => (
                    <button
                      className={selectedAmount === amount ? "is-selected" : ""}
                      type="button"
                      key={amount}
                      aria-pressed={selectedAmount === amount}
                      onClick={() => chooseAmount(amount)}
                    >
                      {formatXof(amount)}
                    </button>
                  ))}
                  <button
                    className={selectedAmount === "custom" ? "is-selected" : ""}
                    type="button"
                    aria-pressed={selectedAmount === "custom"}
                    onClick={() => chooseAmount("custom")}
                  >
                    Autre montant
                  </button>
                </div>
              </fieldset>

              {selectedAmount === "custom" && (
                <label className="support-custom-amount">
                  <span>Ton montant</span>
                  <span className="support-custom-amount__control">
                    <input
                      ref={customInputRef}
                      type="number"
                      min={minimumAmountXof}
                      max={maximumAmountXof}
                      step="1"
                      inputMode="numeric"
                      value={customAmount}
                      onChange={(event) => { setCustomAmount(event.target.value); setFormError(null); }}
                      aria-describedby="support-amount-help"
                      aria-invalid={Boolean(formError)}
                    />
                    <strong>F CFA</strong>
                  </span>
                </label>
              )}

              <p id="support-amount-help" className="support-form-help">
                Montant libre de {formatXof(minimumAmountXof)} à {formatXof(maximumAmountXof)}.
              </p>
              {formError && <p className="support-form-error" role="alert"><WarningCircle size={19} weight="fill" aria-hidden="true" />{formError}</p>}

              <div className="support-consent-note">
                <ShieldCheck size={23} weight="duotone" aria-hidden="true" />
                <p><strong>Contribution volontaire.</strong> Si tu es mineur, demande l’accord d’un parent avant de continuer.</p>
              </div>

              <button className="primary-action support-submit" type="submit" disabled={checkoutBusy}>
                {checkoutBusy ? <CircleNotch className="support-spinner" size={24} aria-hidden="true" /> : <WaveSine size={24} weight="bold" aria-hidden="true" />}
                <span>
                  {checkoutBusy
                    ? "Préparation de Wave…"
                    : Number.isInteger(amountXof) && amountXof > 0
                      ? `Continuer avec Wave · ${formatXof(amountXof)}`
                      : "Continuer avec Wave"}
                </span>
                {!checkoutBusy && <ArrowRight size={22} weight="bold" aria-hidden="true" />}
              </button>
              <p className="support-redirect-note">Tu vas être redirigé vers la page officielle Wave pour confirmer le paiement.</p>
            </form>
          ) : (
            <div className={`support-status support-status--${phase}`}>
              {(phase === "checking" || phase === "pending") && <CircleNotch className="support-spinner" size={48} aria-hidden="true" />}
              {phase === "paid" && <CheckCircle size={52} weight="fill" aria-hidden="true" />}
              {(phase === "failed" || phase === "expired" || phase === "verification-error") && <WarningCircle size={52} weight="duotone" aria-hidden="true" />}
              <p className="support-eyebrow">État de la contribution</p>
              <h2>
                {phase === "checking" ? "Vérification du paiement…" :
                  phase === "pending" ? "Confirmation Wave en attente" :
                    phase === "paid" ? "Merci pour ton soutien !" :
                      phase === "expired" ? "Cette session a expiré" :
                        phase === "failed" ? "Le paiement n’a pas abouti" : "Vérification momentanément impossible"}
              </h2>
              <p>
                {phase === "checking" ? "Nous interrogeons le serveur sécurisé. Cette page ne se fie jamais au simple lien de retour." :
                  phase === "pending" ? "Wave traite encore la confirmation. Nous réessayons automatiquement pendant quelques instants." :
                    phase === "paid" ? `${confirmedAmount ? `${formatXof(confirmedAmount)} · ` : ""}Ta contribution a bien été confirmée par Wave.` :
                      phase === "expired" ? "Aucun paiement confirmé n’a été enregistré pour cette session." :
                        phase === "failed" ? "Aucun paiement confirmé n’a été enregistré. Tu peux réessayer sans risque de perdre un don validé." : verificationError}
              </p>
              {reference && <small className="support-reference">Référence : {reference}</small>}
              <div className="support-status__actions">
                {(phase === "pending" || phase === "verification-error") && (
                  <button className="primary-action is-compact" type="button" onClick={() => setVerificationRound((current) => current + 1)}>
                    Vérifier maintenant
                  </button>
                )}
                {(phase === "failed" || phase === "expired") && (
                  <button className="primary-action is-compact" type="button" onClick={restart}>Faire une nouvelle contribution</button>
                )}
                <button className="secondary-action" type="button" onClick={returnHome}>Retour à Excellence</button>
              </div>
            </div>
          )}
        </section>
      </section>

      <footer className="support-footer">
        <span>Excellence Lycée · Programme ivoirien</span>
        <span>La contribution ne remplace aucun paiement scolaire et ne donne aucun avantage pédagogique.</span>
      </footer>
    </main>
  );
}
