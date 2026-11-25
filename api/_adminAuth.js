/**
 * Helpers compartidos de autenticación ADMIN_SECRET (timing-safe + fail-closed en producción)
 * y validación estricta de origen CORS para endpoints administrativos / proxy.
 */
import crypto from 'node:crypto';

const KNOWN_ALLOWED_ORIGINS = new Set([
  'https://cuponestech.tech',
  'https://www.cuponestech.tech',
  'https://techcoupons-global.vercel.app'
]);

export function getHeaderCaseInsensitive(headers, name) {
  if (!headers) return '';
  const target = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === target) {
      return Array.isArray(v) ? v[0] : String(v || '');
    }
  }
  return '';
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

export function isAdminSecretMissingInProd() {
  return isProductionEnvironment() && !process.env.ADMIN_SECRET;
}

function safeCompareSecrets(provided, expected) {
  if (!provided || !expected) return false;
  const a = crypto.createHash('sha256').update(String(provided)).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

export function isAuthorizedWithAdminSecret(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return !isProductionEnvironment();
  }
  const headerSecret = getHeaderCaseInsensitive(req?.headers, 'x-admin-secret').trim();
  const authHeader = getHeaderCaseInsensitive(req?.headers, 'authorization').trim();
  const bearer = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';
  return safeCompareSecrets(headerSecret, secret) || safeCompareSecrets(bearer, secret);
}

export function resolveAllowedCorsOrigin(req) {
  const origin = getHeaderCaseInsensitive(req?.headers, 'origin').trim();
  if (!origin) return null;

  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  const canonicalOrigin = parsed.origin.toLowerCase();

  if (KNOWN_ALLOWED_ORIGINS.has(canonicalOrigin)) {
    return origin;
  }

  const isLocalHost =
    parsed.hostname.toLowerCase() === 'localhost' || parsed.hostname === '127.0.0.1';

  if (parsed.protocol === 'http:' && isLocalHost) {
    return origin;
  }

  if (parsed.protocol !== 'https:') {
    return null;
  }

  const hostHeader = getHeaderCaseInsensitive(req?.headers, 'host');
  const forwardedHostHeader = getHeaderCaseInsensitive(req?.headers, 'x-forwarded-host');
  const reqHost = (hostHeader || forwardedHostHeader)
    .split(',')[0]
    .trim()
    .toLowerCase();

  if (reqHost && parsed.host.toLowerCase() === reqHost) {
    return origin;
  }

  return null;
}

export function applyValidatedCorsHeaders(req, res, { methods, cacheControl }) {
  const allowedOrigin = resolveAllowedCorsOrigin(req);
  if (allowedOrigin) {
    res.setHeader?.('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader?.('Vary', 'Origin');
  res.setHeader?.('Access-Control-Allow-Methods', methods);
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');
  if (cacheControl) {
    res.setHeader?.('Cache-Control', cacheControl);
  }
}
