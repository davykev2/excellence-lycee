import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, LoginInput, RegisterInput } from "../../domain/auth";
import { closeSession, createSession, describeApiFailure, refreshSession } from "../../lib/api";
import { isMissingSessionRefresh } from "./sessionRefreshState";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  sessionError: string | null;
  retrySession(): void;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<{ emailConfirmationRequired: boolean; email?: string }>;
  logout(): Promise<void>;
  updateUser(user: AuthUser): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionAttempt, setSessionAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSessionError(null);
    refreshSession()
      .then((session) => active && setUser(session.user))
      .catch((reason: unknown) => {
        if (!active) return;
        if (isMissingSessionRefresh(reason)) {
          setUser(null);
          return;
        }
        setSessionError(describeApiFailure(
          reason,
          "Impossible de reprendre ta session pour le moment. Vérifie ta connexion puis réessaie.",
        ).message);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [sessionAttempt]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    sessionError,
    retrySession() {
      setSessionAttempt((attempt) => attempt + 1);
    },
    async login(input) {
      const session = await createSession("/auth/login", input);
      if ("emailConfirmationRequired" in session) throw new Error("Réponse de connexion inattendue.");
      setSessionError(null);
      setUser(session.user);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    async register(input) {
      const session = await createSession("/auth/register", input);
      if ("emailConfirmationRequired" in session) {
        return { emailConfirmationRequired: true, email: session.email };
      }
      setSessionError(null);
      setUser(session.user);
      window.scrollTo({ top: 0, behavior: "auto" });
      return { emailConfirmationRequired: false };
    },
    async logout() {
      await closeSession();
      setSessionError(null);
      setUser(null);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    updateUser(nextUser) {
      setUser(nextUser);
    },
  }), [loading, sessionError, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return value;
}
