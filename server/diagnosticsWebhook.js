/**
 * Diagnostics provider webhook handler (hlthstack, ASSUMED contract; no vendor docs exist).
 *
 * ASSUMPTIONS: provider POSTs JSON; signature header "X-Hlthstack-Signature: sha256=<hex>" is
 * HMAC SHA-256 of the raw body with a shared secret; payload is already in our normalised event shape
 * (a real adapter would map the vendor payload to it). Real header name/scheme must be confirmed.
 *
 * Patterns reused from whatsappServer.js / whatsappBotEngine.js: 64KB body cap, HMAC SHA-256 with
 * timingSafeEqual. Unlike the WhatsApp engine there is NO dev bypass: a missing secret always refuses.
 * No default secret exists in any environment. No network calls are made here.
 */
import crypto from 'node:crypto';

export const MAX_BODY_BYTES = 65536;
export const SIGNATURE_HEADER = 'x-hlthstack-signature';

const STATUS_BY_CODE = {
  NOT_FOUND_BOOKING: 404, UNKNOWN_BOOKING: 404, OUT_OF_ORDER: 409, UNKNOWN_EVENT_TYPE: 422, BAD_EVENT: 422, BAD_REPORT: 422
};

export function verifySignature(rawBody, signatureHeader, secret) {
  if (!secret) return { verified: false, error: 'Webhook secret not configured' };
  if (!signatureHeader || !String(signatureHeader).startsWith('sha256=')) {
    return { verified: false, error: 'Missing or malformed signature header' };
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest();
  const given = Buffer.from(String(signatureHeader).slice(7), 'hex');
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    return { verified: false, error: 'Invalid HMAC SHA-256 signature' };
  }
  return { verified: true };
}

/**
 * Core handler (no sockets). Returns { status, body }.
 * options: { service, secret?, maxBytes? }  secret defaults to process.env.HLTHSTACK_WEBHOOK_SECRET.
 */
export async function handleDiagnosticsWebhook({ rawBody, signatureHeader }, options = {}) {
  const { service, maxBytes = MAX_BODY_BYTES } = options;
  const secret = options.secret ?? process.env.HLTHSTACK_WEBHOOK_SECRET ?? '';
  if (!secret) return { status: 503, body: { error: 'Webhook secret not configured' } };
  if (Buffer.byteLength(rawBody || '') > maxBytes) return { status: 413, body: { error: 'Payload too large' } };
  const sig = verifySignature(rawBody || '', signatureHeader, secret);
  if (!sig.verified) return { status: 401, body: { error: sig.error } };
  let event;
  try { event = JSON.parse(rawBody); } catch { return { status: 400, body: { error: 'Invalid JSON' } }; }
  try {
    const r = await service.applyProviderEvent(event);
    return { status: 200, body: { ok: true, applied: r.applied, duplicate: r.duplicate } };
  } catch (err) {
    if (err && err.name === 'DiagnosticsError') {
      return { status: STATUS_BY_CODE[err.code] || 400, body: { error: err.code } };
    }
    return { status: 500, body: { error: 'Internal error' } };
  }
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', chunk => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { tooLarge: true }));
        if (typeof req.destroy === 'function') req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** Node http-style handler factory: (req, res) => Promise<void>. Export for a future route; no port opened here. */
export function createDiagnosticsWebhookHandler(options = {}) {
  const maxBytes = options.maxBytes ?? MAX_BODY_BYTES;
  return async function handler(req, res) {
    const send = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'POST') return send(405, { error: 'Method not allowed' });
    let rawBody;
    try {
      rawBody = await readBody(req, maxBytes);
    } catch (err) {
      return err.tooLarge ? send(413, { error: 'Payload too large' }) : send(400, { error: 'Bad request' });
    }
    const out = await handleDiagnosticsWebhook({ rawBody, signatureHeader: req.headers?.[SIGNATURE_HEADER] }, options);
    return send(out.status, out.body);
  };
}
