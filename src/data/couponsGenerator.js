import { getLocaleConfig, formatLocalPrice } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';

/**
 * MOTOR REGIONAL DE CÓDIGOS OFICIALES (ALIEXPRESS PORTALS / IFP GLOBAL + TEMU)
 * ----------------------------------------------------------------------------
 * AliExpress emite pools de códigos separados según el país del comprador:
 *  - Pool Global Multi-Región (Serie oficial IFP... de AliExpress Portals que auto-convierte moneda en +60 países, incluyendo Nicaragua, Centroamérica, Asia, Europa y Oceanía).
 *  - Pool Dedicado EE. UU. (USAFF...)
 *  - Pool Dedicado España / Europa (ESCD... + IFP...)
 *  - Pool Dedicado Francia (FRCD... + IFP...)
 *  - Pool Dedicado Brasil (BRCD... + IFP...)
 *  - Pool Dedicado México (ALIMX... + IFP...)
 *
 * En Temu, las reglas reales exigen distinguir claramente:
 *  - Código de Primer Pedido en App (Nuevos Usuarios / Reinstalación 24h) -> 30% OFF directo.
 *  - Paquete de Cupones Escalados en Billetera (Nuevos y Existentes vía App).
 */
function getRegionalAliExpressCode(tierKey, iso) {
  const countryIso = (iso || '').toLowerCase();

  // Códigos oficiales verificados por tramo de gasto ($3/$18, $8/$45, $13/$79, $24/$139, $40/$229, $60/$349)
  const REGIONAL_POOLS = {
    tier3_18: {
      us: { primary: 'IFPCOGGC', backup: 'IFPGTV1F', noteEs: 'Válido en EE. UU. y Casilleros Miami', noteEn: 'Valid for US & Miami Lockers' },
      mx: { primary: 'IFPCOGGC', backup: 'ALIMX03', noteEs: 'Válido para envíos a México en MXN', noteEn: 'Valid for Mexico orders' },
      br: { primary: 'IFPCOGGC', backup: 'IFPGTV1F', noteEs: 'Válido no Brasil (Remessa Conforme)', noteEn: 'Valid for Brazil orders' },
      es: { primary: 'IFPCOGGC', backup: 'IFPGTV1F', noteEs: 'Válido en España (IVA incluido)', noteEn: 'Valid in Spain (VAT included)' },
      fr: { primary: 'IFPCOGGC', backup: 'IFPGTV1F', noteEs: 'Valide en France (TVA incluse)', noteEn: 'Valid in France' },
      default: { primary: 'IFPCOGGC', backup: 'IFPGTV1F', noteEs: 'Código Global Multi-Países (Auto-convierte a tu moneda)', noteEn: 'Global Multi-Region Code (Auto-converts currency)' }
    },
    tier8_45: {
      us: { primary: 'IFPCDXGG', backup: 'IFPOSPHJ', noteEs: 'Válido en EE. UU. y Casilleros Miami', noteEn: 'Valid for US & Miami Lockers' },
      mx: { primary: 'IFPCDXGG', backup: 'IFPOSPHJ', noteEs: 'Válido en México en compras mayores al mínimo', noteEn: 'Valid for Mexico orders' },
      br: { primary: 'IFPCDXGG', backup: 'IFPOSPHJ', noteEs: 'Válido no Brasil em compras acima do mínimo', noteEn: 'Valid for Brazil orders' },
      es: { primary: 'IFPCDXGG', backup: 'IFPOSPHJ', noteEs: 'Válido en España y Unión Europea', noteEn: 'Valid in Spain & EU' },
      default: { primary: 'IFPCDXGG', backup: 'IFPOSPHJ', noteEs: 'Código Global Multi-Países (Auto-convierte a tu moneda)', noteEn: 'Global Multi-Region Code (Auto-converts currency)' }
    },
    tier13_79: {
      default: { primary: 'IFPIMB3X', backup: 'IFPZ5GQG', noteEs: 'Código Global Oficial AliExpress (Tramo Medio)', noteEn: 'Official Global Mid-Tier Code' }
    },
    tier24_139: {
      default: { primary: 'IFPDSIWP', backup: 'IFPHB8CL', noteEs: 'Código Global Oficial AliExpress (Hardware y Redes)', noteEn: 'Official Global Hardware Tier Code' }
    },
    tier40_229: {
      default: { primary: 'IFPZWROH', backup: 'IFPM9JQA', noteEs: 'Código Global Oficial AliExpress (Mini PCs y Monitores)', noteEn: 'Official High-Ticket Tier Code' }
    },
    tier60_349: {
      default: { primary: 'IFPY8HRR', backup: 'IFPPLDBA', noteEs: 'Código Global Oficial AliExpress (Equipos Completos)', noteEn: 'Official Bulk / Pro Tier Code' }
    }
  };

  const pool = REGIONAL_POOLS[tierKey] || REGIONAL_POOLS.tier8_45;
  return pool[countryIso] || pool.default;
}

const CHECKOUT_COUPON_TEMPLATES = [
  // =========================================================================
  // ALIEXPRESS — ESCALERA OFICIAL DE CUPONES REALES POR TRAMO DE COMPRA
  // (Serie IFP... de AliExpress Portals + Respaldo si se agota el principal)
  // =========================================================================
  {
    id: 'ali-tier-3-off-18',
    store: 'aliexpress',
    category: 'accesorios-moviles',
    tierKey: 'tier3_18',
    discountPct: 17,
    discountUsd: 3,
    minSpendUsd: 18,
    userEligibility: {
      es: 'TODOS LOS USUARIOS (Nuevos y Antiguos)',
      en: 'ALL USERS (New & Existing Customers)'
    },
    title: {
      es: 'Cupón para Compras Pequeñas: Cargadores GaN, Cables USB-C y Audífonos',
      en: 'Small Order Coupon: GaN Chargers, USB-C Cables & Earphones',
      de: 'Gutschein für kleine Bestellungen: GaN-Ladegeräte, Kabel & Ohrhörer',
      fr: 'Coupon Petites Commandes : Chargeurs GaN, Câbles USB-C & Écouteurs',
      pt: 'Cupom para Compras Pequenas: Carregadores GaN, Cabos e Fones',
      it: 'Coupon Piccoli Ordini: Caricatori GaN, Cavi USB-C e Auricolari',
      nl: 'Kortingscode Kleine Bestellingen: GaN-Opladers, Kabels & Oordopjes',
      pl: 'Kupon na Małe Zamówienia: Ładowarki GaN, Kable USB-C i Słuchawki',
      ja: '少額注文向けクーポン：GaN急速充電器・USB-Cケーブル・イヤホン',
      ko: '소액 주문 쿠폰: GaN 충전기, C타입 케이블 및 이어폰',
      ar: 'كوبون للطلبات الصغيرة: شواحن GaN وكابلات USB-C وسماعات',
      zh: '小额订单直减码：氮化镓快充、Type-C数据线与有线耳机',
      ru: 'Промокод на небольшие заказы: Зарядки GaN, Кабели и Наушники',
      tr: 'Küçük Sipariş Kuponu: GaN Şarj Cihazı, Kablo ve Kulaklık'
    },
    appliesTo: {
      es: 'Se pega en la casilla "Código promocional" al pagar. Funciona para cualquier cargador rápido, batería portátil, cable o accesorio móvil que sume el mínimo de compra.',
      en: 'Paste in the "Promo Code" box at checkout. Works on any fast charger, power bank, cable, or mobile accessory meeting the minimum spend.'
    }
  },
  {
    id: 'ali-tier-8-off-45',
    store: 'aliexpress',
    category: 'perifericos-gaming',
    tierKey: 'tier8_45',
    discountPct: 18,
    discountUsd: 8,
    minSpendUsd: 45,
    userEligibility: {
      es: 'TODOS LOS USUARIOS (Nuevos y Antiguos)',
      en: 'ALL USERS (New & Existing Customers)'
    },
    title: {
      es: 'Cupón para Controles de Videojuegos, Teclados Mecánicos y Mouse Gaming',
      en: 'Checkout Coupon for Gaming Controllers, Mechanical Keyboards & Mice',
      de: 'Gutscheincode für Gaming-Controller, Mechanische Tastaturen & Mäuse',
      fr: 'Code Promo pour Manettes de Jeu, Claviers Mécaniques et Souris',
      pt: 'Cupom para Controles de Videogame, Teclados Mecânicos e Mouses',
      it: 'Codice Sconto per Controller Gaming, Tastiere Meccaniche e Mouse',
      nl: 'Kortingscode voor Gaming Controllers, Mechanische Toetsenborden & Muizen',
      pl: 'Kod Rabatowy na Kontrolery Gier, Klawiatury Mechaniczne i Myszy',
      ja: 'ゲームコントローラー・メカニカルキーボード・マウス決済クーポン',
      ko: '게이밍 컨트롤러, 기계식 키보드 및 게이밍 마우스 할인 코드',
      ar: 'كود خصم لأذرع التحكم ولوحات المفاتيح الميكانيكية وماوس الألعاب',
      zh: '游戏手柄、客制化机械键盘与无线电竞鼠标 结账优惠码',
      ru: 'Промокод на Игровые геймпады, Механические клавиатуры и Мыши',
      tr: 'Oyun Kolları, Mekanik Klavye ve Oyuncu Mouse Sepet Kuponu'
    },
    appliesTo: {
      es: 'Ideal para comprar controles (GameSir, 8BitDo, EasySMX), teclados mecánicos, micrófonos USB o mouse ultraligeros.',
      en: 'Ideal for gaming controllers (GameSir, 8BitDo, EasySMX), mechanical keyboards, USB mics, or wireless gaming mice.'
    }
  },
  {
    id: 'ali-tier-13-off-79',
    store: 'aliexpress',
    category: 'smart-home',
    tierKey: 'tier13_79',
    discountPct: 16,
    discountUsd: 13,
    minSpendUsd: 79,
    userEligibility: {
      es: 'TODOS LOS USUARIOS (Nuevos y Antiguos)',
      en: 'ALL USERS (New & Existing Customers)'
    },
    title: {
      es: 'Cupón para Cosas del Hogar Inteligente, Cámaras, Luces y Electrodomésticos',
      en: 'Checkout Coupon for Smart Home Devices, Cameras & Home Appliances',
      de: 'Gutscheincode für Smart Home, Überwachungskameras & Haushaltsgeräte',
      fr: 'Code Promo pour Maison Connectée, Caméras et Petit Électroménager',
      pt: 'Cupom para Casa Inteligente, Câmeras de Segurança e Eletrodomésticos',
      it: 'Codice Sconto per Smart Home, Telecamere e Elettrodomestici',
      nl: 'Kortingscode voor Smart Home, Beveiligingscamera’s & Huishouden',
      pl: 'Kod Rabatowy na Smart Home, Kamery Bezpieczeństwa i Małe AGD',
      ja: 'スマートホーム家電・防犯カメラ・生活用品 決済割引コード',
      ko: '스마트홈 기기, 보안 카메라 및 소형 생활가전 할인 코드',
      ar: 'كود خصم لأجهزة المنزل الذكي وكاميرات المراقبة ومستلزمات البيت',
      zh: '全屋智能家居、安防摄像头与家用小电器 结账直减码',
      ru: 'Промокод на Умный дом, Камеры наблюдения и Бытовую технику',
      tr: 'Akıllı Ev Cihazları, Güvenlik Kamerası ve Ev Aletleri Kuponu'
    },
    appliesTo: {
      es: 'Aplica a combos de sensores Zigbee/Wi-Fi, paneles inteligentes, motores de cortina, cámaras de seguridad y artículos para el hogar.',
      en: 'Applies to Zigbee/Wi-Fi sensor bundles, smart panels, curtain motors, security cameras, and household items.'
    }
  },
  {
    id: 'ali-tier-24-off-139',
    store: 'aliexpress',
    category: 'redes-wifi',
    tierKey: 'tier24_139',
    discountPct: 17,
    discountUsd: 24,
    minSpendUsd: 139,
    userEligibility: {
      es: 'TODOS LOS USUARIOS (Nuevos y Antiguos)',
      en: 'ALL USERS (New & Existing Customers)'
    },
    title: {
      es: 'Cupón para Routers Wi-Fi 6/7, Sistemas Mesh, Switches 2.5G y Consolas',
      en: 'Checkout Coupon for Wi-Fi 6/7 Routers, Mesh Systems & 2.5G Switches',
      de: 'Gutscheincode für Wi-Fi 6/7 Router, Mesh-Systeme & 2.5G-Switches',
      fr: 'Code Promo pour Routeurs Wi-Fi 6/7, Systèmes Mesh et Switches 2.5G',
      pt: 'Cupom para Roteadores Wi-Fi 6/7, Sistemas Mesh e Switches 2.5G',
      it: 'Codice Sconto per Router Wi-Fi 6/7, Sistemi Mesh e Switch 2.5G',
      nl: 'Kortingscode voor Wi-Fi 6/7 Routers, Mesh Systemen & 2.5G Switches',
      pl: 'Kod Rabatowy na Routery Wi-Fi 6/7, Systemy Mesh i Switche 2.5G',
      ja: 'Wi-Fi 6/7ルーター・メッシュWi-Fi・2.5Gスイッチ 決済割引コード',
      ko: 'Wi-Fi 6/7 공유기, 메시 시스템 및 2.5G 스위치 결제 할인 코드',
      ar: 'كود خصم لأجهزة راوتر Wi-Fi 6/7 وأنظمة Mesh وموزعات الشبكة',
      zh: 'Wi-Fi 6/7 高端路由器、全屋Mesh组网与2.5G交换机 结账优惠码',
      ru: 'Промокод на Роутеры Wi-Fi 6/7, Mesh-системы и Свитчи 2.5G',
      tr: 'Wi-Fi 6/7 Router, Mesh Sistemleri ve 2.5G Switch Sepet Kuponu'
    },
    appliesTo: {
      es: 'Descuento directo en routers de alto rendimiento (GL.iNet, Xiaomi, Asus), switches administrables y consolas portátiles.',
      en: 'Direct discount on high-performance routers (GL.iNet, Xiaomi, Asus), managed switches, and handheld consoles.'
    }
  },
  {
    id: 'ali-tier-40-off-229',
    store: 'aliexpress',
    category: 'tech-gadgets',
    tierKey: 'tier40_229',
    discountPct: 18,
    discountUsd: 40,
    minSpendUsd: 229,
    userEligibility: {
      es: 'TODOS LOS USUARIOS (Nuevos y Antiguos)',
      en: 'ALL USERS (New & Existing Customers)'
    },
    title: {
      es: 'Cupón para Computadoras, Mini PCs (Intel/Ryzen), Laptops y Monitores',
      en: 'Checkout Coupon for Computers, Mini PCs (Intel/Ryzen), Laptops & Monitors',
      de: 'Gutscheincode für Computer, Mini-PCs (Intel/Ryzen), Laptops & Monitore',
      fr: 'Code Promo pour Ordinateurs, Mini PC (Intel/Ryzen), Portables et Écrans',
      pt: 'Cupom para Computadores, Mini PCs (Intel/Ryzen), Notebooks e Monitores',
      it: 'Codice Sconto per Computer, Mini PC (Intel/Ryzen), Notebook e Monitor',
      nl: 'Kortingscode voor Computers, Mini-PC’s, Laptops & Monitoren',
      pl: 'Kod Rabatowy na Komputery, Mini PC (Intel/Ryzen), Laptopy i Monitory',
      ja: 'パソコン・ミニPC（Intel/Ryzen）・ノートPC・モニター決済割引コード',
      ko: '컴퓨터, 미니 PC (인텔/라이젠), 노트북 및 모니터 장바구니 할인 코드',
      ar: 'كود خصم لأجهزة الكمبيوتر والحواسيب المصغرة والشاشات المحمولة',
      zh: '电脑整机、Intel/Ryzen 迷你主机、笔记本及显示器 结账大额券',
      ru: 'Промокод на Компьютеры, Мини-ПК (Intel/Ryzen), Ноутбуки и Мониторы',
      tr: 'Bilgisayar, Mini PC (Intel/Ryzen), Laptop ve Monitör Sepet Kuponu'
    },
    appliesTo: {
      es: 'Especial para compras de Mini PCs completas, placas base, procesadores Ryzen, tarjetas gráficas o monitores portátiles.',
      en: 'Designed for complete Mini PCs, motherboards, Ryzen CPUs, graphics cards, or portable monitors.'
    }
  },

  // =========================================================================
  // TEMU — CUPONES VERIFICADOS CON CONDICIÓN TRANSPARENTE DE CUENTA
  // (Para no quedar mal con el usuario: indica claramente que el 30% directo
  // es para Primera Compra en App / Reinstalación, y explica qué hacer si ya es usuario antiguo)
  // =========================================================================
  {
    id: 'temu-welcome-30pct-tech',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'aci382910',
    backupCode: 'ach586089',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 39,
    userEligibility: {
      es: 'NUEVOS USUARIOS EN APP (O cuentas que reinstalan tras +14 días)',
      en: 'NEW APP USERS (First app order within 24h of install)'
    },
    title: {
      es: '30% de Descuento Directo en Tecnología, Computadoras y Accesorios PC',
      en: '30% Off Direct Discount on Tech, Computers & PC Accessories',
      de: '30% Direktrabatt auf Technik, Computer & PC-Zubehör',
      fr: '30% de Réduction Directe sur Tech, Ordinateurs et Accessoires PC',
      pt: '30% de Desconto Direto em Tecnologia, Computadores e Acessórios PC',
      it: '30% di Sconto Diretto su Tecnologia, Computer e Accessori PC',
      nl: '30% Directe Korting op Tech, Computers & PC-Accessoires',
      pl: '30% Bezpośredniej Zniżki na Technologię, Komputery i Akcesoria PC',
      ja: 'テクノロジー・PC周辺機器・ガジェット 初回30%OFF割引コード',
      ko: '테크, 컴퓨터 및 PC 주변기기 앱 첫 주문 30% 즉시 할인 코드',
      ar: 'خصم مباشر 30% على الأجهزة التقنية ومستلزمات الكمبيوتر',
      zh: '数码硬件、电脑配件与电子好物 新用户首单 30% 直减码',
      ru: 'Прямая скидка 30% на Электронику, Компьютеры и Аксессуары для ПК',
      tr: 'Teknoloji, Bilgisayar ve PC Aksesuarlarında %30 Doğrudan İndirim'
    },
    appliesTo: {
      es: 'Importante: El 30% directo en carrito lo aplica Temu a cuentas nuevas en la App (dentro de las primeras 24h) o cuentas reactivadas. Si ya compras seguido, este mismo código te desbloquea el Paquete de Cupones al escribirlo en el buscador.',
      en: 'Note: Temu applies the flat 30% cart discount to first-time app orders (within 24h of install). For existing active shoppers, typing this code in the app search bar unlocks the tiered coupon bundle instead.'
    }
  },
  {
    id: 'temu-welcome-gaming',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'acp551920',
    backupCode: 'acr649281',
    discountPct: 30,
    discountUsd: 20,
    minSpendUsd: 35,
    userEligibility: {
      es: 'NUEVOS USUARIOS EN APP (Y Paquete de Cupones para Usuarios Actuales)',
      en: 'NEW APP USERS (+ Tiered Bundle for Existing Users)'
    },
    title: {
      es: 'Cupón Temu para Controles de Videojuegos, Teclados Mecánicos y Audio',
      en: 'Temu Coupon for Gaming Controllers, Mechanical Keyboards & Audio',
      de: 'Temu Gutschein für Gaming-Controller, Mechanische Tastaturen & Audio',
      fr: 'Coupon Temu pour Manettes de Jeu, Claviers Mécaniques et Audio',
      pt: 'Cupom Temu para Controles de Videogame, Teclados Mecânicos e Áudio',
      it: 'Coupon Temu per Controller Gaming, Tastiere Meccaniche e Audio',
      nl: 'Temu Kortingscode voor Gaming Controllers, Toetsenborden & Audio',
      pl: 'Kupon Temu na Kontrolery Gier, Klawiatury Mechaniczne i Audio',
      ja: 'Temu ゲームコントローラー・メカニカルキーボード・音響機器クーポン',
      ko: 'Temu 게이밍 컨트롤러, 기계식 키보드 및 오디오 할인 쿠폰',
      ar: 'كوبون Temu لأذرع التحكم ولوحات المفاتيح الميكانيكية والصوتيات',
      zh: 'Temu 游戏手柄、机械键盘与直播麦克风 专属折扣码',
      ru: 'Купон Temu на Геймпады, Механические клавиатуры и Аудио',
      tr: 'Temu Oyun Kolları, Mekanik Klavye ve Ses Ekipmanı Kuponu'
    },
    appliesTo: {
      es: 'Válido en toda la categoría de Gaming: controles Hall Effect, teclados RGB, mouse inalámbricos y micrófonos de streaming.',
      en: 'Valid across Gaming: Hall Effect controllers, RGB keyboards, wireless mice, and streaming microphones.'
    }
  },
  {
    id: 'temu-welcome-smart-home',
    store: 'temu',
    category: 'smart-home',
    code: 'afh339102',
    backupCode: 'frp204918',
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 40,
    userEligibility: {
      es: 'NUEVOS USUARIOS EN APP (Y Paquete de Cupones para Usuarios Actuales)',
      en: 'NEW APP USERS (+ Tiered Bundle for Existing Users)'
    },
    title: {
      es: 'Cupón Temu para Artículos del Hogar, Cocina, Luces LED y Domótica',
      en: 'Temu Coupon for Household Items, Kitchen, LED Lighting & Smart Home',
      de: 'Temu Gutschein für Haushalt, Küche, LED-Beleuchtung & Smart Home',
      fr: 'Coupon Temu pour Maison, Cuisine, Éclairage LED et Domotique',
      pt: 'Cupom Temu para Casa, Cozinha, Iluminação LED e Casa Inteligente',
      it: 'Coupon Temu per Casa, Cucina, Illuminazione LED e Smart Home',
      nl: 'Temu Kortingscode voor Huishouden, Keuken, LED & Smart Home',
      pl: 'Kupon Temu na Dom, Kuchnię, Oświetlenie LED i Smart Home',
      ja: 'Temu スマートホーム・キッチン家電・LED照明・日用品クーポン',
      ko: 'Temu 스마트홈, 주방가전, LED 조명 및 생활용품 할인 코드',
      ar: 'كوبون Temu لمستلزمات المنزل والمطبخ والإضاءة الذكية',
      zh: 'Temu 智能家居、厨房小家电、LED灯带与日用百货 优惠码',
      ru: 'Купон Temu на Товары для дома, Кухни, Освещение и Умный дом',
      tr: 'Temu Ev Eşyaları, Mutfak, LED Aydınlatma ve Akıllı Ev Kuponu'
    },
    appliesTo: {
      es: 'Aplica a organizadores de casa, electrodomésticos pequeños, enchufes inteligentes, tiras LED y herramientas.',
      en: 'Applies to home organizers, small appliances, smart plugs, LED strips, and household tools.'
    }
  },
  {
    id: 'temu-welcome-wifi-mobile',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'act882910',
    backupCode: 'aci382910',
    discountPct: 30,
    discountUsd: 15,
    minSpendUsd: 29,
    userEligibility: {
      es: 'NUEVOS USUARIOS EN APP (Y Paquete de Cupones para Usuarios Actuales)',
      en: 'NEW APP USERS (+ Tiered Bundle for Existing Users)'
    },
    title: {
      es: 'Cupón Temu para Cargadores Rápidos, Power Banks y Accesorios de Celular',
      en: 'Temu Coupon for Fast Chargers, Power Banks & Mobile Phone Gear',
      de: 'Temu Gutschein für Schnellladegeräte, Powerbanks & Handyzubehör',
      fr: 'Coupon Temu pour Chargeurs Rapides, Batteries Externes et Mobile',
      pt: 'Cupom Temu para Carregadores Rápidos, Power Banks e Celular',
      it: 'Coupon Temu per Caricatori Rapidi, Power Bank e Accessori Mobile',
      nl: 'Temu Kortingscode voor Snelladers, Powerbanks & Telefoonaccessoires',
      pl: 'Kupon Temu na Szybkie Ładowarki, Powerbanki i Akcesoria do Telefonu',
      ja: 'Temu 急速充電器・モバイルバッテリー・スマホアクセサリー割引コード',
      ko: 'Temu 고속 충전기, 보조배터리 및 스마트폰 액세서리 할인 코드',
      ar: 'كوبون Temu للشواحن السريعة وبنوك الطاقة وإكسسوارات الجوال',
      zh: 'Temu 氮化镓充电器、移动电源与手机配件 专属优惠码',
      ru: 'Купон Temu на Быстрые зарядки, Повербанки и Аксессуары для телефонов',
      tr: 'Temu Hızlı Şarj, Powerbank ve Telefon Aksesuarı İndirim Kodu'
    },
    appliesTo: {
      es: 'Aplica a estaciones de carga USB-C, cables de 240W, enfriadores magnéticos para celular, fundas y repetidores Wi-Fi.',
      en: 'Applies to USB-C charging stations, 240W cables, magnetic phone coolers, cases, and Wi-Fi extenders.'
    }
  }
];

export const SEARCH_DYNAMIC_CODES = [
  {
    id: 'dynamic-credit777',
    store: 'temu',
    code: 'credit777',
    badge: {
      es: 'PARA USUARIOS NUEVOS Y ANTIGUOS EN APP',
      en: 'FOR NEW & EXISTING APP USERS'
    },
    title: {
      es: 'Dinámica de Devolución de Saldo y Crédito en Cuenta (credit777)',
      en: 'Account Credit & Cashback Wheel Activity (credit777)'
    },
    howItWorks: {
      es: 'No se pega al pagar. Escribe "credit777" en la lupa del buscador superior de la app de Temu para abrir la actividad oficial de recolección de saldo para tu próxima compra.',
      en: 'Do not paste at checkout. Type "credit777" directly into the top search bar of the Temu mobile app to open the official credit reward event.'
    }
  },
  {
    id: 'dynamic-claimcredit',
    store: 'temu',
    code: 'claimcredit',
    badge: {
      es: 'RECLAMO DIARIO DE SALDO PENDIENTE',
      en: 'DAILY CREDIT CLAIM PAGE'
    },
    title: {
      es: 'Panel para Reclamar Saldo Diario de Compras Anteriores (claimcredit)',
      en: 'Daily Credit Claim Dashboard (claimcredit)'
    },
    howItWorks: {
      es: 'Si hiciste un pedido dentro de una promoción de devolución de saldo en Temu, escribe "claimcredit" todos los días en el buscador para recoger tu dinero diario en la billetera.',
      en: 'If you placed an order inside a credit-back promo on Temu, type "claimcredit" daily in the search bar to collect your credit installments.'
    }
  },
  {
    id: 'dynamic-wincredit',
    store: 'temu',
    code: 'wincredit',
    badge: {
      es: 'ACTIVIDAD DE CRÉDITO EN BUSCADOR',
      en: 'SEARCH BAR CREDIT EVENT'
    },
    title: {
      es: 'Actividad de Ruleta de Crédito por Pedido (wincredit)',
      en: 'Purchase Credit Spin Activity (wincredit)'
    },
    howItWorks: {
      es: 'Escríbelo en la barra de búsqueda de la app de Temu. Abre el tablero donde acumulas monedas al completar un pedido para recibir saldo directo en tu cuenta.',
      en: 'Type into the Temu app search bar. Opens the board where completing an order grants wallet credit back.'
    }
  },
  {
    id: 'dynamic-box777',
    store: 'temu',
    code: 'box777',
    badge: {
      es: 'PAQUETE DE CUPONES PARA USUARIOS ACTUALES',
      en: 'COUPON BUNDLE FOR EXISTING USERS'
    },
    title: {
      es: 'Cofres y Paquete de Cupones Escalados en Billetera (box777)',
      en: 'Mystery Chests & Wallet Coupon Bundle (box777)'
    },
    howItWorks: {
      es: 'El mejor truco si ya eres comprador antiguo y Temu no te acepta códigos de nuevo usuario: busca "box777" en la lupa para activar un paquete de cupones directo en tu cuenta.',
      en: 'Best option if you are an existing customer: search "box777" in the Temu app to trigger a multi-coupon bundle directly into your account wallet.'
    }
  }
];

export function getCouponsForLocale(localeCode, { storeFilter = null, categoryFilter = null } = {}) {
  const localeConfig = getLocaleConfig(localeCode);
  const langKey = localeConfig.lang;
  const isEs = langKey === 'es';
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

  const allItems = [...customItems, ...CHECKOUT_COUPON_TEMPLATES];

  return allItems.filter((item) => {
    if (!supportedStores.includes(item.store)) return false;
    if (storeFilter && item.store !== storeFilter) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  }).map((item) => {
    const title = item.title?.[langKey] || item.title?.es || item.title?.en || item.productName?.[langKey] || item.productName?.en || item.title;
    const appliesToText = item.appliesTo?.[langKey] || item.appliesTo?.es || item.appliesTo?.en || '';
    const eligibilityText = item.userEligibility
      ? (isEs ? item.userEligibility.es : item.userEligibility.en)
      : (isEs ? 'TODOS LOS USUARIOS' : 'ALL USERS');

    // Resolve exact regional code + backup code for the active country
    let primaryCode = item.code;
    let backupCode = item.backupCode || '';
    let regionalNote = '';

    if (item.store === 'aliexpress' && item.tierKey) {
      const regionalData = getRegionalAliExpressCode(item.tierKey, localeConfig.iso);
      primaryCode = regionalData.primary;
      backupCode = regionalData.backup;
      regionalNote = isEs ? regionalData.noteEs : regionalData.noteEn;
    }

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
      code: primaryCode,
      backupCode,
      regionalNote,
      eligibilityText,
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
