/**
 * Helpers puros para normalización de productos manuales SiteStripe,
 * creación/fusión de categorías dinámicas y compatibilidad con HotDealsGrid.
 */
import { CATEGORY_SLUGS } from '../data/i18nDictionaries.js';
import { parseTrackingLinkInput, parseSiteStripeImageInput } from './sitestripeParser.js';

export function slugifyCategory(label) {
  if (typeof label !== 'string') return '';
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
    .replace(/-+$/g, '');
}

function normalizeNumericText(str) {
  const digitsAndSep = String(str || '').replace(/[^\d.,]/g, '');
  if (!digitsAndSep) return '';

  const hasDot = digitsAndSep.includes('.');
  const hasComma = digitsAndSep.includes(',');

  if (hasDot && hasComma) {
    if (digitsAndSep.lastIndexOf('.') > digitsAndSep.lastIndexOf(',')) {
      return digitsAndSep.replace(/,/g, '');
    }
    return digitsAndSep.replace(/\./g, '').replace(/,/g, '.');
  }

  if (hasComma) {
    if (/^\d{1,3}(,\d{3})+$/.test(digitsAndSep)) {
      return digitsAndSep.replace(/,/g, '');
    }
    const parts = digitsAndSep.split(',');
    if (parts.length === 2) {
      return `${parts[0]}.${parts[1]}`;
    }
    return digitsAndSep.replace(/,/g, '');
  }

  if (hasDot) {
    if (/^\d{1,3}(\.\d{3}){2,}$/.test(digitsAndSep)) {
      return digitsAndSep.replace(/\./g, '');
    }
    return digitsAndSep;
  }

  return digitsAndSep;
}

function parseNumericPrice(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw !== 'string') return NaN;
  const normalized = normalizeNumericText(raw);
  if (!normalized) return NaN;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

function formatPriceString(raw, currency) {
  if (raw == null) return '';
  const str = String(raw).trim();
  if (!str) return '';
  // Si ya contiene código de moneda (e.g. "USD 29.99") o símbolo reconocido, conservar limpio
  if (/^[A-Z]{3}\s+[\d.,]+$/i.test(str)) {
    const [curr, num] = str.split(/\s+/);
    return `${curr.toUpperCase()} ${num}`;
  }
  if (/^[\d.,]+$/.test(str)) {
    const num = parseNumericPrice(str);
    return Number.isFinite(num) ? `${currency} ${num.toFixed(2)}` : str;
  }
  return str;
}

function formatDiscountString(rawDiscount, originRaw, discountRaw) {
  const str = String(rawDiscount || '').trim();
  if (str) {
    const num = parseNumericPrice(str);
    if (Number.isFinite(num) && num > 0) {
      return `${Math.round(num)}%`;
    }
    return str.endsWith('%') ? str : `${str}%`;
  }

  const orig = parseNumericPrice(originRaw);
  const disc = parseNumericPrice(discountRaw);
  if (Number.isFinite(orig) && Number.isFinite(disc) && orig > 0 && disc > 0 && orig > disc) {
    const pct = Math.round(((orig - disc) / orig) * 100);
    if (pct > 0 && pct < 100) return `${pct}%`;
  }
  return '';
}

function normalizeCountries(rawCountries) {
  const list = Array.isArray(rawCountries)
    ? rawCountries
    : typeof rawCountries === 'string'
      ? rawCountries.split(',')
      : [];

  const cleaned = [...new Set(
    list.map((c) => String(c).trim().toLowerCase()).filter(Boolean)
  )];

  return cleaned.length > 0 ? cleaned : ['global'];
}

const GENERIC_TRACKING_SEGMENTS = new Set([
  'deep_linkhtm',
  'deep_linkhtml',
  'deeplinkhtm',
  'deeplink',
  'e',
  'indexhtml',
  'indexhtm',
  'redirect',
  'go',
  'link'
]);

function shortHashHex(input) {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  const str = String(input || '');
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x01000193);
    h2 = Math.imul(h2 ^ ch, 0x85ebca6b);
  }
  return ((h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(4, '0')).slice(0, 10);
}

function extractCodeFromTrackingUrl(trackingUrl) {
  try {
    const u = new URL(trackingUrl);
    const itemMatch = u.pathname.match(/\/item\/(\d+)\.html/i);
    if (itemMatch) return itemMatch[1];
    const parts = u.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    const safe = last.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!safe || GENERIC_TRACKING_SEGMENTS.has(safe.toLowerCase())) {
      const hash = shortHashHex(trackingUrl);
      return safe ? `ss-${safe}-${hash}` : `ss-${hash}`;
    }
    return `ss-${safe}`;
  } catch {
    return '';
  }
}

export function normalizeManualProductPayload(payload = {}) {
  const errors = [];

  const trackingRes = parseTrackingLinkInput(
    payload.trackingUrl ?? payload.trackingInput ?? payload.promotionUrl ?? ''
  );
  if (!trackingRes.isValid) {
    errors.push(trackingRes.error || 'Tracking link inválido.');
  }

  const imageRes = parseSiteStripeImageInput(
    payload.imageInput ?? payload.imageUrl ?? ''
  );
  if (!imageRes.isValid) {
    errors.push(imageRes.error || 'URL o HTML de imagen inválido.');
  }

  const title = String(payload.title ?? payload.productDesc ?? '').trim();
  if (!title) {
    errors.push('El título del producto es obligatorio.');
  }

  const newCatRaw = String(payload.newCategoryName ?? '').trim();
  const rawCatSlug = newCatRaw ? slugifyCategory(newCatRaw) : slugifyCategory(payload.category || '');
  const categoryLabel = (
    newCatRaw ||
    String(payload.categoryLabel || '').trim() ||
    String(payload.category || '').trim() ||
    rawCatSlug
  ).slice(0, 120).trim();

  if (!rawCatSlug) {
    errors.push('Selecciona una categoría existente o ingresa una categoría nueva válida.');
  }

  const rawCurrency = String(payload.currency || 'USD').trim().toUpperCase();
  const currency = (/^[A-Z]{3}$/.test(rawCurrency) ? rawCurrency : 'USD').slice(0, 10);

  const originPrice = formatPriceString(payload.originPrice, currency).slice(0, 40);
  const discountPrice = formatPriceString(payload.discountPrice, currency).slice(0, 40);
  const discount = formatDiscountString(payload.discount, payload.originPrice, payload.discountPrice).slice(0, 20);
  const countries = normalizeCountries(payload.countries);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const explicitProductId = String(payload.productId || '').replace(/[^a-zA-Z0-9_-]/g, '');
  const derivedCode = explicitProductId || extractCodeFromTrackingUrl(trackingRes.trackingUrl) || `${Date.now()}`;
  const id = String(payload.id || `manual-${derivedCode}`).slice(0, 120);
  const productId = (explicitProductId || derivedCode).slice(0, 80);

  const isCustomCategory = !CATEGORY_SLUGS.includes(rawCatSlug);

  return {
    ok: true,
    errors: [],
    category: {
      slug: rawCatSlug,
      label: categoryLabel,
      isCustom: isCustomCategory
    },
    product: {
      id,
      productId,
      store: 'aliexpress',
      title,
      trackingUrl: trackingRes.trackingUrl,
      imageUrl: imageRes.imageUrl,
      originPrice,
      discountPrice,
      discount,
      currency,
      category: rawCatSlug,
      categoryLabel,
      countries,
      sourceOrigin: 'sitestripe_manual'
    }
  };
}

export function mapDbProductToCatalogDeal(row) {
  if (!row) return null;
  const countries = Array.isArray(row.countries) && row.countries.length > 0
    ? row.countries
    : ['global'];

  return {
    id: row.id,
    ProductId: String(row.product_id || row.productId || row.id),
    'Image Url': row.image_url || row.imageUrl || '',
    'Video Url': '',
    'Product Desc': row.title || '',
    'Origin Price': row.origin_price ?? row.originPrice ?? '',
    'Discount Price': row.discount_price ?? row.discountPrice ?? '',
    Discount: row.discount || '',
    Currency: row.currency || 'USD',
    'Promotion Url': row.tracking_url || row.trackingUrl || '',
    'Code Name': '',
    'Code Start Time': '',
    'Code End Time': '',
    'Code Value': '',
    'Code Minimum Spend': '',
    dealType: 'manual-sitestripe',
    category: row.category || 'tech-gadgets',
    categoryLabel: row.category_label || row.categoryLabel || row.category || 'tech-gadgets',
    countries,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined
  };
}

export function mergeCatalogDeals(manualDeals = [], staticDeals = []) {
  const seen = new Set();
  const merged = [];

  for (const deal of Array.isArray(manualDeals) ? manualDeals : []) {
    if (!deal) continue;
    const key = String(deal.ProductId || deal.id || '').trim();
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    merged.push(deal);
  }

  for (const deal of Array.isArray(staticDeals) ? staticDeals : []) {
    if (!deal) continue;
    const key = String(deal.ProductId || deal.id || '').trim();
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    merged.push(deal);
  }

  return merged;
}

export function collectCatalogCategories(deals = [], customCategories = []) {
  const counts = {};
  const dealLabels = {};

  for (const deal of Array.isArray(deals) ? deals : []) {
    if (!deal || !deal.category) continue;
    counts[deal.category] = (counts[deal.category] || 0) + 1;
    if (deal.categoryLabel && !dealLabels[deal.category]) {
      dealLabels[deal.category] = deal.categoryLabel;
    }
  }

  const result = CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: slug,
    count: counts[slug] || 0,
    isCustom: false
  }));

  const seen = new Set(CATEGORY_SLUGS);

  for (const cat of Array.isArray(customCategories) ? customCategories : []) {
    const slug = slugifyCategory(cat?.slug || cat?.label || cat?.label_es || '');
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push({
      slug,
      label: cat.label || cat.label_es || cat.labelEs || dealLabels[slug] || slug,
      count: counts[slug] || 0,
      isCustom: true
    });
  }

  for (const deal of Array.isArray(deals) ? deals : []) {
    const slug = deal?.category;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push({
      slug,
      label: deal.categoryLabel || dealLabels[slug] || slug,
      count: counts[slug] || 0,
      isCustom: true
    });
  }

  return result;
}
