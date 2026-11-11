// Complete 27-Language Native Dictionary:
// UI Micro-labels, Localized US Locker / Freight Forwarder terms, 11 Categories,
// App Dynamics & Mini-Games, 30-Day Price Adjustment & US Locker Guides,
// Shipping Tables, and Localized Route & Category Slugs.

import { EXTRA_LANG_SECTIONS } from './multilingualExtraSections.js';
import { NATIONAL_LANG_SECTIONS } from './multilingualNationalSections.js';

const BASE_DYNAMICS_EN = [
  {
    id: 'dyn-credit777',
    store: 'Temu App',
    storeKey: 'temu',
    code: 'credit777',
    badge: 'CREDIT WHEEL & REWARDS',
    title: 'Account Credit & Reward Wheel Activity (credit777)',
    howItWorks:
      'Type "credit777" into the top search bar in the Temu app to open the official credit-back board and spin for wallet credit.'
  },
  {
    id: 'dyn-claimcredit',
    store: 'Temu App',
    storeKey: 'temu',
    code: 'claimcredit',
    badge: 'DAILY CREDIT CLAIM',
    title: 'Daily Pending Credit Collection Dashboard (claimcredit)',
    howItWorks:
      'If you joined a credit-back promotion, search "claimcredit" in the Temu app every day for 7 days to claim each daily credit installment.'
  },
  {
    id: 'dyn-wincredit',
    store: 'Temu App',
    storeKey: 'temu',
    code: 'wincredit',
    badge: 'COINS-TO-CASH EVENT',
    title: 'Coin Accumulation for Wallet Credit (wincredit)',
    howItWorks:
      'Searching "wincredit" in the Temu app opens the progressive coin challenge that converts event points into direct shopping balance.'
  },
  {
    id: 'dyn-box777',
    store: 'Temu App',
    storeKey: 'temu',
    code: 'box777',
    badge: 'MYSTERY CHESTS',
    title: 'Treasure Box & Flash Bundle Mini-Game (box777)',
    howItWorks:
      'Type "box777" in the Temu search bar to trigger the mystery chest activity with stackable flash coupon packs.'
  },
  {
    id: 'dyn-ali-coins',
    store: 'AliExpress App',
    storeKey: 'aliexpress',
    code: 'Coins Discount Finder',
    badge: 'EXTRA 5%–25% APP DISCOUNT',
    title: 'AliExpress Coins Center + Super Discount Finder',
    howItWorks:
      'Open the "Coins" tab inside the AliExpress mobile app, collect daily coins in one tap, and use the Discount Finder to stack up to 25% extra off.'
  },
  {
    id: 'dyn-ali-mergeboss',
    store: 'AliExpress App',
    storeKey: 'aliexpress',
    code: 'Merge Boss & Prize Land',
    badge: 'OFFICIAL SHOPPING CREDITS',
    title: 'AliExpress Merge Boss & Prize Land Reward Games',
    howItWorks:
      'Under "Account" in the AliExpress app, play Merge Boss or Prize Land to exchange game points for no-minimum shopping credits.'
  }
];

export const US_COUNTRY_LABELS_BY_VIEWER_LANG = {
  es: {
    'en-us': 'Estados Unidos (Inglés • US Locker)',
    'es-us': 'Estados Unidos (Casillero / Locker Miami)'
  },
  en: {
    'en-us': 'United States (Direct & US Locker)',
    'es-us': 'United States (Spanish • US Locker)'
  },
  pt: {
    'en-us': 'Estados Unidos (Inglês • Locker / Redirecionador EUA)',
    'es-us': 'Estados Unidos (Espanhol • Locker / Redirecionador EUA)'
  },
  fr: {
    'en-us': 'États-Unis (Anglais • Casier / Locker US)',
    'es-us': 'États-Unis (Espagnol • Casier / Locker US)'
  },
  de: {
    'en-us': 'Vereinigte Staaten (US-Locker / Weiterleitung)',
    'es-us': 'Vereinigte Staaten (Spanisch • US-Locker)'
  },
  it: {
    'en-us': 'Stati Uniti (Inglese • Locker USA)',
    'es-us': 'Stati Uniti (Spagnolo • Locker USA)'
  },
  nl: {
    'en-us': 'Verenigde Staten (US Locker / Doorstuuradres)',
    'es-us': 'Verenigde Staten (Spaans • US Locker)'
  },
  pl: {
    'en-us': 'Stany Zjednoczone (Skrzynka / Locker USA)',
    'es-us': 'Stany Zjednoczone (Hiszpański • Locker USA)'
  },
  ja: {
    'en-us': 'アメリカ合衆国（米国転送ロッカー・US Locker）',
    'es-us': 'アメリカ合衆国（スペイン語・米国ロッカー）'
  },
  ko: {
    'en-us': '미국 (미국 배대지 / US Locker)',
    'es-us': '미국 (스페인어 • 미국 배대지 / Locker)'
  },
  ar: {
    'en-us': 'الولايات المتحدة (صندوق بريد أمريكي / US Locker)',
    'es-us': 'الولايات المتحدة (الإسبانية • صندوق بريد أمريكي)'
  },
  zh: {
    'en-us': '美国（美国转运仓 / US Locker）',
    'es-us': '美国（西语 • 美国转运仓 / Locker）'
  },
  ru: {
    'en-us': 'США (Американский склад / US Locker)',
    'es-us': 'США (Испанский • Склад / Локер в США)'
  },
  tr: {
    'en-us': 'ABD (Amerika Adresi / US Locker)',
    'es-us': 'ABD (İspanyolca • US Locker)'
  },
  sv: {
    'en-us': 'USA (Amerikansk adress / US Locker)',
    'es-us': 'USA (Spanska • US Locker)'
  },
  no: {
    'en-us': 'USA (Amerikansk adresse / US Locker)',
    'es-us': 'USA (Spansk • US Locker)'
  },
  da: {
    'en-us': 'USA (Amerikansk adresse / US Locker)',
    'es-us': 'USA (Spansk • US Locker)'
  },
  fi: {
    'en-us': 'Yhdysvallat (USA:n edelleenlähetys / US Locker)',
    'es-us': 'Yhdysvallat (Espanja • US Locker)'
  },
  el: {
    'en-us': 'Ηνωμένες Πολιτείες (Θυρίδα ΗΠΑ / US Locker)',
    'es-us': 'Ηνωμένες Πολιτείες (Ισπανικά • US Locker)'
  },
  cs: {
    'en-us': 'Spojené státy (Americká schránka / US Locker)',
    'es-us': 'Spojené státy (Španělština • US Locker)'
  },
  ro: {
    'en-us': 'Statele Unite (Adresă SUA / US Locker)',
    'es-us': 'Statele Unite (Spaniolă • US Locker)'
  },
  hu: {
    'en-us': 'Egyesült Államok (Amerikai csomagpont / US Locker)',
    'es-us': 'Egyesült Államok (Spanyol • US Locker)'
  },
  uk: {
    'en-us': 'США (Американський склад / US Locker)',
    'es-us': 'США (Іспанська • US Locker)'
  },
  th: {
    'en-us': 'สหรัฐอเมริกา (ที่อยู่ชิปปิ้งสหรัฐฯ / US Locker)',
    'es-us': 'สหรัฐอเมริกา (ภาษาสเปน • US Locker)'
  },
  vi: {
    'en-us': 'Hoa Kỳ (Kho nhận hàng Mỹ / US Locker)',
    'es-us': 'Hoa Kỳ (Tiếng Tây Ban Nha • US Locker)'
  },
  he: {
    'en-us': 'ארצות הברית (כתובת אמריקאית / US Locker)',
    'es-us': 'ארצות הברית (ספרדית • US Locker)'
  },
  ms: {
    'en-us': 'Amerika Syarikat (Alamat Kargo AS / US Locker)',
    'es-us': 'Amerika Syarikat (Bahasa Sepanyol • US Locker)'
  }
};

export function getLocalizedCountryName(loc, viewerLang = 'en') {
  if (loc.code === 'en-us' || loc.code === 'es-us') {
    const map = US_COUNTRY_LABELS_BY_VIEWER_LANG[viewerLang] || US_COUNTRY_LABELS_BY_VIEWER_LANG.en;
    return map[loc.code] || loc.countryName;
  }
  return loc.countryName;
}

export const SECTION_I18N = {
  es: {
    navAll: 'Todas',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Dinámicas y Minijuegos',
    navGuides: 'Guía y Ajuste de Precio',
    disclosureShort: 'Transparencia: Recibimos comisión por compras calificadas (Admitad / AliExpress Portals) sin costo adicional para ti.',
    disclosureBadge: 'Aviso de Afiliación',
    searchPlaceholder: (curr) => `Buscar cupón: ropa, zapatos, hogar, belleza, herramientas, juguetes, celulares... (${curr})`,
    storeBadgeTemu: 'CUPÓN TEMU',
    storeBadgeAli: 'CUPÓN ALIEXPRESS',
    checkoutBadge: 'Código de pago en carrito',
    directDiscount: 'Descuento directo',
    saveUpTo: (amt) => `Ahorras hasta ${amt}`,
    minSpendLabel: 'Compra mínima',
    promoCodeLabel: 'CÓDIGO:',
    backupCodeLabel: 'Respaldo (si se agota):',
    copyShort: 'Copiar',
    copiedShort: 'Copiado',
    allCategoriesChip: 'Todas',
    days30Badge: '30 DÍAS',
    regionsCountLabel: (n) => `${n} Regiones`,
    topBtn: 'Subir',
    legalHeader: 'Legal e Información',
    regionLabel: 'Región:',
    currencyLabel: 'Moneda:',
    cpaComplianceLabel: 'Cumplimiento CPA:',
    cpaComplianceText: 'Sin incentivos por clic, sin cookie-stuffing y sin redirecciones forzadas.',
    catShort: {
      'moda-ropa': 'Ropa y Calzado',
      'smart-home': 'Hogar y Cocina',
      'belleza-cuidado': 'Belleza y Salud',
      'tech-gadgets': 'Tecnología y PC',
      'accesorios-moviles': 'Celulares y Audio',
      'perifericos-gaming': 'Videojuegos',
      'herramientas-autos': 'Herramientas y Auto',
      'juguetes-hobbies': 'Juguetes y Drones',
      'deportes-outdoor': 'Deportes y Gym',
      'mascotas': 'Mascotas',
      'bebes-oficina': 'Bebés y Papelería',
      'redes-wifi': 'Wi-Fi y Redes'
    },
    usLockerTarget: '/es-us/temu',
    miamiNotice: (country, curr) =>
      `En ${country}, AliExpress envía directo en ${curr}. Si compras mediante Casillero en Estados Unidos (Miami Locker), cambia a la región de Casillero EE. UU.`,
    miamiBtn: 'Ver Cupones EE. UU. (Casillero / Locker)',
    shippingTable: {
      aliStore: 'AliExpress Direct / Choice',
      aliMethod: 'Correo Aéreo Estándar / Entrega Local y Casillero',
      aliDays: '6 - 14 Días',
      temuStore: 'Temu Oficial',
      temuMethodDirect: 'Envío Aéreo Directo a Domicilio',
      temuMethodLocker: 'Envío Gratis a Casillero en EE. UU. (Miami Locker)',
      temuFreeLockerLabel: 'Vía Casillero EE. UU. (USD)',
      temuDays: '5 - 9 Días',
      expressStore: 'Express DHL / FedEx',
      expressMethod: 'Prioritario para Computadoras, Mini PCs y Electrónica',
      expressDays: '3 - 6 Días'
    },
    dynamics: {
      badge: 'COMANDOS DE BUSCADOR Y MINIJUEGOS DE APP',
      title: (country) => `Dinámicas, Ruletas y Minijuegos de Temu y AliExpress en ${country}`,
      subtitle:
        'Estos comandos NO se pegan al pagar en el carrito. Escríbelos en la barra de búsqueda superior de la app de Temu o entra al centro de juegos de AliExpress para abrir ruletas de crédito, cofres y recompensas diarias.',
      typeInSearch: 'ESCRIBIR EN BUSCADOR:',
      copyBtn: (store) => `Copiar Comando (${store})`,
      copiedBtn: '¡Comando Copiado!',
      items: [
        {
          id: 'dyn-credit777',
          store: 'Temu App',
          storeKey: 'temu',
          code: 'credit777',
          badge: 'RULETA DE CRÉDITO Y RECOMPENSAS',
          title: 'Actividad de Reembolso de Saldo y Crédito en Cuenta (credit777)',
          howItWorks:
            'Escribe "credit777" en la lupa de búsqueda de la app de Temu. Abre el tablero oficial de devolución de saldo y giros promocionales para acumular crédito en tu billetera.'
        },
        {
          id: 'dyn-claimcredit',
          store: 'Temu App',
          storeKey: 'temu',
          code: 'claimcredit',
          badge: 'RECLAMO DIARIO DE SALDO',
          title: 'Panel para Reclamar Crédito Diario Pendiente (claimcredit)',
          howItWorks:
            'Si participaste en una promoción de devolución de saldo, escribe "claimcredit" en el buscador de Temu cada día durante 7 días para cobrar tu porción diaria de saldo.'
        },
        {
          id: 'dyn-wincredit',
          store: 'Temu App',
          storeKey: 'temu',
          code: 'wincredit',
          badge: 'DINÁMICA DE MONEDAS POR SALDO',
          title: 'Evento de Acumulación de Monedas por Crédito (wincredit)',
          howItWorks:
            'Al buscar "wincredit" en la app de Temu se abre el evento interactivo donde acumulas puntos por pedidos elegibles para canjearlos por saldo directo.'
        },
        {
          id: 'dyn-box777',
          store: 'Temu App',
          storeKey: 'temu',
          code: 'box777',
          badge: 'COFRES Y SORPRESAS',
          title: 'Minijuego de Cajas Sorpresa y Lotes de Descuento (box777)',
          howItWorks:
            'Escribe "box777" en el buscador de Temu para abrir la actividad de cofres promocionales con cupones relámpago combinables.'
        },
        {
          id: 'dyn-ali-coins',
          store: 'AliExpress App',
          storeKey: 'aliexpress',
          code: 'Buscador de Descuentos con Monedas',
          badge: 'DESCUENTO EXTRA APP (5% A 25%)',
          title: 'Centro de Monedas AliExpress + Buscador de Súper Descuentos',
          howItWorks:
            'Entra a la pestaña "Monedas" en la app de AliExpress, reclama tus monedas diarias en 1 clic y usa el "Buscador de Descuentos" para aplicar hasta 25% extra automático sobre nuestros códigos IFP.'
        },
        {
          id: 'dyn-ali-mergeboss',
          store: 'AliExpress App',
          storeKey: 'aliexpress',
          code: 'Merge Boss / Prize Land',
          badge: 'JUEGO OFICIAL CON CRÉDITOS REALES',
          title: 'Minijuegos Oficiales Merge Boss y Prize Land de AliExpress',
          howItWorks:
            'Desde la sección "Cuenta" en la app de AliExpress, abre Merge Boss o Prize Land para acumular créditos intercambiables por cupones directos sin mínimo de compra durante eventos Choice Day.'
        }
      ]
    },
    guides: {
      badge: 'GUÍA OFICIAL DE AHORRO Y REEMBOLSO EN TODOS LOS PAÍSES',
      title: (country) => `Guía de Ajuste de Precio (30 Días) y Compra Inteligente en ${country}`,
      subtitle: (ex20, ex15, ex5) =>
        `Si compras un artículo hoy por ${ex20} y dentro de los siguientes 30 días baja a ${ex15}, puedes reclamar los ${ex5} de diferencia al instante sin devolver el producto.`,
      g1Title: '1. Cómo Reclamar el "Ajuste de Precio" (Reembolso de 30 Días en Temu)',
      g1Sub: 'Recupera dinero en compras ya pagadas si el vendedor baja el precio',
      g1Desc: (curr) =>
        `Todos tus pedidos en Temu incluyen garantía de precio por 30 días en ${curr}. Si el precio del mismo artículo baja, reclama la diferencia en tres pasos:`,
      steps: (ex20, ex15, ex5) => [
        {
          step: 'PASO 1',
          title: 'Abre "Tus Pedidos"',
          desc: 'Entra a la app o web de Temu, toca en "Tú" -> "Tus Pedidos" y selecciona cualquier compra de los últimos 30 días.'
        },
        {
          step: 'PASO 2',
          title: 'Toca "Solicitar ajuste de precio"',
          desc: `Si el producto bajó de precio (por ejemplo de ${ex20} a ${ex15}), verás activo el botón "Solicitar ajuste de precio".`
        },
        {
          step: 'PASO 3',
          title: `Recibe ${ex5} al instante`,
          desc: 'Elige recibir el reembolso como Crédito Temu (en 1 segundo) o a tu tarjeta original. Puedes revisarlo varias veces durante los 30 días.'
        }
      ],
      g2Title: '2. Cómo Acumular 3 Descuentos al Mismo Tiempo en AliExpress',
      g2Sub: (country) => `Válido en ${country} y en los 66 mercados globales`,
      g2Desc: 'En AliExpress el sistema permite apilar tres rebajas distintas sobre el mismo carrito antes de pagar:',
      g2Bullets: [
        'Capa 1 — Cupón de Tienda/Vendedor: Reclámalo gratis dentro de la ficha del producto antes de añadirlo al carrito.',
        'Capa 2 — Monedas de la App: Compra desde la app móvil para descontar automáticamente entre 2% y 15% extra.',
        'Capa 3 — Código Promocional CuponesTech: Pega uno de nuestros códigos verificados (serie IFP) en la casilla de código promocional al pagar.'
      ],
      g3Title: '3. Envío Directo vs. Casillero Internacional en EE. UU. (US Locker)',
      g3Sub: 'Cómo elegir la mejor ruta de envío según tu país',
      g3Desc: (country) =>
        `Desde ${country}, puedes pedir por envío directo internacional a tu domicilio o, si utilizas un casillero internacional en Estados Unidos (Miami / Florida ZIP 33166 o 33122), seleccionar en el menú superior "Estados Unidos (Casillero / Locker)" para activar envío gratis dentro de EE. UU. y acceder al catálogo completo de códigos en USD.`
    }
  },

  en: {
    navAll: 'All Deals',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'App Mini-Games',
    navGuides: 'Price Adjustment Guide',
    disclosureShort: 'Disclosure: We may earn a commission on qualifying purchases (Admitad / AliExpress Portals) at no extra cost to you.',
    disclosureBadge: 'Affiliate Disclosure',
    searchPlaceholder: (curr) => `Search coupons: clothing, shoes, home, beauty, tools, toys, phones... (${curr})`,
    storeBadgeTemu: 'TEMU COUPON',
    storeBadgeAli: 'ALIEXPRESS COUPON',
    checkoutBadge: 'Verified checkout code',
    directDiscount: 'Direct discount',
    saveUpTo: (amt) => `Save up to ${amt}`,
    minSpendLabel: 'Min. spend',
    promoCodeLabel: 'CODE:',
    backupCodeLabel: 'Backup (if maxed):',
    copyShort: 'Copy',
    copiedShort: 'Copied',
    allCategoriesChip: 'All',
    days30Badge: '30 DAYS',
    regionsCountLabel: (n) => `${n} Regions`,
    topBtn: 'Top',
    legalHeader: 'Legal & Info',
    regionLabel: 'Region:',
    currencyLabel: 'Currency:',
    cpaComplianceLabel: 'CPA Compliance:',
    cpaComplianceText: 'No incentivized clicks, no cookie-stuffing, no forced redirects.',
    catShort: {
      'moda-ropa': 'Fashion & Shoes',
      'smart-home': 'Home & Kitchen',
      'belleza-cuidado': 'Beauty & Care',
      'tech-gadgets': 'Tech & PCs',
      'accesorios-moviles': 'Phones & Audio',
      'perifericos-gaming': 'Gaming',
      'herramientas-autos': 'Tools & Auto',
      'juguetes-hobbies': 'Toys & Drones',
      'deportes-outdoor': 'Sports & Outdoors',
      'mascotas': 'Pets',
      'bebes-oficina': 'Baby & Office',
      'redes-wifi': 'Wi-Fi & Routers'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `In ${country}, AliExpress ships directly in ${curr}. If you use a US Locker / Freight Forwarder address, switch to our United States (US Locker) region.`,
    miamiBtn: 'View US Locker Codes (USD)',
    shippingTable: {
      aliStore: 'AliExpress Direct / Choice',
      aliMethod: 'Standard Tracked Air / National Post & US Locker',
      aliDays: '6 - 14 Days',
      temuStore: 'Temu Official',
      temuMethodDirect: 'Direct Air Delivery to Your Door',
      temuMethodLocker: 'Free Shipping to US Locker / Freight Forwarder',
      temuFreeLockerLabel: 'Via US Locker (USD)',
      temuDays: '5 - 9 Days',
      expressStore: 'Express DHL / FedEx',
      expressMethod: 'Priority Express for PCs, Mini PCs & Electronics',
      expressDays: '3 - 6 Days'
    },
    dynamics: {
      badge: 'APP SEARCH BAR COMMANDS & MINI-GAMES',
      title: (country) => `Temu & AliExpress App Mini-Games & Search Commands in ${country}`,
      subtitle:
        'These keywords are NOT pasted at checkout. Type them directly into the top search bar of the Temu app or open the AliExpress Games center to unlock credit wheels, daily rewards, and stackable bonus discounts.',
      typeInSearch: 'TYPE IN SEARCH:',
      copyBtn: (store) => `Copy Keyword (${store})`,
      copiedBtn: 'Keyword Copied!',
      items: BASE_DYNAMICS_EN
    },
    guides: {
      badge: 'OFFICIAL 30-DAY PRICE ADJUSTMENT & STACKING GUIDE',
      title: (country) => `30-Day Price Adjustment & Smart Shopping Guide for ${country}`,
      subtitle: (ex20, ex15, ex5) =>
        `If you buy a product today for ${ex20} and the price drops to ${ex15} within 30 days, you can claim the ${ex5} difference back in one click without returning the item.`,
      g1Title: '1. How to Claim the 30-Day "Price Adjustment" Refund on Temu',
      g1Sub: 'Get instant credit back when an item you already bought goes on sale',
      g1Desc: (curr) =>
        `Every Temu order includes a 30-day price match guarantee in ${curr}. If the listing price drops within 30 days of purchase, follow these three steps:`,
      steps: (ex20, ex15, ex5) => [
        {
          step: 'STEP 1',
          title: 'Open "Your Orders"',
          desc: 'In the Temu app or website, go to "You" -> "Your Orders" and select any order placed within the last 30 days.'
        },
        {
          step: 'STEP 2',
          title: 'Tap "Request Price Adjustment"',
          desc: `If any item in your order dropped in price (for example from ${ex20} to ${ex15}), the "Request price adjustment" button will be active.`
        },
        {
          step: 'STEP 3',
          title: `Receive ${ex5} Instantly`,
          desc: 'Choose Temu Credit (added in 1 second) or refund to your original payment method. You can repeat this multiple times within 30 days.'
        }
      ],
      g2Title: '2. How to Stack 3 Discounts Simultaneously on AliExpress',
      g2Sub: (country) => `Valid in ${country} and across all 66 global regions`,
      g2Desc: 'AliExpress allows you to combine three distinct discount layers on the exact same cart before paying:',
      g2Bullets: [
        'Layer 1 — Store / Seller Coupon: Claim it for free on the product page before adding the item to your cart.',
        'Layer 2 — Mobile App Coins: Checkout inside the AliExpress mobile app to automatically apply an extra 2% to 15% Coins discount.',
        'Layer 3 — CuponesTech Promo Code: Paste one of our verified IFP promo codes into the checkout promo code box.'
      ],
      g3Title: '3. Direct Local Shipping vs. US Freight Forwarder / Locker Address',
      g3Sub: 'How to pick the best shipping mode for your order',
      g3Desc: (country) =>
        `When shopping from ${country}, you can either ship directly to your home address in local currency or—if you use a US freight forwarder / locker address (Miami, FL 33166 / 33122)—select "United States (US Locker)" in the top region selector to unlock US domestic free shipping and USD promo codes.`
    }
  },

  ...EXTRA_LANG_SECTIONS,
  ...NATIONAL_LANG_SECTIONS
};

export function getSectionText(lang = 'en') {
  return SECTION_I18N[lang] || SECTION_I18N.en;
}

/**
 * LOCALIZED URL ROUTE SLUGS PER LANGUAGE (All 27 Languages)
 */
export const ROUTE_SLUGS_BY_LANG = {
  es: {
    dynamics: 'dinamicas',
    guides: 'guias',
    privacy: 'privacidad',
    terms: 'terminos',
    about: 'nosotros',
    contact: 'contacto',
    category: 'categoria'
  },
  en: {
    dynamics: 'dynamics',
    guides: 'guides',
    privacy: 'privacy',
    terms: 'terms',
    about: 'about',
    contact: 'contact',
    category: 'category'
  },
  pt: {
    dynamics: 'dinamicas',
    guides: 'guias',
    privacy: 'privacidade',
    terms: 'termos',
    about: 'sobre',
    contact: 'contato',
    category: 'categoria'
  },
  fr: {
    dynamics: 'dynamiques',
    guides: 'guides',
    privacy: 'confidentialite',
    terms: 'conditions',
    about: 'a-propos',
    contact: 'contact',
    category: 'categorie'
  },
  de: {
    dynamics: 'minispiele',
    guides: 'ratgeber',
    privacy: 'datenschutz',
    terms: 'bedingungen',
    about: 'ueber-uns',
    contact: 'kontakt',
    category: 'kategorie'
  },
  it: {
    dynamics: 'dinamiche',
    guides: 'guide',
    privacy: 'privacy',
    terms: 'termini',
    about: 'chi-siamo',
    contact: 'contatti',
    category: 'categoria'
  },
  nl: {
    dynamics: 'minigames',
    guides: 'gidsen',
    privacy: 'privacy',
    terms: 'voorwaarden',
    about: 'over-ons',
    contact: 'contact',
    category: 'categorie'
  },
  pl: {
    dynamics: 'minigry',
    guides: 'poradniki',
    privacy: 'prywatnosc',
    terms: 'regulamin',
    about: 'o-nas',
    contact: 'kontakt',
    category: 'kategoria'
  },
  ja: {
    dynamics: 'minigames',
    guides: 'guides',
    privacy: 'privacy',
    terms: 'terms',
    about: 'about',
    contact: 'contact',
    category: 'category'
  },
  ko: {
    dynamics: 'minigames',
    guides: 'guides',
    privacy: 'privacy',
    terms: 'terms',
    about: 'about',
    contact: 'contact',
    category: 'category'
  },
  ar: {
    dynamics: 'al-aab',
    guides: 'dalil',
    privacy: 'khususiya',
    terms: 'shuroot',
    about: 'man-nahnu',
    contact: 'ittisal',
    category: 'fia'
  },
  zh: {
    dynamics: 'huodong',
    guides: 'zhinan',
    privacy: 'yinsi',
    terms: 'tiaokuan',
    about: 'guanyu',
    contact: 'lianxi',
    category: 'fenlei'
  },
  ru: {
    dynamics: 'mini-igry',
    guides: 'gaidy',
    privacy: 'konfidentsialnost',
    terms: 'usloviya',
    about: 'o-nas',
    contact: 'kontakty',
    category: 'kategoriya'
  },
  tr: {
    dynamics: 'mini-oyunlar',
    guides: 'rehberler',
    privacy: 'gizlilik',
    terms: 'kosullar',
    about: 'hakkimizda',
    contact: 'iletisim',
    category: 'kategori'
  },
  sv: {
    dynamics: 'minispel',
    guides: 'guider',
    privacy: 'integritet',
    terms: 'villkor',
    about: 'om-oss',
    contact: 'kontakt',
    category: 'kategori'
  },
  no: {
    dynamics: 'minispill',
    guides: 'guider',
    privacy: 'personvern',
    terms: 'vilkar',
    about: 'om-oss',
    contact: 'kontakt',
    category: 'kategori'
  },
  da: {
    dynamics: 'minispil',
    guides: 'guider',
    privacy: 'privatliv',
    terms: 'vilkaar',
    about: 'om-os',
    contact: 'kontakt',
    category: 'kategori'
  },
  fi: {
    dynamics: 'minipelit',
    guides: 'oppaat',
    privacy: 'tietosuoja',
    terms: 'ehdot',
    about: 'tietoja',
    contact: 'yhteystiedot',
    category: 'kategoria'
  },
  el: {
    dynamics: 'mini-paichnidia',
    guides: 'odigoi',
    privacy: 'aporrito',
    terms: 'oroi',
    about: 'schetika',
    contact: 'epikoinonia',
    category: 'katigoria'
  },
  cs: {
    dynamics: 'minihry',
    guides: 'pruvodce',
    privacy: 'soukromi',
    terms: 'podminky',
    about: 'o-nas',
    contact: 'kontakt',
    category: 'kategorie'
  },
  ro: {
    dynamics: 'mini-jocuri',
    guides: 'ghiduri',
    privacy: 'confidentialitate',
    terms: 'termeni',
    about: 'despre-noi',
    contact: 'contact',
    category: 'categorie'
  },
  hu: {
    dynamics: 'minijatekok',
    guides: 'utmutatok',
    privacy: 'adatvedelem',
    terms: 'feltetelek',
    about: 'rolunk',
    contact: 'kapcsolat',
    category: 'kategoria'
  },
  uk: {
    dynamics: 'mini-ihry',
    guides: 'poradnyky',
    privacy: 'konfidentsiinist',
    terms: 'umovy',
    about: 'pro-nas',
    contact: 'kontakty',
    category: 'katehoriia'
  },
  th: {
    dynamics: 'minigames',
    guides: 'khumue',
    privacy: 'privacy',
    terms: 'terms',
    about: 'about',
    contact: 'contact',
    category: 'muat-mu'
  },
  vi: {
    dynamics: 'tro-choi',
    guides: 'huong-dan',
    privacy: 'bao-mat',
    terms: 'dieu-khoan',
    about: 'gioi-thieu',
    contact: 'lien-he',
    category: 'danh-muc'
  },
  he: {
    dynamics: 'mishakim',
    guides: 'madrikhim',
    privacy: 'pratiyut',
    terms: 'tnaim',
    about: 'odot',
    contact: 'kesher',
    category: 'kategoriya'
  },
  ms: {
    dynamics: 'permainan-mini',
    guides: 'panduan',
    privacy: 'privasi',
    terms: 'terma',
    about: 'tentang-kami',
    contact: 'hubungi',
    category: 'kategori'
  }
};

/**
 * LOCALIZED CATEGORY SLUGS PER LANGUAGE
 * Maps canonical category keys ('moda-ropa', 'smart-home', etc.) to native URL-safe slugs.
 */
export const CATEGORY_SLUGS_BY_LANG = {
  es: {
    'moda-ropa': 'moda-ropa',
    'smart-home': 'hogar-cocina',
    'belleza-cuidado': 'belleza-cuidado',
    'tech-gadgets': 'tech-gadgets',
    'accesorios-moviles': 'accesorios-moviles',
    'perifericos-gaming': 'perifericos-gaming',
    'herramientas-autos': 'herramientas-autos',
    'juguetes-hobbies': 'juguetes-hobbies',
    'deportes-outdoor': 'deportes-outdoor',
    'mascotas': 'mascotas',
    'bebes-oficina': 'bebes-oficina',
    'redes-wifi': 'redes-wifi'
  },
  en: {
    'moda-ropa': 'fashion-shoes',
    'smart-home': 'home-kitchen',
    'belleza-cuidado': 'beauty-health',
    'tech-gadgets': 'tech-gadgets',
    'accesorios-moviles': 'phones-audio',
    'perifericos-gaming': 'gaming-peripherals',
    'herramientas-autos': 'tools-auto',
    'juguetes-hobbies': 'toys-drones',
    'deportes-outdoor': 'sports-outdoors',
    'mascotas': 'pet-supplies',
    'bebes-oficina': 'baby-stationery',
    'redes-wifi': 'wifi-networking'
  },
  pt: {
    'moda-ropa': 'moda-calcados',
    'smart-home': 'casa-cozinha',
    'belleza-cuidado': 'beleza-saude',
    'tech-gadgets': 'tecnologia-pcs',
    'accesorios-moviles': 'celulares-audio',
    'perifericos-gaming': 'jogos-gaming',
    'herramientas-autos': 'ferramentas-auto',
    'juguetes-hobbies': 'brinquedos-drones',
    'deportes-outdoor': 'esportes-outdoor',
    'mascotas': 'pets',
    'bebes-oficina': 'bebes-papelaria',
    'redes-wifi': 'wifi-redes'
  },
  fr: {
    'moda-ropa': 'mode-chaussures',
    'smart-home': 'maison-cuisine',
    'belleza-cuidado': 'beaute-sante',
    'tech-gadgets': 'high-tech-pc',
    'accesorios-moviles': 'telephones-audio',
    'perifericos-gaming': 'gaming-manettes',
    'herramientas-autos': 'outils-auto',
    'juguetes-hobbies': 'jouets-drones',
    'deportes-outdoor': 'sport-plein-air',
    'mascotas': 'animaux',
    'bebes-oficina': 'bebe-bureau',
    'redes-wifi': 'wifi-reseaux'
  },
  de: {
    'moda-ropa': 'mode-schuhe',
    'smart-home': 'haus-kueche',
    'belleza-cuidado': 'beauty-pflege',
    'tech-gadgets': 'technik-pcs',
    'accesorios-moviles': 'handys-audio',
    'perifericos-gaming': 'gaming-zubehoer',
    'herramientas-autos': 'werkzeug-auto',
    'juguetes-hobbies': 'spielzeug-drohnen',
    'deportes-outdoor': 'sport-outdoor',
    'mascotas': 'haustiere',
    'bebes-oficina': 'baby-buero',
    'redes-wifi': 'wlan-netzwerk'
  },
  it: {
    'moda-ropa': 'moda-scarpe',
    'smart-home': 'casa-cucina',
    'belleza-cuidado': 'bellezza-salute',
    'tech-gadgets': 'tecnologia-pc',
    'accesorios-moviles': 'smartphone-audio',
    'perifericos-gaming': 'gaming-console',
    'herramientas-autos': 'utensili-auto',
    'juguetes-hobbies': 'giocattoli-droni',
    'deportes-outdoor': 'sport-outdoor',
    'mascotas': 'animali',
    'bebes-oficina': 'neonati-ufficio',
    'redes-wifi': 'wifi-reti'
  },
  nl: {
    'moda-ropa': 'mode-schoenen',
    'smart-home': 'huis-keuken',
    'belleza-cuidado': 'beauty-verzorging',
    'tech-gadgets': 'elektronica-pc',
    'accesorios-moviles': 'telefoons-audio',
    'perifericos-gaming': 'gaming-accessoires',
    'herramientas-autos': 'gereedschap-auto',
    'juguetes-hobbies': 'speelgoed-drones',
    'deportes-outdoor': 'sport-outdoor',
    'mascotas': 'huisdieren',
    'bebes-oficina': 'baby-kantoor',
    'redes-wifi': 'wifi-netwerk'
  },
  pl: {
    'moda-ropa': 'moda-obuwie',
    'smart-home': 'dom-kuchnia',
    'belleza-cuidado': 'uroda-zdrowie',
    'tech-gadgets': 'elektronika-pc',
    'accesorios-moviles': 'telefony-audio',
    'perifericos-gaming': 'gaming-gry',
    'herramientas-autos': 'narzedzia-auto',
    'juguetes-hobbies': 'zabawki-drony',
    'deportes-outdoor': 'sport-turystyka',
    'mascotas': 'zwierzeta',
    'bebes-oficina': 'dzieci-biuro',
    'redes-wifi': 'wifi-sieci'
  },
  tr: {
    'moda-ropa': 'giyim-ayakkabi',
    'smart-home': 'ev-mutfak',
    'belleza-cuidado': 'guzellik-bakim',
    'tech-gadgets': 'teknoloji-pc',
    'accesorios-moviles': 'telefon-ses',
    'perifericos-gaming': 'oyun-ekipmanlari',
    'herramientas-autos': 'hirdavat-oto',
    'juguetes-hobbies': 'oyuncak-drone',
    'deportes-outdoor': 'spor-outdoor',
    'mascotas': 'evcil-hayvan',
    'bebes-oficina': 'bebek-ofis',
    'redes-wifi': 'wifi-ag'
  },
  sv: {
    'moda-ropa': 'mode-skor',
    'smart-home': 'hem-kok',
    'belleza-cuidado': 'skonhet-halsa',
    'tech-gadgets': 'teknik-datorer',
    'accesorios-moviles': 'mobiler-ljud',
    'perifericos-gaming': 'gaming-spel',
    'herramientas-autos': 'verktyg-bil',
    'juguetes-hobbies': 'leksaker-dronare',
    'deportes-outdoor': 'sport-fritid',
    'mascotas': 'husdjur',
    'bebes-oficina': 'baby-kontor',
    'redes-wifi': 'wifi-natverk'
  },
  no: {
    'moda-ropa': 'mote-sko',
    'smart-home': 'hjem-kjokken',
    'belleza-cuidado': 'skjonnhet-helse',
    'tech-gadgets': 'teknologi-pc',
    'accesorios-moviles': 'mobil-lyd',
    'perifericos-gaming': 'gaming-spill',
    'herramientas-autos': 'verktoy-bil',
    'juguetes-hobbies': 'leker-droner',
    'deportes-outdoor': 'sport-friluftsliv',
    'mascotas': 'kjaeledyr',
    'bebes-oficina': 'baby-kontor',
    'redes-wifi': 'wifi-nettverk'
  },
  da: {
    'moda-ropa': 'mode-sko',
    'smart-home': 'hjem-kokken',
    'belleza-cuidado': 'skonhed-pleje',
    'tech-gadgets': 'teknologi-pc',
    'accesorios-moviles': 'mobil-lyd',
    'perifericos-gaming': 'gaming-spil',
    'herramientas-autos': 'vaerktoj-bil',
    'juguetes-hobbies': 'legetoj-droner',
    'deportes-outdoor': 'sport-fritid',
    'mascotas': 'kaeledyr',
    'bebes-oficina': 'baby-kontor',
    'redes-wifi': 'wifi-netvaerk'
  },
  fi: {
    'moda-ropa': 'muoti-kengat',
    'smart-home': 'koti-keittio',
    'belleza-cuidado': 'kauneus-terveys',
    'tech-gadgets': 'tekniikka-pc',
    'accesorios-moviles': 'puhelimet-aani',
    'perifericos-gaming': 'pelaaminen',
    'herramientas-autos': 'tyokalut-auto',
    'juguetes-hobbies': 'lelut-droonit',
    'deportes-outdoor': 'urheilu-ulkoilu',
    'mascotas': 'lemmikit',
    'bebes-oficina': 'vauvat-toimisto',
    'redes-wifi': 'wifi-verkko'
  },
  cs: {
    'moda-ropa': 'moda-obuv',
    'smart-home': 'dum-kuchyne',
    'belleza-cuidado': 'krasa-zdravi',
    'tech-gadgets': 'elektronika-pc',
    'accesorios-moviles': 'mobily-audio',
    'perifericos-gaming': 'gaming-hry',
    'herramientas-autos': 'naradi-auto',
    'juguetes-hobbies': 'hracky-drony',
    'deportes-outdoor': 'sport-outdoor',
    'mascotas': 'mazlicci',
    'bebes-oficina': 'deti-kancelar',
    'redes-wifi': 'wifi-site'
  },
  ro: {
    'moda-ropa': 'moda-incaltaminte',
    'smart-home': 'casa-bucatarie',
    'belleza-cuidado': 'frumusete-sanatate',
    'tech-gadgets': 'tehnologie-pc',
    'accesorios-moviles': 'telefoane-audio',
    'perifericos-gaming': 'gaming-jocuri',
    'herramientas-autos': 'scule-auto',
    'juguetes-hobbies': 'jucarii-drone',
    'deportes-outdoor': 'sport-outdoor',
    'mascotas': 'animale',
    'bebes-oficina': 'bebelusi-birou',
    'redes-wifi': 'wifi-retea'
  },
  hu: {
    'moda-ropa': 'divat-cipok',
    'smart-home': 'otthon-konyha',
    'belleza-cuidado': 'szepseg-egeszseg',
    'tech-gadgets': ' elektronika-pc'.trim(),
    'accesorios-moviles': 'telefon-audio',
    'perifericos-gaming': 'gaming-jatekok',
    'herramientas-autos': 'szerszam-auto',
    'juguetes-hobbies': 'jatekok-dronok',
    'deportes-outdoor': 'sport-szabadido',
    'mascotas': 'kisallat',
    'bebes-oficina': 'baba-iroda',
    'redes-wifi': 'wifi-halozat'
  },
  vi: {
    'moda-ropa': 'thoi-trang-giay-dep',
    'smart-home': 'nha-cua-nha-bep',
    'belleza-cuidado': 'lam-dep-suc-khoe',
    'tech-gadgets': 'cong-nghe-pc',
    'accesorios-moviles': 'dien-thoai-am-thanh',
    'perifericos-gaming': 'phu-kien-gaming',
    'herramientas-autos': 'dung-cu-o-to',
    'juguetes-hobbies': 'do-choi-flycam',
    'deportes-outdoor': 'the-thao-da-ngoai',
    'mascotas': 'thu-cung',
    'bebes-oficina': 'me-be-van-phong',
    'redes-wifi': 'wifi-mang'
  },
  ms: {
    'moda-ropa': 'fesyen-kasut',
    'smart-home': 'rumah-dapur',
    'belleza-cuidado': 'kecantikan-kesihatan',
    'tech-gadgets': 'teknologi-pc',
    'accesorios-moviles': 'telefon-audio',
    'perifericos-gaming': 'permainan-gaming',
    'herramientas-autos': 'alatan-kereta',
    'juguetes-hobbies': 'mainan-dron',
    'deportes-outdoor': 'sukan-luar',
    'mascotas': 'haiwan-peliharaan',
    'bebes-oficina': 'bayi-pejabat',
    'redes-wifi': 'wifi-rangkaian'
  }
};

export function getRouteSlugsForLang(lang = 'en') {
  return ROUTE_SLUGS_BY_LANG[lang] || ROUTE_SLUGS_BY_LANG.en;
}

export function getCategorySlugsForLang(lang = 'en') {
  return CATEGORY_SLUGS_BY_LANG[lang] || CATEGORY_SLUGS_BY_LANG.en;
}

export function getLocalizedPath(localeConfig, pageKey) {
  const slugs = getRouteSlugsForLang(localeConfig.lang);
  const slug = slugs[pageKey] || pageKey;
  return `/${localeConfig.code}/${slug}`;
}

export function getLocalizedCategoryPath(localeConfig, storeFilter, canonicalCategorySlug) {
  const routeSlugs = getRouteSlugsForLang(localeConfig.lang);
  const catWord = routeSlugs.category || 'category';
  const catMap = getCategorySlugsForLang(localeConfig.lang);
  const localizedCatSlug = catMap[canonicalCategorySlug] || canonicalCategorySlug;
  if (storeFilter === 'temu' || storeFilter === 'aliexpress') {
    return `/${localeConfig.code}/${storeFilter}/${catWord}/${localizedCatSlug}`;
  }
  return `/${localeConfig.code}/${catWord}/${localizedCatSlug}`;
}

export function resolvePageKeyFromSlug(rawSlug) {
  if (!rawSlug) return null;
  const clean = rawSlug.toLowerCase();
  for (const map of Object.values(ROUTE_SLUGS_BY_LANG)) {
    for (const [pageKey, val] of Object.entries(map)) {
      if (pageKey !== 'category' && val === clean) return pageKey;
    }
  }
  return null;
}

export function isCategoryWordSlug(rawWord) {
  if (!rawWord) return false;
  const clean = rawWord.toLowerCase();
  if (clean === 'categoria' || clean === 'category') return true;
  for (const map of Object.values(ROUTE_SLUGS_BY_LANG)) {
    if (map.category === clean) return true;
  }
  return false;
}

export function resolveCanonicalCategory(rawSlug) {
  if (!rawSlug) return null;
  const clean = rawSlug.toLowerCase();
  // Direct canonical check first
  if (CATEGORY_SLUGS_BY_LANG.es[clean]) return clean;
  for (const map of Object.values(CATEGORY_SLUGS_BY_LANG)) {
    for (const [canonicalKey, localizedSlug] of Object.entries(map)) {
      if (localizedSlug === clean) return canonicalKey;
    }
  }
  return clean;
}

export function translatePathToLocale(pathname, newLocaleConfig) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return `/${newLocaleConfig.code}`;
  parts[0] = newLocaleConfig.code;

  // /:locale/:sectionSlug
  if (parts.length === 2) {
    const pageKey = resolvePageKeyFromSlug(parts[1]);
    if (pageKey) {
      parts[1] = getRouteSlugsForLang(newLocaleConfig.lang)[pageKey];
    }
    return '/' + parts.join('/');
  }

  // /:locale/:catWord/:catSlug
  if (parts.length === 3 && isCategoryWordSlug(parts[1])) {
    const canonicalCat = resolveCanonicalCategory(parts[2]);
    return getLocalizedCategoryPath(newLocaleConfig, 'all', canonicalCat);
  }

  // /:locale/:store/:catWord/:catSlug
  if (parts.length === 4 && (parts[1] === 'temu' || parts[1] === 'aliexpress') && isCategoryWordSlug(parts[2])) {
    const canonicalCat = resolveCanonicalCategory(parts[3]);
    return getLocalizedCategoryPath(newLocaleConfig, parts[1], canonicalCat);
  }

  return '/' + parts.join('/');
}
