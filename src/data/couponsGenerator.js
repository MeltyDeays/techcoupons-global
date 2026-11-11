import { getLocaleConfig, formatLocalPrice } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';

/**
 * REGIONAL ALIEXPRESS TIERED PROMO CODES (Official Global Portals / Choice Active Series)
 */
const ALIEXPRESS_REGIONAL_TIERS = {
  tier3_18: {
    default: { primary: 'IFPCOGGC', backup: 'IFPGTV1F' },
    'es-mx': { primary: 'ALIMX03', backup: 'IFPCOGGC' },
    'pt-br': { primary: 'IFPCOGGC', backup: 'IFPGTV1F' },
    'es-es': { primary: 'IFPCOGGC', backup: 'IFPGTV1F' }
  },
  tier8_45: {
    default: { primary: 'IFPCDXGG', backup: 'IFPOSPHJ' }
  },
  tier13_79: {
    default: { primary: 'IFPIMB3X', backup: 'IFPZ5GQG' }
  },
  tier24_139: {
    default: { primary: 'IFPDSIWP', backup: 'IFPHB8CL' }
  },
  tier40_229: {
    default: { primary: 'IFPZWROH', backup: 'IFPM9JQA' }
  }
};

function getAliCodeForLocale(tierKey, localeCode) {
  const tier = ALIEXPRESS_REGIONAL_TIERS[tierKey] || ALIEXPRESS_REGIONAL_TIERS.tier8_45;
  return tier[localeCode] || tier.default;
}

/**
 * 22 CUPONES VERIFICADOS DE CARRITO (11 AliExpress + 11 Temu)
 * Cubriendo las 11 categorías universales de compra con descripción directa y clara
 * de para qué sirve cada cupón y a qué productos aplica.
 */
const CHECKOUT_COUPONS = [
  // =========================================================================
  // 1. ROPA, CALZADO Y MODA (moda-ropa)
  // =========================================================================
  {
    id: 'ali-moda-ropa',
    store: 'aliexpress',
    category: 'moda-ropa',
    tierKey: 'tier8_45',
    discountPct: 18,
    discountUsd: 8,
    minSpendUsd: 45,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Ropa de Mujer y Hombre, Calzado, Bolsos y Relojes',
      en: 'Coupon for Men’s & Women’s Clothing, Shoes, Bags & Watches'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta directo en vestidos, camisas, pantalones, zapatillas deportivas, bolsos, mochilas, lentes de sol y joyería.',
      en: 'What it covers: Direct discount on dresses, shirts, pants, sneakers, handbags, backpacks, sunglasses, and jewelry.'
    }
  },
  {
    id: 'temu-moda-ropa',
    store: 'temu',
    category: 'moda-ropa',
    code: 'aci382910',
    backupCode: 'ach586089',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Ropa, Zapatos, Tenis, Bolsos y Accesorios de Moda',
      en: '30% OFF Coupon on Clothing, Sneakers, Shoes, Bags & Fashion'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica a toda la sección de ropa casual, deportiva, calzado para dama y caballero, carteras, cinturones y relojes.',
      en: 'What it covers: Applies to casual & athletic clothing, men’s and women’s footwear, purses, belts, and watches.'
    }
  },

  // =========================================================================
  // 2. HOGAR, COCINA Y MUEBLES (smart-home)
  // =========================================================================
  {
    id: 'ali-hogar-cocina',
    store: 'aliexpress',
    category: 'smart-home',
    tierKey: 'tier8_45',
    discountPct: 18,
    discountUsd: 8,
    minSpendUsd: 45,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Artículos del Hogar, Cocina, Organización y Decoración',
      en: 'Coupon for Home, Kitchen Appliances, Storage & Decor'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en cafeteras, freidoras de aire, utensilios de cocina, sábanas, organizadores de clóset, lámparas LED y aspiradoras.',
      en: 'What it covers: Discounts coffee makers, air fryers, kitchenware, bedding, closet organizers, LED lamps, and vacuums.'
    }
  },
  {
    id: 'temu-hogar-cocina',
    store: 'temu',
    category: 'smart-home',
    code: 'afh339102',
    backupCode: 'aci382910',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Hogar, Cocina, Baño, Limpieza y Decoración',
      en: '30% OFF Coupon on Home, Kitchen, Bath, Cleaning & Decor'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica a organizadores de hogar, baterías de cocina, cortinas, alfombras, accesorios de baño y pequeños electrodomésticos.',
      en: 'What it covers: Applies to home organizers, cookware sets, curtains, rugs, bathroom accessories, and small appliances.'
    }
  },

  // =========================================================================
  // 3. BELLEZA, MAQUILLAJE Y CUIDADO PERSONAL (belleza-cuidado)
  // =========================================================================
  {
    id: 'ali-belleza-cuidado',
    store: 'aliexpress',
    category: 'belleza-cuidado',
    tierKey: 'tier3_18',
    discountPct: 17,
    discountUsd: 3,
    minSpendUsd: 18,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Belleza, Maquillaje, Cuidado de la Piel y Barbería',
      en: 'Coupon for Beauty, Makeup, Skincare, Nails & Grooming'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en brochas, maquillaje, lámparas UV para uñas, secadores de pelo, planchas, rasuradoras eléctricas y cuidado facial.',
      en: 'What it covers: Applies to makeup brushes, cosmetics, UV nail lamps, hair dryers, straighteners, electric shavers, and skincare.'
    }
  },
  {
    id: 'temu-belleza-cuidado',
    store: 'temu',
    category: 'belleza-cuidado',
    code: 'acp551920',
    backupCode: 'ach586089',
    discountPct: 30,
    discountUsd: 20,
    minSpendUsd: 29,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Maquillaje, Uñas, Cuidado Personal y Salud',
      en: '30% OFF Coupon on Makeup, Nail Art, Personal Care & Wellness'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en sets de maquillaje, esmaltes en gel, masajeadores, cepillos eléctricos, rizadores de cabello y organizadores de cosméticos.',
      en: 'What it covers: Discounts makeup sets, gel nail kits, massagers, electric toothbrushes, hair stylers, and cosmetic organizers.'
    }
  },

  // =========================================================================
  // 4. TECNOLOGÍA Y COMPUTADORAS (tech-gadgets)
  // =========================================================================
  {
    id: 'ali-tech-gadgets',
    store: 'aliexpress',
    category: 'tech-gadgets',
    tierKey: 'tier24_139',
    discountPct: 18,
    discountUsd: 24,
    minSpendUsd: 139,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Computadoras, Mini PCs, Tablets, Monitores y Electrónica',
      en: 'Coupon for Computers, Mini PCs, Tablets, Monitors & Electronics'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en Mini PCs, laptops, tablets, discos SSD, memoria RAM, proyectores portátiles, cámaras de seguridad y routers Wi-Fi.',
      en: 'What it covers: Applies to Mini PCs, laptops, tablets, SSDs, RAM, portable projectors, security cameras, and Wi-Fi routers.'
    }
  },
  {
    id: 'temu-tech-gadgets',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'ach586089',
    backupCode: 'aci382910',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Electrónica, Accesorios de Computadora y Tablets',
      en: '30% OFF Coupon on Electronics, Computer Accessories & Tablets'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en teclados, ratones inalámbricos, memorias USB/MicroSD, cámaras web, proyectores, bocinas Bluetooth y soportes de laptop.',
      en: 'What it covers: Discounts keyboards, wireless mice, USB/MicroSD drives, webcams, projectors, Bluetooth speakers, and laptop stands.'
    }
  },

  // =========================================================================
  // 5. CELULARES, AUDÍFONOS Y CARGA RÁPIDA (accesorios-moviles)
  // =========================================================================
  {
    id: 'ali-accesorios-moviles',
    store: 'aliexpress',
    category: 'accesorios-moviles',
    tierKey: 'tier3_18',
    discountPct: 17,
    discountUsd: 3,
    minSpendUsd: 18,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Audífonos Bluetooth, Cargadores Rápidos, Fundas y Smartwatches',
      en: 'Coupon for Bluetooth Earbuds, Fast Chargers, Cases & Smartwatches'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en cargadores rápidos USB-C, baterías portátiles (Power Banks), audífonos inalámbricos, relojes inteligentes, cables y fundas.',
      en: 'What it covers: Applies to fast USB-C chargers, power banks, wireless earbuds, smartwatches, cables, and phone cases.'
    }
  },
  {
    id: 'temu-accesorios-moviles',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'frp204918',
    backupCode: 'acp551920',
    discountPct: 30,
    discountUsd: 15,
    minSpendUsd: 25,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Accesorios para Celular, Audífonos y Relojes Inteligentes',
      en: '30% OFF Coupon on Phone Accessories, Earbuds & Smartwatches'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en protectores de pantalla, fundas para iPhone/Samsung/Xiaomi, cargadores de pared, aros de luz y audífonos.',
      en: 'What it covers: Discounts screen protectors, iPhone/Samsung/Xiaomi cases, wall chargers, ring lights, and wireless earphones.'
    }
  },

  // =========================================================================
  // 6. VIDEOJUEGOS Y CONSOLAS (perifericos-gaming)
  // =========================================================================
  {
    id: 'ali-gaming',
    store: 'aliexpress',
    category: 'perifericos-gaming',
    tierKey: 'tier13_79',
    discountPct: 16,
    discountUsd: 13,
    minSpendUsd: 79,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Controles de Videojuegos, Consolas Portátiles y Teclados Mecánicos',
      en: 'Coupon for Game Controllers, Handheld Consoles & Mechanical Keyboards'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en mandos para PC/Celular/Switch/PS5, consolas retro portátiles, teclados mecánicos, mouse gamer y diademas con micrófono.',
      en: 'What it covers: Applies to PC/Mobile/Switch controllers, retro handheld consoles, mechanical keyboards, gaming mice, and headsets.'
    }
  },
  {
    id: 'temu-gaming',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'acr649281',
    backupCode: 'aci382910',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Controles, Diademas Gamer, Teclados y Sillas/Escritorios',
      en: '30% OFF Coupon on Gamepads, Gaming Headsets, Keyboards & Desk Setup'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en controles inalámbricos, alfombrillas XXL, micrófonos USB para streaming, luces RGB para cuarto gamer y accesorios de consola.',
      en: 'What it covers: Discounts wireless controllers, XXL mousepads, USB streaming mics, RGB room lights, and console accessories.'
    }
  },

  // =========================================================================
  // 7. HERRAMIENTAS, AUTOS Y MOTOS (herramientas-autos)
  // =========================================================================
  {
    id: 'ali-herramientas-autos',
    store: 'aliexpress',
    category: 'herramientas-autos',
    tierKey: 'tier13_79',
    discountPct: 16,
    discountUsd: 13,
    minSpendUsd: 79,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Herramientas Eléctricas, Accesorios de Auto, Moto y Taller',
      en: 'Coupon for Power Tools, Car Accessories, Motorcycle Gear & DIY'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en taladros inalámbricos, multímetros, escáneres automotrices OBD2, pantallas CarPlay/Android Auto, cámaras de reversa y luces LED.',
      en: 'What it covers: Applies to cordless drills, multimeters, OBD2 car scanners, CarPlay screens, dashcams, and LED headlights.'
    }
  },
  {
    id: 'temu-herramientas-autos',
    store: 'temu',
    category: 'herramientas-autos',
    code: 'act882910',
    backupCode: 'ach586089',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Herramientas de Mano, Jardinería y Accesorios para Auto/Moto',
      en: '30% OFF Coupon on Hand Tools, Gardening & Car/Motorcycle Accessories'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en cajas de herramientas, destornilladores de precisión, aspiradoras para carro, infladores de llantas portátiles y cascos/guantes.',
      en: 'What it covers: Discounts toolboxes, precision screwdrivers, car vacuums, portable tire inflators, and moto gloves/accessories.'
    }
  },

  // =========================================================================
  // 8. JUGUETES, DRONES Y HOBBIES (juguetes-hobbies)
  // =========================================================================
  {
    id: 'ali-juguetes-hobbies',
    store: 'aliexpress',
    category: 'juguetes-hobbies',
    tierKey: 'tier8_45',
    discountPct: 18,
    discountUsd: 8,
    minSpendUsd: 45,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Juguetes, Bloques de Construcción, Drones, Carros RC y Figuras',
      en: 'Coupon for Toys, Building Blocks, Drones, RC Cars & Collectibles'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en drones con cámara, carros a control remoto, sets de bloques armables, figuras de colección, peluches y juegos de mesa.',
      en: 'What it covers: Applies to camera drones, RC cars, building block sets, action figures, plushies, and board games.'
    }
  },
  {
    id: 'temu-juguetes-hobbies',
    store: 'temu',
    category: 'juguetes-hobbies',
    code: 'apq449102',
    backupCode: 'aci382910',
    discountPct: 30,
    discountUsd: 20,
    minSpendUsd: 29,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Juguetes para Niños, Rompecabezas, Manualidades y Drones',
      en: '30% OFF Coupon on Kids Toys, Puzzles, Arts & Crafts & Mini Drones'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en juguetes educativos, pistas de autos, muñecas, bloques de construcción, pintura, crochet y regalos infantiles.',
      en: 'What it covers: Discounts educational toys, car tracks, dolls, building bricks, DIY craft kits, and gifts for kids.'
    }
  },

  // =========================================================================
  // 9. DEPORTES, GYM Y AIRE LIBRE (deportes-outdoor)
  // =========================================================================
  {
    id: 'ali-deportes-outdoor',
    store: 'aliexpress',
    category: 'deportes-outdoor',
    tierKey: 'tier8_45',
    discountPct: 18,
    discountUsd: 8,
    minSpendUsd: 45,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Artículos Deportivos, Ciclismo, Gimnasio, Pesca y Camping',
      en: 'Coupon for Sports Gear, Cycling, Gym Fitness, Fishing & Camping'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en accesorios para bicicleta, lámparas recargables, tiendas de campaña, cañas de pescar, bandas de ejercicio y termos deportivos.',
      en: 'What it covers: Applies to bike accessories, rechargeable headlamps, camping tents, fishing gear, resistance bands, and flasks.'
    }
  },
  {
    id: 'temu-deportes-outdoor',
    store: 'temu',
    category: 'deportes-outdoor',
    code: 'alk992018',
    backupCode: 'ach586089',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Ropa Deportiva, Gym en Casa, Ciclismo y Senderismo',
      en: '30% OFF Coupon on Activewear, Home Gym, Cycling & Camping Gear'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en conjuntos de gimnasio, guantes, rodilleras, tapetes de yoga, mochilas tácticas de viaje y equipo de campamento.',
      en: 'What it covers: Discounts gym sets, workout gloves, knee braces, yoga mats, tactical travel backpacks, and camping equipment.'
    }
  },

  // =========================================================================
  // 10. MASCOTAS (PERROS Y GATOS) (mascotas)
  // =========================================================================
  {
    id: 'ali-mascotas',
    store: 'aliexpress',
    category: 'mascotas',
    tierKey: 'tier3_18',
    discountPct: 17,
    discountUsd: 3,
    minSpendUsd: 18,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Accesorios de Mascotas: Camas, Comederos, Juguetes y Correas',
      en: 'Coupon for Pet Supplies: Beds, Automatic Feeders, Toys & Leashes'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en dispensadores automáticos de comida y agua para perros y gatos, camas lavables, pecheras, collares, cepillos y rascadores.',
      en: 'What it covers: Applies to automatic pet feeders & water fountains, washable beds, harnesses, collars, grooming brushes, and cat trees.'
    }
  },
  {
    id: 'temu-mascotas',
    store: 'temu',
    category: 'mascotas',
    code: 'avm338190',
    backupCode: 'acp551920',
    discountPct: 30,
    discountUsd: 15,
    minSpendUsd: 25,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Todo para Perros y Gatos (Ropa, Juguetes, Camas y Aseo)',
      en: '30% OFF Coupon on Dog & Cat Supplies (Clothes, Toys, Beds & Grooming)'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en juguetes mordedores, cortauñas y máquinas de corte para mascotas, mochilas transportadoras y ropa para perritos.',
      en: 'What it covers: Discounts chew toys, pet nail clippers & grooming trimmers, carrier backpacks, and pet clothing.'
    }
  },

  // =========================================================================
  // 11. BEBÉS, NIÑOS Y PAPELERÍA / OFICINA (bebes-oficina)
  // =========================================================================
  {
    id: 'ali-bebes-oficina',
    store: 'aliexpress',
    category: 'bebes-oficina',
    tierKey: 'tier3_18',
    discountPct: 17,
    discountUsd: 3,
    minSpendUsd: 18,
    userEligibility: {
      es: 'TODOS LOS USUARIOS',
      en: 'ALL USERS'
    },
    title: {
      es: 'Cupón para Artículos de Bebé, Ropa Infantil, Útiles Escolares y Oficina',
      en: 'Coupon for Baby Essentials, Kids Clothing, School Supplies & Office'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Aplica en ropa para bebé y niños, pañaleras, monitores de bebé, mochilas escolares, cuadernos, plumones, calculadoras y artículos de escritorio.',
      en: 'What it covers: Applies to baby & kids clothes, diaper bags, baby monitors, school backpacks, notebooks, markers, and desk supplies.'
    }
  },
  {
    id: 'temu-bebes-oficina',
    store: 'temu',
    category: 'bebes-oficina',
    code: 'azx774120',
    backupCode: 'aci382910',
    discountPct: 30,
    discountUsd: 20,
    minSpendUsd: 29,
    userEligibility: {
      es: 'NUEVOS USUARIOS APP / PAQUETE',
      en: 'NEW APP USERS / BUNDLE'
    },
    title: {
      es: 'Cupón 30% OFF en Ropa de Bebé, Maternidad, Papelería y Regreso a Clases',
      en: '30% OFF Coupon on Baby Clothes, Maternity, Stationery & Back to School'
    },
    appliesTo: {
      es: '¿Para qué sirve?: Descuenta en conjuntos para recién nacido, zapatos infantiles, estuches de colores, agendas, organizadores de escritorio y mochilas.',
      en: 'What it covers: Discounts newborn outfits, kids shoes, art pencil cases, planners, desk organizers, and school bags.'
    }
  }
];

export const SEARCH_DYNAMIC_CODES = [];

export function getCouponsForLocale(localeCode, { storeFilter = null, categoryFilter = null } = {}) {
  const localeConfig = getLocaleConfig(localeCode);
  const { lang, dict } = localeConfig;
  const availableStores = localeConfig.stores || ['temu', 'aliexpress'];

  return CHECKOUT_COUPONS.filter((c) => {
    if (!availableStores.includes(c.store)) return false;
    if (storeFilter && c.store !== storeFilter) return false;
    if (categoryFilter && c.category !== categoryFilter) return false;
    return true;
  }).map((c) => {
    const localizedTitle = c.title[lang] || (lang === 'es' ? c.title.es : c.title.en);
    const appliesToText = c.appliesTo[lang] || (lang === 'es' ? c.appliesTo.es : c.appliesTo.en);
    const eligibilityText = c.userEligibility[lang] || (lang === 'es' ? c.userEligibility.es : c.userEligibility.en);
    const localMinSpend = formatLocalPrice(c.minSpendUsd, localeConfig);
    const localDiscountAmount = formatLocalPrice(c.discountUsd, localeConfig);

    let primaryCode = c.code;
    let backupCode = c.backupCode || null;

    if (c.store === 'aliexpress') {
      const aliCodes = getAliCodeForLocale(c.tierKey, localeConfig.code);
      primaryCode = aliCodes.primary;
      backupCode = aliCodes.backup;
    }

    const temuUrl = AFFILIATE_CONFIG.temuBaseTrackingUrl || 'https://www.temu.com';
    const aliUrl = AFFILIATE_CONFIG.aliexpressBaseTrackingUrl || 'https://www.aliexpress.com';

    const affiliateLink =
      c.store === 'temu'
        ? `${temuUrl}${temuUrl.includes('?') ? '&' : '?'}region=${localeConfig.code}&code=${primaryCode}`
        : `${aliUrl}${aliUrl.includes('?') ? '&' : '?'}region=${localeConfig.code}&code=${primaryCode}`;

    return {
      ...c,
      code: primaryCode,
      backupCode,
      title: localizedTitle,
      appliesToText,
      eligibilityText,
      regionalNote: null,
      localMinSpend,
      localDiscountAmount,
      affiliateLink,
      categoryLabel: dict.categories[c.category] || c.category
    };
  });
}
