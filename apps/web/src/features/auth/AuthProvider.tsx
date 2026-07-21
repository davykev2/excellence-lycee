import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, LoginInput, RegisterInput } from "../../domain/auth";
import { closeSession, createSession, refreshSession } from "../../lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<{ emailConfirmationRequired: boolean; email?: string }>;
  logout(): Promise<void>;
  updateUser(user: AuthUser): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    refreshSession()
      .then((session) => active && setUser(session.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(input) {
      const session = await createSession("/auth/login", input);
      if ("emailConfirmationRequired" in session) throw new Error("Réponse de connexion inattendue.");
      setUser(session.user);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    async register(input) {
      const session = await createSession("/auth/register", input);
      if ("emailConfirmationRequired" in session) {
        return { emailConfirmationRequired: true, email: session.email };
      }
      setUser(session.user);
      window.scrollTo({ top: 0, behavior: "auto" });
      return { emailConfirmationRequired: false };
    },
    async logout() {
      await closeSession();
      setUser(null);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    updateUser(nextUser) {
      setUser(nextUser);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return value;
}
