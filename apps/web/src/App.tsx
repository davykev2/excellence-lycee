import { lazy, Suspense } from "react";
import { AuthScreen } from "./features/auth/AuthScreen";
import { useAuth } from "./features/auth/AuthProvider";

const LearningApp = lazy(() =>
  import("./LearningApp").then((module) => ({ default: module.LearningApp })),
);

const previewParams = new URLSearchParams(window.location.search);
const hasDevelopmentPreview = import.meta.env.DEV && [
  "__paths-preview",
  "__admin-content-preview",
  "__arena-exercise-editor-preview",
  "__duel-preview",
  "__bac-exam-preview",
].some((parameter) => previewParams.has(parameter));

const learningFallback = (
  <main className="session-loading" role="status">
    <span className="session-loading-mark" />
    Chargement de ton espace Excellence…
  </main>
);

export function App() {
  const { user, loading } = useAuth();

  if (hasDevelopmentPreview) {
    return <Suspense fallback={learningFallback}><LearningApp /></Suspense>;
  }
  if (loading) {
    return <main className="session-loading" role="status"><span className="session-loading-mark" />Préparation de ton espace…</main>;
  }
  if (!user) return <AuthScreen />;
  return <Suspense fallback={learningFallback}><LearningApp user={user} /></Suspense>;
}
