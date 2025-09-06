export type FetchImageError =
  | "invalid-url"
  | "non-https"
  | "blocked-host"
  | "timeout"
  | "http-error"
  | "unsupported-mime"
  | "too-large"
  | "fetch-failed";

export type FetchImageResult =
  | { ok: true; dataUri: string; mime: string; bytes: number }
  | { ok: false; error: FetchImageError; status?: number };

export type FetchImageOptions = {
  timeoutMs?: number;
  maxBytes?: number;
  allowedMimes?: RegExp;
  userAgent?: string;
  allowedHosts?: string[] | RegExp;
  maxRedirects?: number;
};
