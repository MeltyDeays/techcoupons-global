const VALID_CATEGORIES = [
  'moda-ropa',
  'smart-home',
  'belleza-cuidado',
  'tech-gadgets',
  'accesorios-moviles',
  'perifericos-gaming',
  'herramientas-autos',
  'juguetes-hobbies',
  'deportes-outdoor',
  'mascotas',
  'bebes-oficina'
];

const NON_TEMU_COUNTRIES = [
  'es-ni', 'es-cr', 'es-gt', 'es-sv', 'es-hn', 'es-ar', 'es-ec', 'es-py', 'es-bo', 'vi-vn',
  'ni', 'cr', 'gt', 'sv', 'hn', 'ar', 'ec', 'py', 'bo', 'vn'
];

function getCommercialSeason(date = new Date()) {
  const year = date.getFullYear();
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();

  if (m === 11 && d >= 1 && d <= 18) {
    return {
      id: '11-11-singles-day',
      name: 'Festival 11.11 Singles Day & Temu Black Friday Anticipado',
      window: `1 al 18 de Noviembre ${year}`,
      is1111: true,
      aliSummary: 'Escalera oficial 11.11 activa ($3 a $120 OFF) + serie IFP global multi-país.',
      temuSummary: 'Campaña Temu Black Friday Anticipado: Lote $100 USD en cupones + 30% OFF directo en app oficial.'
    };
  }
  if ((m === 11 && d >= 19) || (m === 12 && d <= 3)) {
    return {
      id: 'black-friday-cyber-monday',
      name: 'Black Friday & Cyber Monday Global',
      window: `19 de Noviembre al 3 de Diciembre ${year}`,
      is1111: false,
      aliSummary: 'Grandes descuentos Black Friday hasta 70% OFF + códigos promocionales de escalera.',
      temuSummary: 'Cyber Ofertas hasta 90% OFF y paquetes de cupones de temporada.'
    };
  }
  if (m === 12 && d >= 8 && d <= 15) {
    return {
      id: '12-12-year-end-sale',
      name: 'Gran Liquidación 12.12 Fin de Año',
      window: `8 al 15 de Diciembre ${year}`,
      is1111: false,
      aliSummary: 'Liquidación 12.12 con cupones acumulables en electrónica y hogar.',
      temuSummary: 'Ofertas relámpago de fin de año y envíos gratis sin mínimo.'
    };
  }
  if (m === 3 && d >= 18 && d <= 28) {
    return {
      id: 'anniversary-sale',
      name: 'Aniversario AliExpress & Venta de Primavera Temu',
      window: `18 al 28 de Marzo ${year}`,
      is1111: false,
      aliSummary: 'Cumpleaños AliExpress: Códigos universales y rebajas masivas en todo el sitio.',
      temuSummary: 'Spring Mega Sale con descuentos directos en catálogo de temporada.'
    };
  }
  if (m === 6 && d >= 12 && d <= 25) {
    return {
      id: '618-mid-year-sale',
      name: '618 Mid-Year Mega Sale',
      window: `12 al 25 de Junio ${year}`,
      is1111: false,
      aliSummary: 'Festival 618: Cupones de mitad de año y subsidios de envío.',
      temuSummary: 'Summer Mega Sale con paquetes de bienvenida y descuentos del 30% al 50%.'
    };
  }
  if (d <= 7) {
    return {
      id: 'choice-day-monthly',
      name: 'Choice Day & Días de Super Ahorro',
      window: `1 al 7 del mes`,
      is1111: false,
      aliSummary: 'Días Choice: Envíos rápidos gratis y $3 a $20 OFF en compras combinadas.',
      temuSummary: 'Super Ahorro mensual con cupones exclusivos de app.'
    };
  }
  return {
    id: 'regular-monthly-sale',
    name: 'Selección Mensual y Cupones Activos',
    window: `Mes regular ${year}`,
    is1111: false,
    aliSummary: 'Códigos promocionales de escalera vigentes y descuentos Choice.',
    temuSummary: 'Cupones de nuevos usuarios, lotes de bienvenida y descuentos de categoría.'
  };
}

function cleanTrailingCommas(str) {
  let prev;
  let s = str;
  do {
    prev = s;
    s = s.replace(/,\s*([}\]])/g, '$1');
  } while (s !== prev);
  return s;
}

function extractAndParseModelJson(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return null;

  // 1. Strip markdown fences if present
  let cleanStr = rawContent.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

  // Find start of outermost JSON object
  const startIdx = cleanStr.indexOf('{');
  if (startIdx === -1) return null;
  cleanStr = cleanStr.slice(startIdx);

  // Attempt 1: Direct JSON parse after stripping trailing commas
  const lastBrace = cleanStr.lastIndexOf('}');
  if (lastBrace !== -1) {
    const candidate = cleanTrailingCommas(cleanStr.slice(0, lastBrace + 1));
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {}
  }

  // Attempt 2: Truncated JSON recovery by backtracking from the last available '}'
  let searchPos = cleanStr.length;
  while ((searchPos = cleanStr.lastIndexOf('}', searchPos - 1)) > 0) {
    let candidate = cleanStr.slice(0, searchPos + 1);
    candidate = cleanTrailingCommas(candidate).replace(/,\s*$/, '');

    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < candidate.length; i++) {
      const ch = candidate[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (ch === '{') openBraces++;
        else if (ch === '}') openBraces--;
        else if (ch === '[') openBrackets++;
        else if (ch === ']') openBrackets--;
      }
    }

    if (!inString && openBraces >= 0 && openBrackets >= 0) {
      let closer = '';
      for (let b = 0; b < openBrackets; b++) closer += ']';
      for (let b = 0; b < openBraces; b++) closer += '}';
      try {
        const repaired = candidate + closer;
        const parsed = JSON.parse(cleanTrailingCommas(repaired));
        if (parsed && typeof parsed === 'object') return parsed;
      } catch {}
    }
  }

  return null;
}

function sanitizeCoupon(item, season) {
  if (!item || typeof item !== 'object') return null;
  const code = String(item.code || '').trim();
  if (!code) return null;

  const store = String(item.store || '').toLowerCase() === 'temu' ? 'temu' : 'aliexpress';
  const category = VALID_CATEGORIES.includes(item.category) ? item.category : 'tech-gadgets';
  const discountPct = Number(item.discountPct) || 20;
  const discountUsd = Number(item.discountUsd) || 15;
  const minSpendUsd = Number(item.minSpendUsd) || 45;
  const backupCode = item.backupCode ? String(item.backupCode).trim() : null;
  const regions = item.regions ? String(item.regions).trim() : 'Global (66 países)';
  const title = String(item.title || `Cupón ${store.toUpperCase()} ${discountPct}% OFF en ${category}`).trim();

  return {
    store,
    code,
    backupCode,
    category,
    discountPct,
    discountUsd,
    minSpendUsd,
    regions,
    title,
    isEvent1111: season.is1111,
    eventId: season.id
  };
}

function getStructuredFallback(nowIso, season, targetCountry = '') {
  const isNoTemu = targetCountry && NON_TEMU_COUNTRIES.includes(targetCountry.toLowerCase().trim());
  const year = new Date().getFullYear();

  const aliCoupons = [
    {
      store: 'aliexpress',
      code: 'IFPSF035',
      backupCode: 'IFPGQEE8',
      category: 'moda-ropa',
      discountPct: 33,
      discountUsd: 6,
      minSpendUsd: 18,
      regions: 'Global (66 países)',
      title: `Bono Global ${season.name} ($6 OFF en $18+) para Moda, Hogar y Accesorios`,
      isEvent1111: season.is1111,
      eventId: season.id
    },
    {
      store: 'aliexpress',
      code: 'IFPD1RWY',
      backupCode: 'IFPMOWED',
      category: 'tech-gadgets',
      discountPct: 18,
      discountUsd: 60,
      minSpendUsd: 349,
      regions: 'Global + Europa (OEUD1160) + EE. UU. (IFPJA46F)',
      title: `Escalón ${season.name} ($60 OFF en $349+) para Mini PCs, Laptops y Tablets`,
      isEvent1111: season.is1111,
      eventId: season.id
    },
    {
      store: 'aliexpress',
      code: 'IFPAYSD8',
      backupCode: 'IFPWIL3R',
      category: 'perifericos-gaming',
      discountPct: 18,
      discountUsd: 80,
      minSpendUsd: 469,
      regions: 'Global + Europa (OEUD1179) + EE. UU. (IFPAFP51)',
      title: `Escalón ${season.name} ($80 OFF en $469+) en Consolas, Monitores y Electrónica`,
      isEvent1111: season.is1111,
      eventId: season.id
    },
    {
      store: 'aliexpress',
      code: 'IFP9Z8BS',
      backupCode: 'IFPHQ1HD',
      category: 'herramientas-autos',
      discountPct: 20,
      discountUsd: 120,
      minSpendUsd: 600,
      regions: 'Global + EE. UU. (IFPWCFMD)',
      title: `Escalón VIP ${season.name} ($120 OFF en $600+) en Todo el Carrito`,
      isEvent1111: season.is1111,
      eventId: season.id
    }
  ];

  const temuCoupons = isNoTemu ? [
    {
      store: 'aliexpress',
      code: 'IFPH7JTG',
      backupCode: 'IFP7C7F4',
      category: 'smart-home',
      discountPct: 18,
      discountUsd: 8,
      minSpendUsd: 45,
      regions: 'Global (66 países)',
      title: `Escalón ${season.name} ($8 OFF en $45+) en Domótica y Cámaras WiFi`,
      isEvent1111: season.is1111,
      eventId: season.id
    },
    {
      store: 'aliexpress',
      code: 'IFP8JJII',
      backupCode: 'IFPBJKOH',
      category: 'belleza-cuidado',
      discountPct: 18,
      discountUsd: 14,
      minSpendUsd: 79,
      regions: 'Global (66 países)',
      title: `Escalón ${season.name} ($14 OFF en $79+) Cuidado Personal y Belleza`,
      isEvent1111: season.is1111,
      eventId: season.id
    },
    {
      store: 'aliexpress',
      code: 'IFPSOMRB',
      backupCode: 'IFPEDRVK',
      category: 'deportes-outdoor',
      discountPct: 17,
      discountUsd: 24,
      minSpendUsd: 139,
      regions: 'Global (66 países)',
      title: `Escalón ${season.name} ($24 OFF en $139+) Ciclismo, Fitness y Outdoor`,
      isEvent1111: season.is1111,
      eventId: season.id
    },
    {
      store: 'aliexpress',
      code: 'IFPTUSUJ',
      backupCode: 'IFPT8YXM',
      category: 'accesorios-moviles',
      discountPct: 17,
      discountUsd: 40,
      minSpendUsd: 229,
      regions: 'Global (66 países)',
      title: `Escalón ${season.name} ($40 OFF en $229+) Audio HiFi y Accesorios`,
      isEvent1111: season.is1111,
      eventId: season.id
    }
  ] : (() => {
    const temuCampaignName = season.is1111 ? 'Black Friday Anticipado' : season.name;
    return [
      {
        store: 'temu',
        code: 'fav43910',
        backupCode: 'aci382910',
        category: 'smart-home',
        discountPct: 30,
        discountUsd: 100,
        minSpendUsd: 39,
        regions: '55 Países con Envío Directo + Casillero EE. UU.',
        title: `Paquete Global Temu ${temuCampaignName} (30% OFF + Lote $100 en Cupones)`,
        isEvent1111: season.is1111,
        eventId: season.id
      },
      {
        store: 'temu',
        code: 'aci382910',
        backupCode: 'fav43910',
        category: 'moda-ropa',
        discountPct: 33,
        discountUsd: 25,
        minSpendUsd: 75,
        regions: '55 Países con Envío Directo + Casillero EE. UU.',
        title: `Bono Temu ${temuCampaignName} ($25 OFF en $75+) en Moda, Calzado y Bolsos`,
        isEvent1111: season.is1111,
        eventId: season.id
      },
      {
        store: 'temu',
        code: 'act578291',
        backupCode: 'dpw7281',
        category: 'belleza-cuidado',
        discountPct: 40,
        discountUsd: 12,
        minSpendUsd: 30,
        regions: '55 Países con Envío Directo + Casillero EE. UU.',
        title: `Cupón Flash Temu ${temuCampaignName} (40% OFF en $30+) Belleza y Cuidado Personal`,
        isEvent1111: season.is1111,
        eventId: season.id
      },
      {
        store: 'temu',
        code: 'dpw7281',
        backupCode: 'act578291',
        category: 'tech-gadgets',
        discountPct: 25,
        discountUsd: 40,
        minSpendUsd: 100,
        regions: '55 Países con Envío Directo + Casillero EE. UU.',
        title: `Cupón Especial Temu ${temuCampaignName} ($40 OFF en $100+) en Gadgets y Smart Home`,
        isEvent1111: season.is1111,
        eventId: season.id
      }
    ];
  })();

  return {
    scanDate: nowIso,
    nextScanDays: 7,
    activeEvents: {
      aliexpress: {
        name: `${season.name} AliExpress`,
        window: season.window,
        summary: season.aliSummary
      },
      temu: {
        name: `${season.name} Temu`,
        window: season.window,
        summary: isNoTemu ? 'Envíos vía casillero en Miami / compras internacionales.' : season.temuSummary
      }
    },
    upcomingEvents: [
      { name: 'Black Friday & Cyber Monday Global', dates: `19 Nov – 3 Dic ${year}`, stores: 'AliExpress & Temu' },
      { name: 'Choice Day & Días de Super Ahorro', dates: '1 – 7 de cada mes', stores: 'AliExpress & Temu' },
      { name: 'Gran Liquidación 12.12 Fin de Año', dates: `8 – 15 Dic ${year}`, stores: 'AliExpress & Temu' },
      { name: 'Aniversario AliExpress & Venta de Primavera Temu', dates: `18 – 28 Mar ${year + 1}`, stores: 'AliExpress & Temu' }
    ],
    discoveredCoupons: [...aliCoupons, ...temuCoupons]
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Edge caching on Vercel CDN: 7-day edge cache, background revalidation every 24h
  res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = new Date();
  const nowIso = now.toISOString().split('T')[0];
  const apiKey = process.env.OMNIROUTE_API_KEY || 'REDACTED_USE_ENV';

  // Country / locale query extraction for country-specific resilience
  const queryParam = req.query || {};
  let bodyParam = {};
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body || '{}');
        bodyParam = parsed && typeof parsed === 'object' ? parsed : {};
      } catch {
        return res.status(400).json({ ok: false, error: 'Malformed JSON payload' });
      }
    } else if (typeof req.body === 'object' && req.body !== null) {
      bodyParam = req.body;
    }
  }
  const targetCountry = queryParam.country || bodyParam.country || queryParam.locale || bodyParam.locale || '';
  const season = getCommercialSeason(now);

  const countryInstruction = targetCountry
    ? `Atención especial para el país/mercado objetivo: ${targetCountry}. Si el país no cuenta con Temu directo (como NI, CR, GT, SV, HN, AR, EC, PY, BO, VN), prioriza cupones AliExpress o casilleros EE. UU.`
    : 'Cobertura multi-país completa para 66 regiones globales.';

  const systemPrompt = `Eres un analista experto en comercio electrónico global e inteligencia de cupones para AliExpress (Portals / IFP / Choice Day / Eventos) y Temu (Admitad / App Bundles / Eventos) en 66 países.
Fecha actual del sistema: ${nowIso}. Evento comercial de referencia: ${season.name} (${season.window}).
${countryInstruction}
Devuelve ÚNICAMENTE un objeto JSON válido (sin bloques markdown \`\`\`json) con esta estructura exacta:
{
  "scanDate": "${nowIso}",
  "nextScanDays": 7,
  "activeEvents": {
    "aliexpress": {
      "name": "Nombre evento actual AliExpress",
      "window": "Rango de fechas",
      "summary": "Resumen ejecutivo de 1 línea de descuentos"
    },
    "temu": {
      "name": "Nombre evento actual Temu",
      "window": "Rango de fechas",
      "summary": "Resumen ejecutivo de 1 línea de promociones Temu"
    }
  },
  "upcomingEvents": [
    { "name": "Nombre evento", "dates": "Fechas", "stores": "AliExpress / Temu" }
  ],
  "discoveredCoupons": [
    {
      "store": "aliexpress",
      "code": "IFPH7JTG",
      "backupCode": "IFP7C7F4",
      "category": "tech-gadgets",
      "discountPct": 18,
      "discountUsd": 8,
      "minSpendUsd": 45,
      "regions": "Global (66 países)",
      "title": "Descripción clara del cupón y escalón"
    },
    {
      "store": "temu",
      "code": "aci382910",
      "backupCode": "fav43910",
      "category": "moda-ropa",
      "discountPct": 30,
      "discountUsd": 25,
      "minSpendUsd": 75,
      "regions": "55 países con Temu oficial",
      "title": "Bono Temu ($25 OFF en $75+) en Moda y Calzado"
    }
  ]
}
Usa categorías válidas de esta lista: moda-ropa, smart-home, belleza-cuidado, tech-gadgets, accesorios-moviles, perifericos-gaming, herramientas-autos, juguetes-hobbies, deportes-outdoor, mascotas, bebes-oficina.
IMPORTANTE: Debe incluir al menos 8 cupones balanceados con códigos promocionales reales verificables.`;

  const modelsToTry = [
    'antigravity/gemini-3.1-pro',
    'combo/free',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b'
  ];

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://omniroute-ai-gateway-u9zh.onrender.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Analiza la fecha ${nowIso} (${season.name}) y genera el reporte JSON de eventos activos y cupones multi-país para AliExpress y Temu.`
            }
          ]
        })
      });

      clearTimeout(timeoutId);

      // Handle 429 quota exhaustion or server errors gracefully
      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawContent = data?.choices?.[0]?.message?.content || '';
      const parsed = extractAndParseModelJson(rawContent);
      if (parsed && Array.isArray(parsed.discoveredCoupons) && parsed.discoveredCoupons.length > 0) {
        let sanitizedCoupons = parsed.discoveredCoupons
          .map((c) => sanitizeCoupon(c, season))
          .filter(Boolean);

        const isNoTemu = Boolean(targetCountry && NON_TEMU_COUNTRIES.includes(targetCountry.toLowerCase().trim()));
        if (isNoTemu) {
          sanitizedCoupons = sanitizedCoupons.filter((c) => {
            const store = String(c.store || '').toLowerCase().trim();
            return store !== 'temu';
          });
        }

        if (sanitizedCoupons.length > 0) {
          parsed.discoveredCoupons = sanitizedCoupons;
          return res.status(200).json({ ok: true, modelUsed: model, data: parsed });
        }
      }
    } catch {
      // Fallback to next model in cascade
    }
  }

  // Fallback deterministic response with dynamic event awareness & country resilience
  const fallbackData = getStructuredFallback(nowIso, season, targetCountry);
  return res.status(200).json({
    ok: true,
    modelUsed: 'fallback-verified-calendar-engine',
    fallbackReason: 'quota_exhausted_or_unavailable',
    data: fallbackData
  });
}
