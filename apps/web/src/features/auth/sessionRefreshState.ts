export function isMissingSessionRefresh(reason: unknown) {
  return Boolean(
    reason
    && typeof reason === "object"
    && "status" in reason
    && reason.status === 401,
  );
}
