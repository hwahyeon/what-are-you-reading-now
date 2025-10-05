// Streaming helpers: content-length precheck, limited read, and data URI conversion

// Return null if OK, or an error object if the declared size exceeds maxBytes.
export function precheckContentLength(
  res: Response,
  maxBytes: number
): { ok: false; error: "too-large" } | null {
  const cl = res.headers.get("content-length");
  if (!cl) return null;
  const n = Number(cl);
  if (Number.isFinite(n) && n > maxBytes) {
    return { ok: false, error: "too-large" };
  }
  return null;
}

// Read response body into a Buffer while enforcing a hard size limit.
export async function readToBufferWithLimit(
  res: Response,
  maxBytes: number
): Promise<{ ok: true; buffer: Buffer } | { ok: false; error: "too-large" }> {
  const reader = res.body?.getReader();
  if (!reader) {
    // Fallback: no stream reader available
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > maxBytes) return { ok: false, error: "too-large" };
    return { ok: true, buffer: buf };
  }

  let received = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > maxBytes) {
        try {
          await reader.cancel();
        } catch {}
        return { ok: false, error: "too-large" };
      }
      chunks.push(value);
    }
  }

  // Concatenate chunks into a single Buffer
  const buffers = chunks.map((u) => Buffer.from(u));
  const buffer = Buffer.concat(buffers, received);
  return { ok: true, buffer };
}

// Convert a Buffer to a data URI with the provided MIME type.
export function bufferToDataUri(buf: Buffer, mime: string): string {
  return `data:${mime};base64,${buf.toString("base64")}`;
}
