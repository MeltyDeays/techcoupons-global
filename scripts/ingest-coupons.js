/**
 * INGESTIÓN DE CUPONES OFICIALES (Admitad / AliExpress Portals / Temu)
 * -------------------------------------------------------------------
 * Script de infraestructura preparado para cuando se obtengan las credenciales
 * o el feed oficial de las redes de afiliados.
 *
 * Uso:
 *   node scripts/ingest-coupons.js --source=manual --file=./coupons-input.json
 *   node scripts/ingest-coupons.js --source=admitad --file=./admitad-response.json
 *   node scripts/ingest-coupons.js --source=aliexpress --file=./ali-response.json
 *
 * Valida cada entrada con `validateCoupon` antes de emitir el código para `verifiedCoupons.js`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateCoupon } from '../src/data/verifiedCoupons.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isGlobalRegion(r) {
  const norm = String(r || '').toLowerCase().trim();
  return norm === '' || norm === '*' || norm === 'global' || norm === 'all' || norm === 'ww';
}

function normalizeAdmitad(item) {
  // Mapeo estándar de objeto cupón devuelto por API /coupons/ de Admitad
  const validUntil = item.date_end ? new Date(item.date_end).toISOString() : '';
  const validFrom = item.date_start ? new Date(item.date_start).toISOString() : new Date().toISOString();

  let countries = ['global'];
  if (Array.isArray(item.regions) && item.regions.length > 0) {
    const hasGlobal = item.regions.some(isGlobalRegion);
    countries = hasGlobal ? ['global'] : item.regions.map((r) => String(r).toLowerCase().trim()).filter(Boolean);
  }

  const desc = String(item.description || item.name || '').toLowerCase();
  const isNew = desc.includes('new user') || desc.includes('nuevo usuario') || desc.includes('primera compra');
  const isAppOnly = desc.includes('app only') || desc.includes('solo app') || desc.includes('en la aplicación');

  return {
    id: `admitad-${item.id || item.promocode}`,
    store: (item.advcampaign_name || '').toLowerCase().includes('temu') ? 'temu' : 'aliexpress',
    code: String(item.promocode || '').trim(),
    countries: countries.length ? countries : ['global'],
    userType: isNew ? 'new' : 'all',
    currency: item.currency || 'USD',
    discountType: item.discount_type === 'percent' ? 'percent' : 'fixed',
    discountValue: Number(item.discount_value || item.discount || 0),
    maxDiscount: null,
    minSpend: Number(item.min_spend || item.order_amount || 0),
    validFrom,
    validUntil,
    channel: isAppOnly ? 'app' : 'both',
    sourceUrl: item.gotolink || item.promolink || 'https://www.admitad.com',
    lastVerifiedAt: new Date().toISOString(),
    affiliateUrl: item.gotolink || item.promolink || '',
    category: null,
    title: {
      es: item.name || item.title || 'Cupón Oficial Verificado',
      en: item.name_en || item.name || item.title || 'Verified Official Coupon'
    },
    notes: item.description ? { es: item.description, en: item.description } : undefined
  };
}

function normalizeAliExpressPortals(item) {
  // Mapeo estándar de promo_code_info de AliExpress Affiliate API
  const promoCode = item.promo_code || item.code || item.coupon_code || '';
  const countryField = item.country || item.country_code || item.regions || '';

  let countries = ['global'];
  if (countryField) {
    if (typeof countryField === 'string') {
      const parts = countryField.split(/[,;\/]/).map((c) => c.toLowerCase().trim()).filter(Boolean);
      countries = parts.some(isGlobalRegion) ? ['global'] : parts;
    } else if (Array.isArray(countryField) && countryField.length > 0) {
      countries = countryField.some(isGlobalRegion)
        ? ['global']
        : countryField.map((c) => String(c).toLowerCase().trim()).filter(Boolean);
    }
  }

  const validFrom = item.code_availabletime_start
    ? new Date(item.code_availabletime_start).toISOString()
    : new Date().toISOString();
  const validUntil = item.code_availabletime_end
    ? new Date(item.code_availabletime_end).toISOString()
    : '';

  return {
    id: `ali-${promoCode}`,
    store: 'aliexpress',
    code: String(promoCode).trim(),
    countries: countries.length ? countries : ['global'],
    userType: item.is_new_user ? 'new' : 'all',
    currency: item.currency || 'USD',
    discountType: 'fixed',
    discountValue: Number(item.code_value || item.code_amount || item.discount || 0),
    maxDiscount: null,
    minSpend: Number(item.code_mini_spend || item.min_spend || 0),
    validFrom,
    validUntil,
    channel: item.channel === 'app' ? 'app' : 'both',
    sourceUrl: item.code_promotionurl || 'https://portals.aliexpress.com',
    lastVerifiedAt: new Date().toISOString(),
    affiliateUrl: item.code_promotionurl || '',
    category: null,
    title: {
      es: `Descuento de $${item.code_value || item.discount} en pedidos desde $${item.code_mini_spend || 0}`,
      en: `$${item.code_value || item.discount} off orders over $${item.code_mini_spend || 0}`
    }
  };
}

export function parseAndValidateFeed(rawItems, source = 'manual') {
  const normalized = rawItems.map((item) => {
    if (source === 'admitad') return normalizeAdmitad(item);
    if (source === 'aliexpress') return normalizeAliExpressPortals(item);
    return item;
  });

  const valid = [];
  const invalid = [];

  for (const c of normalized) {
    const errs = validateCoupon(c);
    if (errs.length === 0) {
      valid.push(c);
    } else {
      invalid.push({ coupon: c, errors: errs });
    }
  }

  return { valid, invalid };
}

// Ejecución CLI si se llama directamente
if (process.argv[1] && process.argv[1].endsWith('ingest-coupons.js')) {
  const args = process.argv.slice(2);
  const fileArg = args.find((a) => a.startsWith('--file='));
  const sourceArg = args.find((a) => a.startsWith('--source='));

  if (!fileArg) {
    console.log('Uso: node scripts/ingest-coupons.js --file=./path-to-feed.json [--source=admitad|aliexpress|manual]');
    process.exit(0);
  }

  const filePath = path.resolve(process.cwd(), fileArg.replace('--file=', ''));
  const source = sourceArg ? sourceArg.replace('--source=', '') : 'manual';

  if (!fs.existsSync(filePath)) {
    console.error(`Archivo no encontrado: ${filePath}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const list = Array.isArray(raw) ? raw : (raw.coupons || raw.items || raw.results || raw.promos || []);
  const { valid, invalid } = parseAndValidateFeed(list, source);

  console.log(`\n--- RESULTADO DE INGESTIÓN (${source}) ---`);
  console.log(`Total leídos: ${list.length}`);
  console.log(`Válidos y publicables: ${valid.length}`);
  console.log(`Inválidos / rechazados: ${invalid.length}`);

  if (invalid.length > 0) {
    console.log('\nPrimeros rechazos:');
    invalid.slice(0, 5).forEach((inv) => {
      console.log(` - Código "${inv.coupon?.code || 'sin-código'}": falló en [${inv.errors.join(', ')}]`);
    });
  }

  if (valid.length > 0) {
    console.log('\nEjemplo de salida para VERIFIED_COUPONS:');
    console.log(JSON.stringify(valid.slice(0, 2), null, 2));
  }
}
