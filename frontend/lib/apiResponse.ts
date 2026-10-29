/** Read an API response without exposing a framework or network error to customers. */
export async function readApiResponse(response: Response, fallback: string) {
  const payload: unknown = await response.json().catch(() => null);
  const body = payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {};

  if (!response.ok) {
    const message = typeof body.error === "string" ? body.error : fallback;
    const diagnostic = process.env.NODE_ENV !== "production" && typeof body.diagnostic === "string"
      ? ` (${body.diagnostic})`
      : "";
    throw new Error(`${message}${diagnostic}`);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(fallback);
  }
  return body;
}

export function customerErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  if (/^(failed to fetch|networkerror|load failed)$/i.test(error.message)) return fallback;
  return error.message;
}
