/**
 * INGESTIÓN AUTOMÁTICA ADMITAD XML -> SUPABASE POSTGRESQL
 * --------------------------------------------------------
 * Parsea el feed XML de Admitad, valida los cupones contra las reglas oficiales
 * y los inserta directamente en la tabla `public.cuponestech_coupons` con tu
 * enlace oficial de AliExpress Portals (s.click.aliexpress.com/e/_c3mBZjPN).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateCoupon } from '../src/data/verifiedCoupons.js';
import { upsertCouponToDB } from '../src/data/dbClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env si existe
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

async function getXmlContent() {
  const argTarget = process.argv[2];
  const url = (argTarget && argTarget.startsWith('http')) ? argTarget : process.env.ADMITAD_COUPONS_XML_URL;

  if (url) {
    try {
      console.log('[Admitad Feed] Descargando feed XML en vivo desde Admitad...');
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        console.log(`[Admitad Feed] Descarga exitosa (${text.length} bytes recibidos).`);
        return text;
      }
      console.warn(`[Admitad Feed] HTTP ${res.status} al descargar feed, intentando archivo local...`);
    } catch (e) {
      console.warn('[Admitad Feed] Error en descarga HTTP, intentando archivo local:', e.message);
    }
  }

  const localPath = (argTarget && !argTarget.startsWith('http')) ? argTarget : 'c:/Users/everd/Downloads/admitad_coupons.xml';
  if (fs.existsSync(localPath)) {
    console.log(`[Admitad Feed] Cargando archivo local: ${localPath}`);
    return fs.readFileSync(localPath, 'utf-8');
  }

  throw new Error(`No se pudo obtener el feed XML (ni por URL ni en ${localPath})`);
}

function parseCouponFromXml(xmlChunk, { sourceUrl = 'https://portals.aliexpress.com' } = {}) {
  const idMatch = xmlChunk.match(/<coupon id="(\d+)">/);
  const rawId = idMatch ? idMatch[1] : '';
  const codeMatch = xmlChunk.match(/<promocode>(.*?)<\/promocode>/);
  const code = codeMatch ? codeMatch[1].trim() : '';
  const isCartCode = /^[A-Za-z0-9]{5,12}$/.test(code) && !/^not[\s_]?required$/i.test(code);
  const couponScope = isCartCode ? 'cart' : 'campaign';

  const nameMatch = xmlChunk.match(/<name>(.*?)<\/name>/);
  const name = nameMatch ? nameMatch[1].trim() : '';
  const descMatch = xmlChunk.match(/<description>([\s\S]*?)<\/description>/);
  const desc = descMatch ? descMatch[1].trim() : '';
  const dateStartMatch = xmlChunk.match(/<date_start>(.*?)<\/date_start>/);
  const dateStart = dateStartMatch ? dateStartMatch[1].trim() : '';
  const dateEndMatch = xmlChunk.match(/<date_end>(.*?)<\/date_end>/);
  const dateEnd = dateEndMatch ? dateEndMatch[1].trim() : '';
  const discountMatch = xmlChunk.match(/<discount>(.*?)<\/discount>/);
  const discountRaw = discountMatch ? discountMatch[1].trim() : '';

  let countries = ['global'];
  let currency = 'USD';
  let discountValue = 0;
  let minSpend = 0;
  let userType = 'all';

  if (name.includes('New User') || desc.includes('New User') || name.includes('NEWUS')) {
    userType = 'new';
  }

  const lowerName = name.toLowerCase();
  const lowerDesc = desc.toLowerCase();

  if (lowerName.includes(' sale es ') || lowerName.includes('codes: esd') || lowerName.includes('codes: aees')) {
    countries = ['es'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale mx ') || lowerName.includes('alimx')) {
    countries = ['mx'];
    currency = 'MXN';
  } else if (lowerName.includes(' sale cl ') || lowerName.includes('claf')) {
    countries = ['cl'];
    currency = 'USD';
  } else if (lowerName.includes(' sale pt ') || lowerName.includes('ptd')) {
    countries = ['pt'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale fr ') || lowerName.includes('11fr')) {
    countries = ['fr'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale it ') || lowerName.includes('itaff')) {
    countries = ['it'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale de ') || lowerName.includes('11de')) {
    countries = ['de'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale uk ') || lowerName.includes('26novbd')) {
    countries = ['gb'];
    currency = 'GBP';
  } else if (lowerName.includes(' sale nl ') || lowerName.includes('11nl')) {
    countries = ['nl'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale pl ') || lowerName.includes('pld')) {
    countries = ['pl'];
    currency = 'USD';
  } else if (lowerName.includes(' sale ua ') || lowerName.includes('uad')) {
    countries = ['ua'];
    currency = 'USD';
  } else if (lowerName.includes('cz, hu') || lowerName.includes('ceed')) {
    countries = ['cz', 'hu'];
    currency = 'EUR';
  } else if (lowerName.includes('nwed') || lowerDesc.includes('at, be, dk, fi, ie, se')) {
    countries = ['at', 'be', 'dk', 'fi', 'ie', 'se'];
    currency = 'EUR';
  } else if (lowerName.includes(' sale ca ') || lowerName.includes('aeca')) {
    countries = ['ca'];
    currency = 'CAD';
  } else if (lowerName.includes(' sale au ') || lowerName.includes('auau')) {
    countries = ['au'];
    currency = 'AUD';
  } else if (lowerName.includes(' sale il ') || lowerName.includes('ilaff')) {
    countries = ['il'];
    currency = 'USD';
  } else if (lowerName.includes(' sale kr ') || lowerName.includes('gons')) {
    countries = ['kr'];
    currency = 'USD';
  } else if (lowerName.includes(' sale jp ') || lowerName.includes('jpaf')) {
    countries = ['jp'];
    currency = 'JPY';
  } else if (lowerName.includes('us new user') || lowerName.includes('newus')) {
    countries = ['us'];
    currency = 'USD';
  } else if (lowerName.includes('oeud') || lowerDesc.includes('bg, hr, cy, ee, gr, lv, lt, lu, mt, ro, sk, si')) {
    countries = ['bg', 'hr', 'cy', 'ee', 'gr', 'lv', 'lt', 'lu', 'mt', 'ro', 'sk', 'si'];
    currency = 'USD';
  } else if (lowerName.includes(' sale ww ') || lowerName.includes('otd')) {
    // Los códigos OTD son "Rest of the World (Others)" y en su descripción excluyen explícitamente a 121 países (incluyendo US, NI, MX, ES, CL, AR, CO, etc.).
    // Solo aplican a países no excluidos (PA, EC, NZ, ZA, MA, etc.) y NUNCA a 'global' ni a los excluidos.
    countries = ['pa', 'ec', 'nz', 'za', 'ma'];
    currency = 'USD';
  }

  const cleaned = name.replace(/,/g, '');
  const m1 = cleaned.match(/(?:get|code\s+\w+:)?\s*(?:us|ca|au|mx)?\s*[\$€£]?\s*(\d+)\s*(?:€|円|usd|eur|gbp)?\s*(?:off|de descuento|de remise)?\s*(?:on orders over|orders over|en compras mínimas de|d'achat|dès)\s*(?:us|ca|au|mx)?\s*[\$€£]?\s*(\d+)/i);
  if (m1) {
    discountValue = parseFloat(m1[1]);
    minSpend = parseFloat(m1[2]);
  } else {
    const m2 = cleaned.match(/(\d+)\s*€\s*de remise dès\s*(\d+)\s*€/i);
    if (m2) {
      discountValue = parseFloat(m2[1]);
      minSpend = parseFloat(m2[2]);
    }
  }

  if (!discountValue && discountRaw) {
    const rawVal = parseFloat(discountRaw.replace('%', ''));
    if (!isNaN(rawVal)) discountValue = rawVal;
  }

  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '円' : currency;

  return {
    id: `ali-${(code || 'campaign').toLowerCase()}-${rawId}`,
    store: 'aliexpress',
    code,
    couponScope,
    sourceOrigin: 'admitad',
    countries,
    userType,
    currency,
    discountType: 'fixed',
    discountValue: discountValue || 3,
    maxDiscount: null,
    minSpend: minSpend || 15,
    validFrom: new Date(dateStart).toISOString(),
    validUntil: new Date(dateEnd).toISOString(),
    channel: 'both',
    sourceUrl: String(sourceUrl || '').trim(),
    lastVerifiedAt: new Date().toISOString(),
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: `Descuento de ${symbol}${discountValue} en compras desde ${symbol}${minSpend} — Código ${code}`,
      en: `${symbol}${discountValue} off orders over ${symbol}${minSpend} — Code ${code}`
    },
    notes: {
      es: `Promoción oficial 11.11 de AliExpress. Válido en checkout para cuentas con país de envío: ${countries.join(', ').toUpperCase()}.`,
      en: `Official AliExpress 11.11 promo. Valid at checkout for accounts shipping to: ${countries.join(', ').toUpperCase()}.`
    }
  };
}

export function parseAdmitadXml(xmlContent, options = {}) {
  const couponMatches = xmlContent.match(/<coupon id="(\d+)">([\s\S]*?)<\/coupon>/g) || [];
  const valid = [];
  const invalid = [];

  for (const chunk of couponMatches) {
    const c = parseCouponFromXml(chunk, options);
    if (!c) continue;
    if (!c.sourceUrl) {
      console.warn(`[Ingesta Admitad] Fila ${c.id} omitida: falta source_url.`);
      invalid.push({ coupon: c, errors: ['sourceUrl'] });
      continue;
    }
    const errors = validateCoupon(c);
    if (errors.length === 0) {
      valid.push(c);
    } else {
      invalid.push({ coupon: c, errors });
    }
  }

  return { total: couponMatches.length, valid, invalid };
}

export async function run() {
  const content = await getXmlContent();
  const parsed = parseAdmitadXml(content);
  console.log(`Leídos ${parsed.total} cupones totales desde XML.`);
  console.log(`Cupones parseados y validados: ${parsed.valid.length}`);

  let insertedCount = 0;
  for (const c of parsed.valid) {
    try {
      await upsertCouponToDB(c);
      insertedCount++;
    } catch (e) {
      console.error(`Error insertando ${c.code}:`, e.message);
    }
  }

  console.log(`\n¡Éxito! ${insertedCount} cupones oficiales insertados en Supabase PostgreSQL.`);
  return { total: parsed.total, inserted: insertedCount };
}

if (process.argv[1] && process.argv[1].endsWith('ingest-admitad-xml.js')) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error general de ejecución:', err);
      process.exit(1);
    });
}
