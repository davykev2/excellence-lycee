import type { AuthUser } from "../domain/auth";

const apiUrl = import.meta.env.VITE_API_URL || "/api";
let accessToken: string | null = null;
let refreshInFlight: Promise<SessionPayload> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

interface SessionPayload {
  accessToken: string;
  user: AuthUser;
}

export interface EmailConfirmationPayload {
  emailConfirmationRequired: true;
  email: string;
}

export type SessionResult = SessionPayload | EmailConfirmationPayload;

function setAccessToken(token: string | null) {
  accessToken = token;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({})) as { message?: string; error?: string } & T;
  if (!response.ok) {
    const fallbackMessage = response.status >= 500
      ? "Le serveur Excellence est momentanément indisponible. Réessaie dans quelques instants."
      : response.status === 429
        ? "Trop de tentatives rapprochées. Patiente une minute puis réessaie."
        : "La demande n’a pas pu être traitée.";
    throw new ApiError(payload.message ?? fallbackMessage, response.status, payload.error);
  }
  return payload;
}

export function refreshSession() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = fetch(`${apiUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => parseResponse<SessionPayload>(response))
    .then((session) => {
      setAccessToken(session.accessToken);
      return session;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

export async function createSession(path: "/auth/register" | "/auth/login", body: unknown) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const session = await parseResponse<SessionResult>(response);
  if ("emailConfirmationRequired" in session) return session;
  setAccessToken(session.accessToken);
  return session;
}

export async function closeSession() {
  const headers = new Headers();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  await fetch(`${apiUrl}/auth/logout`, { method: "POST", credentials: "include", headers });
  setAccessToken(null);
}

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${apiUrl}/auth/password-reset/request`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse<{ message: string }>(response);
}

export async function confirmPasswordReset(accessToken: string, password: string) {
  const response = await fetch(`${apiUrl}/auth/password-reset/confirm`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken, password }),
  });
  return parseResponse<{ message: string }>(response);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry) {
    try {
      await refreshSession();
      return apiRequest<T>(path, init, false);
    } catch {
      setAccessToken(null);
    }
  }

  return parseResponse<T>(response);
}

export async function apiBlobRequest(path: string, init: RequestInit = {}, retry = true): Promise<Blob> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry) {
    try {
      await refreshSession();
      return apiBlobRequest(path, init, false);
    } catch {
      setAccessToken(null);
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string; error?: string };
    throw new ApiError(payload.message ?? "Le contenu audio est indisponible.", response.status, payload.error);
  }
  return response.blob();
}
