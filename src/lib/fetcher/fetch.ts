// Fetch with explicit timeout and minimal error mapping
export async function fetchWithTimeout(
  url: URL,
  timeoutMs: number,
  headers?: Record<string, string>
): Promise<
  { ok: true; res: Response } | { ok: false; error: "timeout" | "fetch-failed" }
> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers,
    });
    return { ok: true, res };
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { ok: false, error: "timeout" };
    }
    return { ok: false, error: "fetch-failed" };
  } finally {
    clearTimeout(timer);
  }
}
