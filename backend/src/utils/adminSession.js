import crypto from 'crypto';

/**
 * Admin session token verification for backend (ENV-based admin)
 *
 * Token format: `${payloadB64}.${sigB64}`
 * - payloadB64: base64url(JSON payload)
 * - sigB64: base64url(HMAC-SHA256(secret, payloadB64))
 *
 * Payload includes: { typ: 'admin', v: 1, iat, exp }
 */

function timingSafeEqualStr(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function verifyAdminSessionToken(token, secret) {
  try {
    if (!token || !secret) return null;
    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return null;

    const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
    if (!timingSafeEqualStr(sigB64, expectedSig)) return null;

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    if (payload?.typ !== 'admin' || payload?.v !== 1) return null;
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.exp || payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}


