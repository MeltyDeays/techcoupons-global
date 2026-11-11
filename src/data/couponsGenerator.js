import { getLocaleConfig, formatLocalPrice } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';

/**
 * 1. CUPONES REALES DE PAGO EN CARRITO (CHECKOUT COUPONS)
 * Cero códigos trampa o de buscador aquí. Todos estos son cupones que se pegan
 * en la casilla "Código promocional / Promo Code" justo antes de pagar.
 */
const CHECKOUT_COUPON_TEMPLATES = [
  // =========================================================================
  // TEMU — CUPONES DE PAGO EN CARRITO (CHECKOUT)
  // =========================================================================
  {
    id: 'temu-checkout-all-store',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'aci382910',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 25,
    minSpendUsd: 80,
    title: {
      es: 'Cupón de Pago para Computadoras, Mini PCs, Monitores y SSD',
      en: 'Checkout Promo Code for Computers, Mini PCs, Monitors & SSDs',
      de: 'Warenkorb-Gutscheincode für Computer, Mini-PCs, Monitore & SSDs',
      fr: 'Code Promo Panier pour Ordinateurs, Mini PC, Écrans et SSD',
      pt: 'Cupom de Carrinho para Computadores, Mini PCs, Monitores e SSDs',
      it: 'Codice Sconto Carrello per Computer, Mini PC, Monitor e SSD',
      nl: 'Winkelwagen Kortingscode voor Computers, Mini-PC’s & Monitoren',
      pl: 'Kod Rabatowy do Koszyka na Komputery, Mini PC, Monitory i SSD',
      ja: 'パソコン・ミニPC・モニター・SSD専用 決済時プロモコード',
      ko: '컴퓨터, 미니 PC, 모니터 및 SSD 장바구니 결제 할인 코드',
      ar: 'كود خصم مباشر عند الدفع لأجهزة الكمبيوتر والشاشات وأقراص SSD',
      zh: '电脑主机、迷你PC、便携显示器及SSD 结账直减优惠码',
      ru: 'Промокод в корзине на Компьютеры, Мини-ПК, Мониторы и SSD',
      tr: 'Bilgisayar, Mini PC, Monitör ve SSD İçin Sepette İndirim Kodu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Descuenta directo en la compra de Mini PCs, Monitores portátiles, Discos SSD NVMe y Accesorios de PC.',
      en: 'Paste at checkout: Direct cart discount on Mini PCs, Portable Monitors, NVMe SSDs & Computer accessories.'
    }
  },
  {
    id: 'temu-checkout-gaming',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'acp551920',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 15,
    minSpendUsd: 45,
    title: {
      es: 'Cupón de Pago para Controles de Videojuegos, Teclados y Mouse Gaming',
      en: 'Checkout Coupon for Gaming Controllers, Mechanical Keyboards & Mice',
      de: 'Gutscheincode für Gaming-Controller, Mechanische Tastaturen & Mäuse',
      fr: 'Code Promo pour Manettes de Jeu, Claviers Mécaniques et Souris',
      pt: 'Cupom de Desconto para Controles de Videogame, Teclados e Mouses',
      it: 'Codice Sconto per Controller da Gioco, Tastiere Meccaniche e Mouse',
      nl: 'Kortingscode voor Gaming Controllers, Toetsenborden & Muizen',
      pl: 'Kod Rabatowy na Kontrolery Gier, Klawiatury Mechaniczne i Myszy',
      ja: 'ゲームコントローラー・メカニカルキーボード・マウス決済割引コード',
      ko: '게이밍 컨트롤러, 기계식 키보드 및 마우스 결제 프로모션 코드',
      ar: 'كود خصم عند الدفع لأذرع التحكم ولوحات المفاتيح وماوس الألعاب',
      zh: '游戏手柄、机械键盘与电竞鼠标 购物车结账折扣码',
      ru: 'Промокод при оплате на Геймпады, Механические клавиатуры и Мыши',
      tr: 'Oyun Kolları, Mekanik Klavye ve Oyuncu Mouse Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Válido en controles para celular/PC, teclados mecánicos, micrófonos USB y diademas gamer.',
      en: 'Paste at checkout: Valid on Mobile/PC controllers, mechanical keyboards, USB mics & gaming headsets.'
    }
  },
  {
    id: 'temu-checkout-smart-home',
    store: 'temu',
    category: 'smart-home',
    code: 'afh339102',
    isSecretSearch: false,
    discountPct: 25,
    discountUsd: 12,
    minSpendUsd: 40,
    title: {
      es: 'Cupón de Pago para Cosas del Hogar, Domótica, Luces LED y Cámaras',
      en: 'Checkout Coupon for Smart Home, Household Items, LEDs & Cameras',
      de: 'Warenkorb-Gutschein für Smart Home, Haushalt, LED & Kameras',
      fr: 'Code Promo pour Maison Connectée, Articles Ménagers et Caméras',
      pt: 'Cupom para Casa Inteligente, Utilidades Domésticas, LED e Câmeras',
      it: 'Codice Sconto per Smart Home, Articoli per la Casa e Telecamere',
      nl: 'Kortingscode voor Smart Home, Huishouden, LED-Verlichting & Camera’s',
      pl: 'Kod Rabatowy na Smart Home, Artykuły Domowe, Oświetlenie LED i Kamery',
      ja: 'スマートホーム・生活家電・LED照明・防犯カメラ 決済割引コード',
      ko: '스마트홈, 생활가전, LED 조명 및 보안 카메라 결제 할인 코드',
      ar: 'كود خصم للدفع على مستلزمات المنزل الذكي والإضاءة والكاميرات',
      zh: '智能家居、家用小电器、LED灯带及安防摄像头 结账优惠码',
      ru: 'Промокод на Умный дом, Товары для дома, LED-освещение и Камеры',
      tr: 'Akıllı Ev, Ev Eşyaları, LED Aydınlatma ve Kamera Sepet Kodu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a enchufes inteligentes, sensores para la casa, lámparas, cocina y pequeños electrodomésticos.',
      en: 'Paste at checkout: Applies to smart plugs, home sensors, lamps, kitchen gadgets & small appliances.'
    }
  },
  {
    id: 'temu-checkout-wifi',
    store: 'temu',
    category: 'redes-wifi',
    code: 'acr649281',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 10,
    minSpendUsd: 35,
    title: {
      es: 'Cupón de Pago para Routers Wi-Fi, Repetidores de Señal y Switches',
      en: 'Checkout Coupon for Wi-Fi Routers, Signal Repeaters & Switches',
      de: 'Gutscheincode für WLAN-Router, Signalverstärker & Switches',
      fr: 'Code Promo pour Routeurs Wi-Fi, Répéteurs et Switches Réseau',
      pt: 'Cupom para Roteadores Wi-Fi, Repetidores de Sinal e Switches',
      it: 'Codice Sconto per Router Wi-Fi, Ripetitori di Segnale e Switch',
      nl: 'Kortingscode voor Wi-Fi Routers, Versterkers & Netwerk Switches',
      pl: 'Kod Rabatowy na Routery Wi-Fi, Wzmacniacze Sygnału i Switche',
      ja: 'Wi-Fiルーター・中継機・ネットワークスイッチ 決済プロモコード',
      ko: 'Wi-Fi 공유기, 신호 증폭기 및 네트워크 스위치 결제 할인 코드',
      ar: 'كود خصم عند الدفع لأجهزة الراوتر ومقويات شبكة Wi-Fi',
      zh: 'Wi-Fi 路由器、信号放大器与千兆交换机 结账优惠码',
      ru: 'Промокод на Wi-Fi роутеры, Усилители сигнала и Свитчи',
      tr: 'Wi-Fi Modem, Sinyal Güçlendirici ve Switch Sepet İndirim Kodu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a repetidores de Wi-Fi para el hogar, switches Ethernet de 2.5G, cables de red y antenas USB.',
      en: 'Paste at checkout: Applies to home Wi-Fi extenders, 2.5G Ethernet switches, LAN cables & USB adapters.'
    }
  },
  {
    id: 'temu-checkout-mobile',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'act882910',
    isSecretSearch: false,
    discountPct: 25,
    discountUsd: 8,
    minSpendUsd: 29,
    title: {
      es: 'Cupón de Pago para Cargadores Rápidos, Baterías Portátiles y Cables',
      en: 'Checkout Coupon for Fast Chargers, Power Banks & Phone Cables',
      de: 'Gutscheincode für Schnellladegeräte, Powerbanks & Handykabel',
      fr: 'Code Promo pour Chargeurs Rapides, Batteries Externes et Câbles',
      pt: 'Cupom para Carregadores Rápidos, Power Banks e Cabos de Celular',
      it: 'Codice Sconto per Caricatori Rapidi, Power Bank e Cavi Smartphone',
      nl: 'Kortingscode voor Snelladers, Powerbanks & Telefoonkabels',
      pl: 'Kod Rabatowy na Szybkie Ładowarki, Powerbanki i Kable USB-C',
      ja: '急速充電器・モバイルバッテリー・スマホケーブル 決済割引コード',
      ko: '고속 충전기, 보조배터리 및 스마트폰 케이블 결제 할인 코드',
      ar: 'كود خصم عند الدفع للشواحن السريعة وبنوك الطاقة وكابلات الهواتف',
      zh: '氮化镓快充充电器、充电宝及Type-C数据线 结账优惠码',
      ru: 'Промокод на Быстрые зарядки GaN, Повербанки и Кабели',
      tr: 'Hızlı Şarj Cihazı, Powerbank ve Telefon Kablosu Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a estaciones de carga rápida GaN, baterías externas, cables trenzados USB-C y audífonos.',
      en: 'Paste at checkout: Applies to GaN fast charging stations, power banks, braided USB-C cables & earbuds.'
    }
  },
  {
    id: 'temu-checkout-home-appliances',
    store: 'temu',
    category: 'smart-home',
    code: 'frp204918',
    isSecretSearch: false,
    discountPct: 30,
    discountUsd: 18,
    minSpendUsd: 55,
    title: {
      es: 'Cupón de Pago para Electrodomésticos Pequeños y Herramientas de Casa',
      en: 'Checkout Coupon for Small Home Appliances & Household Tools',
      de: 'Gutscheincode für Haushaltskleingeräte & Heimwerker-Werkzeuge',
      fr: 'Code Promo pour Petit Électroménager et Outils de Maison',
      pt: 'Cupom para Pequenos Eletrodomésticos e Ferramentas Domésticas',
      it: 'Codice Sconto per Piccoli Elettrodomestici e Attrezzi Casa',
      nl: 'Kortingscode voor Kleine Huishoudelijke Apparaten & Gereedschap',
      pl: 'Kod Rabatowy na Małe AGD i Narzędzia Domowe',
      ja: '小型家電・キッチン用品・家庭用工具 決済プロモコード',
      ko: '소형 가전제품, 주방용품 및 가정용 공구 결제 할인 코드',
      ar: 'كود خصم عند الدفع للأجهزة المنزلية الصغيرة وأدوات البيت',
      zh: '家用小电器、厨房好物与日常工具 购物车结账优惠码',
      ru: 'Промокод на Мелкую бытовую технику и Инструменты для дома',
      tr: 'Küçük Ev Aletleri ve Ev Gereçleri İçin Sepette İndirim Kodu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a aspiradoras portátiles, artículos de cocina, organización del hogar y herramientas.',
      en: 'Paste at checkout: Applies to handheld vacuums, kitchen items, home organization & DIY tools.'
    }
  },

  // =========================================================================
  // ALIEXPRESS — CUPONES DE PAGO EN CARRITO (CHECKOUT - 63 PAÍSES)
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
      es: 'Cupón de Pago AliExpress para Computadoras, Mini PCs y Laptops',
      en: 'AliExpress Checkout Coupon for Computers, Mini PCs & Laptops',
      de: 'AliExpress Gutscheincode für Computer, Mini-PCs & Laptops',
      fr: 'Code Promo AliExpress pour Ordinateurs, Mini PC et Portables',
      pt: 'Cupom AliExpress para Computadores, Mini PCs e Notebooks',
      it: 'Codice Sconto AliExpress per Computer, Mini PC e Notebook',
      nl: 'AliExpress Kortingscode voor Computers, Mini-PC’s & Laptops',
      pl: 'Kod Rabatowy AliExpress na Komputery, Mini PC i Laptopy',
      ja: 'AliExpress パソコン・ミニPC・ノートPC対象 決済割引コード',
      ko: 'AliExpress 컴퓨터, 미니 PC 및 노트북 장바구니 할인 코드',
      ar: 'كود خصم AliExpress عند الدفع لأجهزة الكمبيوتر والحواسيب المصغرة',
      zh: 'AliExpress 电脑主机、迷你PC与笔记本 结账直减码',
      ru: 'Промокод AliExpress на Компьютеры, Мини-ПК и Ноутбуки',
      tr: 'AliExpress Bilgisayar, Mini PC ve Laptop Sepet İndirim Kodu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Descuento directo en Mini PCs, Memorias RAM, Procesadores, Discos SSD, Tablets y Monitores.',
      en: 'Paste at checkout: Direct discount on Mini PCs, RAM, Processors, SSDs, Tablets & Monitors.'
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
      es: 'Cupón de Pago para Controles de Juegos, Consolas Portátiles y Teclados',
      en: 'Checkout Coupon for Gaming Controllers, Retro Handhelds & Keyboards',
      de: 'Gutscheincode für Gaming-Controller, Retro-Handhelds & Tastaturen',
      fr: 'Code Promo pour Manettes de Jeu, Consoles Portables et Claviers',
      pt: 'Cupom para Controles Gamer, Consoles Portáteis e Teclados',
      it: 'Codice Sconto per Controller Gaming, Console Portatili e Tastiere',
      nl: 'Kortingscode voor Gaming Controllers, Retro Handhelds & Toetsenborden',
      pl: 'Kod Rabatowy na Kontrolery Gier, Konsole Przenośne i Klawiatury',
      ja: 'ゲームコントローラー・携帯ゲーム機・キーボード決済割引コード',
      ko: '게이밍 컨트롤러, 휴대용 게임기 및 키보드 결제 할인 코드',
      ar: 'كود خصم عند الدفع لأذرع التحكم وأجهزة الألعاب المحمولة',
      zh: '游戏手柄、开源掌机与机械键盘 结账直减优惠码',
      ru: 'Промокод на Игровые контроллеры, Портативные консоли и Клавиатуры',
      tr: 'Oyun Kolları, Taşınabilir Konsollar ve Klavye Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a controles Bluetooth/USB (GameSir, 8BitDo), consolas retro portátiles y mouse gaming.',
      en: 'Paste at checkout: Applies to Bluetooth/USB controllers (GameSir, 8BitDo), retro handhelds & gaming mice.'
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
      es: 'Cupón de Pago para Equipos de Red, Routers Wi-Fi 6 y Switches',
      en: 'Checkout Coupon for Networking Gear, Wi-Fi 6 Routers & Switches',
      de: 'Gutscheincode für Netzwerkgeräte, Wi-Fi 6 Router & Switches',
      fr: 'Code Promo pour Équipements Réseau, Routeurs Wi-Fi 6 et Switches',
      pt: 'Cupom para Equipamentos de Rede, Roteadores Wi-Fi 6 e Switches',
      it: 'Codice Sconto per Apparati di Rete, Router Wi-Fi 6 e Switch',
      nl: 'Kortingscode voor Netwerkapparatuur, Wi-Fi 6 Routers & Switches',
      pl: 'Kod Rabatowy na Sprzęt Sieciowy, Routery Wi-Fi 6 i Switche',
      ja: 'ネットワーク機器・Wi-Fi 6ルーター・スイッチ 決済割引コード',
      ko: '네트워크 장비, Wi-Fi 6 공유기 및 스위치 결제 할인 코드',
      ar: 'كود خصم عند الدفع لمعدات الشبكات وراوترات Wi-Fi 6',
      zh: 'Wi-Fi 6 路由器、便携软路由与万兆交换机 结账优惠码',
      ru: 'Промокод на Сетевое оборудование, Роутеры Wi-Fi 6 и Свитчи',
      tr: 'Ağ Ekipmanları, Wi-Fi 6 Router ve Switch Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a routers domésticos y de viaje, sistemas Wi-Fi Mesh, tarjetas de red y fibra óptica.',
      en: 'Paste at checkout: Applies to home & travel routers, Mesh Wi-Fi systems, network cards & fiber gear.'
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
      es: 'Cupón de Pago para Domótica, Artículos del Hogar y Seguridad',
      en: 'Checkout Coupon for Home Automation, Household Tech & Security',
      de: 'Gutscheincode für Hausautomation, Haushaltstechnik & Sicherheit',
      fr: 'Code Promo pour Domotique, Équipement de la Maison et Sécurité',
      pt: 'Cupom para Automação Residencial, Casa e Segurança Inteligente',
      it: 'Codice Sconto per Domotica, Casa Intelligente e Sicurezza',
      nl: 'Kortingscode voor Huisautomatisering, Huishouden & Beveiliging',
      pl: 'Kod Rabatowy na Automatykę Domową, Dom i Bezpieczeństwo',
      ja: 'スマートホーム自動化・生活家電・防犯センサー 決済割引コード',
      ko: '홈 오토메이션, 스마트 생활가전 및 보안 기기 결제 할인 코드',
      ar: 'كود خصم عند الدفع لأتمتة المنزل والأجهزة المنزلية والأمان',
      zh: '全屋智能家居、Zigbee传感器与家用电器 结账优惠码',
      ru: 'Промокод на Умный дом, Домашнюю автоматизацию и Безопасность',
      tr: 'Ev Otomasyonu, Akıllı Ev Eşyaları ve Güvenlik Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a interruptores inteligentes, motores de cortina, sensores Zigbee/Wi-Fi y cámaras.',
      en: 'Paste at checkout: Applies to smart switches, curtain motors, Zigbee/Wi-Fi sensors & security cameras.'
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
      es: 'Cupón de Pago para Cargadores GaN, Audífonos y Accesorios de Celular',
      en: 'Checkout Coupon for GaN Chargers, Earphones & Phone Accessories',
      de: 'Gutscheincode für GaN-Ladegeräte, Kopfhörer & Telefonzubehör',
      fr: 'Code Promo pour Chargeurs GaN, Écouteurs et Accessoires Téléphone',
      pt: 'Cupom para Carregadores GaN, Fones de Ouvido e Acessórios Celular',
      it: 'Codice Sconto per Caricatori GaN, Auricolari e Accessori Smartphone',
      nl: 'Kortingscode voor GaN-Opladers, Oortelefoons & Telefoonaccessoires',
      pl: 'Kod Rabatowy na Ładowarki GaN, Słuchawki i Akcesoria Mobilne',
      ja: 'GaN急速充電器・高音質イヤホン・スマホアクセサリー 決済割引コード',
      ko: 'GaN 초고속 충전기, 이어폰 및 스마트폰 액세서리 결제 할인 코드',
      ar: 'كود خصم عند الدفع لشواحن GaN وسماعات الأذن وملحقات الهواتف',
      zh: '氮化镓快充、HIFI有线耳机与手机配件 结账直减码',
      ru: 'Промокод на Зарядные устройства GaN, Наушники и Аксессуары',
      tr: 'GaN Şarj Cihazı, Kulaklık ve Telefon Aksesuarı Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a cargadores rápidos (Baseus, Ugreen, Anker), baterías portátiles, audífonos y cables.',
      en: 'Paste at checkout: Applies to fast chargers (Baseus, Ugreen, Anker), power banks, earphones & cables.'
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
      es: 'Cupón de Pago para Compras Pequeñas de Tecnología y Electrónica',
      en: 'Checkout Coupon for Small Tech Orders & Consumer Electronics',
      de: 'Gutscheincode für kleine Technik-Bestellungen & Elektronik',
      fr: 'Code Promo pour Petites Commandes Tech et Électronique',
      pt: 'Cupom para Pequenas Compras de Tecnologia e Eletrônicos',
      it: 'Codice Sconto per Piccoli Ordini Tech ed Elettronica',
      nl: 'Kortingscode voor Kleine Tech Bestellingen & Elektronica',
      pl: 'Kod Rabatowy na Mniejsze Zakupy Technologiczne i Elektronikę',
      ja: '少額注文OK！ガジェット・一般電子機器向け 決済プロモコード',
      ko: '소액 주문 가능! 테크 가젯 및 일반 전자제품 결제 할인 코드',
      ar: 'كود خصم عند الدفع للطلبات التقنية الصغيرة والإلكترونيات',
      zh: '小额订单可用！数码小配件与电子工具 结账优惠码',
      ru: 'Промокод на Небольшие заказы электроники и гаджетов',
      tr: 'Küçük Teknoloji Siparişleri ve Elektronik Sepet Kuponu'
    },
    appliesTo: {
      es: 'Se pega al pagar: Aplica a cualquier gadget electrónico, adaptadores USB, herramientas y componentes.',
      en: 'Paste at checkout: Applies to any electronic gadget, USB adapters, precision tools & components.'
    }
  }
];

/**
 * 2. APARTADO EXTRA: CÓDIGOS DE DINÁMICAS, ACTIVIDADES Y MINIJUEGOS EN BUSCADOR
 * Estos NO son cupones de carrito: son comandos de texto que el usuario pega en la
 * barra de búsqueda superior de la App de Temu para abrir ruletas, cofres o saldo.
 */
export const SEARCH_DYNAMIC_CODES = [
  {
    id: 'dynamic-credit777',
    store: 'temu',
    code: 'credit777',
    badge: {
      es: 'ACTIVIDAD DE RECOMPENSA / SALDO EN APP',
      en: 'APP SEARCH BAR REWARD ACTIVITY'
    },
    title: {
      es: 'Dinámica de Devolución de Saldo y Crédito en Cuenta (credit777)',
      en: 'Account Credit & Cashback Wheel Activity (credit777)'
    },
    howItWorks: {
      es: 'No se pega al pagar. Escribe "credit777" en la lupa del buscador superior de la app de Temu para abrir el minijuego de recolección de monedas y saldo a favor para tu próxima compra.',
      en: 'Do not paste at checkout. Type "credit777" directly into the top search bar of the Temu mobile app to open the credit wheel mini-game.'
    }
  },
  {
    id: 'dynamic-wincredit',
    store: 'temu',
    code: 'wincredit',
    badge: {
      es: 'MINIJUEGO DE CRÉDITO EN BUSCADOR',
      en: 'SEARCH BAR CREDIT MINI-GAME'
    },
    title: {
      es: 'Actividad de Ruleta de Crédito por Compra (wincredit)',
      en: 'Purchase Credit Spin Activity (wincredit)'
    },
    howItWorks: {
      es: 'Escríbelo en la barra de búsqueda de la app de Temu. Abre una actividad temporal donde acumulas puntos al completar un pedido para recibir crédito en tu billetera de Temu.',
      en: 'Type into the Temu app search bar. Opens a timed event where completing an order grants wallet credit back.'
    }
  },
  {
    id: 'dynamic-box777',
    store: 'temu',
    code: 'box777',
    badge: {
      es: 'DINÁMICA DE COFRES Y PAQUETE DE CUPONES',
      en: 'MYSTERY BOX & COUPON BUNDLE EVENT'
    },
    title: {
      es: 'Apertura de Cofres y Paquete de Cupones Combinados (box777)',
      en: 'Mystery Chests & Coupon Bundle Unlock (box777)'
    },
    howItWorks: {
      es: 'Al buscar "box777" en la lupa de Temu, se abre una pantalla de cofres que activa un paquete de varios cupones escalonados si realizas una compra inicial dentro del tiempo límite.',
      en: 'Searching "box777" in the Temu search bar opens a chest screen that unlocks a multi-coupon bundle upon qualifying purchase.'
    }
  },
  {
    id: 'dynamic-freebie777',
    store: 'temu',
    code: 'freebie777',
    badge: {
      es: 'DINÁMICA DE SELECCIÓN DE ARTÍCULOS',
      en: 'PROMOTIONAL GIFT SELECTION ACTIVITY'
    },
    title: {
      es: 'Tablero de Artículos Promocionales por Invitación o Pedido (freebie777)',
      en: 'Promotional Gift Board Activity (freebie777)'
    },
    howItWorks: {
      es: 'Comando de buscador que abre el calendario o tablero de regalos de Temu. Requiere cumplir las tareas diarias o metas del evento dentro de la aplicación.',
      en: 'Search command that opens the Temu gift calendar board. Requires completing daily check-ins or event tasks inside the app.'
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
      es: 'Panel para Reclamar Saldo Diario de Eventos Anteriores (claimcredit)',
      en: 'Daily Credit Claim Dashboard (claimcredit)'
    },
    howItWorks: {
      es: 'Si participaste en una dinámica de saldo en Temu, escribe "claimcredit" todos los días en el buscador para recoger los tramos diarios de crédito en tu cuenta.',
      en: 'If you joined a credit event on Temu, type "claimcredit" daily in the search bar to collect your daily credit installments.'
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

  const allItems = [...customItems, ...CHECKOUT_COUPON_TEMPLATES];

  return allItems.filter((item) => {
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
