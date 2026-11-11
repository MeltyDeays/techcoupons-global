import { getLocaleConfig, formatLocalPrice } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';

const HARDWARE_ITEMS = [
  // TEMU (15 items)
  {
    id: 'temu-gamesir-g8',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'credit777',
    isSecretSearch: true,
    discountPct: 35,
    basePriceUsd: 54,
    minSpendUsd: 39,
    productName: {
      en: 'GameSir G8 Galileo Type-C Mobile Controller (Hall Effect)',
      es: 'Control Móvil GameSir G8 Galileo USB-C (Joysticks Hall Effect)',
      de: 'GameSir G8 Galileo USB-C Mobile Controller (Hall-Effekt)',
      fr: 'Manette Mobile GameSir G8 Galileo USB-C (Effet Hall)',
      pt: 'Controle Mobile GameSir G8 Galileo USB-C (Hall Effect)',
      it: 'Controller Mobile GameSir G8 Galileo USB-C (Effetto Hall)',
      nl: 'GameSir G8 Galileo USB-C Mobiele Controller (Hall-Effect)',
      pl: 'Kontroler Mobilny GameSir G8 Galileo USB-C (Efekt Halla)',
      ja: 'GameSir G8 Galileo Type-C ホール効果モバイルコントローラー',
      ko: 'GameSir G8 갈릴레오 C타입 홀이펙트 모바일 컨트롤러',
      ar: 'يد تحكم GameSir G8 Galileo بمنفذ Type-C وتقنية Hall Effect'
    }
  },
  {
    id: 'temu-wincredit-bundle',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'wincredit',
    isSecretSearch: true,
    discountPct: 50,
    basePriceUsd: 100,
    minSpendUsd: 50,
    productName: {
      en: 'Temu Cash Credit & Hardware Bundle Unlock (Search Bar Command)',
      es: 'Paquete de Crédito y Cupones Hardware Temu (Comando en Buscador)',
      de: 'Temu Guthaben & Hardware-Gutscheinpaket (Suchbefehl)',
      fr: 'Pack Crédit & Coupons Hardware Temu (Commande de Recherche)',
      pt: 'Pacote de Crédito e Cupons de Hardware Temu (Busca Secreta)',
      it: 'Pacchetto Credito e Coupon Hardware Temu (Comando di Ricerca)',
      nl: 'Temu Tegoed & Hardware Couponbundel (Zoekopdracht)',
      pl: 'Pakiet Kredytów i Kuponów Hardware Temu (Hasło w Wyszukiwarce)',
      ja: 'Temu クレジット＆ハードウェアクーポンバンドル（検索コマンド）',
      ko: 'Temu 크레딧 및 하드웨어 쿠폰 번들 잠금 해제 (검색창 키워드)',
      ar: 'حزمة رصيد وكوبونات أجهزة Temu (أمر شريط البحث)'
    }
  },
  {
    id: 'temu-box777-mechanical',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'box777',
    isSecretSearch: true,
    discountPct: 40,
    basePriceUsd: 42,
    minSpendUsd: 30,
    productName: {
      en: 'Aula F75 75% Wireless Gasket Mechanical Keyboard RGB',
      es: 'Teclado Mecánico Inalámbrico Aula F75 75% Gasket RGB Hot-Swap',
      de: 'Aula F75 75% Kabellose Mechanische Gasket-Tastatur RGB',
      fr: 'Clavier Mécanique Sans Fil Aula F75 75% Gasket RGB',
      pt: 'Teclado Mecânico Sem Fio Aula F75 75% Gasket RGB',
      it: 'Tastiera Meccanica Wireless Aula F75 75% Gasket RGB',
      nl: 'Aula F75 75% Draadloos Mechanisch Toetsenbord RGB',
      pl: 'Klawiatura Mechaniczna Bezprzewodowa Aula F75 75% Gasket RGB',
      ja: 'Aula F75 75% ワイヤレス ガスケット メカニカルキーボード RGB',
      ko: '독거미 Aula F75 유무선 가스켓 기계식 키보드 RGB',
      ar: 'لوحة مفاتيح ميكانيكية لاسلكية Aula F75 75% إضاءة RGB'
    }
  },
  {
    id: 'temu-wifi6-repeater',
    store: 'temu',
    category: 'redes-wifi',
    code: 'acr649281',
    isSecretSearch: false,
    discountPct: 30,
    basePriceUsd: 28,
    minSpendUsd: 25,
    productName: {
      en: 'AX3000 Dual-Band Wi-Fi 6 Range Extender & Gigabit AP',
      es: 'Extensor de Rango Wi-Fi 6 AX3000 Doble Banda con Puerto Gigabit',
      de: 'AX3000 Dual-Band Wi-Fi 6 Repeater & Gigabit Access Point',
      fr: 'Répéteur Wi-Fi 6 AX3000 Bi-Bande avec Port Gigabit',
      pt: 'Repetidor e Extensor Wi-Fi 6 AX3000 Dual-Band Gigabit',
      it: 'Ripetitore Wi-Fi 6 AX3000 Dual-Band con Porta Gigabit',
      nl: 'AX3000 Dual-Band Wi-Fi 6 Versterker met Gigabit Poort',
      pl: 'Wzmacniacz Sygnału Wi-Fi 6 AX3000 Dual-Band Gigabit',
      ja: 'AX3000 デュアルバンド Wi-Fi 6 中継機＆ギガビットAP',
      ko: 'AX3000 듀얼밴드 Wi-Fi 6 증폭기 및 기가비트 확장기',
      ar: 'مقوي شبكة Wi-Fi 6 AX3000 ثنائي النطاق بمنفذ جيجابت'
    }
  },
  {
    id: 'temu-gan-charger-140w',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'act882910',
    isSecretSearch: false,
    discountPct: 25,
    basePriceUsd: 34,
    minSpendUsd: 29,
    productName: {
      en: '140W GaN III 5-Port PD 3.1 Desktop Fast Charger Station',
      es: 'Estación de Carga Rápida GaN III 140W PD 3.1 de 5 Puertos',
      de: '140W GaN III 5-Port PD 3.1 Desktop-Schnellladestation',
      fr: 'Station de Charge Rapide GaN III 140W PD 3.1 à 5 Ports',
      pt: 'Estação Carregador Rápido GaN III 140W PD 3.1 com 5 Portas',
      it: 'Stazione di Ricarica Rapida GaN III 140W PD 3.1 a 5 Porte',
      nl: '140W GaN III 5-Poorts PD 3.1 Snellader Desktopstation',
      pl: 'Stacja Ładująca GaN III 140W PD 3.1 5 Portów USB-C',
      ja: '140W GaN III 5ポート PD 3.1 デスクトップ急速充電ステーション',
      ko: '140W GaN III 5포트 PD 3.1 초고속 데스크탑 멀티 충전기',
      ar: 'محطة شحن سريع GaN III بقدرة 140 واط و5 منافذ PD 3.1'
    }
  },
  {
    id: 'temu-zigbee-hub',
    store: 'temu',
    category: 'smart-home',
    code: 'afh339102',
    isSecretSearch: false,
    discountPct: 30,
    basePriceUsd: 22,
    minSpendUsd: 20,
    productName: {
      en: 'Matter & Zigbee 3.0 Smart Home Multi-Mode Gateway Bridge',
      es: 'Hub Gateway Inteligente Multimodo Matter y Zigbee 3.0',
      de: 'Matter & Zigbee 3.0 Smart Home Multi-Mode Gateway Hub',
      fr: 'Passerelle Domotique Multimode Matter & Zigbee 3.0',
      pt: 'Hub Gateway Casa Inteligente Multimodo Matter e Zigbee 3.0',
      it: 'Gateway Smart Home Multimodale Matter e Zigbee 3.0',
      nl: 'Matter & Zigbee 3.0 Smart Home Multi-Mode Gateway Bridge',
      pl: 'Bramka Smart Home Matter i Zigbee 3.0 Multi-Mode Hub',
      ja: 'Matter & Zigbee 3.0 スマートホーム マルチモード ゲートウェイ',
      ko: 'Matter 및 Zigbee 3.0 스마트홈 멀티모드 게이트웨이 허브',
      ar: 'بوابة منزل ذكي متعددة الأوضاع تدعم Matter و Zigbee 3.0'
    }
  },
  {
    id: 'temu-attack-shark-x3',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'claimcredit',
    isSecretSearch: true,
    discountPct: 38,
    basePriceUsd: 31,
    minSpendUsd: 25,
    productName: {
      en: 'Attack Shark X3 PAW3395 Ultra-Light 49g Wireless Gaming Mouse',
      es: 'Mouse Gaming Inalámbrico Attack Shark X3 PAW3395 Ultraligero 49g',
      de: 'Attack Shark X3 PAW3395 Ultraleichte 49g Gaming-Maus',
      fr: 'Souris Gaming Sans Fil Attack Shark X3 PAW3395 Ultra-Légère 49g',
      pt: 'Mouse Gamer Sem Fio Attack Shark X3 PAW3395 Ultraleve 49g',
      it: 'Mouse Gaming Wireless Attack Shark X3 PAW3395 Ultraleggero 49g',
      nl: 'Attack Shark X3 PAW3395 Ultralichte 49g Draadloze Gamingmuis',
      pl: 'Mysz Gamingowa Bezprzewodowa Attack Shark X3 PAW3395 49g',
      ja: 'Attack Shark X3 PAW3395 超軽量49g ワイヤレスゲーミングマウス',
      ko: '어택샤크 X3 PAW3395 초경량 49g 유무선 게이밍 마우스',
      ar: 'ماوس ألعاب لاسلكي Attack Shark X3 بمستشعر PAW3395 ووزن 49 جرام'
    }
  },
  {
    id: 'temu-nvme-enclosure',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'acv991042',
    isSecretSearch: false,
    discountPct: 25,
    basePriceUsd: 19,
    minSpendUsd: 15,
    productName: {
      en: '40Gbps USB4 M.2 NVMe Aluminum SSD Enclosure with Cooling Fan',
      es: 'Carcasa M.2 NVMe USB4 40Gbps de Aluminio con Ventilador Activo',
      de: '40Gbps USB4 M.2 NVMe Aluminium SSD-Gehäuse mit Lüfter',
      fr: 'Boîtier SSD M.2 NVMe USB4 40Gbps en Aluminium avec Ventilateur',
      pt: 'Case SSD M.2 NVMe USB4 40Gbps em Alumínio com Cooler',
      it: 'Case SSD M.2 NVMe USB4 40Gbps in Alluminio con Ventola',
      nl: '40Gbps USB4 M.2 NVMe Aluminium SSD-Behuizing met Koelventilator',
      pl: 'Obudowa SSD M.2 NVMe USB4 40Gbps Aluminiowa z Wentylatorem',
      ja: '40Gbps USB4 M.2 NVMe アルミ製SSD外付けケース（冷却ファン搭載）',
      ko: '40Gbps USB4 M.2 NVMe 알루미늄 외장 SSD 케이스 (쿨링팬 내장)',
      ar: 'حاوية أقراص M.2 NVMe بسرعة 40Gbps من الألمنيوم مع مروحة تبريد'
    }
  },
  {
    id: 'temu-smart-plug-energy',
    store: 'temu',
    category: 'smart-home',
    code: 'frp204918',
    isSecretSearch: false,
    discountPct: 32,
    basePriceUsd: 24,
    minSpendUsd: 20,
    productName: {
      en: '4-Pack 20A Smart Wi-Fi Plugs with Real-Time Power Monitoring',
      es: 'Pack de 4 Enchufes Inteligentes Wi-Fi 20A con Medidor de Consumo',
      de: '4er-Pack 20A WLAN-Steckdosen mit Stromverbrauchsmessung',
      fr: 'Pack de 4 Prises Connectées Wi-Fi 20A avec Suivi Conso',
      pt: 'Kit 4 Tomadas Inteligentes Wi-Fi 20A com Medidor de Energia',
      it: 'Set 4 Prese Smart Wi-Fi 20A con Monitoraggio Consumi',
      nl: '4-Pack 20A Slimme Wi-Fi Stekkers met Energiemeter',
      pl: 'Zestaw 4 Inteligentnych Gniazdek Wi-Fi 20A z Pomiarami Energii',
      ja: '20A スマートWi-Fiプラグ 4個セット（リアルタイム電力モニタリング付）',
      ko: '20A 스마트 Wi-Fi 플러그 4팩 (실시간 전력 측정 지원)',
      ar: 'مجموعة 4 مقابس ذكية Wi-Fi بقدرة 20 أمبير مع مراقبة استهلاك الطاقة'
    }
  },
  {
    id: 'temu-magsafe-cooler',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'freebie777',
    isSecretSearch: true,
    discountPct: 45,
    basePriceUsd: 18,
    minSpendUsd: 15,
    productName: {
      en: 'Magnetic Semiconductor Peltier Phone Cooler 27W for Mobile Gaming',
      es: 'Cooler Magnético Semiconductor Peltier 27W para Gaming Móvil',
      de: 'Magnetischer 27W Peltier-Halbleiter-Handykühler für Mobile Gaming',
      fr: 'Refroidisseur Magnétique Peltier 27W pour Smartphone Gaming',
      pt: 'Cooler Magnético Semicondutor Peltier 27W para Celular Gamer',
      it: 'Dissipatore Magnetico Peltier 27W per Smartphone Gaming',
      nl: 'Magnetische 27W Peltier Telefoonkoeler voor Mobiel Gamen',
      pl: 'Magnetyczne Chłodzenie Półprzewodnikowe Peltier 27W do Telefonu',
      ja: '27W ペルチェ素子 マグネット式スマホ冷却クーラー（モバイルゲーム用）',
      ko: '27W 펠티어 반도체 맥세이프 스마트폰 쿨러 (모바일 게이밍용)',
      ar: 'مبرد هاتف مغناطيسي بتقنية Peltier بقدرة 27 واط للألعاب'
    }
  },
  {
    id: 'temu-25g-switch',
    store: 'temu',
    category: 'redes-wifi',
    code: 'ack771029',
    isSecretSearch: false,
    discountPct: 28,
    basePriceUsd: 49,
    minSpendUsd: 40,
    productName: {
      en: '8-Port 2.5GbE Unmanaged Network Switch + 10G SFP+ Uplink',
      es: 'Switch de Red 8 Puertos 2.5GbE + Puerto 10G SFP+ Caja Metálica',
      de: '8-Port 2.5GbE Netzwerk-Switch + 10G SFP+ Uplink Metallgehäuse',
      fr: 'Switch Réseau 8 Ports 2.5GbE + Port 10G SFP+ Boîtier Métal',
      pt: 'Switch de Rede 8 Portas 2.5GbE + Uplink 10G SFP+ Metálico',
      it: 'Switch di Rete 8 Porte 2.5GbE + Uplink 10G SFP+ in Metallo',
      nl: '8-Poorts 2.5GbE Netwerk Switch + 10G SFP+ Uplink',
      pl: 'Switch Sieciowy 8 Portów 2.5GbE + Uplink 10G SFP+ Metalowy',
      ja: '8ポート 2.5GbE アンマネージドスイッチ + 10G SFP+ アップリンク',
      ko: '8포트 2.5GbE 비관리형 네트워크 스위치 + 10G SFP+ 업링크',
      ar: 'موزع شبكة 8 منافذ 2.5GbE مع منفذ 10G SFP+ بهيكل معدني'
    }
  },
  {
    id: 'temu-portable-monitor',
    store: 'temu',
    category: 'tech-gadgets',
    code: 'reward777',
    isSecretSearch: true,
    discountPct: 35,
    basePriceUsd: 79,
    minSpendUsd: 60,
    productName: {
      en: '15.6" 1080P IPS 144Hz Portable Gaming Monitor USB-C & Mini HDMI',
      es: 'Monitor Portátil Gaming 15.6" IPS 144Hz USB-C y Mini HDMI',
      de: '15,6" 1080P IPS 144Hz Tragbarer Gaming-Monitor USB-C & HDMI',
      fr: 'Écran Portable Gaming 15,6" IPS 144Hz USB-C & Mini HDMI',
      pt: 'Monitor Portátil Gamer 15.6" IPS 144Hz USB-C e Mini HDMI',
      it: 'Monitor Portatile Gaming 15.6" IPS 144Hz USB-C e Mini HDMI',
      nl: '15.6" 1080P IPS 144Hz Draagbare Gaming Monitor USB-C',
      pl: 'Monitor Przenośny Gamingowy 15.6" IPS 144Hz USB-C i Mini HDMI',
      ja: '15.6インチ 144Hz IPS ポータブルゲーミングモニター USB-C対応',
      ko: '15.6인치 144Hz IPS 휴대용 게이밍 포터블 모니터 USB-C',
      ar: 'شاشة ألعاب محمولة 15.6 بوصة IPS بتردد 144Hz ومنفذ USB-C'
    }
  },
  {
    id: 'temu-fifine-mic',
    store: 'temu',
    category: 'perifericos-gaming',
    code: 'acp551920',
    isSecretSearch: false,
    discountPct: 26,
    basePriceUsd: 38,
    minSpendUsd: 30,
    productName: {
      en: 'Dynamic XLR/USB Streaming Microphone with Boom Arm & Mute',
      es: 'Micrófono Dinámico XLR/USB para Streaming con Brazo Articulado',
      de: 'Dynamisches XLR/USB-Streaming-Mikrofon inkl. Mikrofonarm',
      fr: 'Microphone Dynamique XLR/USB Streaming avec Bras Articulé',
      pt: 'Microfone Dinâmico XLR/USB para Streaming com Braço Articulado',
      it: 'Microfono Dinamico XLR/USB da Streaming con Braccio Regolabile',
      nl: 'Dynamische XLR/USB Streaming Microfoon met Microfoonarm',
      pl: 'Mikrofon Dynamiczny XLR/USB do Streamingu z Ramieniem',
      ja: 'XLR/USB ダイナミック配信マイク ブームアーム＆ミュート機能付き',
      ko: 'XLR/USB 겸용 다이나믹 스트리밍 마이크 및 마이크 암 세트',
      ar: 'ميكروفون بث ديناميكي XLR/USB مع ذراع حامل وزر كتم الصوت'
    }
  },
  {
    id: 'temu-mmwave-sensor',
    store: 'temu',
    category: 'smart-home',
    code: 'acx440192',
    isSecretSearch: false,
    discountPct: 22,
    basePriceUsd: 17,
    minSpendUsd: 15,
    productName: {
      en: '24GHz mmWave Human Presence Radar Sensor (Zigbee / Home Assistant)',
      es: 'Sensor Radar de Presencia Humana mmWave 24GHz (Zigbee / Home Assistant)',
      de: '24GHz mmWave Präsenzmelder Radarsensor (Zigbee / Home Assistant)',
      fr: 'Capteur de Présence Humaine Radar mmWave 24GHz (Zigbee)',
      pt: 'Sensor Radar de Presença Humana mmWave 24GHz (Zigbee)',
      it: 'Sensore Radar di Presenza Umana mmWave 24GHz (Zigbee)',
      nl: '24GHz mmWave Aanwezigheidssensor Radar (Zigbee / Home Assistant)',
      pl: 'Czujnik Obecności Radarowy mmWave 24GHz (Zigbee / Home Assistant)',
      ja: '24GHz ミリ波 人感プレゼンスセンサー（Zigbee / Home Assistant対応）',
      ko: '24GHz mmWave 재실 감지 레이더 센서 (지그비 / 홈어시스턴트 호환)',
      ar: 'مستشعر رادار حضور بشري 24GHz mmWave متوافق مع Zigbee'
    }
  },
  {
    id: 'temu-240w-cable-kit',
    store: 'temu',
    category: 'accesorios-moviles',
    code: 'acu309184',
    isSecretSearch: false,
    discountPct: 33,
    basePriceUsd: 14,
    minSpendUsd: 12,
    productName: {
      en: '240W USB4 Braided Type-C Cable with Real-Time LED Wattage Display',
      es: 'Cable USB4 Trenzado 240W Tipo-C con Pantalla LED de Vatios en Vivo',
      de: '240W USB4 Geflochtenes USB-C-Kabel mit LED-Leistungsanzeige',
      fr: 'Câble USB4 Tressé 240W USB-C avec Écran LED de Puissance',
      pt: 'Cabo USB4 Trançado 240W Tipo-C com Display LED de Potência',
      it: 'Cavo USB4 Intrecciato 240W USB-C con Display LED Watt',
      nl: '240W USB4 Gevlochten USB-C Kabel met LED Wattage Display',
      pl: 'Kabel USB4 w Oplocie 240W USB-C z Wyświetlaczem Mocy LED',
      ja: '240W USB4 編み込み式 Type-Cケーブル LEDワット数リアルタイム表示付',
      ko: '240W USB4 패브릭 C타입 케이블 실시간 LED 전력 표시창 탑재',
      ar: 'كابل USB4 مضفر بقدرة 240 واط مع شاشة LED لقراءة الطاقة'
    }
  },

  // ALIEXPRESS (15 items)
  {
    id: 'ali-gamesir-t4-cyclone',
    store: 'aliexpress',
    category: 'perifericos-gaming',
    code: 'ALIGAME15',
    isSecretSearch: false,
    discountPct: 28,
    basePriceUsd: 46,
    minSpendUsd: 35,
    productName: {
      en: 'GameSir Cyclone Pro Multi-Platform Wireless Controller (Hall Triggers)',
      es: 'Control Inalámbrico GameSir Cyclone Pro Multiplataforma (Gatillos Hall)',
      de: 'GameSir Cyclone Pro Kabelloser Multi-Plattform-Controller',
      fr: 'Manette Sans Fil Multiplateforme GameSir Cyclone Pro (Effet Hall)',
      pt: 'Controle Sem Fio GameSir Cyclone Pro Multiplataforma (Gatilhos Hall)',
      it: 'Controller Wireless GameSir Cyclone Pro Multi-Piattaforma',
      nl: 'GameSir Cyclone Pro Draadloze Multi-Platform Controller',
      pl: 'Kontroler Bezprzewodowy GameSir Cyclone Pro (Czujniki Halla)',
      ja: 'GameSir Cyclone Pro マルチプラットフォーム ホール効果ワイヤレスコントローラー',
      ko: 'GameSir 사이클론 프로 멀티플랫폼 무선 홀이펙트 컨트롤러',
      ar: 'يد تحكم لاسلكية GameSir Cyclone Pro متعددة المنصات بتقنية Hall'
    }
  },
  {
    id: 'ali-minipc-n100',
    store: 'aliexpress',
    category: 'tech-gadgets',
    code: 'CHOICE30',
    isSecretSearch: false,
    discountPct: 24,
    basePriceUsd: 135,
    minSpendUsd: 110,
    productName: {
      en: 'Intel Alder Lake N100 Mini PC 16GB DDR5 512GB NVMe Dual 2.5G LAN',
      es: 'Mini PC Intel Alder Lake N100 16GB DDR5 512GB NVMe Doble LAN 2.5G',
      de: 'Intel Alder Lake N100 Mini-PC 16GB DDR5 512GB NVMe Dual 2.5G LAN',
      fr: 'Mini PC Intel Alder Lake N100 16Go DDR5 512Go NVMe Double LAN 2.5G',
      pt: 'Mini PC Intel Alder Lake N100 16GB DDR5 512GB NVMe Dual LAN 2.5G',
      it: 'Mini PC Intel Alder Lake N100 16GB DDR5 512GB NVMe Dual LAN 2.5G',
      nl: 'Intel Alder Lake N100 Mini-PC 16GB DDR5 512GB NVMe Dual 2.5G LAN',
      pl: 'Mini PC Intel Alder Lake N100 16GB DDR5 512GB NVMe Dual LAN 2.5G',
      ja: 'Intel N100 ミニPC 16GB DDR5 512GB NVMe デュアル2.5G LAN搭載',
      ko: '인텔 N100 미니 PC 16GB DDR5 512GB NVMe 듀얼 2.5G 랜 탑재',
      ar: 'حاسوب مصغر Intel N100 بذاكرة 16GB DDR5 و 512GB NVMe ومنفذي 2.5G'
    }
  },
  {
    id: 'ali-glinet-mt3000',
    store: 'aliexpress',
    category: 'redes-wifi',
    code: 'ALINET20',
    isSecretSearch: false,
    discountPct: 22,
    basePriceUsd: 78,
    minSpendUsd: 65,
    productName: {
      en: 'GL.iNet GL-MT3000 (Beryl AX) Pocket Wi-Fi 6 Travel Router OpenWrt',
      es: 'Router de Viaje Wi-Fi 6 GL.iNet GL-MT3000 (Beryl AX) OpenWrt VPN',
      de: 'GL.iNet GL-MT3000 (Beryl AX) Wi-Fi 6 Reiserouter mit OpenWrt',
      fr: 'Routeur de Voyage Wi-Fi 6 GL.iNet GL-MT3000 (Beryl AX) OpenWrt',
      pt: 'Roteador Portátil Wi-Fi 6 GL.iNet GL-MT3000 (Beryl AX) OpenWrt',
      it: 'Router da Viaggio Wi-Fi 6 GL.iNet GL-MT3000 (Beryl AX) OpenWrt',
      nl: 'GL.iNet GL-MT3000 (Beryl AX) Wi-Fi 6 Reisrouter met OpenWrt',
      pl: 'Router Podróżny Wi-Fi 6 GL.iNet GL-MT3000 (Beryl AX) OpenWrt',
      ja: 'GL.iNet GL-MT3000 (Beryl AX) ポケット Wi-Fi 6 トラベルルーター OpenWrt',
      ko: 'GL.iNet GL-MT3000 (Beryl AX) 휴대용 Wi-Fi 6 여행용 공유기 OpenWrt',
      ar: 'راوتر سفر محمول GL.iNet GL-MT3000 Beryl AX يدعم Wi-Fi 6 و OpenWrt'
    }
  },
  {
    id: 'ali-baseus-powerbank',
    store: 'aliexpress',
    category: 'accesorios-moviles',
    code: 'ALIPOWER10',
    isSecretSearch: false,
    discountPct: 25,
    basePriceUsd: 44,
    minSpendUsd: 35,
    productName: {
      en: 'Baseus Blade 100W 20000mAh Ultra-Thin Laptop PD Power Bank',
      es: 'Batería Externa Baseus Blade 100W 20000mAh Ultradelgada para Laptop',
      de: 'Baseus Blade 100W 20000mAh Ultraflache Laptop-Powerbank',
      fr: 'Batterie Externe Baseus Blade 100W 20000mAh Ultra-Fine pour PC',
      pt: 'Power Bank Baseus Blade 100W 20000mAh Ultrafino para Notebook',
      it: 'Power Bank Baseus Blade 100W 20000mAh Ultrasottile per Notebook',
      nl: 'Baseus Blade 100W 20000mAh Ultradunne Laptop Powerbank',
      pl: 'Powerbank Baseus Blade 100W 20000mAh Ultracienki do Laptopa',
      ja: 'Baseus Blade 100W 20000mAh 超薄型ノートPC対応モバイルバッテリー',
      ko: '베이스어스 블레이드 100W 20000mAh 초슬림 노트북 보조배터리',
      ar: 'بنك طاقة نحيف Baseus Blade بقدرة 100 واط وسعة 20000mAh للحواسيب'
    }
  },
  {
    id: 'ali-sonoff-nspane',
    store: 'aliexpress',
    category: 'smart-home',
    code: 'SMARTHOME12',
    isSecretSearch: false,
    discountPct: 20,
    basePriceUsd: 56,
    minSpendUsd: 45,
    productName: {
      en: 'Sonoff NSPanel Pro Smart Home Touch Control Panel with Zigbee Hub',
      es: 'Panel Táctil Inteligente Sonoff NSPanel Pro con Hub Zigbee 3.0',
      de: 'Sonoff NSPanel Pro Smart-Home-Touchpanel mit Zigbee-Gateway',
      fr: 'Panneau Tactile Domotique Sonoff NSPanel Pro avec Hub Zigbee',
      pt: 'Painel Touch Casa Inteligente Sonoff NSPanel Pro com Hub Zigbee',
      it: 'Pannello Touch Smart Home Sonoff NSPanel Pro con Hub Zigbee',
      nl: 'Sonoff NSPanel Pro Smart Home Touchpaneel met Zigbee Hub',
      pl: 'Panel Dotykowy Smart Home Sonoff NSPanel Pro z Bramką Zigbee',
      ja: 'Sonoff NSPanel Pro スマートホーム タッチコントロールパネル Zigbee内蔵',
      ko: '손오프 NSPanel Pro 스마트홈 터치 월패드 (지그비 3.0 허브 내장)',
      ar: 'لوحة تحكم لمس ذكية Sonoff NSPanel Pro مع موزع Zigbee مدمج'
    }
  },
  {
    id: 'ali-8bitdo-ultimate',
    store: 'aliexpress',
    category: 'perifericos-gaming',
    code: 'GAMERPRO14',
    isSecretSearch: false,
    discountPct: 26,
    basePriceUsd: 48,
    minSpendUsd: 40,
    productName: {
      en: '8BitDo Ultimate 2.4G/Bluetooth Controller with Charging Dock',
      es: 'Control 8BitDo Ultimate 2.4G/Bluetooth con Base de Carga Magnética',
      de: '8BitDo Ultimate 2.4G/Bluetooth-Controller inkl. Ladestation',
      fr: 'Manette 8BitDo Ultimate 2.4G/Bluetooth avec Station de Charge',
      pt: 'Controle 8BitDo Ultimate 2.4G/Bluetooth com Base Carregadora',
      it: 'Controller 8BitDo Ultimate 2.4G/Bluetooth con Dock di Ricarica',
      nl: '8BitDo Ultimate 2.4G/Bluetooth Controller met Oplaaddock',
      pl: 'Kontroler 8BitDo Ultimate 2.4G/Bluetooth ze StacjąDokującą',
      ja: '8BitDo Ultimate 2.4G/Bluetooth コントローラー 充電ドック付き',
      ko: '8BitDo 얼티밋 2.4G/블루투스 무선 컨트롤러 및 충전 독 세트',
      ar: 'يد تحكم 8BitDo Ultimate لاسلكية مع قاعدة شحن مغناطيسية'
    }
  },
  {
    id: 'ali-ugreen-nas',
    store: 'aliexpress',
    category: 'tech-gadgets',
    code: 'TECHMEGA25',
    isSecretSearch: false,
    discountPct: 22,
    basePriceUsd: 118,
    minSpendUsd: 95,
    productName: {
      en: 'UGREEN Revodok Max 13-in-1 Thunderbolt 4 / USB4 Docking Station',
      es: 'Docking Station UGREEN Revodok Max 13-en-1 Thunderbolt 4 / USB4',
      de: 'UGREEN Revodok Max 13-in-1 Thunderbolt 4 / USB4 Dockingstation',
      fr: 'Station d’Accueil UGREEN Revodok Max 13-en-1 Thunderbolt 4 / USB4',
      pt: 'Docking Station UGREEN Revodok Max 13-em-1 Thunderbolt 4 / USB4',
      it: 'Docking Station UGREEN Revodok Max 13-in-1 Thunderbolt 4 / USB4',
      nl: 'UGREEN Revodok Max 13-in-1 Thunderbolt 4 / USB4 Dockingstation',
      pl: 'Stacja Dokująca UGREEN Revodok Max 13-w-1 Thunderbolt 4 / USB4',
      ja: 'UGREEN Revodok Max 13-in-1 Thunderbolt 4 / USB4 ドッキングステーション',
      ko: '유그린 Revodok Max 13-in-1 썬더볼트 4 / USB4 도킹 스테이션',
      ar: 'قاعدة توصيل UGREEN Revodok Max 13 في 1 بمنفذ Thunderbolt 4'
    }
  },
  {
    id: 'ali-xiaomi-ax6000',
    store: 'aliexpress',
    category: 'redes-wifi',
    code: 'WIFI6MAX18',
    isSecretSearch: false,
    discountPct: 24,
    basePriceUsd: 84,
    minSpendUsd: 70,
    productName: {
      en: 'Xiaomi Router AX6000 Wi-Fi 6 Mesh 4x4 MIMO 2500M Gaming Port',
      es: 'Router Xiaomi AX6000 Wi-Fi 6 Mesh 4x4 MIMO con Puerto Gaming 2.5G',
      de: 'Xiaomi Router AX6000 Wi-Fi 6 Mesh 4x4 MIMO mit 2.5G Gaming-Port',
      fr: 'Routeur Xiaomi AX6000 Wi-Fi 6 Mesh 4x4 MIMO Port Gaming 2.5G',
      pt: 'Roteador Xiaomi AX6000 Wi-Fi 6 Mesh 4x4 MIMO Porta Gamer 2.5G',
      it: 'Router Xiaomi AX6000 Wi-Fi 6 Mesh 4x4 MIMO Porta Gaming 2.5G',
      nl: 'Xiaomi Router AX6000 Wi-Fi 6 Mesh 4x4 MIMO met 2.5G Poort',
      pl: 'Router Xiaomi AX6000 Wi-Fi 6 Mesh 4x4 MIMO Port Gaming 2.5G',
      ja: 'Xiaomi ルーター AX6000 Wi-Fi 6 メッシュ対応 2.5Gゲーミングポート搭載',
      ko: '샤오미 AX6000 Wi-Fi 6 메시 공유기 4x4 MIMO 2.5G 포트 탑재',
      ar: 'راوتر Xiaomi AX6000 يدعم Wi-Fi 6 Mesh مع منفذ ألعاب 2.5G'
    }
  },
  {
    id: 'ali-aqara-fp2',
    store: 'aliexpress',
    category: 'smart-home',
    code: 'AQARA10OFF',
    isSecretSearch: false,
    discountPct: 21,
    basePriceUsd: 59,
    minSpendUsd: 50,
    productName: {
      en: 'Aqara Presence Sensor FP2 Multi-Zone mmWave Radar HomeKit',
      es: 'Sensor de Presencia Aqara FP2 Radar mmWave Multizona HomeKit',
      de: 'Aqara Präsenzmelder FP2 Multi-Zonen mmWave-Radar Apple HomeKit',
      fr: 'Capteur de Présence Aqara FP2 Radar mmWave Multizone HomeKit',
      pt: 'Sensor de Presença Aqara FP2 Radar mmWave Multizona HomeKit',
      it: 'Sensore di Presenza Aqara FP2 Radar mmWave Multizona HomeKit',
      nl: 'Aqara FP2 Aanwezigheidssensor Multi-Zone mmWave Radar HomeKit',
      pl: 'Czujnik Obecności Aqara FP2 Radar mmWave Wielostrefowy HomeKit',
      ja: 'Aqara FP2 ミリ波レーダー マルチゾーン人感センサー HomeKit対応',
      ko: '아카라 FP2 멀티존 mmWave 레이더 재실 센서 (애플 홈킷 지원)',
      ar: 'مستشعر حضور Aqara FP2 متعدد المناطق بتقنية mmWave ودعم HomeKit'
    }
  },
  {
    id: 'ali-anker-ganprime',
    store: 'aliexpress',
    category: 'accesorios-moviles',
    code: 'FASTGAN08',
    isSecretSearch: false,
    discountPct: 23,
    basePriceUsd: 36,
    minSpendUsd: 28,
    productName: {
      en: '3-in-1 Qi2 15W Foldable Magnetic Wireless Travel Charging Pad',
      es: 'Cargador Inalámbrico Magnético Plegable 3-en-1 Qi2 15W de Viaje',
      de: '3-in-1 Qi2 15W Faltbares Magnetisches Reise-Ladepad',
      fr: 'Chargeur Sans Fil Magnétique Pliable 3-en-1 Qi2 15W de Voyage',
      pt: 'Carregador Sem Fio Magnético Dobrável 3-em-1 Qi2 15W Portátil',
      it: 'Caricatore Wireless Magnetico Pieghevole 3-in-1 Qi2 15W da Viaggio',
      nl: '3-in-1 Qi2 15W Opvouwbare Magnetische Draadloze Reisoplader',
      pl: 'Składana Ładowarka Indukcyjna Magnetyczna 3-w-1 Qi2 15W Podróżna',
      ja: '3-in-1 Qi2 15W 折りたたみ式 マグネットワイヤレス充電パッド（旅行用）',
      ko: '3-in-1 Qi2 15W 접이식 맥세이프 무선 트래블 멀티 충전 패드',
      ar: 'شاحن لاسلكي مغناطيسي قابل للطي 3 في 1 بمعيار Qi2 بقدرة 15 واط'
    }
  },
  {
    id: 'ali-epomaker-aula',
    store: 'aliexpress',
    category: 'perifericos-gaming',
    code: 'KEYMECH12',
    isSecretSearch: false,
    discountPct: 25,
    basePriceUsd: 52,
    minSpendUsd: 40,
    productName: {
      en: 'Epomaker Hall Effect Magnetic Switch Rapid Trigger 60% Keyboard',
      es: 'Teclado Magnético Hall Effect Epomaker 60% con Rapid Trigger 8KHz',
      de: 'Epomaker Hall-Effekt Magnetische Rapid-Trigger 60% Gaming-Tastatur',
      fr: 'Clavier Magnétique Hall Effect Epomaker 60% Rapid Trigger 8KHz',
      pt: 'Teclado Magnético Hall Effect Epomaker 60% com Rapid Trigger 8KHz',
      it: 'Tastiera Magnetica Hall Effect Epomaker 60% con Rapid Trigger 8KHz',
      nl: 'Epomaker Hall-Effect Magnetisch Rapid Trigger 60% Toetsenbord',
      pl: 'Klawiatura Magnetyczna Hall Effect Epomaker 60% Rapid Trigger 8KHz',
      ja: 'Epomaker ホール効果 磁気スイッチ ラピッドトリガー対応 60%キーボード',
      ko: 'Epomaker 홀이펙트 자석축 래피드 트리거 60% 게이밍 키보드',
      ar: 'لوحة مفاتيح مغناطيسية Epomaker 60% بخاصية Rapid Trigger وتردد 8KHz'
    }
  },
  {
    id: 'ali-trimui-smart-pro',
    store: 'aliexpress',
    category: 'tech-gadgets',
    code: 'HANDHELD15',
    isSecretSearch: false,
    discountPct: 29,
    basePriceUsd: 55,
    minSpendUsd: 45,
    productName: {
      en: 'Trimui Smart Pro 4.96" IPS Linux Open-Source Retro Handheld Console',
      es: 'Consola Portátil Trimui Smart Pro 4.96" IPS Linux Open-Source',
      de: 'Trimui Smart Pro 4,96" IPS Linux Open-Source Retro-Handheld',
      fr: 'Console Portable Trimui Smart Pro 4,96" IPS Linux Open-Source',
      pt: 'Console Portátil Trimui Smart Pro 4.96" IPS Linux Open-Source',
      it: 'Console Portatile Trimui Smart Pro 4.96" IPS Linux Open-Source',
      nl: 'Trimui Smart Pro 4.96" IPS Linux Open-Source Handheld Console',
      pl: 'Konsola Przenośna Trimui Smart Pro 4.96" IPS Linux Open-Source',
      ja: 'Trimui Smart Pro 4.96インチ IPS Linux オープンソース携帯ゲーム機',
      ko: '트림유아이 스마트 프로 4.96인치 IPS 리눅스 오픈소스 휴대용 게임기',
      ar: 'جهاز ألعاب محمول Trimui Smart Pro بشاشة 4.96 بوصة IPS ونظام Linux'
    }
  },
  {
    id: 'ali-wavlink-outdoor-wifi',
    store: 'aliexpress',
    category: 'redes-wifi',
    code: 'MESHNET16',
    isSecretSearch: false,
    discountPct: 24,
    basePriceUsd: 62,
    minSpendUsd: 50,
    productName: {
      en: 'WAVLINK Outdoor AX3000 Wi-Fi 6 Weatherproof PoE Access Point',
      es: 'Punto de Acceso Exterior WAVLINK AX3000 Wi-Fi 6 Impermeable PoE',
      de: 'WAVLINK Outdoor AX3000 Wi-Fi 6 Wetterfester PoE Access Point',
      fr: 'Point d’Accès Extérieur WAVLINK AX3000 Wi-Fi 6 Étanche PoE',
      pt: 'Access Point Externo WAVLINK AX3000 Wi-Fi 6 à Prova d’Água PoE',
      it: 'Access Point da Esterno WAVLINK AX3000 Wi-Fi 6 Impermeabile PoE',
      nl: 'WAVLINK Outdoor AX3000 Wi-Fi 6 Weerbestendig PoE Access Point',
      pl: 'Zewnętrzny Punkt Dostępowy WAVLINK AX3000 Wi-Fi 6 PoE Wodoodporny',
      ja: 'WAVLINK 屋外用 AX3000 Wi-Fi 6 防水 PoE アクセスポイント',
      ko: 'WAVLINK 실외용 AX3000 Wi-Fi 6 방수 PoE 무선 액세스 포인트',
      ar: 'نقطة وصول خارجية WAVLINK AX3000 Wi-Fi 6 مقاومة للعوامل الجوية PoE'
    }
  },
  {
    id: 'ali-moondrop-iem',
    store: 'aliexpress',
    category: 'accesorios-moviles',
    code: 'AUDIOHIFI09',
    isSecretSearch: false,
    discountPct: 20,
    basePriceUsd: 39,
    minSpendUsd: 30,
    productName: {
      en: 'Hi-Res Dual-Cavity Planar / Dynamic In-Ear Monitor IEM with USB-C DSP',
      es: 'Audífonos In-Ear Monitor Hi-Res Doble Cavidad con Cable USB-C DSP',
      de: 'Hi-Res Dual-Cavity In-Ear-Monitore (IEM) mit USB-C DSP-Kabel',
      fr: 'Écouteurs Intra-Auriculaires Hi-Res IEM avec Câble USB-C DSP',
      pt: 'Fone In-Ear Monitor Hi-Res Dupla Cavidade com Cabo USB-C DSP',
      it: 'Auricolari In-Ear Monitor Hi-Res Doppia Cavità con Cavo USB-C DSP',
      nl: 'Hi-Res Dual-Cavity In-Ear Monitors (IEM) met USB-C DSP Kabel',
      pl: 'Słuchawki Dokanałowe Hi-Res IEM z Kablem USB-C DSP',
      ja: 'ハイレゾ対応 デュアルキャビティ カナル型IEMモニターイヤホン USB-C DSP搭載',
      ko: 'Hi-Res 듀얼 캐비티 인이어 모니터 이어폰(IEM) USB-C DSP 케이블 포함',
      ar: 'سماعات أذن احترافية Hi-Res IEM ثنائية التجويف مع كابل USB-C DSP'
    }
  },
  {
    id: 'ali-tuya-Curtain-motor',
    store: 'aliexpress',
    category: 'smart-home',
    code: 'SMARTBOT11',
    isSecretSearch: false,
    discountPct: 27,
    basePriceUsd: 41,
    minSpendUsd: 32,
    productName: {
      en: 'Smart Automatic Curtain Robot Motor Track Driver with Solar Panel',
      es: 'Motor Robot Inteligente para Cortinas con Panel Solar y Control Voz',
      de: 'Smarter Vorhang-Roboter-Motor inkl. Solarpanel & Sprachsteuerung',
      fr: 'Moteur Robot Rideau Connecté Intelligent avec Panneau Solaire',
      pt: 'Motor Robô Inteligente para Cortinas com Painel Solar e Voz',
      it: 'Motore Robot Smart per Tende con Pannello Solare e Controllo Vocale',
      nl: 'Slimme Gordijnrobot Motor met Zonnepaneel & Spraakbediening',
      pl: 'Inteligentny Robot do Zasłon i Firank z Panelem Słonecznym',
      ja: 'スマート自動カーテンロボットモーター ソーラーパネル＆音声操作対応',
      ko: '스마트 자동 커튼 로봇 모터 (태양광 충전 패널 및 음성 제어 포함)',
      ar: 'محرك ستائر ذكي أوتوماتيكي مع لوحة طاقة شمسية وتحكم صوتي'
    }
  }
];

export function getCouponsForLocale(localeCode, { storeFilter = null, categoryFilter = null } = {}) {
  const localeConfig = getLocaleConfig(localeCode);
  const langKey = localeConfig.lang;

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

  const allItems = [...customItems, ...HARDWARE_ITEMS];

  return allItems.filter((item) => {
    if (storeFilter && item.store !== storeFilter) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  }).map((item) => {
    const title = item.productName?.[langKey] || item.productName?.en || item.title;
    const discountedUsd = Math.round(item.basePriceUsd * (1 - item.discountPct / 100));
    const localPrice = formatLocalPrice(discountedUsd, localeConfig);
    const localOriginalPrice = formatLocalPrice(item.basePriceUsd, localeConfig);
    const localMinSpend = formatLocalPrice(item.minSpendUsd, localeConfig);
    const numericPrice = Math.max(1, Math.round(discountedUsd * localeConfig.rate));

    const affiliateLink = item.customAffiliateUrl
      ? item.customAffiliateUrl
      : item.store === 'temu'
      ? (activeSettings.temuBaseTrackingUrl || 'https://www.temu.com')
      : (activeSettings.aliexpressBaseTrackingUrl || 'https://www.aliexpress.com');

    return {
      ...item,
      title,
      localPrice,
      localOriginalPrice,
      localMinSpend,
      numericPrice,
      currencyCode: localeConfig.currencyCode,
      categoryLabel: localeConfig.dict.categories[item.category] || item.category,
      affiliateLink
    };
  });
}
