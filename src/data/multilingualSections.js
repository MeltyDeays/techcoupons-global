// Complete 14-Language Native Dictionary:
// UI Micro-labels, Localized US Locker / Freight Forwarder terms, 11 Categories,
// App Dynamics & Mini-Games, and 30-Day Price Adjustment & US Locker Guides.

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
          desc: `If any item dropped in price (for example from ${ex20} to ${ex15}), the "Request price adjustment" button will be active.`
        },
        {
          step: 'STEP 3',
          title: `Receive ${ex5} Instantly`,
          desc: 'Choose Temu Credit (added in 1 second) or refund to your original payment method. You can check again every few days!'
        }
      ],
      g2Title: '2. How to Stack 3 Discounts Simultaneously on AliExpress',
      g2Sub: (country) => `Works in ${country} and across all 66 supported markets`,
      g2Desc: 'Never pay full retail on AliExpress. Combine these three discount layers on the exact same checkout screen:',
      g2Bullets: [
        'Layer 1 — Seller Store Coupon: Claim it for free on the product page before adding the item to your cart.',
        'Layer 2 — Mobile App Coins: Checkout in the AliExpress mobile app to automatically deduct 2% to 15% extra.',
        'Layer 3 — CuponesTech Promo Code: Paste one of our verified IFP tiered codes into the Promo Code box at payment.'
      ],
      g3Title: '3. Direct Local Delivery vs. US Locker / Freight Forwarder',
      g3Sub: 'Choosing between local shipping and a US forwarding locker',
      g3Desc: (country) =>
        `From ${country}, you can ship directly to your local address in local currency, or select "United States (Direct & US Locker)" in the region selector when shipping to a US parcel locker / freight forwarder (such as Miami FL 33166 or Delaware) to unlock US domestic free shipping and USD voucher bundles.`
    }
  }
};

const EXTRA_LANGS = {
  pt: {
    navAll: 'Todas',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Minijogos e Dinâmicas',
    navGuides: 'Ajuste de Preço (30 Dias)',
    disclosureShort: 'Transparência: Recebemos comissão em compras qualificadas (Admitad / AliExpress Portals) sem custo extra para você.',
    disclosureBadge: 'Aviso de Afiliados',
    searchPlaceholder: (curr) => `Buscar cupom: roupas, calçados, casa, beleza, ferramentas, brinquedos... (${curr})`,
    storeBadgeTemu: 'CUPOM TEMU',
    storeBadgeAli: 'CUPOM ALIEXPRESS',
    checkoutBadge: 'Cupom real no carrinho',
    directDiscount: 'Desconto direto',
    saveUpTo: (amt) => `Economize até ${amt}`,
    minSpendLabel: 'Compra mínima',
    promoCodeLabel: 'CÓDIGO:',
    backupCodeLabel: 'Reserva (se esgotar):',
    copyShort: 'Copiar',
    copiedShort: 'Copiado',
    allCategoriesChip: 'Todas',
    catShort: {
      'moda-ropa': 'Moda e Calçados',
      'smart-home': 'Casa e Cozinha',
      'belleza-cuidado': 'Beleza e Saúde',
      'tech-gadgets': 'Tecnologia e PC',
      'accesorios-moviles': 'Celulares e Áudio',
      'perifericos-gaming': 'Videojogos',
      'herramientas-autos': 'Ferramentas e Auto',
      'juguetes-hobbies': 'Brinquedos e Drones',
      'deportes-outdoor': 'Esportes e Lazer',
      'mascotas': 'Pets',
      'bebes-oficina': 'Bebês e Papelaria',
      'redes-wifi': 'Wi-Fi e Redes'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `Em ${country}, o AliExpress envia diretamente em ${curr}. Se você usa um Redirecionador / Locker nos Estados Unidos (EUA), altere para a região Estados Unidos (Locker EUA).`,
    miamiBtn: 'Ver Cupons EUA (Redirecionador / Locker)',
    dynamicsTitle: (country) => `Dinâmicas, Roletas e Minijogos da Temu e AliExpress (${country})`,
    dynamicsSub: 'Estes comandos NÃO são colados no pagamento. Digite-os na barra de busca superior do app da Temu ou abra a aba Moedas do AliExpress para desbloquear créditos e bônus.',
    guidesTitle: (country) => `Guia de Ajuste de Preço (30 Dias) e Descontos Triplos (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Se você comprar um produto hoje por ${ex20} e ele baixar para ${ex15} em até 30 dias, peça o reembolso de ${ex5} na hora sem devolver o produto.`,
    guidesOverride: {
      badge: 'GUIA OFICIAL DE REEMBOLSO E ECONOMIA',
      g1Title: '1. Como Pedir o "Ajuste de Preço" (Reembolso de 30 Dias na Temu)',
      g1Sub: 'Receba a diferença de volta se o produto que você já comprou baixar de preço',
      g1Desc: (curr) => `Todos os pedidos na Temu têm garantia de preço de 30 dias em ${curr}. Se o preço cair, recupere a diferença em 3 passos:`,
      steps: (ex20, ex15, ex5) => [
        { step: 'PASSO 1', title: 'Abra "Seus Pedidos"', desc: 'No app ou site da Temu, entre em "Você" -> "Seus Pedidos" e selecione qualquer compra dos últimos 30 dias.' },
        { step: 'PASSO 2', title: 'Toque em "Solicitar ajuste de preço"', desc: `Se algum item baixou de preço (ex: de ${ex20} para ${ex15}), o botão de ajuste estará liberado.` },
        { step: 'PASSO 3', title: `Receba ${ex5} na hora`, desc: 'Escolha Crédito Temu (cai em 1 segundo) ou estorno no método de pagamento original.' }
      ],
      g2Title: '2. Como Acumular 3 Descontos ao Mesmo Tempo no AliExpress',
      g2Sub: (country) => `Válido em ${country} (incluindo Remessa Conforme) e em todos os 66 países`,
      g2Desc: 'No AliExpress você pode somar três camadas de desconto no mesmo carrinho:',
      g2Bullets: [
        'Camada 1 — Cupom da Loja/Vendedor: Resgate grátis na página do produto antes de adicionar ao carrinho.',
        'Camada 2 — Moedas do App: Compre pelo aplicativo para abater automaticamente de 2% a 15% extra.',
        'Camada 3 — Código Promocional CuponesTech: Cole um dos nossos códigos verificados (série IFP) no checkout.'
      ],
      g3Title: '3. Envio Direto vs. Redirecionador / Locker nos Estados Unidos (EUA)',
      g3Sub: 'Quando usar entrega direta ou armazém/locker nos EUA',
      g3Desc: (country) => `Comprando a partir de ${country}, você pode usar o envio direto internacional para seu endereço local ou, caso utilize um redirecionador de encomendas / locker nos Estados Unidos (Miami / Florida ZIP 33166), selecionar "Estados Unidos (Locker / Redirecionador EUA)" no topo para liberar cupons exclusivos em dólar (USD).`
    }
  },
  fr: {
    navAll: 'Toutes',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Mini-Jeux App',
    navGuides: 'Ajustement de Prix',
    disclosureShort: 'Transparence : Commission perçue sur les achats éligibles (Admitad / AliExpress Portals) sans frais supplémentaires.',
    disclosureBadge: 'Affiliation',
    searchPlaceholder: (curr) => `Rechercher : vêtements, maison, beauté, outils, jouets, tech... (${curr})`,
    storeBadgeTemu: 'CODE TEMU',
    storeBadgeAli: 'CODE ALIEXPRESS',
    checkoutBadge: 'Code panier vérifié',
    directDiscount: 'Remise directe',
    saveUpTo: (amt) => `Économisez jusqu'à ${amt}`,
    minSpendLabel: 'Achat min.',
    promoCodeLabel: 'CODE :',
    backupCodeLabel: 'Secours :',
    copyShort: 'Copier',
    copiedShort: 'Copié',
    allCategoriesChip: 'Toutes',
    catShort: {
      'moda-ropa': 'Mode & Chaussures',
      'smart-home': 'Maison & Cuisine',
      'belleza-cuidado': 'Beauté & Soins',
      'tech-gadgets': 'Tech & PC',
      'accesorios-moviles': 'Mobiles & Audio',
      'perifericos-gaming': 'Gaming',
      'herramientas-autos': 'Outils & Auto',
      'juguetes-hobbies': 'Jouets & Drones',
      'deportes-outdoor': 'Sport & Loisirs',
      'mascotas': 'Animaux',
      'bebes-oficina': 'Bébés & Bureau',
      'redes-wifi': 'Wi-Fi & Réseaux'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `En ${country}, AliExpress livre directement en ${curr}. Si vous utilisez une adresse de transit / Casier aux États-Unis (US Locker), sélectionnez la région États-Unis (Casier US).`,
    miamiBtn: 'Voir les Codes États-Unis (Casier / Locker US)',
    dynamicsTitle: (country) => `Mini-Jeux et Commandes de Recherche Temu & AliExpress (${country})`,
    dynamicsSub: 'Ces mots-clés ne se collent pas au paiement : tapez-les dans la barre de recherche de l’application Temu ou ouvrez l’espace Pièces AliExpress pour gagner du crédit.',
    guidesTitle: (country) => `Guide d’Ajustement de Prix (30 Jours) et Cumul de Remises (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Si un article acheté ${ex20} passe à ${ex15} dans les 30 jours, réclamez ${ex5} de remboursement instantané sans renvoyer le colis.`,
    guidesOverride: {
      badge: 'GUIDE OFFICIEL DE REMBOURSEMENT ET D’ÉCONOMIES',
      g1Title: '1. Comment demander l’Ajustement de Prix (Remboursement 30 Jours sur Temu)',
      g1Sub: 'Récupérez la différence si le prix baisse après votre achat',
      g1Desc: (curr) => `Chaque commande Temu bénéficie d’une garantie de prix de 30 jours en ${curr} :`,
      steps: (ex20, ex15, ex5) => [
        { step: 'ÉTAPE 1', title: 'Ouvrez "Vos Commandes"', desc: 'Dans l’application Temu, allez dans "Vous" -> "Vos commandes" et choisissez une commande des 30 derniers jours.' },
        { step: 'ÉTAPE 2', title: 'Cliquez sur "Demander un ajustement de prix"', desc: `Si le prix est passé de ${ex20} à ${ex15}, le bouton d’ajustement sera disponible.` },
        { step: 'ÉTAPE 3', title: `Recevez ${ex5} instantanément`, desc: 'Choisissez le crédit Temu (en 1 seconde) ou le remboursement sur votre carte bancaire.' }
      ],
      g2Title: '2. Comment cumuler 3 réductions simultanément sur AliExpress',
      g2Sub: (country) => `Valable en ${country} et dans les 66 pays`,
      g2Desc: 'Cumulez toujours ces trois niveaux de réduction avant de payer :',
      g2Bullets: [
        'Niveau 1 — Coupon Vendeur : Récupérez-le gratuitement sur la fiche produit.',
        'Niveau 2 — Pièces de l’App : Achetez via l’application mobile pour déduire 2% à 15% supplémentaires.',
        'Niveau 3 — Code Promo CuponesTech : Collez l’un de nos codes vérifiés (série IFP) au moment du paiement.'
      ],
      g3Title: '3. Livraison Directe vs. Casier / Transit aux États-Unis (US Locker)',
      g3Sub: 'Choisir entre la livraison locale et un casier de réexpédition US',
      g3Desc: (country) => `Depuis ${country}, vous pouvez commander en livraison directe ou sélectionner "États-Unis (Casier / Locker US)" en haut de page si vous utilisez un service de réexpédition américain (Miami FL 33166) pour profiter des codes exclusifs en USD.`
    }
  },
  de: {
    navAll: 'Alle',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'App Mini-Spiele',
    navGuides: 'Preisanpassung (30 Tage)',
    disclosureShort: 'Hinweis: Wir erhalten eine Provision bei qualifizierten Käufen (Admitad / AliExpress Portals) ohne Mehrkosten für Sie.',
    disclosureBadge: 'Affiliate-Hinweis',
    searchPlaceholder: (curr) => `Gutscheine suchen: Kleidung, Haushalt, Beauty, Werkzeug, Spielzeug, Tech... (${curr})`,
    storeBadgeTemu: 'TEMU GUTSCHEIN',
    storeBadgeAli: 'ALIEXPRESS CODE',
    checkoutBadge: 'Warenkorb-Gutscheincode',
    directDiscount: 'Direktrabatt',
    saveUpTo: (amt) => `Spare bis zu ${amt}`,
    minSpendLabel: 'Mindestbestellwert',
    promoCodeLabel: 'CODE:',
    backupCodeLabel: 'Ersatzcode:',
    copyShort: 'Kopieren',
    copiedShort: 'Kopiert',
    allCategoriesChip: 'Alle',
    catShort: {
      'moda-ropa': 'Mode & Schuhe',
      'smart-home': 'Haus & Küche',
      'belleza-cuidado': 'Beauty & Pflege',
      'tech-gadgets': 'Technik & PC',
      'accesorios-moviles': 'Handy & Audio',
      'perifericos-gaming': 'Gaming',
      'herramientas-autos': 'Werkzeug & Auto',
      'juguetes-hobbies': 'Spielzeug & Drohnen',
      'deportes-outdoor': 'Sport & Outdoor',
      'mascotas': 'Haustiere',
      'bebes-oficina': 'Baby & Büro',
      'redes-wifi': 'Wi-Fi & Router'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `In ${country} liefert AliExpress direkt in ${curr}. Wenn Sie eine US-Weiterleitungsadresse (US Locker) nutzen, wechseln Sie zur Region Vereinigte Staaten (US-Locker).`,
    miamiBtn: 'US-Locker Gutscheine anzeigen (USD)',
    dynamicsTitle: (country) => `Temu & AliExpress App-Minispiele & Suchbefehle (${country})`,
    dynamicsSub: 'Diese Suchbefehle werden direkt in die obere Suchleiste der Temu-App eingegeben oder im AliExpress-Münzcenter genutzt, um Guthaben freizuschalten.',
    guidesTitle: (country) => `30-Tage-Preisanpassung & Dreifach-Rabatt-Anleitung (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Fällt der Preis eines für ${ex20} gekauften Artikels innerhalb von 30 Tagen auf ${ex15}, erhalten Sie ${ex5} sofort zurück.`,
    guidesOverride: {
      badge: 'OFFIZIELLER PREISANPASSUNGS- & RABATT-RATGEBER',
      g1Title: '1. 30-Tage-Preisanpassung bei Temu einfordern',
      g1Sub: 'Sofortige Rückerstattung der Preisdifferenz bei Preissenkungen',
      g1Desc: (curr) => `Jede Temu-Bestellung beinhaltet 30 Tage Preisgarantie in ${curr}:`,
      steps: (ex20, ex15, ex5) => [
        { step: 'SCHRITT 1', title: '"Ihre Bestellungen" öffnen', desc: 'Gehen Sie in der Temu-App auf "Sie" -> "Ihre Bestellungen".' },
        { step: 'SCHRITT 2', title: '"Preisanpassung anfordern" tippen', desc: `Ist der Preis z. B. von ${ex20} auf ${ex15} gesunken, erscheint die Schaltfläche.` },
        { step: 'SCHRITT 3', title: `Sofort ${ex5} erhalten`, desc: 'Wählen Sie Temu-Guthaben (in 1 Sekunde) oder Rückerstattung auf Ihre Zahlungsart.' }
      ],
      g2Title: '2. Drei Rabatte gleichzeitig bei AliExpress kombinieren',
      g2Sub: (country) => `Gültig in ${country} und weltweit`,
      g2Desc: 'Kombinieren Sie bei AliExpress immer diese drei Rabattstufen im Warenkorb:',
      g2Bullets: [
        'Stufe 1 — Verkäufer-Coupon auf der Produktseite aktivieren.',
        'Stufe 2 — App-Münzen für 2% bis 15% Extra-Abzug nutzen.',
        'Stufe 3 — CuponesTech Promo-Code (IFP-Serie) an der Kasse eingeben.'
      ],
      g3Title: '3. Direktversand vs. US-Locker / Weiterleitungsadresse',
      g3Sub: 'Wann sich ein US-Paketfach (US Locker) lohnt',
      g3Desc: (country) => `Aus ${country} können Sie per Direktversand bestellen oder oben "Vereinigte Staaten (US-Locker)" wählen, falls Sie einen US-Paketweiterleitungsdienst nutzen.`
    }
  },
  it: {
    navAll: 'Tutti',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Minigiochi App',
    navGuides: 'Adeguamento Prezzo',
    disclosureShort: 'Trasparenza: Riceviamo una commissione sugli acquisti idonei (Admitad / AliExpress Portals) senza costi aggiuntivi.',
    disclosureBadge: 'Affiliazione',
    searchPlaceholder: (curr) => `Cerca codice: abbigliamento, casa, bellezza, attrezzi, giocattoli, tech... (${curr})`,
    storeBadgeTemu: 'CODICE TEMU',
    storeBadgeAli: 'CODICE ALIEXPRESS',
    checkoutBadge: 'Codice carrello verificato',
    directDiscount: 'Sconto diretto',
    saveUpTo: (amt) => `Risparmi fino a ${amt}`,
    minSpendLabel: 'Spesa minima',
    promoCodeLabel: 'CODICE:',
    backupCodeLabel: 'Codice riserva:',
    copyShort: 'Copia',
    copiedShort: 'Copiato',
    allCategoriesChip: 'Tutte',
    catShort: {
      'moda-ropa': 'Moda e Scarpe',
      'smart-home': 'Casa e Cucina',
      'belleza-cuidado': 'Bellezza e Cura',
      'tech-gadgets': 'Tech e PC',
      'accesorios-moviles': 'Smartphone e Audio',
      'perifericos-gaming': 'Gaming',
      'herramientas-autos': 'Fai da te e Auto',
      'juguetes-hobbies': 'Giochi e Droni',
      'deportes-outdoor': 'Sport e Outdoor',
      'mascotas': 'Animali',
      'bebes-oficina': 'Bambini e Ufficio',
      'redes-wifi': 'Wi-Fi e Reti'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `In ${country}, AliExpress spedisce direttamente in ${curr}. Se utilizzi un indirizzo Locker negli Stati Uniti (US Locker), seleziona Stati Uniti (Locker USA).`,
    miamiBtn: 'Vedi Codici Stati Uniti (Locker USA)',
    dynamicsTitle: (country) => `Minigiochi e Comandi di Ricerca App Temu & AliExpress (${country})`,
    dynamicsSub: 'Digita questi comandi nella barra di ricerca dell’app Temu o apri la sezione Monete di AliExpress per sbloccare credito e bonus giornalieri.',
    guidesTitle: (country) => `Guida Adeguamento Prezzo (30 Giorni) e Triplo Sconto (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Se acquisti un articolo a ${ex20} e scende a ${ex15} entro 30 giorni, richiedi subito ${ex5} di rimborso senza restituire il prodotto.`
  },
  nl: {
    navAll: 'Alle',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'App Minigames',
    navGuides: 'Prijsaanpassing',
    disclosureShort: 'Transparantie: Wij ontvangen een commissie bij gekwalificeerde aankopen zonder extra kosten voor jou.',
    disclosureBadge: 'Affiliate-melding',
    searchPlaceholder: (curr) => `Zoek kortingscode: kleding, huis, beauty, gereedschap, speelgoed, tech... (${curr})`,
    storeBadgeTemu: 'TEMU CODE',
    storeBadgeAli: 'ALIEXPRESS CODE',
    checkoutBadge: 'Winkelwagen kortingscode',
    directDiscount: 'Directe korting',
    saveUpTo: (amt) => `Bespaar tot ${amt}`,
    minSpendLabel: 'Min. besteding',
    promoCodeLabel: 'CODE:',
    backupCodeLabel: 'Reservecode:',
    copyShort: 'Kopieer',
    copiedShort: 'Gekopieerd',
    allCategoriesChip: 'Alle',
    catShort: {
      'moda-ropa': 'Mode & Schoenen',
      'smart-home': 'Huis & Keuken',
      'belleza-cuidado': 'Beauty & Verzorging',
      'tech-gadgets': 'Tech & PC',
      'accesorios-moviles': 'Telefoon & Audio',
      'perifericos-gaming': 'Gaming',
      'herramientas-autos': 'Gereedschap & Auto',
      'juguetes-hobbies': 'Speelgoed & Drones',
      'deportes-outdoor': 'Sport & Outdoor',
      'mascotas': 'Huisdieren',
      'bebes-oficina': 'Baby & Kantoor',
      'redes-wifi': 'Wi-Fi & Netwerk'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `In ${country} verzendt AliExpress rechtstreeks in ${curr}. Gebruik je een US Locker / doorstuuradres? Kies dan Verenigde Staten (US Locker).`,
    miamiBtn: 'Bekijk US Locker Codes (USD)',
    dynamicsTitle: (country) => `Temu & AliExpress App Minigames & Zoekopdrachten (${country})`,
    dynamicsSub: 'Typ deze zoekwoorden in de zoekbalk van de Temu-app of gebruik AliExpress Munten voor extra tegoed.',
    guidesTitle: (country) => `30-Dagen Prijsaanpassing & Stapelkorting Gids (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Kocht je een artikel voor ${ex20} en daalt de prijs binnen 30 dagen naar ${ex15}? Claim direct ${ex5} terug.`
  },
  pl: {
    navAll: 'Wszystkie',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Minigry w Aplikacji',
    navGuides: 'Wyrównanie Ceny',
    disclosureShort: 'Informacja: Otrzymujemy prowizję od kwalifikujących się zakupów bez dodatkowych kosztów dla Ciebie.',
    disclosureBadge: 'Afiliacja',
    searchPlaceholder: (curr) => `Szukaj kodu: odzież, dom, uroda, narzędzia, zabawki, elektronika... (${curr})`,
    storeBadgeTemu: 'KOD TEMU',
    storeBadgeAli: 'KOD ALIEXPRESS',
    checkoutBadge: 'Kod rabatowy do koszyka',
    directDiscount: 'Rabat bezpośredni',
    saveUpTo: (amt) => `Oszczędzasz do ${amt}`,
    minSpendLabel: 'Min. zamówienie',
    promoCodeLabel: 'KOD:',
    backupCodeLabel: 'Kod zapasowy:',
    copyShort: 'Kopiuj',
    copiedShort: 'Skopiowano',
    allCategoriesChip: 'Wszystkie',
    catShort: {
      'moda-ropa': 'Moda i Obuwie',
      'smart-home': 'Dom i Kuchnia',
      'belleza-cuidado': 'Uroda i Zdrowie',
      'tech-gadgets': 'Elektronika i PC',
      'accesorios-moviles': 'Telefony i Audio',
      'perifericos-gaming': 'Gaming',
      'herramientas-autos': 'Narzędzia i Auto',
      'juguetes-hobbies': 'Zabawki i Drony',
      'deportes-outdoor': 'Sport i Turystyka',
      'mascotas': 'Zwierzęta',
      'bebes-oficina': 'Dzieci i Biuro',
      'redes-wifi': 'Wi-Fi i Sieci'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `W ${country} AliExpress wysyła bezpośrednio w ${curr}. Jeśli korzystasz ze skrzynki / Lockera w USA, wybierz region Stany Zjednoczone (Locker USA).`,
    miamiBtn: 'Zobacz Kody USA (Locker USA)',
    dynamicsTitle: (country) => `Minigry i Komendy Wyszukiwania Temu oraz AliExpress (${country})`,
    dynamicsSub: 'Wpisz te hasła w pasku wyszukiwania aplikacji Temu lub otwórz zakładkę Monety w AliExpress, aby odebrać środki i kupony.',
    guidesTitle: (country) => `Poradnik Wyrównania Ceny (30 Dni) i Łączenia Rabatów (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Jeśli kupisz produkt za ${ex20}, a w ciągu 30 dni jego cena spadnie do ${ex15}, odbierz ${ex5} zwrotu jednym kliknięciem.`
  },
  ja: {
    navAll: 'すべて',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'アプリ内ミニゲーム',
    navGuides: '価格調整・返金ガイド',
    disclosureShort: '広告開示：当サイトは適格な購入に対して追加費用なしでアフィリエイト報酬を受け取る場合があります。',
    disclosureBadge: '広告開示',
    searchPlaceholder: (curr) => `クーポン検索: ファッション, 生活雑貨, 美容, 工具, おもちゃ, 家電... (${curr})`,
    storeBadgeTemu: 'TEMU クーポン',
    storeBadgeAli: 'ALIEXPRESS コード',
    checkoutBadge: 'カート決済用コード',
    directDiscount: '即時割引',
    saveUpTo: (amt) => `最大 ${amt} お得`,
    minSpendLabel: '最低注文額',
    promoCodeLabel: 'コード:',
    backupCodeLabel: '予備コード:',
    copyShort: 'コピー',
    copiedShort: '完了',
    allCategoriesChip: 'すべて',
    catShort: {
      'moda-ropa': 'ファッション・靴',
      'smart-home': 'ホーム・キッチン',
      'belleza-cuidado': '美容・コスメ',
      'tech-gadgets': '家電・PC',
      'accesorios-moviles': 'スマホ・イヤホン',
      'perifericos-gaming': 'ゲーム機器',
      'herramientas-autos': '工具・カー用品',
      'juguetes-hobbies': 'おもちゃ・ホビー',
      'deportes-outdoor': 'スポーツ・アウトドア',
      'mascotas': 'ペット用品',
      'bebes-oficina': 'ベビー・文房具',
      'redes-wifi': 'Wi-Fi・ルーター'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `${country}ではAliExpressが${curr}で直接配送します。米国転送ロッカー（US Locker）をご利用の場合は「アメリカ合衆国（米国ロッカー）」を選択してください。`,
    miamiBtn: '米国ロッカー用クーポンを見る (USD)',
    dynamicsTitle: (country) => `Temu & AliExpress アプリ検索コマンド・ミニゲーム (${country})`,
    dynamicsSub: 'これらのキーワードはTemuアプリの検索バーに入力するか、AliExpressのコインセンターで利用してクレジットを獲得できます。',
    guidesTitle: (country) => `30日間価格調整（差額返金）＆3重割引ガイド (${country})`,
    guidesSub: (ex20, ex15, ex5) => `${ex20}で購入した商品が30日以内に${ex15}に値下がりした場合、返品不要で差額の${ex5}を即時請求できます。`
  },
  ko: {
    navAll: '전체',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: '앱 미니게임·이벤트',
    navGuides: '가격 조정 환불 가이드',
    disclosureShort: '파트너스 고지: 적격 구매 시 추가 비용 없이 제휴 수수료를 제공받을 수 있습니다.',
    disclosureBadge: '제휴 고지',
    searchPlaceholder: (curr) => `쿠폰 검색: 의류, 신발, 홈/키친, 뷰티, 공구, 완구, 전자기기... (${curr})`,
    storeBadgeTemu: 'TEMU 쿠폰',
    storeBadgeAli: 'ALIEXPRESS 코드',
    checkoutBadge: '장바구니 결제 코드',
    directDiscount: '즉시 할인',
    saveUpTo: (amt) => `최대 ${amt} 할인`,
    minSpendLabel: '최소 주문',
    promoCodeLabel: '코드:',
    backupCodeLabel: '예비 코드:',
    copyShort: '복사',
    copiedShort: '복사됨',
    allCategoriesChip: '전체',
    catShort: {
      'moda-ropa': '패션·신발',
      'smart-home': '홈·주방·리빙',
      'belleza-cuidado': '뷰티·케어',
      'tech-gadgets': '테크·컴퓨터',
      'accesorios-moviles': '휴대폰·오디오',
      'perifericos-gaming': '게이밍·콘솔',
      'herramientas-autos': '공구·자동차',
      'juguetes-hobbies': '완구·드론·취미',
      'deportes-outdoor': '스포츠·캠핑',
      'mascotas': '반려동물 용품',
      'bebes-oficina': '유아·문구/오피스',
      'redes-wifi': 'Wi-Fi·공유기'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `${country}에서는 AliExpress가 ${curr} 통화로 직배송합니다. 미국 배송대행지(배대지 / US Locker)를 이용하시는 경우 미국(US Locker) 지역을 선택하세요.`,
    miamiBtn: '미국 배대지(US Locker) 전용 쿠폰 보기',
    dynamicsTitle: (country) => `Temu & AliExpress 앱 검색창 미니게임 및 크레딧 코드 (${country})`,
    dynamicsSub: '이 키워드는 결제창이 아닌 Temu 앱 상단 검색창에 입력하거나 AliExpress 코인 탭에서 사용하여 크레딧 보상을 받는 전용 코드입니다.',
    guidesTitle: (country) => `30일 가격 조정(차액 환불) 및 3중 중복 할인 가이드 (${country})`,
    guidesSub: (ex20, ex15, ex5) => `오늘 ${ex20}에 구매한 상품이 30일 이내에 ${ex15}로 인하되면 반품 없이 차액 ${ex5}를 즉시 환불받을 수 있습니다.`
  },
  ar: {
    navAll: 'الكل',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'ألعاب ومكافآت التطبيق',
    navGuides: 'دليل تعديل السعر',
    disclosureShort: 'إفصاح: قد نحصل على عمولة من عمليات الشراء المؤهلة دون أي تكلفة إضافية عليك.',
    disclosureBadge: 'إفصاح الشراكة',
    searchPlaceholder: (curr) => `ابحث عن كود: ملابس، أحذية، منزل، تجميل، أدوات، ألعاب، إلكترونيات... (${curr})`,
    storeBadgeTemu: 'كوبون TEMU',
    storeBadgeAli: 'كود ALIEXPRESS',
    checkoutBadge: 'كود خصم مباشر للسلة',
    directDiscount: 'خصم فوري',
    saveUpTo: (amt) => `وفر حتى ${amt}`,
    minSpendLabel: 'الحد الأدنى',
    promoCodeLabel: 'الكود:',
    backupCodeLabel: 'كود بديل:',
    copyShort: 'نسخ',
    copiedShort: 'تم النسخ',
    allCategoriesChip: 'الكل',
    catShort: {
      'moda-ropa': 'أزياء وأحذية',
      'smart-home': 'المنزل والمطبخ',
      'belleza-cuidado': 'الجمال والعناية',
      'tech-gadgets': 'إلكترونيات وحواسيب',
      'accesorios-moviles': 'هواتف وسماعات',
      'perifericos-gaming': 'ألعاب الفيديو',
      'herramientas-autos': 'عدد ومستلزمات سيارات',
      'juguetes-hobbies': 'دمى وهوايات',
      'deportes-outdoor': 'رياضة وتخييم',
      'mascotas': 'مستلزمات الحيوانات',
      'bebes-oficina': 'أطفال وقرطاسية',
      'redes-wifi': 'واي فاي وشبكات'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `في ${country}، يشحن AliExpress مباشرة بعملة ${curr}. إذا كنت تستخدم صندوق بريد أمريكي (US Locker)، اختر منطقة الولايات المتحدة (US Locker).`,
    miamiBtn: 'عرض أكواد صندوق البريد الأمريكي (US Locker)',
    dynamicsTitle: (country) => `أكواد البحث والألعاب المصغرة في تطبيق Temu وAliExpress (${country})`,
    dynamicsSub: 'اكتب هذه الكلمات في شريط بحث تطبيق Temu أو افتح قسم العملات في AliExpress للحصول على رصيد ومكافآت يومية.',
    guidesTitle: (country) => `دليل استرداد فرق السعر خلال 30 يوماً والخصم الثلاثي (${country})`,
    guidesSub: (ex20, ex15, ex5) => `إذا اشتريت منتجاً اليوم بسعر ${ex20} وانخفض سعره إلى ${ex15} خلال 30 يوماً، يمكنك استرداد فرق السعر (${ex5}) فوراً.`
  },
  zh: {
    navAll: '全部优惠',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'App小游戏与口令',
    navGuides: '30天保价与退差价指南',
    disclosureShort: '联盟声明：通过本站链接购买符合条件的商品，我们可能会获得佣金，但不会增加您的任何费用。',
    disclosureBadge: '联盟声明',
    searchPlaceholder: (curr) => `搜索优惠券：服饰鞋包、家居厨房、美妆、工具、玩具、数码... (${curr})`,
    storeBadgeTemu: 'TEMU 优惠码',
    storeBadgeAli: '速卖通优惠码',
    checkoutBadge: '购物车结账可用',
    directDiscount: '立减折扣',
    saveUpTo: (amt) => `最高立省 ${amt}`,
    minSpendLabel: '最低消费',
    promoCodeLabel: '优惠码:',
    backupCodeLabel: '备用码:',
    copyShort: '复制',
    copiedShort: '已复制',
    allCategoriesChip: '全部',
    catShort: {
      'moda-ropa': '服饰与鞋靴',
      'smart-home': '家居与厨房',
      'belleza-cuidado': '美妆与个护',
      'tech-gadgets': '电脑与数码',
      'accesorios-moviles': '手机与音频',
      'perifericos-gaming': '电玩与手柄',
      'herramientas-autos': '工具与汽配',
      'juguetes-hobbies': '玩具与无人机',
      'deportes-outdoor': '运动与户外',
      'mascotas': '宠物用品',
      'bebes-oficina': '母婴与办公文具',
      'redes-wifi': 'Wi-Fi路由器'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `在 ${country}，速卖通支持 ${curr} 直邮。如果您使用美国转运仓（US Locker），请切换至“美国（US Locker）”地区。`,
    miamiBtn: '查看美国转运仓 (US Locker) 优惠码',
    dynamicsTitle: (country) => `Temu 与 AliExpress 搜索框隐藏口令及小游戏 (${country})`,
    dynamicsSub: '这些口令无需在结账时粘贴，直接在 Temu App 顶部搜索框输入，或打开速卖通金币中心即可领取余额与叠加礼券。',
    guidesTitle: (country) => `30天价格保护（一键退差价）与三重叠加省钱指南 (${country})`,
    guidesSub: (ex20, ex15, ex5) => `如果您今天以 ${ex20} 购买商品，30天内降价至 ${ex15}，无需退货即可一键申请退还 ${ex5} 差价。`
  },
  ru: {
    navAll: 'Все',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Мини-игры в App',
    navGuides: 'Возврат разницы цены',
    disclosureShort: 'Партнерское уведомление: мы получаем комиссию за покупки без доплат с вашей стороны.',
    disclosureBadge: 'Партнерство',
    searchPlaceholder: (curr) => `Поиск купонов: одежда, обувь, дом, красота, инструменты, игрушки... (${curr})`,
    storeBadgeTemu: 'КУПОН TEMU',
    storeBadgeAli: 'КОД ALIEXPRESS',
    checkoutBadge: 'Промокод для корзины',
    directDiscount: 'Прямая скидка',
    saveUpTo: (amt) => `Экономия до ${amt}`,
    minSpendLabel: 'Мин. заказ',
    promoCodeLabel: 'КОД:',
    backupCodeLabel: 'Запасной код:',
    copyShort: 'Копировать',
    copiedShort: 'Скопировано',
    allCategoriesChip: 'Все',
    catShort: {
      'moda-ropa': 'Одежда и обувь',
      'smart-home': 'Дом и кухня',
      'belleza-cuidado': 'Красота и уход',
      'tech-gadgets': 'Электроника и ПК',
      'accesorios-moviles': 'Смартфоны и аудио',
      'perifericos-gaming': 'Гейминг',
      'herramientas-autos': 'Инструменты и авто',
      'juguetes-hobbies': 'Игрушки и хобби',
      'deportes-outdoor': 'Спорт и отдых',
      'mascotas': 'Зоотовары',
      'bebes-oficina': 'Детям и офис',
      'redes-wifi': 'Wi-Fi и роутеры'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `В ${country} AliExpress доставляет напрямую в ${curr}. Если вы используете склад-посредник в США (US Locker), выберите регион США (US Locker).`,
    miamiBtn: 'Промокоды для склада США (US Locker)',
    dynamicsTitle: (country) => `Поисковые команды и мини-игры Temu & AliExpress (${country})`,
    dynamicsSub: 'Введите эти команды в строку поиска приложения Temu или откройте раздел Монеты в AliExpress для получения бонусов и купонов.',
    guidesTitle: (country) => `Гид по корректировке цены (30 дней) и тройным скидкам (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Если вы купили товар за ${ex20}, а в течение 30 дней цена снизилась до ${ex15}, верните разницу ${ex5} в один клик.`
  },
  tr: {
    navAll: 'Tümü',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Uygulama Oyunları',
    navGuides: 'Fiyat Farkı İadesi',
    disclosureShort: 'Açıklama: Sizin için ek maliyet olmadan uygun alışverişlerden satış ortaklığı komisyonu kazanabiliriz.',
    disclosureBadge: 'Ortaklık Bildirimi',
    searchPlaceholder: (curr) => `Kupon ara: giyim, ayakkabı, ev, güzellik, aletler, oyuncak, elektronik... (${curr})`,
    storeBadgeTemu: 'TEMU KUPONU',
    storeBadgeAli: 'ALIEXPRESS KODU',
    checkoutBadge: 'Sepette geçerli kod',
    directDiscount: 'Anında indirim',
    saveUpTo: (amt) => `${amt}’ye varan indirim`,
    minSpendLabel: 'Min. sepet',
    promoCodeLabel: 'KOD:',
    backupCodeLabel: 'Yedek kod:',
    copyShort: 'Kopyala',
    copiedShort: 'Kopyalandı',
    allCategoriesChip: 'Tümü',
    catShort: {
      'moda-ropa': 'Giyim ve Ayakkabı',
      'smart-home': 'Ev ve Mutfak',
      'belleza-cuidado': 'Güzellik ve Bakım',
      'tech-gadgets': 'Teknoloji ve PC',
      'accesorios-moviles': 'Telefon ve Ses',
      'perifericos-gaming': 'Oyun ve Konsol',
      'herramientas-autos': 'Yapı Market ve Oto',
      'juguetes-hobbies': 'Oyuncak ve Hobi',
      'deportes-outdoor': 'Spor ve Kamp',
      'mascotas': 'Evcil Hayvan',
      'bebes-oficina': 'Bebek ve Kırtasiye',
      'redes-wifi': 'Wi-Fi ve Ağ'
    },
    usLockerTarget: '/en-us/temu',
    miamiNotice: (country, curr) =>
      `${country} için AliExpress ${curr} para 세비예신데 doğrudan gönderim yapar. ABD posta kutusu / yönlendirme (US Locker) kullanıyorsanız ABD (US Locker) bölgesini seçin.`,
    miamiBtn: 'ABD Locker Kuponlarını Gör (USD)',
    dynamicsTitle: (country) => `Temu & AliExpress Uygulama Arama Kodları ve Mini Oyunlar (${country})`,
    dynamicsSub: 'Bu komutları Temu uygulama arama çubuğuna yazın veya AliExpress Jetonlar sekmesini açarak ekstra kredi ve indirim kazanın.',
    guidesTitle: (country) => `30 Günlük Fiyat Ayarlaması (Fark İadesi) ve 3’lü İndirim Rehberi (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Bugün ${ex20} ödeyerek aldığınız ürün 30 gün içinde ${ex15} seviyesine düşerse, ürünü iade etmeden ${ex5} farkı anında geri alabilirsiniz.`
  }
};

export function getSectionText(lang = 'en') {
  if (lang === 'es') return SECTION_I18N.es;
  if (lang === 'en') return SECTION_I18N.en;
  const extra = EXTRA_LANGS[lang];
  if (!extra) return SECTION_I18N.en;

  return {
    ...SECTION_I18N.en,
    ...extra,
    dynamics: {
      ...SECTION_I18N.en.dynamics,
      title: extra.dynamicsTitle || SECTION_I18N.en.dynamics.title,
      subtitle: extra.dynamicsSub || SECTION_I18N.en.dynamics.subtitle
    },
    guides: {
      ...SECTION_I18N.en.guides,
      ...(extra.guidesOverride || {}),
      title: extra.guidesTitle || SECTION_I18N.en.guides.title,
      subtitle: extra.guidesSub || SECTION_I18N.en.guides.subtitle
    }
  };
}

/**
 * LOCALIZED URL ROUTE SLUGS PER LANGUAGE
 */
export const ROUTE_SLUGS_BY_LANG = {
  es: {
    dynamics: 'dinamicas',
    guides: 'guias',
    privacy: 'privacidad',
    terms: 'terminos',
    about: 'nosotros',
    contact: 'contacto'
  },
  en: {
    dynamics: 'dynamics',
    guides: 'guides',
    privacy: 'privacy',
    terms: 'terms',
    about: 'about',
    contact: 'contact'
  },
  pt: {
    dynamics: 'dinamicas',
    guides: 'guias',
    privacy: 'privacidade',
    terms: 'termos',
    about: 'sobre',
    contact: 'contato'
  },
  fr: {
    dynamics: 'dynamiques',
    guides: 'guides',
    privacy: 'confidentialite',
    terms: 'conditions',
    about: 'a-propos',
    contact: 'contact'
  },
  de: {
    dynamics: 'minispiele',
    guides: 'ratgeber',
    privacy: 'datenschutz',
    terms: 'bedingungen',
    about: 'ueber-uns',
    contact: 'kontakt'
  },
  it: {
    dynamics: 'dinamiche',
    guides: 'guide',
    privacy: 'privacy',
    terms: 'termini',
    about: 'chi-siamo',
    contact: 'contatti'
  }
};

export function getRouteSlugsForLang(lang = 'en') {
  return ROUTE_SLUGS_BY_LANG[lang] || ROUTE_SLUGS_BY_LANG.en;
}

export function getLocalizedPath(localeConfig, pageKey) {
  const slugs = getRouteSlugsForLang(localeConfig.lang);
  const slug = slugs[pageKey] || pageKey;
  return `/${localeConfig.code}/${slug}`;
}

export function resolvePageKeyFromSlug(rawSlug) {
  if (!rawSlug) return null;
  const clean = rawSlug.toLowerCase();
  for (const map of Object.values(ROUTE_SLUGS_BY_LANG)) {
    for (const [pageKey, val] of Object.entries(map)) {
      if (val === clean) return pageKey;
    }
  }
  return null;
}

export function translatePathToLocale(pathname, newLocaleConfig) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return `/${newLocaleConfig.code}`;
  parts[0] = newLocaleConfig.code;
  if (parts.length === 2) {
    const pageKey = resolvePageKeyFromSlug(parts[1]);
    if (pageKey) {
      parts[1] = getRouteSlugsForLang(newLocaleConfig.lang)[pageKey];
    }
  }
  return '/' + parts.join('/');
}
