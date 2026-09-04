import { lazy, Suspense } from "react";
import { AuthScreen, readPasswordRecoveryState } from "./features/auth/AuthScreen";
import { useAuth } from "./features/auth/AuthProvider";

const LearningApp = lazy(() =>
  import("./LearningApp").then((module) => ({ default: module.LearningApp })),
);

const SupportScreen = lazy(() => import("./features/support/SupportScreen"));

const previewParams = new URLSearchParams(window.location.search);
const hasDevelopmentPreview = import.meta.env.DEV && [
  "__paths-preview",
  "__admin-content-preview",
  "__arena-exercise-editor-preview",
  "__duel-preview",
  "__homework-preview",
  "__bac-exam-preview",
].some((parameter) => previewParams.has(parameter));

const learningFallback = (
  <main className="session-loading" role="status">
    <span className="session-loading-mark" />
    Chargement de ton espace Excellence…
  </main>
);

export function App() {
  const { user, loading, sessionError, retrySession } = useAuth();
  const { hasRecoveryIntent } = readPasswordRecoveryState();
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/soutenir") return <Suspense fallback={learningFallback}><SupportScreen /></Suspense>;
  if (hasRecoveryIntent) return <AuthScreen />;
  if (hasDevelopmentPreview) {
    return <Suspense fallback={learningFallback}><LearningApp /></Suspense>;
  }
  if (loading) {
    return <main className="session-loading" role="status"><span className="session-loading-mark" />Préparation de ton espace…</main>;
  }
  if (sessionError) {
    return (
      <main
        className="session-loading"
        role="alert"
        style={{ flexDirection: "column", padding: 24, textAlign: "center" }}
      >
        <strong>Ta session n’a pas pu être reprise.</strong>
        <span style={{ maxWidth: 560, fontWeight: 600 }}>{sessionError}</span>
        <button className="primary-action is-compact" type="button" onClick={retrySession}>Réessayer</button>
      </main>
    );
  }
  if (!user) return <AuthScreen />;
  return <Suspense fallback={learningFallback}><LearningApp user={user} /></Suspense>;
}
