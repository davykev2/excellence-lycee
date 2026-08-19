import type { AuthUser } from "../domain/auth";

const apiUrl = import.meta.env.VITE_API_URL || "/api";
let accessToken: string | null = null;
let refreshInFlight: Promise<SessionPayload> | null = null;

export const DEFAULT_API_TIMEOUT_MS = 30_000;
const SESSION_REFRESH_TIMEOUT_MS = 15_000;

export interface ApiRequestInit extends RequestInit {
  timeoutMs?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiFailureKind =
  | "timeout"
  | "offline"
  | "network"
  | "authentication"
  | "forbidden"
  | "server"
  | "request"
  | "cancelled"
  | "unknown";

export interface ApiRequestFailure {
  kind: ApiFailureKind;
  message: string;
  retryable: boolean;
  status?: number;
  code?: string;
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

function callerAbortReason(signal: AbortSignal, fallback: unknown) {
  return signal.reason ?? fallback;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const callerSignal = init.signal;
  let abortSource: "caller" | "timeout" | null = null;

  const abortFromCaller = () => {
    if (abortSource) return;
    abortSource = "caller";
    controller.abort(callerSignal?.reason);
  };

  if (callerSignal?.aborted) {
    throw callerAbortReason(callerSignal, new DOMException("La requête a été annulée.", "AbortError"));
  }
  callerSignal?.addEventListener("abort", abortFromCaller, { once: true });

  const effectiveTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0
    ? timeoutMs
    : DEFAULT_API_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    if (abortSource) return;
    abortSource = "timeout";
    controller.abort();
  }, effectiveTimeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (reason) {
    if (abortSource === "caller" && callerSignal) {
      throw callerAbortReason(callerSignal, reason);
    }
    if (abortSource === "timeout") {
      throw new ApiError(
        "Le serveur Excellence met trop de temps à répondre. Vérifie ta connexion puis réessaie.",
        408,
        "REQUEST_TIMEOUT",
      );
    }
    if (reason instanceof ApiError) throw reason;
    throw new ApiError(
      "Impossible de joindre le serveur Excellence. Vérifie ta connexion puis réessaie.",
      0,
      "NETWORK_ERROR",
    );
  } finally {
    globalThis.clearTimeout(timeoutId);
    callerSignal?.removeEventListener("abort", abortFromCaller);
  }
}

function waitForPromiseWithSignal<T>(promise: Promise<T>, signal?: AbortSignal | null): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) {
    return Promise.reject(callerAbortReason(signal, new DOMException("La requête a été annulée.", "AbortError")));
  }
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(callerAbortReason(signal, new DOMException("La requête a été annulée.", "AbortError")));
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}

export function describeApiFailure(reason: unknown, fallbackMessage: string): ApiRequestFailure {
  if (reason instanceof ApiError) {
    if (reason.code === "REQUEST_TIMEOUT" || reason.status === 408) {
      return { kind: "timeout", message: reason.message, retryable: true, status: reason.status, code: reason.code };
    }
    if (reason.code === "NETWORK_ERROR") {
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;
      return {
        kind: offline ? "offline" : "network",
        message: offline
          ? "La connexion Internet semble interrompue. Vérifie le réseau puis réessaie."
          : reason.message,
        retryable: true,
        status: reason.status,
        code: reason.code,
      };
    }
    if (reason.status === 401) {
      return { kind: "authentication", message: reason.message, retryable: true, status: reason.status, code: reason.code };
    }
    if (reason.status === 403) {
      return { kind: "forbidden", message: reason.message, retryable: false, status: reason.status, code: reason.code };
    }
    if (reason.status >= 500) {
      return { kind: "server", message: reason.message, retryable: true, status: reason.status, code: reason.code };
    }
    return { kind: "request", message: reason.message, retryable: reason.status === 429, status: reason.status, code: reason.code };
  }
  if (reason instanceof DOMException && reason.name === "AbortError") {
    return { kind: "cancelled", message: "La requête a été annulée.", retryable: true };
  }
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  if (offline) {
    return {
      kind: "offline",
      message: "La connexion Internet semble interrompue. Vérifie le réseau puis réessaie.",
      retryable: true,
    };
  }
  return { kind: "unknown", message: fallbackMessage, retryable: true };
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
  refreshInFlight = fetchWithTimeout(`${apiUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  }, SESSION_REFRESH_TIMEOUT_MS)
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
  const response = await fetchWithTimeout(`${apiUrl}${path}`, {
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
  await fetchWithTimeout(`${apiUrl}/auth/logout`, { method: "POST", credentials: "include", headers });
  setAccessToken(null);
}

export async function requestPasswordReset(email: string) {
  const response = await fetchWithTimeout(`${apiUrl}/auth/password-reset/request`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse<{ message: string }>(response);
}

export async function confirmPasswordReset(accessToken: string, password: string) {
  const response = await fetchWithTimeout(`${apiUrl}/auth/password-reset/confirm`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken, password }),
  });
  return parseResponse<{ message: string }>(response);
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}, retry = true): Promise<T> {
  const { timeoutMs = DEFAULT_API_TIMEOUT_MS, ...requestInit } = init;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetchWithTimeout(`${apiUrl}${path}`, {
    ...requestInit,
    headers,
    credentials: "include",
  }, timeoutMs);

  if (response.status === 401 && retry) {
    try {
      await waitForPromiseWithSignal(refreshSession(), init.signal);
      return apiRequest<T>(path, init, false);
    } catch (reason) {
      if (init.signal?.aborted) throw callerAbortReason(init.signal, reason);
      setAccessToken(null);
      if (
        reason instanceof ApiError
        && (reason.code === "NETWORK_ERROR" || reason.code === "REQUEST_TIMEOUT" || reason.status >= 500)
      ) {
        throw reason;
      }
    }
  }

  return parseResponse<T>(response);
}

export async function apiBlobRequest(path: string, init: ApiRequestInit = {}, retry = true): Promise<Blob> {
  const { timeoutMs = DEFAULT_API_TIMEOUT_MS, ...requestInit } = init;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetchWithTimeout(`${apiUrl}${path}`, {
    ...requestInit,
    headers,
    credentials: "include",
  }, timeoutMs);

  if (response.status === 401 && retry) {
    try {
      await waitForPromiseWithSignal(refreshSession(), init.signal);
      return apiBlobRequest(path, init, false);
    } catch (reason) {
      if (init.signal?.aborted) throw callerAbortReason(init.signal, reason);
      setAccessToken(null);
      if (
        reason instanceof ApiError
        && (reason.code === "NETWORK_ERROR" || reason.code === "REQUEST_TIMEOUT" || reason.status >= 500)
      ) {
        throw reason;
      }
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string; error?: string };
    throw new ApiError(payload.message ?? "Le contenu audio est indisponible.", response.status, payload.error);
  }
  return response.blob();
}
