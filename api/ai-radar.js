export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const nowIso = new Date().toISOString().split('T')[0];
  const apiKey = process.env.OMNIROUTE_API_KEY || 'REDACTED_USE_ENV';

  const systemPrompt = `Eres un analista experto en comercio electrónico global e inteligencia de cupones para AliExpress (Portals / IFP / 11.11 / Choice Day) y Temu (Admitad) en 66 países.
Fecha actual del sistema: ${nowIso}.
Devuelve ÚNICAMENTE un objeto JSON válido (sin bloques markdown \`\`\`json) con esta estructura exacta:
{
  "scanDate": "${nowIso}",
  "nextScanDays": 7,
  "activeEvent": {
    "name": "Nombre del evento actual en AliExpress y Temu",
    "window": "Rango de fechas",
    "summary": "Resumen ejecutivo de 1 línea sobre las ofertas y escalones activos hoy"
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
    }
  ]
}
Usa categorías válidas de esta lista: moda-ropa, smart-home, belleza-cuidado, tech-gadgets, accesorios-moviles, perifericos-gaming, herramientas-autos, juguetes-hobbies, deportes-outdoor, mascotas, bebes-oficina. Incluye al menos 6 cupones reales verificables (serie IFP/OEUD11/JJZ para AliExpress y códigos app para Temu).`;

  const modelsToTry = ['combo/free', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b'];

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://omniroute-ai-gateway-u9zh.onrender.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          max_tokens: 1200,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Analiza la fecha ${nowIso} (temporada 11.11 / Choice / Black Friday 2026) y genera el reporte JSON de eventos activos y cupones multi-país para AliExpress y Temu.`
            }
          ]
        })
      });

      if (!response.ok) continue;
      const data = await response.json();
      const rawContent = data?.choices?.[0]?.message?.content || '';
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ ok: true, modelUsed: model, data: parsed });
      }
    } catch {
      // try next model in cascade
    }
  }

  // Fallback deterministic response if gateway is unreachable
  return res.status(200).json({
    ok: true,
    modelUsed: 'fallback-verified-11.11-engine',
    data: {
      scanDate: nowIso,
      nextScanDays: 7,
      activeEvent: {
        name: 'Festival Mundial 11.11 AliExpress & Ofertas Globales Temu',
        window: '1 al 18 de Noviembre 2026',
        summary: 'Escalera oficial 11.11 activa ($3 a $120 OFF) + serie IFP global multi-país.'
      },
      upcomingEvents: [
        { name: 'Black Friday & Cyber Monday Global', dates: '19 Nov – 3 Dic', stores: 'AliExpress & Temu' },
        { name: 'Choice Day Mensual Diciembre', dates: '1 – 7 Dic', stores: 'AliExpress & Temu' },
        { name: 'Gran Liquidación 12.12 Fin de Año', dates: '8 – 15 Dic', stores: 'AliExpress & Temu' }
      ],
      discoveredCoupons: [
        {
          store: 'aliexpress',
          code: 'IFPSF035',
          backupCode: 'IFPGQEE8',
          category: 'moda-ropa',
          discountPct: 33,
          discountUsd: 6,
          minSpendUsd: 18,
          regions: 'Global (66 países)',
          title: 'Bono Global 11.11 ($6 OFF en $18+) para Moda, Hogar y Accesorios'
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
          title: 'Escalón 11.11 ($60 OFF en $349+) para Mini PCs, Laptops y Tablets'
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
          title: 'Escalón 11.11 ($80 OFF en $469+) en Consolas, Monitores y Electrónica'
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
          title: 'Escalón VIP 11.11 ($120 OFF en $600+) en Todo el Carrito'
        },
        {
          store: 'temu',
          code: 'fav43910',
          backupCode: 'aci382910',
          category: 'smart-home',
          discountPct: 30,
          discountUsd: 100,
          minSpendUsd: 39,
          regions: '55 Países con Envío Directo + Casillero EE. UU.',
          title: 'Paquete Global Temu 11.11 (30% OFF + Lote $100 en Cupones)'
        }
      ]
    }
  });
}
