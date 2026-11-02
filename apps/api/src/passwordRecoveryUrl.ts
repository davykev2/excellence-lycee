/** Recovery links use the public frontend address, never an incoming request origin. */
export function passwordRecoveryRedirectUrl(publicWebUrl: string, production: boolean) {
  let site: URL;
  try {
    site = new URL(publicWebUrl);
  } catch {
    throw new Error("L’adresse publique de récupération est invalide.");
  }
  const hostname = site.hostname.toLowerCase();
  const local = hostname === "localhost" || hostname.endsWith(".localhost")
    || hostname.endsWith(".local") || /^127\./.test(hostname)
    || hostname === "[::1]" || hostname === "0.0.0.0";
  if (site.username || site.password || !["https:", "http:"].includes(site.protocol)
    || (production && (site.protocol !== "https:" || local))) {
    throw new Error("La récupération en production exige l’adresse HTTPS publique du site.");
  }
  return new URL("/?auth=recovery", site).href;
}
