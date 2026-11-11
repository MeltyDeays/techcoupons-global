import { getLocaleConfig, formatLocalPrice } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';

/**
 * CUPONES CLAROS Y DIRECTOS POR CATEGORÍA (CERO PRODUCTOS CONFUSOS)
 * Cada cupón indica exactamente:
 *  - Para qué tipo de cosas aplica (Controles, Computadoras, Hogar, Redes, Móviles, Toda la tienda)
 *  - Cuánto te descuentan (en moneda local o %)
 *  - De cuánto debe ser tu compra mínima
 */
const COUPON_TEMPLATES = [
  // =========================================================================
  // TEMU (Cupones Generales, Secretos de Buscador y por Categoría)
  // =========================================================================
  {
    id: 'temu-bundle-all',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'credit777',
    isSecretSearch: true,
    discountPct: 50,
    discountUsd: 50,
    minSpendUsd: 100,
    title: {
      es: 'Paquete de Cupones para Toda la Tienda (Tecnología, Hogar y Más)',
      en: 'Storewide Coupon Bundle (Tech, Home & All Categories)',
      de: 'Gutscheinpaket für das gesamte Sortiment (Technik & Haushalt)',
      fr: 'Pack de Coupons sur Toute la Boutique (Tech & Maison)',
      pt: 'Pacote de Cupons para Toda a Loja (Tecnologia e Casa)',
      it: 'Pacchetto Coupon su Tutto il Catalogo (Tech e Casa)',
      nl: 'Couponbundel voor de Hele Winkel (Tech & Huis)',
      pl: 'Pakiet Kuponów na Cały Asortyment (Technologia i Dom)',
      ja: '全カテゴリー対象クーポンバンドル（テクノロジー・家電・日用品）',
      ko: '전 카테고리 통합 쿠폰 팩 (디지털, 가전 및 홈 리빙 전체)',
      ar: 'حزمة كوبونات شاملة لجميع أقسام المتجر (التقنية والمنزل)'
    },
    appliesTo: {
      es: 'Aplica a: Cualquier producto de Tecnología, Computadoras, Gaming u Hogar en la app de Temu.',
      en: 'Applies to: Any Tech, Computer, Gaming, or Smart Home order in the Temu app.'
    }
  },
  {
    id: 'temu-gaming-controllers',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'box777',
    isSecretSearch: true,
    discountPct: 35,
    discountUsd: 15,
    minSpendUsd: 40,
    title: {
      es: 'Cupón para Controles de Videojuegos, Teclados y Mouse Gaming',
      en: 'Coupon for Gaming Controllers, Keyboards & Gaming Mice',
      de: 'Gutschein für Gaming-Controller, Tastaturen & Gaming-Mäuse',
      fr: 'Coupon pour Manettes de Jeu, Claviers et Souris Gaming',
      pt: 'Cupom para Controles de Videogame, Teclados e Mouses Gamer',
      it: 'Coupon per Controller da Gioco, Tastiere e Mouse Gaming',
      nl: 'Kortingscode voor Gaming Controllers, Toetsenborden & Muizen',
      pl: 'Kupon na Kontrolery Gier, Klawiatury i Myszy Gamingowe',
      ja: 'ゲームコントローラー・キーボード・マウス専用割引クーポン',
      ko: '게이밍 컨트롤러, 기계식 키보드 및 마우스 전용 할인 쿠폰',
      ar: 'كوبون خصم لأذرع التحكم ولوحات المفاتيح وماوس الألعاب'
    },
    appliesTo: {
      es: 'Aplica a: Toda la sección de Controles para celular/PC, Teclados mecánicos, Diademas y Mouse.',
      en: 'Applies to: All Mobile/PC Controllers, Mechanical Keyboards, Headsets & Gaming Mice.'
    }
  },
  {
    id: 'temu-computers-hardware',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'wincredit',
    isSecretSearch: true,
    discountPct: 40,
    discountUsd: 25,
    minSpendUsd: 60,
    title: {
      es: 'Descuento para Computadoras, Mini PCs, Monitores y Discos SSD',
      en: 'Discount for Computers, Mini PCs, Monitors & SSD Storage',
      de: 'Rabattcode für Computer, Mini-PCs, Monitore & SSD-Speicher',
      fr: 'Réduction sur Ordinateurs, Mini PC, Écrans et Disques SSD',
      pt: 'Desconto para Computadores, Mini PCs, Monitores e SSDs',
      it: 'Sconto per Computer, Mini PC, Monitor e Archiviazione SSD',
      nl: 'Korting op Computers, Mini-PC’s, Monitoren & SSD-Opslag',
      pl: 'Zniżka na Komputery, Mini PC, Monitory i Dyski SSD',
      ja: 'パソコン・ミニPC・ポータブルモニター・SSD周辺機器 割引クーポン',
      ko: '컴퓨터, 미니 PC, 포터블 모니터 및 SSD 저장장치 할인 코드',
      ar: 'خصم خاص لأجهزة الكمبيوتر والحواسيب المصغرة والشاشات وأقراص SSD'
    },
    appliesTo: {
      es: 'Aplica a: Accesorios de Computadora, Laptops, Monitores portátiles, Hubs USB y Almacenamiento.',
      en: 'Applies to: Computer accessories, Portable Monitors, USB Hubs & NVMe/SSD Storage.'
    }
  },
  {
    id: 'temu-smart-home-all',
    store: 'temu',
    category: 'smart-home',
    code: 'afh339102',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 12,
    minSpendUsd: 35,
    title: {
      es: 'Cupón para Cosas del Hogar Inteligente, Luces LED y Cámaras',
      en: 'Coupon for Smart Home Devices, LED Lighting & Security Cameras',
      de: 'Gutschein für Smart-Home-Geräte, LED-Beleuchtung & Kameras',
      fr: 'Coupon pour Objets Connectés de la Maison, LED et Caméras',
      pt: 'Cupom para Itens de Casa Inteligente, Iluminação LED e Câmeras',
      it: 'Coupon per Dispositivi Smart Home, Illuminazione LED e Telecamere',
      nl: 'Coupon voor Smart Home Apparaten, LED-Verlichting & Camera’s',
      pl: 'Kupon na Urządzenia Smart Home, Oświetlenie LED i Kamery',
      ja: 'スマートホーム家電・LED照明・防犯カメラ専用クーポン',
      ko: '스마트홈 가전, LED 조명 및 보안 카메라 전용 할인 쿠폰',
      ar: 'كوبون لأجهزة المنزل الذكي والإضاءة وكاميرات المراقبة'
    },
    appliesTo: {
      es: 'Aplica a: Enchufes inteligentes, Sensores para el hogar, Tiras LED, Aspiradoras y Automatización.',
      en: 'Applies to: Smart plugs, Home sensors, LED strips, Robot vacuums & Home automation.'
    }
  },
  {
    id: 'temu-wifi-networking',
    store: 'temu',
    category: 'redes-wifi',
    code: 'acr649281',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 10,
    minSpendUsd: 30,
    title: {
      es: 'Cupón para Routers Wi-Fi, Repetidores de Señal y Cables de Red',
      en: 'Coupon for Wi-Fi Routers, Signal Repeaters & Network Switches',
      de: 'Gutschein für WLAN-Router, Repeater & Netzwerk-Switches',
      fr: 'Coupon pour Routeurs Wi-Fi, Répéteurs et Switches Réseau',
      pt: 'Cupom para Roteadores Wi-Fi, Repetidores de Sinal e Switches',
      it: 'Coupon per Router Wi-Fi, Ripetitori di Segnale e Switch di Rete',
      nl: 'Kortingscode voor Wi-Fi Routers, Versterkers & Netwerk Switches',
      pl: 'Kupon na Routery Wi-Fi, Wzmacniacze Sygnału i Switche',
      ja: 'Wi-Fiルーター・中継機・ネットワークスイッチ専用割引コード',
      ko: 'Wi-Fi 공유기, 신호 증폭기 및 네트워크 스위치 할인 코드',
      ar: 'كوبون لأجهزة الراوتر ومقويات شبكة Wi-Fi وموزعات الشبكة'
    },
    appliesTo: {
      es: 'Aplica a: Extensores de Wi-Fi para casa, Routers, Switches Ethernet y Antenas USB.',
      en: 'Applies to: Home Wi-Fi Range Extenders, Routers, Ethernet Switches & USB Adapters.'
    }
  },
  {
    id: 'temu-mobile-chargers',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'act882910',
    isSecretSearch: false,
    discountPct: 25,
    discountUsd: 8,
    minSpendUsd: 25,
    title: {
      es: 'Cupón para Cargadores Rápidos, Baterías Portátiles y Cables de Celular',
      en: 'Coupon for Fast Chargers, Power Banks & Mobile Phone Cables',
      de: 'Gutschein für Schnellladegeräte, Powerbanks & Handykabel',
      fr: 'Coupon pour Chargeurs Rapides, Batteries Externes et Câbles Mobile',
      pt: 'Cupom para Carregadores Rápidos, Power Banks e Cabos de Celular',
      it: 'Coupon per Caricatori Rapidi, Power Bank e Cavi per Smartphone',
      nl: 'Coupon voor Snelladers, Powerbanks & Telefoonkabels',
      pl: 'Kupon na Szybkie Ładowarki, Powerbanki i Kable do Telefonów',
      ja: '急速充電器・モバイルバッテリー・スマホケーブル専用クーポン',
      ko: '고속 충전기, 보조배터리 및 스마트폰 케이블 전용 쿠폰',
      ar: 'كوبون للشواحن السريعة وبنوك الطاقة وكابلات الهواتف'
    },
    appliesTo: {
      es: 'Aplica a: Cargadores GaN de pared, Power Banks, Cables USB-C, Audífonos y Soportes de celular.',
      en: 'Applies to: GaN Wall Chargers, Power Banks, USB-C Cables, Earbuds & Phone Mounts.'
    }
  },
  {
    id: 'temu-freebie-gift',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'freebie777',
    isSecretSearch: true,
    discountPct: 45,
    discountUsd: 18,
    minSpendUsd: 35,
    title: {
      es: 'Regalo + Descuento en Accesorios para Juegos y Streaming',
      en: 'Free Gift + Discount on Gaming & Streaming Accessories',
      de: 'Gratisgeschenk + Rabatt auf Gaming- & Streaming-Zubehör',
      fr: 'Cadeau Gratuit + Remise sur Accessoires Gaming et Streaming',
      pt: 'Brinde + Desconto em Acessórios para Jogos e Streaming',
      it: 'Regalo + Sconto su Accessori Gaming e Streaming',
      nl: 'Gratis Cadeau + Korting op Gaming & Streaming Accessoires',
      pl: 'Darmowy Prezent + Rabat na Akcesoria Gamingowe i Streamingowe',
      ja: '無料ギフト＋ゲーミング＆配信機材アクセサリー特別割引',
      ko: '사은품 증정 + 게이밍 및 스트리밍 액세서리 특별 할인',
      ar: 'هدية مجانية + خصم على إكسسوارات الألعاب والبث المباشر'
    },
    appliesTo: {
      es: 'Aplica a: Micrófonos USB, Luces para escritorio, Controles y Audífonos gamer.',
      en: 'Applies to: USB Microphones, Desk RGB lights, Controllers & Gaming Headsets.'
    }
  },
  {
    id: 'temu-home-kitchen-tech',
    store: 'temu',
    category: 'smart-home',
    code: 'frp204918',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 15,
    minSpendUsd: 45,
    title: {
      es: 'Cupón para Electrodomésticos Pequeños y Artículos del Hogar',
      en: 'Coupon for Small Home Appliances & Everyday Household Items',
      de: 'Gutschein für Kleingeräte & Haushaltsartikel',
      fr: 'Coupon pour Petit Électroménager et Articles de Maison',
      pt: 'Cupom para Pequenos Eletrodomésticos e Utilidades Domésticas',
      it: 'Coupon per Piccoli Elettrodomestici e Articoli per la Casa',
      nl: 'Kortingscode voor Kleine Huishoudelijke Apparaten & Huisartikelen',
      pl: 'Kupon na Małe AGD i Artykuły Gospodarstwa Domowego',
      ja: '小型家電・キッチン・日用雑貨カテゴリー割引クーポン',
      ko: '소형 가전제품 및 생활용품 카테고리 전용 할인 쿠폰',
      ar: 'كوبون للأجهزة المنزلية الصغيرة ومستلزمات البيت'
    },
    appliesTo: {
      es: 'Aplica a: Artículos para la casa, Cocina, Organización, Lámparas y Herramientas eléctricas.',
      en: 'Applies to: Household items, Kitchen gadgets, Organizers, Lamps & Power tools.'
    }
  },

  // =========================================================================
  // ALIEXPRESS (Funciona en TODOS los 33 países, incluyendo Nicaragua y Centroamérica)
  // =========================================================================
  {
    id: 'ali-global-choice-all',
    store: 'aliexpress',
    category: 'tech-gadgets',
    code: 'CHOICE30',
    isSecretSearch: false,
    discountPct: 25,
    discountUsd: 30,
    minSpendUsd: 120,
    title: {
      es: 'Cupón General AliExpress para Computadoras, Mini PCs y Laptops',
      en: 'AliExpress Storewide Coupon for Computers, Mini PCs & Laptops',
      de: 'AliExpress Gutschein für Computer, Mini-PCs & Laptops',
      fr: 'Coupon AliExpress pour Ordinateurs, Mini PC et Portables',
      pt: 'Cupom AliExpress para Computadores, Mini PCs e Notebooks',
      it: 'Coupon AliExpress per Computer, Mini PC e Notebook',
      nl: 'AliExpress Kortingscode voor Computers, Mini-PC’s & Laptops',
      pl: 'Kupon AliExpress na Komputery, Mini PC i Laptopy',
      ja: 'AliExpress パソコン・ミニPC・ノートPC対象 全体割引コード',
      ko: 'AliExpress 컴퓨터, 미니 PC 및 노트북 전용 프로모션 코드',
      ar: 'كوبون AliExpress شامل لأجهزة الكمبيوتر والحواسيب المصغرة'
    },
    appliesTo: {
      es: 'Aplica a: Mini PCs, Componentes de PC, Memorias RAM, Procesadores, Tablets y Monitores.',
      en: 'Applies to: Mini PCs, PC Components, RAM, Processors, Tablets & Monitors.'
    }
  },
  {
    id: 'ali-gaming-controllers-all',
    store: 'aliexpress',
    category: 'perifericos-gaming',
    code: 'ALIGAME15',
    isSecretSearch: false,
    discountPct: 25,
    discountUsd: 15,
    minSpendUsd: 55,
    title: {
      es: 'Cupón para Controles de Juegos, Consolas Portátiles y Teclados',
      en: 'Coupon for Gaming Controllers, Retro Handhelds & Keyboards',
      de: 'Gutschein für Gaming-Controller, Retro-Handhelds & Tastaturen',
      fr: 'Coupon pour Manettes de Jeu, Consoles Portables et Claviers',
      pt: 'Cupom para Controles Gamer, Consoles Portáteis e Teclados',
      it: 'Coupon per Controller Gaming, Console Portatili e Tastiere',
      nl: 'Coupon voor Gaming Controllers, Retro Handhelds & Toetsenborden',
      pl: 'Kupon na Kontrolery Gier, Konsole Przenośne i Klawiatury',
      ja: 'ゲームコントローラー・携帯ゲーム機・ゲーミングキーボード割引コード',
      ko: '게이밍 컨트롤러, 레트로 휴대용 게임기 및 키보드 할인 코드',
      ar: 'كوبون لأذرع التحكم وأجهزة الألعاب المحمولة ولوحات المفاتيح'
    },
    appliesTo: {
      es: 'Aplica a: Controles Bluetooth/USB (GameSir, 8BitDo), Consolas retro portátiles y Mouse gamer.',
      en: 'Applies to: Bluetooth/USB Controllers (GameSir, 8BitDo), Retro Handhelds & Gaming Mice.'
    }
  },
  {
    id: 'ali-wifi-routers-all',
    store: 'aliexpress',
    category: 'redes-wifi',
    code: 'ALINET20',
    isSecretSearch: false,
    discountPct: 22,
    discountUsd: 18,
    minSpendUsd: 75,
    title: {
      es: 'Cupón para Equipos de Red, Routers Wi-Fi 6 y Switches Ethernet',
      en: 'Coupon for Networking Gear, Wi-Fi 6 Routers & Ethernet Switches',
      de: 'Gutschein für Netzwerkgeräte, Wi-Fi 6 Router & Ethernet-Switches',
      fr: 'Coupon pour Équipements Réseau, Routeurs Wi-Fi 6 et Switches',
      pt: 'Cupom para Equipamentos de Rede, Roteadores Wi-Fi 6 e Switches',
      it: 'Coupon per Apparati di Rete, Router Wi-Fi 6 e Switch Ethernet',
      nl: 'Kortingscode voor Netwerkapparatuur, Wi-Fi 6 Routers & Switches',
      pl: 'Kupon na Sprzęt Sieciowy, Routery Wi-Fi 6 i Switche Ethernet',
      ja: 'ネットワーク機器・Wi-Fi 6ルーター・イーサネットスイッチ割引コード',
      ko: '네트워크 장비, Wi-Fi 6 공유기 및 이더넷 스위치 할인 코드',
      ar: 'كوبون لمعدات الشبكات وراوترات Wi-Fi 6 وموزعات الإنترنت'
    },
    appliesTo: {
      es: 'Aplica a: Routers domésticos y de viaje, Sistemas Wi-Fi Mesh, Tarjetas de red y Fibra.',
      en: 'Applies to: Home & Travel Routers, Mesh Wi-Fi Systems, Network Cards & Fiber gear.'
    }
  },
  {
    id: 'ali-smart-home-devices',
    store: 'aliexpress',
    category: 'smart-home',
    code: 'SMARTHOME12',
    isSecretSearch: false,
    discountPct: 20,
    discountUsd: 12,
    minSpendUsd: 50,
    title: {
      es: 'Cupón para Domótica, Artículos del Hogar y Seguridad Inteligente',
      en: 'Coupon for Home Automation, Household Tech & Smart Security',
      de: 'Gutschein für Hausautomation, Haushaltstechnik & Sicherheit',
      fr: 'Coupon pour Domotique, Équipement de la Maison et Sécurité',
      pt: 'Cupom para Automação Residencial, Casa e Segurança Inteligente',
      it: 'Coupon per Domotica, Casa Intelligente e Sicurezza',
      nl: 'Coupon voor Huisautomatisering, Huishouden & Slimme Beveiliging',
      pl: 'Kupon na Automatykę Domową, Urządzenia Domowe i Bezpieczeństwo',
      ja: 'スマートホーム自動化・生活家電・防犯センサー割引コード',
      ko: '홈 오토메이션, 스마트 생활가전 및 보안 기기 할인 코드',
      ar: 'كوبون لأتمتة المنزل والأجهزة المنزلية وأنظمة الأمان الذكية'
    },
    appliesTo: {
      es: 'Aplica a: Interruptores inteligentes, Motores de cortina, Sensores Zigbee/Wi-Fi y Cámaras.',
      en: 'Applies to: Smart switches, Curtain motors, Zigbee/Wi-Fi sensors & Security cameras.'
    }
  },
  {
    id: 'ali-mobile-chargers-audio',
    store: 'aliexpress',
    category: 'accesorios-moviles',
    code: 'ALIPOWER10',
    isSecretSearch: false,
    discountPct: 25,
    discountUsd: 10,
    minSpendUsd: 35,
    title: {
      es: 'Cupón para Cargadores GaN, Audífonos y Accesorios de Teléfono',
      en: 'Coupon for GaN Chargers, Earphones & Phone Accessories',
      de: 'Gutschein für GaN-Ladegeräte, Kopfhörer & Telefonzubehör',
      fr: 'Coupon pour Chargeurs GaN, Écouteurs et Accessoires Téléphone',
      pt: 'Cupom para Carregadores GaN, Fones de Ouvido e Acessórios Celular',
      it: 'Coupon per Caricatori GaN, Auricolari e Accessori Smartphone',
      nl: 'Coupon voor GaN-Opladers, Oortelefoons & Telefoonaccessoires',
      pl: 'Kupon na Ładowarki GaN, Słuchawki i Akcesoria do Telefonów',
      ja: 'GaN急速充電器・高音質イヤホン・スマホアクセサリー割引コード',
      ko: 'GaN 초고속 충전기, 이어폰 및 스마트폰 액세서리 할인 코드',
      ar: 'كوبون لشواحن GaN وسماعات الأذن وإكسسوارات الهواتف الذكية'
    },
    appliesTo: {
      es: 'Aplica a: Cargadores rápidos (Baseus, Ugreen, Anker), Baterías portátiles, Audífonos y Fundas.',
      en: 'Applies to: Fast chargers (Baseus, Ugreen, Anker), Power banks, IEM Earphones & Cases.'
    }
  },
  {
    id: 'ali-tech-gadgets-small',
    store: 'aliexpress',
    category: 'tech-gadgets',
    code: 'TECHMEGA08',
    isSecretSearch: false,
    discountPct: 20,
    discountUsd: 8,
    minSpendUsd: 29,
    title: {
      es: 'Cupón para Compras Pequeñas de Tecnología y Electrónica General',
      en: 'Coupon for Small Tech Orders & General Consumer Electronics',
      de: 'Gutschein für kleine Technik-Bestellungen & Elektronik',
      fr: 'Coupon pour Petites Commandes Tech et Électronique Générale',
      pt: 'Cupom para Pequenas Compras de Tecnologia e Eletrônicos',
      it: 'Coupon per Piccoli Ordini Tech ed Elettronica di Consumo',
      nl: 'Kortingscode voor Kleine Tech Bestellingen & Elektronica',
      pl: 'Kupon na Mniejsze Zakupy Technologiczne i Elektronikę',
      ja: '少額注文OK！ガジェット・一般電子機器向け割引クーポン',
      ko: '소액 주문 가능! 테크 가젯 및 일반 전자제품 할인 코드',
      ar: 'كوبون للطلبات التقنية الصغيرة والإلكترونيات الاستهلاكية'
    },
    appliesTo: {
      es: 'Aplica a: Cualquier gadget electrónico, Adaptadores, Herramientas de precisión y Componentes.',
      en: 'Applies to: Any electronic gadget, USB Adapters, Precision tools & DIY Components.'
    }
  }
];

export function getCouponsForLocale(localeCode, { storeFilter = null, categoryFilter = null } = {}) {
  const localeConfig = getLocaleConfig(localeCode);
  const langKey = localeConfig.lang;
  const supportedStores = localeConfig.stores || ['temu', 'aliexpress'];

  let customItems = [];
  let activeSettings = AFFILIATE_CONFIG;
  if (typeof window !== 'undefined') {
    try {
      const rawCustom = localStorage.getItem('ecosistema_b_custom_coupons_v1');
      if (rawCustom) customItems = JSON.parse(rawCustom);
      const rawSettings = localStorage.getItem('ecosistema_b_custom_settings_v1');
      if (rawSettings) activeSettings = { ...AFFILIATE_CONFIG, ...JSON.parse(rawSettings) };
    } catch {
      // Ignore storage error
    }
  }

  const allItems = [...customItems, ...COUPON_TEMPLATES];

  return allItems.filter((item) => {
    // Only show stores that operate in this country (unless user explicitly filtered, or keep strict)
    if (!supportedStores.includes(item.store)) return false;
    if (storeFilter && item.store !== storeFilter) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  }).map((item) => {
    const title = item.title?.[langKey] || item.title?.es || item.title?.en || item.productName?.[langKey] || item.productName?.en || item.title;
    const appliesToText = item.appliesTo?.[langKey] || item.appliesTo?.es || item.appliesTo?.en || '';

    const discountUsd = item.discountUsd || Math.max(5, Math.round((item.basePriceUsd || 40) * (item.discountPct / 100)));
    const minSpendUsd = item.minSpendUsd || 30;

    const localDiscountAmount = formatLocalPrice(discountUsd, localeConfig);
    const localMinSpend = formatLocalPrice(minSpendUsd, localeConfig);
    const numericPrice = Math.max(1, Math.round(minSpendUsd * localeConfig.rate));

    const affiliateLink = item.customAffiliateUrl
      ? item.customAffiliateUrl
      : item.store === 'temu'
      ? (activeSettings.temuBaseTrackingUrl || 'https://www.temu.com')
      : (activeSettings.aliexpressBaseTrackingUrl || 'https://www.aliexpress.com');

    return {
      ...item,
      title,
      appliesToText,
      localDiscountAmount,
      localPrice: localDiscountAmount,
      localMinSpend,
      numericPrice,
      currencyCode: localeConfig.currencyCode,
      categoryLabel: localeConfig.dict.categories[item.category] || item.category,
      affiliateLink
    };
  });
}
