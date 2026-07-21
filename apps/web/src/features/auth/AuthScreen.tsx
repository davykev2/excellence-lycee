import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChalkboardTeacher,
  CheckCircle,
  Eye,
  EyeSlash,
  EnvelopeSimpleOpen,
  GraduationCap,
  LockKey,
  ShieldCheck,
  SignIn,
  Sparkle,
  UserPlus,
  UsersThree,
} from "@phosphor-icons/react";
import type { SchoolLevel } from "../../domain/learning";
import type { AccountType } from "../../domain/auth";
import { schoolLevels } from "../../data/programme";
import { ApiError } from "../../lib/api";
import { CompanionAvatar, type CompanionMotion } from "../companion/CompanionAvatar";
import { useAuth } from "./AuthProvider";
import officialLogo from "../../assets/logo-excellence-officiel.png";

type AuthMode = "login" | "register";
type OnboardingStep = "welcome" | "access" | "form" | "confirmation";

const stageLabels: Record<SchoolLevel["stage"], string> = {
  seconde: "Seconde",
  premiere: "Première",
  terminale: "Terminale",
};

const accountChoices = [
  {
    id: "student" as const,
    title: "Élève",
    shortLabel: "élève",
    description: "Je veux apprendre, m’entraîner et progresser.",
    Icon: GraduationCap,
  },
  {
    id: "parent" as const,
    title: "Parent",
    shortLabel: "parent",
    description: "Je souhaite accompagner la progression d’un élève.",
    Icon: UsersThree,
  },
  {
    id: "teacher" as const,
    title: "Enseignant",
    shortLabel: "enseignant",
    description: "Je veux suivre le programme et guider mes élèves.",
    Icon: ChalkboardTeacher,
  },
];

export function AuthScreen() {
  const { login, register } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [mode, setMode] = useState<AuthMode>("register");
  const [motion, setMotion] = useState<CompanionMotion>("wave");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<SchoolLevel["stage"]>("seconde");
  const [levelId, setLevelId] = useState("seconde-c");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  const series = useMemo(() => schoolLevels.filter((level) => level.stage === stage), [stage]);
  const selectedChoice = accountChoices.find((choice) => choice.id === accountType);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion("idle");
      return;
    }
    const timeout = window.setTimeout(() => setMotion("idle"), 1250);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const chooseAccountType = (nextAccountType: AccountType) => {
    setAccountType(nextAccountType);
    setStep("access");
    setError(null);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion("celebrate");
      window.setTimeout(() => setMotion("idle"), 1100);
    }
  };

  const chooseMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("form");
    setError(null);
  };

  const chooseStage = (nextStage: SchoolLevel["stage"]) => {
    setStage(nextStage);
    const candidates = schoolLevels.filter((level) => level.stage === nextStage);
    const currentSeries = schoolLevels.find((level) => level.id === levelId)?.series;
    setLevelId((candidates.find((level) => level.series === currentSeries) ?? candidates[0]).id);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accountType) return;
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") await login({ email, password });
      else {
        const result = await register({ name, email, password, levelId, accountType });
        if (result.emailConfirmationRequired) {
          setConfirmationEmail(result.email ?? email);
          setMotion("celebrate");
          setStep("confirmation");
        }
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Le serveur est momentanément indisponible.");
    } finally {
      setSubmitting(false);
    }
  };

  const registrationLevelLabel = accountType === "student"
    ? "Ton niveau"
    : accountType === "parent"
      ? "Niveau de l’élève accompagné"
      : "Niveau principal enseigné";

  return (
    <main className={`onboarding-page onboarding-page--${step}`} data-onboarding-step={step}>
      <header className="onboarding-brand">
        <span><img src={officialLogo} alt="Logo officiel Excellence" /></span>
        <strong>Excellence <b>Lycée</b></strong>
      </header>

      <div className="onboarding-orb onboarding-orb--one" aria-hidden="true" />
      <div className="onboarding-orb onboarding-orb--two" aria-hidden="true" />

      <section className="onboarding-shell" aria-labelledby="onboarding-title">
        <div className="onboarding-davy-stage">
          <span className="onboarding-davy-halo" aria-hidden="true" />
          <CompanionAvatar motion={motion} className="onboarding-davy" />
          <span className="onboarding-davy-name"><Sparkle size={15} weight="fill" /> Davy · ton guide</span>
        </div>

        <div className="onboarding-card">
          <div className="onboarding-progress" aria-label={`Étape ${step === "welcome" ? 1 : step === "access" ? 2 : 3} sur 3`}>
            {["welcome", "access", "form"].map((item, index) => (
              <span key={item} className={(step === "welcome" ? 0 : step === "access" ? 1 : 2) >= index ? "is-active" : ""} />
            ))}
          </div>

          {step === "welcome" && (
            <div className="onboarding-step onboarding-welcome-step">
              <p className="onboarding-kicker"><Sparkle size={16} weight="fill" /> Bienvenue chez Excellence</p>
              <h1 id="onboarding-title">Bonjour, moi c’est Davy&nbsp;!</h1>
              <p className="onboarding-lead">Je serai ton guide sur la plateforme. Pour commencer, dis-moi simplement qui tu es.</p>

              <div className="onboarding-account-grid" role="group" aria-label="Choisis ton profil">
                {accountChoices.map(({ id, title, description, Icon }) => (
                  <button key={id} type="button" onClick={() => chooseAccountType(id)} data-account-type={id}>
                    <span><Icon size={27} weight="duotone" /></span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                    <ArrowRight className="onboarding-choice-arrow" size={18} weight="bold" />
                  </button>
                ))}
              </div>
              <p className="onboarding-reassurance"><ShieldCheck size={17} weight="fill" /> Un espace adapté à chaque profil, en toute sécurité.</p>
            </div>
          )}

          {step === "access" && selectedChoice && (
            <div className="onboarding-step onboarding-access-step">
              <button className="onboarding-back" type="button" onClick={() => { setStep("welcome"); setMotion("wave"); }}>
                <ArrowLeft size={18} weight="bold" /> Changer de profil
              </button>
              <span className="onboarding-selected-profile"><selectedChoice.Icon size={20} weight="duotone" /> Espace {selectedChoice.title}</span>
              <h1 id="onboarding-title">Parfait, bienvenue&nbsp;!</h1>
              <p className="onboarding-lead">As-tu déjà un compte Excellence Lycée&nbsp;?</p>

              <div className="onboarding-access-grid">
                <button type="button" onClick={() => chooseMode("login")} data-auth-mode="login">
                  <span><SignIn size={28} weight="duotone" /></span>
                  <strong>Oui, je me connecte</strong>
                  <small>Retrouver mon espace et reprendre là où je me suis arrêté.</small>
                  <ArrowRight size={20} weight="bold" />
                </button>
                <button type="button" className="is-primary" onClick={() => chooseMode("register")} data-auth-mode="register">
                  <span><UserPlus size={28} weight="duotone" /></span>
                  <strong>Non, je m’inscris</strong>
                  <small>Créer gratuitement mon espace personnalisé.</small>
                  <ArrowRight size={20} weight="bold" />
                </button>
              </div>
              <p className="onboarding-davy-tip"><strong>Davy te conseille :</strong> l’inscription ne prend qu’une minute.</p>
            </div>
          )}

          {step === "form" && selectedChoice && (
            <div className="onboarding-step onboarding-form-step">
              <button className="onboarding-back" type="button" onClick={() => { setStep("access"); setError(null); }}>
                <ArrowLeft size={18} weight="bold" /> Retour
              </button>
              <div className="onboarding-form-heading">
                <span className="onboarding-selected-profile"><selectedChoice.Icon size={20} weight="duotone" /> Espace {selectedChoice.title}</span>
                <h1 id="onboarding-title">{mode === "register" ? "Créons ton espace" : "Heureux de te revoir"}</h1>
                <p>{mode === "register" ? "Quelques informations et ton parcours pourra commencer." : "Connecte-toi pour retrouver ton espace Excellence."}</p>
              </div>

              <div className="auth-mode-tabs" role="tablist" aria-label="Type d’accès">
                <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "is-active" : ""} onClick={() => { setMode("register"); setError(null); }}>Créer un compte</button>
                <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => { setMode("login"); setError(null); }}>Se connecter</button>
              </div>

              <form className="auth-form" onSubmit={submit}>
                {mode === "register" && (
                  <label><span>Prénom et nom</span><input required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Aïcha Kouassi" /></label>
                )}
                <label><span>Adresse e-mail</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tonadresse@exemple.com" /></label>
                <label><span>Mot de passe</span><span className="auth-password-field"><LockKey size={19} /><input required minLength={mode === "register" ? 10 : 1} type={showPassword ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "register" ? "10 caractères, majuscule et chiffre" : "Ton mot de passe"} /><button type="button" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}</button></span></label>

                {mode === "register" && (
                  <fieldset className="auth-school-choice">
                    <legend>{registrationLevelLabel}</legend>
                    <div>{(Object.keys(stageLabels) as SchoolLevel["stage"][]).map((item) => <button type="button" key={item} className={stage === item ? "is-selected" : ""} aria-pressed={stage === item} onClick={() => chooseStage(item)}>{stageLabels[item]}</button>)}</div>
                    <span className="auth-series-label">{accountType === "student" ? "Ta série" : "Série suivie"}</span>
                    <div className="auth-series-choice">{series.map((level) => <button type="button" key={level.id} className={levelId === level.id ? "is-selected" : ""} aria-pressed={levelId === level.id} onClick={() => setLevelId(level.id)}>{level.series}</button>)}</div>
                  </fieldset>
                )}

                {error && <p className="auth-error" role="alert">{error}</p>}
                <button className="primary-action auth-submit" type="submit" disabled={submitting}>{submitting ? "Vérification…" : mode === "register" ? "Créer mon espace" : "Me connecter"}<ArrowRight size={22} weight="bold" /></button>
              </form>
              <p className="auth-trust"><CheckCircle size={17} weight="fill" /> Tes informations restent privées et protégées.</p>
            </div>
          )}

          {step === "confirmation" && selectedChoice && (
            <div className="onboarding-step onboarding-confirmation-step">
              <span className="onboarding-confirmation-icon"><EnvelopeSimpleOpen size={38} weight="duotone" /></span>
              <p className="onboarding-kicker"><CheckCircle size={16} weight="fill" /> Compte presque prêt</p>
              <h1 id="onboarding-title">Vérifie ta boîte mail</h1>
              <p className="onboarding-lead">Supabase a envoyé un lien de confirmation à <strong>{confirmationEmail}</strong>. Clique sur ce lien, puis reviens te connecter.</p>
              <button className="primary-action onboarding-confirmation-action" type="button" onClick={() => { setMode("login"); setStep("form"); setMotion("wave"); }}>
                J’ai confirmé mon e-mail <ArrowRight size={21} weight="bold" />
              </button>
              <p className="onboarding-reassurance"><ShieldCheck size={17} weight="fill" /> Cette vérification protège ton compte et ta progression.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="onboarding-footer">Programme ivoirien · De la Seconde à la Terminale</footer>
    </main>
  );
}
