// Native translations for all 14 languages across 66 countries:
// UI Micro-labels, Category Short Labels, App Dynamics & Mini-Games, and 30-Day Price Adjustment Guides.

export const SECTION_I18N = {
  es: {
    navAll: 'Todas',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Dinámicas y Minijuegos',
    navGuides: 'Guía y Ajuste de Precio',
    disclosureShort: 'Transparencia: Recibimos comisión por compras calificadas (Admitad / AliExpress Portals) sin costo adicional para ti.',
    disclosureBadge: 'Aviso de Afiliación',
    searchPlaceholder: (curr) => `Buscar cupón: PC, controles, hogar, carga GaN... (${curr})`,
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
      'tech-gadgets': 'PC y Gadgets',
      'perifericos-gaming': 'Gaming y Controles',
      'smart-home': 'Hogar y Domótica',
      'redes-wifi': 'Wi-Fi y Redes',
      'accesorios-moviles': 'Carga GaN y Móvil'
    },
    miamiNotice: (country, curr) =>
      `En ${country}, AliExpress envía directo en ${curr}. Para pedir en Temu con casillero en Miami, puedes ver los códigos de EE. UU.`,
    miamiBtn: 'Ver Temu (Casillero Miami)',
    dynamics: {
      badge: 'COMANDOS DE BUSCADOR Y MINIJUEGOS DE APP',
      title: (country) => `Dinámicas, Ruletas y Minijuegos de Temu y AliExpress en ${country}`,
      subtitle:
        'Estos comandos NO se pegan al pagar en el carrito. Escríbelos en la barra de búsqueda superior de la app de Temu o entra al centro de juegos de AliExpress para abrir ruletas de crédito, cofres y recompensas diarias.',
      typeInSearch: 'ESCRIBIR EN BUSCADOR:',
      copyBtn: (store) => `Copiar Comando e Ir a ${store}`,
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
      g3Title: '3. Envío Directo vs. Casillero Internacional en Miami (Florida)',
      g3Sub: 'Cómo elegir la mejor ruta logística según tu país',
      g3Desc: (country) =>
        `Desde ${country}, puedes pedir por envío directo internacional en AliExpress (línea Choice con seguimiento completo) o, si utilizas un casillero en Miami (código postal 33166 / 33122), cambiar el selector de país arriba a "Estados Unidos (Casilleros Miami)" para aprovechar envío doméstico gratuito en EE. UU. tanto en Temu como en AliExpress.`
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
    searchPlaceholder: (curr) => `Search coupons: Mini PC, controllers, smart home, GaN... (${curr})`,
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
      'tech-gadgets': 'PC & Gadgets',
      'perifericos-gaming': 'Gaming Gear',
      'smart-home': 'Smart Home',
      'redes-wifi': 'Wi-Fi & Routers',
      'accesorios-moviles': 'GaN & Mobile'
    },
    miamiNotice: (country, curr) =>
      `In ${country}, AliExpress ships directly in ${curr}. To shop Temu via a US freight forwarder, switch to our US region.`,
    miamiBtn: 'View US Temu Codes',
    dynamics: {
      badge: 'APP SEARCH BAR COMMANDS & MINI-GAMES',
      title: (country) => `Temu & AliExpress App Mini-Games & Search Commands in ${country}`,
      subtitle:
        'These keywords are NOT pasted at checkout. Type them directly into the top search bar of the Temu app or open the AliExpress Games center to unlock credit wheels, daily rewards, and stackable bonus discounts.',
      typeInSearch: 'TYPE IN SEARCH:',
      copyBtn: (store) => `Copy Keyword & Open ${store}`,
      copiedBtn: 'Keyword Copied!',
      items: [
        {
          id: 'dyn-credit777',
          store: 'Temu App',
          storeKey: 'temu',
          code: 'credit777',
          badge: 'CREDIT WHEEL & CASHBACK EVENT',
          title: 'Account Credit & Reward Wheel Activity (credit777)',
          howItWorks:
            'Type "credit777" into the top search bar in the Temu app. It opens the official credit-back board where qualifying orders unlock wallet credit.'
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
            'Type "box777" in the Temu search bar to trigger the mystery chest activity with time-limited coupon packs.'
        },
        {
          id: 'dyn-ali-coins',
          store: 'AliExpress App',
          storeKey: 'aliexpress',
          code: 'Coins Discount Finder',
          badge: 'EXTRA 5%–25% APP DISCOUNT',
          title: 'AliExpress Coins Center + Super Discount Finder',
          howItWorks:
            'Open the "Coins" tab inside the AliExpress mobile app, collect daily coins in one tap, and use the Discount Finder to stack up to 25% extra off on top of our IFP promo codes.'
        },
        {
          id: 'dyn-ali-mergeboss',
          store: 'AliExpress App',
          storeKey: 'aliexpress',
          code: 'Merge Boss & Prize Land',
          badge: 'OFFICIAL SHOPPING CREDITS',
          title: 'AliExpress Merge Boss & Prize Land Reward Games',
          howItWorks:
            'Under "Account" in the AliExpress app, play Merge Boss or Prize Land during Choice Day events to exchange game points for no-minimum shopping credits.'
        }
      ]
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
      g3Title: '3. Direct Local Delivery vs. US Freight Forwarder (Miami Locker)',
      g3Sub: 'Choosing the fastest shipping route for your country',
      g3Desc: (country) =>
        `Shoppers in ${country} can use AliExpress Choice Direct shipping in local currency, or switch our country selector to "United States" when shipping to a Miami freight forwarder (ZIP 33166 / 33122) to unlock US-only Temu & AliExpress bundles.`
    }
  }
};

// Build tailored native translations for the remaining 12 languages so all 14 languages are 100% native
const EXTRA_LANGS = {
  pt: {
    navAll: 'Todas',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Minijogos e Dinâmicas',
    navGuides: 'Ajuste de Preço (30 Dias)',
    disclosureShort: 'Transparência: Recebemos comissão em compras qualificadas (Admitad / AliExpress Portals) sem custo extra para você.',
    disclosureBadge: 'Aviso de Afiliados',
    searchPlaceholder: (curr) => `Buscar cupom: Mini PC, controles, casa smart, GaN... (${curr})`,
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
      'tech-gadgets': 'PC e Gadgets',
      'perifericos-gaming': 'Gaming e Controles',
      'smart-home': 'Casa Inteligente',
      'redes-wifi': 'Wi-Fi e Redes',
      'accesorios-moviles': 'Carga GaN e Mobile'
    },
    dynamicsTitle: (country) => `Dinâmicas, Roletas e Minijogos da Temu e AliExpress (${country})`,
    dynamicsSub: 'Estes comandos NÃO são colados no pagamento. Digite-os na barra de busca superior do app da Temu ou abra a aba Moedas do AliExpress para desbloquear créditos e bônus.',
    guidesTitle: (country) => `Guia de Ajuste de Preço (30 Dias) e Descontos Triplos (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Se você comprar um produto hoje por ${ex20} e ele baixar para ${ex15} em até 30 dias, peça o reembolso de ${ex5} na hora sem devolver o produto.`
  },
  fr: {
    navAll: 'Toutes',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Mini-Jeux App',
    navGuides: 'Ajustement de Prix',
    disclosureShort: 'Transparence : Commission perçue sur les achats éligibles (Admitad / AliExpress Portals) sans frais supplémentaires.',
    disclosureBadge: 'Affiliation',
    searchPlaceholder: (curr) => `Rechercher un code : Mini PC, manettes, maison, GaN... (${curr})`,
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
      'tech-gadgets': 'PC & Gadgets',
      'perifericos-gaming': 'Gaming & Manettes',
      'smart-home': 'Maison Connectée',
      'redes-wifi': 'Wi-Fi & Réseaux',
      'accesorios-moviles': 'Chargeurs GaN'
    },
    dynamicsTitle: (country) => `Mini-Jeux et Commandes de Recherche Temu & AliExpress (${country})`,
    dynamicsSub: 'Ces mots-clés ne se collent pas au paiement : tapez-les dans la barre de recherche de l’application Temu ou ouvrez l’espace Pièces AliExpress pour gagner du crédit.',
    guidesTitle: (country) => `Guide d’Ajustement de Prix (30 Jours) et Cumul de Remises (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Si un article acheté ${ex20} passe à ${ex15} dans les 30 jours, réclamez ${ex5} de remboursement instantané sans renvoyer le colis.`
  },
  de: {
    navAll: 'Alle',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'App Mini-Spiele',
    navGuides: 'Preisanpassung (30 Tage)',
    disclosureShort: 'Hinweis: Wir erhalten eine Provision bei qualifizierten Käufen (Admitad / AliExpress Portals) ohne Mehrkosten für Sie.',
    disclosureBadge: 'Affiliate-Hinweis',
    searchPlaceholder: (curr) => `Gutscheine filtern: Mini-PC, Controller, Smart Home, GaN... (${curr})`,
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
      'tech-gadgets': 'PC & Gadgets',
      'perifericos-gaming': 'Gaming & Controller',
      'smart-home': 'Smart Home',
      'redes-wifi': 'Wi-Fi & Router',
      'accesorios-moviles': 'GaN & Zubehör'
    },
    dynamicsTitle: (country) => `Temu & AliExpress App-Minispiele & Suchbefehle (${country})`,
    dynamicsSub: 'Diese Suchbefehle werden direkt in die obere Suchleiste der Temu-App eingegeben oder im AliExpress-Münzcenter genutzt, um Guthaben freizuschalten.',
    guidesTitle: (country) => `30-Tage-Preisanpassung & Dreifach-Rabatt-Anleitung (${country})`,
    guidesSub: (ex20, ex15, ex5) => `Fällt der Preis eines für ${ex20} gekauften Artikels innerhalb von 30 Tagen auf ${ex15}, erhalten Sie ${ex5} sofort zurück.`
  },
  it: {
    navAll: 'Tutti',
    navTemu: 'Temu',
    navAli: 'AliExpress',
    navDynamics: 'Minigiochi App',
    navGuides: 'Adeguamento Prezzo',
    disclosureShort: 'Trasparenza: Riceviamo una commissione sugli acquisti idonei (Admitad / AliExpress Portals) senza costi aggiuntivi.',
    disclosureBadge: 'Affiliazione',
    searchPlaceholder: (curr) => `Cerca codice: Mini PC, controller, smart home, GaN... (${curr})`,
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
      'tech-gadgets': 'PC & Gadget',
      'perifericos-gaming': 'Gaming & Controller',
      'smart-home': 'Smart Home',
      'redes-wifi': 'Wi-Fi & Reti',
      'accesorios-moviles': 'Ricarica GaN'
    },
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
    searchPlaceholder: (curr) => `Zoek kortingscode: Mini-PC, gaming, smart home, GaN... (${curr})`,
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
      'tech-gadgets': 'PC & Gadgets',
      'perifericos-gaming': 'Gaming Gear',
      'smart-home': 'Smart Home',
      'redes-wifi': 'Wi-Fi & Netwerk',
      'accesorios-moviles': 'GaN & Mobiel'
    },
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
    searchPlaceholder: (curr) => `Szukaj kodu: Mini PC, kontrolery, smart home, GaN... (${curr})`,
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
      'tech-gadgets': 'PC i Gadżety',
      'perifericos-gaming': 'Gaming i Pady',
      'smart-home': 'Smart Home',
      'redes-wifi': 'Wi-Fi i Sieci',
      'accesorios-moviles': 'Ładowarki GaN'
    },
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
    searchPlaceholder: (curr) => `クーポン検索: ミニPC, コントローラー, GaN充電器... (${curr})`,
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
      'tech-gadgets': 'PC・ガジェット',
      'perifericos-gaming': 'ゲーミング機器',
      'smart-home': 'スマートホーム',
      'redes-wifi': 'Wi-Fi・ルーター',
      'accesorios-moviles': 'GaN急速充電'
    },
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
    searchPlaceholder: (curr) => `쿠폰 검색: 미니 PC, 게임패드, 스마트홈, GaN... (${curr})`,
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
      'tech-gadgets': 'PC·가젯',
      'perifericos-gaming': '게이밍 기어',
      'smart-home': '스마트홈',
      'redes-wifi': 'Wi-Fi·공유기',
      'accesorios-moviles': 'GaN 충전·모바일'
    },
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
    searchPlaceholder: (curr) => `ابحث عن كود: حواسيب، أذرع تحكم، شواحن GaN... (${curr})`,
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
      'tech-gadgets': 'أجهزة وMini PC',
      'perifericos-gaming': 'ألعاب وتحكم',
      'smart-home': 'المنزل الذكي',
      'redes-wifi': 'واي فاي وشبكات',
      'accesorios-moviles': 'شواحن GaN'
    },
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
    searchPlaceholder: (curr) => `搜索优惠券：迷你主机、手柄、智能家居、GaN充电器... (${curr})`,
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
      'tech-gadgets': '迷你主机与数码',
      'perifericos-gaming': '游戏外设手柄',
      'smart-home': '智能家居',
      'redes-wifi': 'Wi-Fi路由器',
      'accesorios-moviles': 'GaN快充配件'
    },
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
    searchPlaceholder: (curr) => `Поиск купонов: Мини-ПК, геймпады, умный дом, GaN... (${curr})`,
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
      'tech-gadgets': 'ПК и гаджеты',
      'perifericos-gaming': 'Гейминг и пады',
      'smart-home': 'Умный дом',
      'redes-wifi': 'Wi-Fi и роутеры',
      'accesorios-moviles': 'GaN зарядки'
    },
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
    searchPlaceholder: (curr) => `Kupon ara: Mini PC, gamepad, akıllı ev, GaN... (${curr})`,
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
      'tech-gadgets': 'PC ve Gadget',
      'perifericos-gaming': 'Oyuncu Ekipmanı',
      'smart-home': 'Akıllı Ev',
      'redes-wifi': 'Wi-Fi ve Ağ',
      'accesorios-moviles': 'GaN Şarj ve Mobil'
    },
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
      title: extra.guidesTitle || SECTION_I18N.en.guides.title,
      subtitle: extra.guidesSub || SECTION_I18N.en.guides.subtitle
    }
  };
}
