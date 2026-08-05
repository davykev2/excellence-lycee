import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  failed: boolean;
  incidentId: string | null;
}

function createIncidentId() {
  return `EL-${Date.now().toString(36).toUpperCase()}`;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false, incidentId: null };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true, incidentId: createIncidentId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Le journal reste volontairement local tant qu'aucun fournisseur de suivi
    // d'erreurs n'a été choisi. L'identifiant aide déjà à rapprocher une capture
    // d'écran du message visible dans la console du navigateur.
    console.error("Erreur d'affichage Excellence Lycée", {
      incidentId: this.state.incidentId,
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="app-error-boundary" role="alert">
        <section>
          <span className="app-error-boundary__mark" aria-hidden="true">!</span>
          <p className="app-error-boundary__eyebrow">Davy a détecté un blocage</p>
          <h1>Cette page n’a pas pu s’afficher.</h1>
          <p>Ta progression déjà enregistrée reste protégée. Recharge simplement l’application pour reprendre.</p>
          <div>
            <button type="button" onClick={() => window.location.reload()}>Recharger l’application</button>
            <a href="/">Retour à l’accueil</a>
          </div>
          {this.state.incidentId && <small>Référence : {this.state.incidentId}</small>}
        </section>
      </main>
    );
  }
}
