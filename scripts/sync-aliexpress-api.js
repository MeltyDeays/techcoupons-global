/**
 * SINCRONIZACIÓN MULTI-PAÍS Y GLOBAL VÍA ALIEXPRESS OPEN SERVICE API
 * ------------------------------------------------------------------
 * Descarga ofertas activas de todas las campañas globales y regionales configuradas,
 * fusiona con el catálogo base preservando los 381 productos originales como respaldo
 * global, y escribe src/data/aliexpress_catalog_deals.json.
 *
 * Uso:
 *   node --env-file=.env scripts/sync-aliexpress-api.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fetchAliExpressMultiCountryDeals,
  COUNTRY_PROMO_FEEDS,
  GLOBAL_PROMO_FEEDS
} from '../src/data/affiliateClients.js';
import { LOCALES } from '../src/config/locales.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, '../src/data/aliexpress_catalog_deals.json');

export function mergeCatalogDeals(existingDeals = [], syncedDeals = []) {
  const byId = new Map();

  for (const item of existingDeals) {
    if (!item?.ProductId) continue;
    const pid = String(item.ProductId);
    byId.set(pid, {
      ...item,
      ProductId: pid,
      countries: Array.isArray(item.countries) && item.countries.length ? item.countries : ['global']
    });
  }

  for (const fresh of syncedDeals) {
    const pid = String(fresh.ProductId);
    const prev = byId.get(pid);
    if (!prev) {
      byId.set(pid, fresh);
      continue;
    }

    const mergedCountries = prev.countries.includes('global') || fresh.countries.includes('global')
      ? ['global']
      : [...new Set([...prev.countries, ...fresh.countries])];

    byId.set(pid, {
      ...prev,
      ...(!prev['Code Name'] && fresh['Code Name'] ? {
        'Code Name': fresh['Code Name'],
        'Code Start Time': fresh['Code Start Time'],
        'Code End Time': fresh['Code End Time'],
        'Code Value': fresh['Code Value'],
        'Code Quantity': fresh['Code Quantity'],
        'Code Minimum Spend': fresh['Code Minimum Spend']
      } : {}),
      countries: mergedCountries
    });
  }

  return [...byId.values()];
}

async function main() {
  const appKey = process.env.ALI_APP_KEY;
  const appSecret = process.env.ALI_APP_SECRET;
  const trackingId = process.env.ALI_TRACKING_ID || 'default';

  if (!appKey || !appSecret) {
    console.error('Error: Faltan ALI_APP_KEY o ALI_APP_SECRET en .env');
    process.exit(1);
  }

  const existing = fs.existsSync(CATALOG_PATH)
    ? JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'))
    : [];

  console.log(`Consultando AliExpress Open Service (${GLOBAL_PROMO_FEEDS.length} feeds globales + ${Object.keys(COUNTRY_PROMO_FEEDS).length} países con feeds dedicados)...`);

  const { deals, rawCouponItems, feedStats } = await fetchAliExpressMultiCountryDeals({
    appKey,
    appSecret,
    trackingId,
    globalPages: 1,
    regionalPages: 1,
    pageSize: 50,
    maxPerGlobalFeed: 20,
    maxPerRegionalFeed: 15,
    concurrency: 5
  });

  const merged = mergeCatalogDeals(existing, deals);
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(merged, null, 2), 'utf-8');

  const sizeKb = (fs.statSync(CATALOG_PATH).size / 1024).toFixed(1);
  const allIsos = [...new Set(LOCALES.map((l) => l.iso))];
  const regionalIsos = allIsos.filter((iso) => merged.some((d) => d.countries.includes(iso)));
  const withCode = merged.filter((d) => d['Code Name']).length;
  const errors = feedStats.filter((f) => f.error).length;

  console.log(`Sincronización completada:`);
  console.log(` - Productos base previos: ${existing.length}`);
  console.log(` - Productos API nuevos/unicos: ${deals.length} (con cupón API: ${rawCouponItems.length})`);
  console.log(` - Total catálogo unificado: ${merged.length} (${withCode} con código promocional, ${sizeKb} KB)`);
  console.log(` - Países con ofertas regionales dedicadas: ${regionalIsos.length}/${allIsos.length}`);
  console.log(` - Países cubiertos vía campañas globales fallback: ${allIsos.length}/${allIsos.length}`);
  if (errors > 0) console.log(` - Feeds con error/timeout ignorados: ${errors}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch((err) => {
    console.error('Error fatal en sync-aliexpress-api:', err.message);
    process.exit(1);
  });
}
