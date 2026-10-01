export class HttpError extends Error {
  status: number;
  headers?: HeadersInit;

  constructor(status: number, message: string, headers?: HeadersInit) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

export function json(value: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(extraHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(JSON.stringify(value), { status, headers });
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('Origin');
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (origin !== new URL(request.url).origin || (fetchSite && !['same-origin', 'none'].includes(fetchSite))) {
    throw new HttpError(403, 'This action must be made from the portfolio admin page.');
  }
}

/** Read bounded input, including chunked bodies without a Content-Length. */
export async function readBody(request: Request, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  const declared = request.headers.get('Content-Length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit)) {
    throw new HttpError(413, 'The request is too large.');
  }
  if (!request.body) throw new HttpError(400, 'A request body is required.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new HttpError(413, 'The request is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readJson(request: Request, limit = 512 * 1024): Promise<unknown> {
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    throw new HttpError(415, 'Send JSON with the application/json content type.');
  }
  const bytes = await readBody(request, limit);
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes));
  } catch {
    throw new HttpError(400, 'The JSON body is invalid.');
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export async function handleError(action: () => Promise<Response>, request: Request): Promise<Response> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status, error.headers);
    // Never log request bodies, cookies, passwords, or platform error details.
    console.error(JSON.stringify({ event: 'request_failed', path: new URL(request.url).pathname }));
    return json({ error: 'The service is temporarily unavailable. Please try again.' }, 503);
  }
}

