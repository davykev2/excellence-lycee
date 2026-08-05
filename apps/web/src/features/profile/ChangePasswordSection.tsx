import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, Eye, EyeSlash, LockKey, ShieldCheck } from "@phosphor-icons/react";
import { ApiError, apiRequest } from "../../lib/api";

// Changer son mot de passe en étant connecté. Le flux « mot de passe oublié »
// (pour quelqu'un qui ne peut plus se connecter) vit dans AuthScreen.
export function ChangePasswordSection({ onPasswordChanged }: { onPasswordChanged: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmation) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }
    if (password === currentPassword) {
      setError("Le nouveau mot de passe doit être différent de l’actuel.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest<{ message: string }>("/auth/password/change", {
        method: "POST",
        body: JSON.stringify({ currentPassword, password }),
      });
      setCurrentPassword("");
      setPassword("");
      setConfirmation("");
      setDone(true);
      // Toutes les sessions ont été révoquées : on repasse par la connexion.
      window.setTimeout(onPasswordChanged, 2500);
    } catch (submitError) {
      setError(submitError instanceof ApiError
        ? submitError.message
        : "La modification n’a pas pu aboutir. Réessaie dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <article className="profile-level-editor">
        <div className="profile-section-heading">
          <ShieldCheck size={28} weight="duotone" />
          <div>
            <p className="path-kicker">Sécurité</p>
            <h2>Mot de passe modifié</h2>
            <p>Pour ta sécurité, toutes tes sessions ont été fermées. Reconnecte-toi avec ton nouveau mot de passe.</p>
          </div>
        </div>
        <p className="profile-photo-feedback is-success" role="status">
          <CheckCircle size={19} weight="fill" /> Redirection vers la connexion…
        </p>
      </article>
    );
  }

  return (
    <article className="profile-level-editor">
      <div className="profile-section-heading">
        <ShieldCheck size={28} weight="duotone" />
        <div>
          <p className="path-kicker">Sécurité</p>
          <h2>Changer mon mot de passe</h2>
          <p>Choisis au moins 10 caractères, avec une majuscule, une minuscule et un chiffre.</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <label>
          <span>Mot de passe actuel</span>
          <span className="auth-password-field">
            <LockKey size={19} />
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Ton mot de passe actuel"
            />
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </span>
        </label>

        <label>
          <span>Nouveau mot de passe</span>
          <span className="auth-password-field">
            <LockKey size={19} />
            <input
              required
              minLength={10}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="10 caractères, majuscule et chiffre"
            />
          </span>
        </label>

        <label>
          <span>Confirme le nouveau mot de passe</span>
          <span className="auth-password-field">
            <LockKey size={19} />
            <input
              required
              minLength={10}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="Retape exactement le même mot de passe"
            />
          </span>
        </label>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="primary-action auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Modification…" : "Enregistrer mon nouveau mot de passe"}
          <ArrowRight size={22} weight="bold" />
        </button>
      </form>
    </article>
  );
}
