/**
 * ENDPOINT DE EXTRACCIÓN DE METADATOS DE ALIEXPRESS (CON RESGUARDO SSRF Y RESPALDO EDITABLE)
 * -----------------------------------------------------------------------------------------
 * Resuelve redirecciones de s.click.aliexpress.com de forma segura (SSRF guard),
 * extrae metadatos disponibles (OG, JSON-LD, runParams, Open Platform opcional)
 * y siempre retorna una respuesta no bloqueante (HTTP 200) si AliExpress limita la consulta.
 */
import dns from 'node:dns/promises';
import net from 'node:net';
import { normalizeProtocolUrl, extractAllTagAttributes } from '../src/utils/sitestripeParser.js';
import { callAliExpressOpenPlatform } from '../src/data/affiliateClients.js';
import {
  isAuthorizedWithAdminSecret,
  isAdminSecretMissingInProd,
  applyValidatedCorsHeaders
} from './_adminAuth.js';

const MAX_REDIRECTS = 6;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 6000;

const ALLOWED_SUFFIXES = ['.aliexpress.com', '.aliexpress.us', '.aliexpress.ru'];
const ALLOWED_EXACT = new Set(['aliexpress.com', 'aliexpress.us', 'aliexpress.ru']);

export function isAuthorizedMetadataRequest(req) {
  return isAuthorizedWithAdminSecret(req);
}

export function isAllowedAliExpressUrl(urlStr) {
  const normalized = normalizeProtocolUrl(urlStr);
  if (!normalized) return false;

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
  if (parsed.username || parsed.password) return false;
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') return false;

  const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (!host || net.isIP(host) !== 0) return false;
  if (ALLOWED_EXACT.has(host)) return true;

  return ALLOWED_SUFFIXES.some((suffix) => host.endsWith(suffix) && host.length > suffix.length);
}

function isPrivateIpv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b, c] = parts;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local / metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && c === 2) return true; // 192.0.2.0/24 TEST-NET-1
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15
  if (a === 198 && b === 51 && c === 100) return true; // 198.51.100.0/24
  if (a === 203 && b === 0 && c === 113) return true; // 203.0.113.0/24
  if (a >= 224) return true; // 224.0.0.0/4 multicast & 240.0.0.0/4 reserved
  return false;
}

function parseIpv6Hextets(ip) {
  const clean = String(ip || '').trim().toLowerCase().split('%')[0];
  if (net.isIP(clean) !== 6) return null;

  let working = clean;
  const lastColon = working.lastIndexOf(':');
  if (lastColon !== -1 && working.slice(lastColon + 1).includes('.')) {
    const ipv4Part = working.slice(lastColon + 1);
    const octets = ipv4Part.split('.').map(Number);
    if (octets.length !== 4 || octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
      return null;
    }
    const hi = ((octets[0] << 8) | octets[1]).toString(16);
    const lo = ((octets[2] << 8) | octets[3]).toString(16);
    working = `${working.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const dblIdx = working.indexOf('::');
  let groups;
  if (dblIdx !== -1) {
    const leftStr = working.slice(0, dblIdx);
    const rightStr = working.slice(dblIdx + 2);
    const left = leftStr ? leftStr.split(':') : [];
    const right = rightStr ? rightStr.split(':') : [];
    const missing = 8 - (left.length + right.length);
    if (missing < 0) return null;
    groups = [...left, ...Array(missing).fill('0'), ...right];
  } else {
    groups = working.split(':');
  }

  if (groups.length !== 8) return null;
  const hextets = groups.map((g) => (/^[0-9a-f]{1,4}$/.test(g) ? parseInt(g, 16) : NaN));
  if (hextets.some((n) => !Number.isInteger(n) || n < 0 || n > 0xffff)) return null;
  return hextets;
}

function hextetsToIpv4(h6, h7) {
  return `${(h6 >> 8) & 0xff}.${h6 & 0xff}.${(h7 >> 8) & 0xff}.${h7 & 0xff}`;
}

export function isPrivateOrReservedIp(ip) {
  if (typeof ip !== 'string') return true;
  const clean = ip.trim().toLowerCase().split('%')[0];
  const ipVersion = net.isIP(clean);
  if (ipVersion === 0) return true;
  if (ipVersion === 4) return isPrivateIpv4(clean);

  // IPv6: parsear a 8 hextets de 16 bits
  const h = parseIpv6Hextets(clean);
  if (!h) return true;

  // ::/128, ::1/128, y ::/96 (IPv4-compatible)
  if (h[0] === 0 && h[1] === 0 && h[2] === 0 && h[3] === 0 && h[4] === 0 && h[5] === 0) {
    if (h[6] === 0 && (h[7] === 0 || h[7] === 1)) return true;
    return isPrivateIpv4(hextetsToIpv4(h[6], h[7]));
  }
  // ::ffff:0:0/96 (IPv4-mapped)
  if (h[0] === 0 && h[1] === 0 && h[2] === 0 && h[3] === 0 && h[4] === 0 && h[5] === 0xffff) {
    return isPrivateIpv4(hextetsToIpv4(h[6], h[7]));
  }
  // ::ffff:0:0:0/96 (SIIT IPv4-translated)
  if (h[0] === 0 && h[1] === 0 && h[2] === 0 && h[3] === 0 && h[4] === 0xffff && h[5] === 0) {
    return isPrivateIpv4(hextetsToIpv4(h[6], h[7]));
  }
  // 2002::/16 (6to4 deprecated per RFC 7526 / embeds IPv4 in h[1..2])
  if (h[0] === 0x2002) {
    return true;
  }
  // 64:ff9b::/96 y 64:ff9b:1::/48 (NAT64)
  if (h[0] === 0x0064 && h[1] === 0xff9b && h[2] === 0 && h[3] === 0 && h[4] === 0 && h[5] === 0) {
    return true;
  }
  if (h[0] === 0x0064 && h[1] === 0xff9b && h[2] === 0x0001) {
    return true;
  }
  // 100::/64 (Discard-Only)
  if (h[0] === 0x0100 && h[1] === 0 && h[2] === 0 && h[3] === 0) return true;
  // 2001:db8::/32 (Documentation)
  if (h[0] === 0x2001 && h[1] === 0x0db8) return true;
  // fc00::/7 (ULA)
  if ((h[0] & 0xfe00) === 0xfc00) return true;
  // fe80::/10 (Link-local)
  if ((h[0] & 0xffc0) === 0xfe80) return true;
  // ff00::/8 (Multicast)
  if ((h[0] & 0xff00) === 0xff00) return true;

  return false;
}

function decodeHtmlEntities(str) {
  return String(str || '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

function extractProductIdFromString(str) {
  if (!str) return '';
  const itemMatch = String(str).match(/\/item\/(\d{6,})\.html/i);
  if (itemMatch) return itemMatch[1];
  const paramMatch = String(str).match(/[?&]productIds?=(\d{6,})/i);
  if (paramMatch) return paramMatch[1];
  return '';
}

function extractMetaContent(html, key) {
  const target = key.toLowerCase();
  const metaTags = extractAllTagAttributes(html, 'meta', { breakUrlAttrOnSpace: false });
  for (const attrs of metaTags) {
    const prop = (attrs.property || '').trim().toLowerCase();
    const name = (attrs.name || '').trim().toLowerCase();
    if ((prop === target || name === target) && attrs.content) {
      return decodeHtmlEntities(attrs.content);
    }
  }
  return '';
}

function findJsonLdProduct(node) {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findJsonLdProduct(item);
      if (found) return found;
    }
    return null;
  }
  const type = node['@type'];
  if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) {
    return node;
  }
  if (Array.isArray(node['@graph'])) {
    return findJsonLdProduct(node['@graph']);
  }
  return null;
}

function extractFromJsonLd(html) {
  const matches = html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of matches) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const prod = findJsonLdProduct(parsed);
      if (!prod) continue;
      const offer = Array.isArray(prod.offers) ? prod.offers[0] : prod.offers;
      const img = Array.isArray(prod.image) ? prod.image[0] : prod.image;
      return {
        title: prod.name ? decodeHtmlEntities(prod.name) : '',
        imageUrl: typeof img === 'string' ? (normalizeProtocolUrl(img) || '') : '',
        discountPrice: offer?.lowPrice ?? offer?.price ?? '',
        originPrice: offer?.highPrice ?? '',
        currency: offer?.priceCurrency || ''
      };
    } catch {
      // Ignora bloques JSON-LD malformados
    }
  }
  return {};
}

function extractFromRunParams(html) {
  const result = {};

  const subjectMatch = html.match(/"subject"\s*:\s*"((?:[^"\\]|\\.)+)"/);
  if (subjectMatch?.[1]) {
    try {
      result.title = JSON.parse(`"${subjectMatch[1]}"`);
    } catch {
      result.title = subjectMatch[1];
    }
  }

  const activityPriceMatch = html.match(/"formatedActivityPrice"\s*:\s*"([^"]+)"/)
    || html.match(/"minActivityAmount"\s*:\s*\{[^}]*"value"\s*:\s*([\d.]+)/);
  if (activityPriceMatch?.[1]) {
    result.discountPrice = activityPriceMatch[1];
  }

  const origPriceMatch = html.match(/"formatedPrice"\s*:\s*"([^"]+)"/)
    || html.match(/"minAmount"\s*:\s*\{[^}]*"value"\s*:\s*([\d.]+)/);
  if (origPriceMatch?.[1]) {
    result.originPrice = origPriceMatch[1];
  }

  const discountMatch = html.match(/"discount"\s*:\s*"?(\d{1,2}%?)"?/);
  if (discountMatch?.[1]) {
    result.discount = discountMatch[1].endsWith('%') ? discountMatch[1] : `${discountMatch[1]}%`;
  }

  const currencyMatch = html.match(/"(?:currency|currencyCode)"\s*:\s*"([A-Z]{3})"/);
  if (currencyMatch?.[1]) {
    result.currency = currencyMatch[1];
  }

  const imgListMatch = html.match(/"imagePathList"\s*:\s*\[\s*"([^"]+)"/);
  if (imgListMatch?.[1]) {
    result.imageUrl = normalizeProtocolUrl(imgListMatch[1]) || '';
  }

  const pidMatch = html.match(/"productId"\s*:\s*"?(\d{6,})"?/);
  if (pidMatch?.[1]) {
    result.productId = pidMatch[1];
  }

  return result;
}

function cleanTitle(rawTitle) {
  return String(rawTitle || '')
    .replace(/\s*[-|]\s*AliExpress(?:\s+\d+)?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumeric(val) {
  const n = Number(String(val || '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function computeDiscount(originVal, discountVal, existingDiscount) {
  if (existingDiscount) return existingDiscount;
  const orig = parseNumeric(originVal);
  const disc = parseNumeric(discountVal);
  if (Number.isFinite(orig) && Number.isFinite(disc) && orig > disc) {
    const pct = Math.round(((orig - disc) / orig) * 100);
    if (pct > 0 && pct < 100) return `${pct}%`;
  }
  return '';
}

export function extractMetadataFromHtml(html = '', resolvedUrl = '') {
  const safeHtml = String(html || '').slice(0, MAX_HTML_BYTES);
  const rawTitleTag = safeHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
  const decodedTitleTag = decodeHtmlEntities(rawTitleTag);

  const isBotWall =
    /_____tmd_____|rgv587_flag|x5sec|baxia|punish\?x5secdata/i.test(safeHtml) ||
    /captcha|security check|access denied|robot|just a moment/i.test(decodedTitleTag);

  const jsonLd = extractFromJsonLd(safeHtml);
  const runParams = extractFromRunParams(safeHtml);

  const ogTitle = extractMetaContent(safeHtml, 'og:title') || extractMetaContent(safeHtml, 'twitter:title');
  const ogImage = extractMetaContent(safeHtml, 'og:image') || extractMetaContent(safeHtml, 'twitter:image');
  const metaPrice = extractMetaContent(safeHtml, 'product:price:amount') || extractMetaContent(safeHtml, 'og:price:amount');
  const metaCurrency = extractMetaContent(safeHtml, 'product:price:currency') || extractMetaContent(safeHtml, 'og:price:currency');

  const rawTitle = runParams.title || jsonLd.title || (isBotWall ? '' : (ogTitle || decodedTitleTag));
  const title = cleanTitle(rawTitle);
  const imageUrl = normalizeProtocolUrl(runParams.imageUrl || jsonLd.imageUrl || ogImage || '') || '';

  const currency = (runParams.currency || jsonLd.currency || metaCurrency || 'USD').toUpperCase();
  const discountPrice = String(runParams.discountPrice || jsonLd.discountPrice || metaPrice || '').trim();
  const originPrice = String(runParams.originPrice || jsonLd.originPrice || '').trim();
  const discount = computeDiscount(originPrice, discountPrice, runParams.discount || '');
  const productId = extractProductIdFromString(resolvedUrl) || runParams.productId || '';

  return {
    blocked: isBotWall && !title,
    metadata: {
      title,
      originPrice,
      discountPrice,
      discount,
      currency,
      imageUrl,
      resolvedUrl: resolvedUrl || '',
      productId
    }
  };
}

async function readHtmlUpToLimit(response, maxBytes = MAX_HTML_BYTES) {
  const reader = response?.body?.getReader?.();
  if (!reader) {
    return (await response.text()).slice(0, maxBytes);
  }
  const chunks = [];
  let totalBytes = 0;
  try {
    while (totalBytes < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const buf = value instanceof Uint8Array ? value : new Uint8Array(value);
      const remaining = maxBytes - totalBytes;
      if (buf.byteLength >= remaining) {
        chunks.push(buf.byteLength > remaining ? buf.subarray(0, remaining) : buf);
        totalBytes += remaining;
        await reader.cancel?.().catch(() => {});
        break;
      }
      chunks.push(buf);
      totalBytes += buf.byteLength;
    }
  } finally {
    reader.releaseLock?.();
  }
  const decoder = new TextDecoder('utf-8', { fatal: false });
  return chunks.map((c, idx) => decoder.decode(c, { stream: idx < chunks.length - 1 })).join('') + decoder.decode();
}

async function assertHostResolvesPublicIp(hostname, lookupImpl) {
  const records = await lookupImpl(hostname, { all: true });
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('No se pudo resolver el host.');
  }
  for (const rec of records) {
    if (isPrivateOrReservedIp(rec.address)) {
      throw new Error('Destino IP privado o reservado bloqueado por seguridad SSRF.');
    }
  }
}

export async function resolveAliExpressMetadata(
  rawUrl,
  {
    fetchImpl = globalThis.fetch,
    lookupImpl = (host, opts) => dns.lookup(host, opts),
    openPlatformClient = callAliExpressOpenPlatform,
    env = process.env
  } = {}
) {
  const initialUrl = normalizeProtocolUrl(rawUrl);
  if (!initialUrl || !isAllowedAliExpressUrl(initialUrl)) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'URL inválida o dominio no permitido. Usa un enlace de AliExpress (ej. s.click.aliexpress.com).'
      }
    };
  }

  let currentUrl = initialUrl;
  let productId = extractProductIdFromString(currentUrl);
  let blocked = false;
  let warning = null;
  let metadata = {
    title: '',
    originPrice: '',
    discountPrice: '',
    discount: '',
    currency: 'USD',
    imageUrl: '',
    resolvedUrl: currentUrl,
    productId
  };

  try {
    let response = null;
    for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
      const parsed = new URL(currentUrl);
      await assertHostResolvesPublicIp(parsed.hostname, lookupImpl);

      response = await fetchImpl(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers?.get?.('location');
        if (!location) break;
        const nextUrl = new URL(location, currentUrl).toString();
        if (!isAllowedAliExpressUrl(nextUrl)) {
          blocked = true;
          warning = 'La redirección salió del dominio de AliExpress; completa los datos manualmente.';
          break;
        }
        currentUrl = nextUrl;
        productId = extractProductIdFromString(currentUrl) || productId;
        continue;
      }
      break;
    }

    metadata.resolvedUrl = currentUrl;
    metadata.productId = productId;

    if (response && !blocked) {
      if (response.status === 403 || response.status === 429) {
        blocked = true;
        warning = `AliExpress respondió HTTP ${response.status} (protección antibot). Completa o edita los datos manualmente.`;
      } else if (response.ok) {
        const html = await readHtmlUpToLimit(response, MAX_HTML_BYTES);
        const extracted = extractMetadataFromHtml(html, currentUrl);
        blocked = extracted.blocked;
        metadata = {
          ...metadata,
          ...extracted.metadata,
          productId: extracted.metadata.productId || productId,
          resolvedUrl: currentUrl
        };
        if (blocked) {
          warning = 'AliExpress mostró verificación antibot. Puedes editar y guardar el producto manualmente.';
        }
      } else {
        blocked = true;
        warning = `AliExpress respondió HTTP ${response.status}. Puedes completar los campos manualmente.`;
      }
    }
  } catch (err) {
    blocked = true;
    warning = `No se pudo leer el producto automáticamente (${err.message}). Completa los campos manualmente.`;
  }

  // Respaldo opcional con AliExpress Open Platform si hay credenciales y productId
  if ((blocked || !metadata.title || !metadata.discountPrice) && metadata.productId && env?.ALI_APP_KEY && env?.ALI_APP_SECRET) {
    try {
      const apiRes = await openPlatformClient(
        'aliexpress.affiliate.productdetail.get',
        {
          product_ids: metadata.productId,
          target_currency: metadata.currency || 'USD',
          target_language: 'ES'
        },
        {
          appKey: env.ALI_APP_KEY,
          appSecret: env.ALI_APP_SECRET,
          trackingId: env.ALI_TRACKING_ID || 'default'
        }
      );
      const item = apiRes?.aliexpress_affiliate_productdetail_get_response?.resp_result?.result?.products?.product?.[0];
      if (item) {
        metadata.title = metadata.title || String(item.product_title || '').trim();
        metadata.originPrice = metadata.originPrice || String(item.target_original_price || item.original_price || '').trim();
        metadata.discountPrice = metadata.discountPrice || String(item.target_sale_price || item.sale_price || '').trim();
        metadata.discount = metadata.discount || String(item.discount || '').trim();
        metadata.currency = item.target_sale_price_currency || metadata.currency || 'USD';
        metadata.imageUrl = metadata.imageUrl || normalizeProtocolUrl(item.product_main_image_url || '') || '';
        blocked = false;
        warning = null;
      }
    } catch {
      // Silencioso: el respaldo editable siempre permanece disponible
    }
  }

  const partial = !metadata.title || (!metadata.discountPrice && !metadata.originPrice);
  if (!warning && partial) {
    warning = 'Algunos datos no estuvieron disponibles en el enlace. Revisa o completa los campos manualmente.';
  }

  return {
    status: 200,
    body: {
      ok: true,
      blocked,
      partial,
      warning,
      metadata
    }
  };
}

export function createAliExpressMetadataHandler(deps = {}) {
  return async function handler(req, res) {
    applyValidatedCorsHeaders(req, res, {
      methods: 'GET, POST, OPTIONS',
      cacheControl: 'no-store'
    });

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (isAdminSecretMissingInProd()) {
      return res.status(503).json({
        ok: false,
        error: 'ADMIN_SECRET no está configurado en el servidor de producción.'
      });
    }

    if (!isAuthorizedMetadataRequest(req)) {
      return res.status(401).json({ ok: false, error: 'Token de administrador inválido o faltante.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const rawUrl = req.method === 'GET' ? req.query?.url : (body?.url ?? req.query?.url);
    const result = await resolveAliExpressMetadata(rawUrl, deps);
    return res.status(result.status).json(result.body);
  };
}

export default createAliExpressMetadataHandler();
