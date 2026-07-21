import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../src/app.js";

let appPromise: ReturnType<typeof buildApp> | undefined;

function getApp() {
  appPromise ??= buildApp().then(async (app) => {
    await app.ready();
    return app;
  });
  return appPromise;
}

function resolveFastifyUrl(originalUrl: string) {
  const url = new URL(originalUrl, "http://excellence.local");
  const forwardedPath = url.searchParams.get("path");

  if (!forwardedPath) {
    return originalUrl.replace(/^\/api(?=\/|\?|$)/, "") || "/";
  }

  url.searchParams.delete("path");
  const query = url.searchParams.toString();
  const pathname = `/${forwardedPath.replace(/^\/+/, "")}`;
  return query ? `${pathname}?${query}` : pathname;
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  request.url = resolveFastifyUrl(request.url ?? "/");
  const app = await getApp();
  app.server.emit("request", request, response);
}
