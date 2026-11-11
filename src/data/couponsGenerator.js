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
 * 27-LANGUAGE COUPON LOCALIZATION ENGINE
 * Provides 100% native eligibility badges, coupon titles, and detailed product-coverage
 * descriptions across all 27 languages and 11 categories without falling back to English.
 */
const COUPON_LANG_TEMPLATES = {
  es: {
    allUsers: 'TODOS LOS USUARIOS',
    newUsers: 'NUEVOS USUARIOS APP / PAQUETE',
    aliTitle: (catName) => `Cupón Verificado para ${catName}`,
    temuTitle: (pct, catName) => `Cupón ${pct}% OFF en ${catName}`,
    coversPrefix: '¿Para qué sirve?:',
    catCovers: {
      'moda-ropa': 'Descuenta directo en vestidos, camisas, pantalones, zapatillas deportivas, bolsos, mochilas, lentes de sol y relojes.',
      'smart-home': 'Descuenta en cafeteras, freidoras de aire, utensilios de cocina, sábanas, organizadores de clóset, lámparas LED y aspiradoras.',
      'belleza-cuidado': 'Aplica en brochas, maquillaje, lámparas UV para uñas, secadores de pelo, planchas, rasuradoras eléctricas y cuidado facial.',
      'tech-gadgets': 'Aplica en Mini PCs, laptops, tablets, discos SSD, memoria RAM, proyectores portátiles, cámaras de seguridad y routers Wi-Fi.',
      'accesorios-moviles': 'Aplica en cargadores rápidos USB-C, baterías portátiles (Power Banks), audífonos inalámbricos, smartwatches, cables y fundas.',
      'perifericos-gaming': 'Aplica en controles para PC/Celular/Switch/PS5, consolas retro portátiles, teclados mecánicos, mouse gamer y diademas.',
      'herramientas-autos': 'Aplica en taladros inalámbricos, multímetros, escáneres automotrices OBD2, pantallas CarPlay, cámaras de reversa y luces LED.',
      'juguetes-hobbies': 'Aplica en drones con cámara, carros a control remoto, bloques de construcción, figuras de colección, peluches y juegos de mesa.',
      'deportes-outdoor': 'Aplica en accesorios de ciclismo, lámparas recargables, tiendas de campaña, pesca, bandas de ejercicio y ropa deportiva.',
      'mascotas': 'Aplica en dispensadores automáticos de comida y agua para perros y gatos, camas lavables, pecheras, collares, cepillos y juguetes.',
      'bebes-oficina': 'Aplica en ropa para bebé y niños, pañaleras, mochilas escolares, cuadernos, plumones, calculadoras y organizadores de oficina.'
    }
  },
  en: {
    allUsers: 'ALL USERS',
    newUsers: 'NEW APP USERS / BUNDLE',
    aliTitle: (catName) => `Verified Checkout Coupon for ${catName}`,
    temuTitle: (pct, catName) => `${pct}% OFF Coupon on ${catName}`,
    coversPrefix: 'What it covers:',
    catCovers: {
      'moda-ropa': 'Direct discount on dresses, shirts, pants, sneakers, handbags, backpacks, sunglasses, and watches.',
      'smart-home': 'Discounts coffee makers, air fryers, kitchenware, bedding, closet organizers, LED lamps, and vacuums.',
      'belleza-cuidado': 'Applies to makeup brushes, cosmetics, UV nail lamps, hair dryers, straighteners, electric shavers, and skincare.',
      'tech-gadgets': 'Applies to Mini PCs, laptops, tablets, SSDs, RAM, portable projectors, security cameras, and Wi-Fi routers.',
      'accesorios-moviles': 'Applies to fast USB-C chargers, power banks, wireless earbuds, smartwatches, cables, and phone cases.',
      'perifericos-gaming': 'Applies to PC/Mobile/Switch controllers, retro handheld consoles, mechanical keyboards, gaming mice, and headsets.',
      'herramientas-autos': 'Applies to cordless drills, multimeters, OBD2 car scanners, CarPlay screens, dashcams, and LED headlights.',
      'juguetes-hobbies': 'Applies to camera drones, RC cars, building block sets, action figures, plushies, and board games.',
      'deportes-outdoor': 'Applies to cycling gear, rechargeable headlamps, camping tents, fishing equipment, resistance bands, and activewear.',
      'mascotas': 'Applies to automatic pet feeders & water fountains, washable beds, harnesses, collars, grooming brushes, and pet toys.',
      'bebes-oficina': 'Applies to baby & kids clothing, diaper bags, school backpacks, notebooks, markers, calculators, and desk organizers.'
    }
  },
  pt: {
    allUsers: 'TODOS OS USUÁRIOS',
    newUsers: 'NOVOS USUÁRIOS APP / PACOTE',
    aliTitle: (catName) => `Cupom Verificado para ${catName}`,
    temuTitle: (pct, catName) => `Cupom ${pct}% OFF em ${catName}`,
    coversPrefix: 'Para que serve:',
    catCovers: {
      'moda-ropa': 'Desconto direto em vestidos, camisas, calças, tênis esportivos, bolsas, mochilas, óculos de sol e relógios.',
      'smart-home': 'Desconto em cafeteiras, air fryers, utensílios de cozinha, roupa de cama, organizadores, lâmpadas LED e aspiradores.',
      'belleza-cuidado': 'Válido para pincéis de maquiagem, cosméticos, cabines UV de unhas, secadores, pranchas, barbeadores e skincare.',
      'tech-gadgets': 'Válido para Mini PCs, notebooks, tablets, SSDs, memória RAM, projetores portáteis, câmeras Wi-Fi e roteadores.',
      'accesorios-moviles': 'Válido para carregadores rápidos USB-C, power banks, fones Bluetooth, smartwatches, cabos e capas de celular.',
      'perifericos-gaming': 'Válido para controles de PC/Celular/Switch, consoles portáteis retrô, teclados mecânicos, mouses gamer e headsets.',
      'herramientas-autos': 'Válido para parafusadeiras sem fio, multímetros, scanners automotivos OBD2, telas CarPlay, câmeras de ré e LEDs.',
      'juguetes-hobbies': 'Válido para drones com câmera, carros de controle remoto, blocos de montar, figuras de ação, pelúcias e jogos.',
      'deportes-outdoor': 'Válido para acessórios de ciclismo, lanternas recarregáveis, barracas de camping, pesca, elásticos de treino e academia.',
      'mascotas': 'Válido para comedouros automáticos e fontes para cães e gatos, camas laváveis, coleiras, peitorais, escovas e brinquedos.',
      'bebes-oficina': 'Válido para roupas de bebê e infantil, bolsas maternidade, mochilas escolares, cadernos, marcadores e escritório.'
    }
  },
  fr: {
    allUsers: 'TOUS LES UTILISATEURS',
    newUsers: 'NOUVEAUX UTILISATEURS APP / PACK',
    aliTitle: (catName) => `Code Promo Vérifié pour ${catName}`,
    temuTitle: (pct, catName) => `Coupon -${pct}% sur ${catName}`,
    coversPrefix: 'Produits éligibles :',
    catCovers: {
      'moda-ropa': 'Réduction directe sur robes, chemises, pantalons, baskets, sacs à main, sacs à dos, lunettes de soleil et montres.',
      'smart-home': 'Valable sur cafetières, friteuses sans huile, ustensiles de cuisine, literie, rangements, lampes LED et aspirateurs.',
      'belleza-cuidado': 'Valable sur pinceaux maquillage, cosmétiques, lampes UV ongles, sèche-cheveux, lisseurs, rasoirs et soins visage.',
      'tech-gadgets': 'Valable sur Mini PC, ordinateurs portables, tablettes, SSD, RAM, vidéoprojecteurs, caméras Wi-Fi et routeurs.',
      'accesorios-moviles': 'Valable sur chargeurs rapides GaN USB-C, batteries externes, écouteurs Bluetooth, montres connectées, câbles et coques.',
      'perifericos-gaming': 'Valable sur manettes PC/Mobile/Switch, consoles rétro portables, claviers mécaniques, souris gaming et casques.',
      'herramientas-autos': 'Valable sur perceuses sans fil, multimètres, valises diagnostic OBD2, écrans CarPlay, dashcams et ampoules LED.',
      'juguetes-hobbies': 'Valable sur drones avec caméra, voitures télécommandées, briques de construction, figurines, peluches et jeux.',
      'deportes-outdoor': 'Valable sur accessoires vélo, lampes frontales, tentes de camping, matériel de pêche, bandes fitness et vêtements sport.',
      'mascotas': 'Valable sur distributeurs automatiques pour chiens et chats, paniers lavables, harnais, laisses, brosses et jouets.',
      'bebes-oficina': 'Valable sur vêtements bébé et enfant, sacs à langer, sacs à dos scolaires, cahiers, feutres et fournitures de bureau.'
    }
  },
  de: {
    allUsers: 'ALLE NUTZER',
    newUsers: 'NEUE APP-NUTZER / PAKET',
    aliTitle: (catName) => `Geprüfter Gutschein für ${catName}`,
    temuTitle: (pct, catName) => `${pct}% Rabatt-Coupon auf ${catName}`,
    coversPrefix: 'Gilt für:',
    catCovers: {
      'moda-ropa': 'Direktrabatt auf Kleider, Hemden, Hosen, Sneaker, Handtaschen, Rucksäcke, Sonnenbrillen und Armbanduhren.',
      'smart-home': 'Rabatt auf Kaffeemaschinen, Heißluftfritteusen, Küchenhelfer, Bettwäsche, Organizer, LED-Lampen und Staubsauger.',
      'belleza-cuidado': 'Gilt für Make-up-Pinsel, Kosmetik, UV-Nagellampen, Haartrockner, Glätteisen, Elektrorasierer und Hautpflege.',
      'tech-gadgets': 'Gilt für Mini-PCs, Laptops, Tablets, SSDs, RAM, tragbare Beamer, Überwachungskameras und WLAN-Router.',
      'accesorios-moviles': 'Gilt für USB-C-Schnellladegeräte, Powerbanks, Bluetooth-Ohrhörer, Smartwatches, Ladekabel und Handyhüllen.',
      'perifericos-gaming': 'Gilt für PC-/Switch-/Mobile-Controller, Retro-Handhelds, mechanische Tastaturen, Gaming-Mäuse und Headsets.',
      'herramientas-autos': 'Gilt für Akkuschrauber, Multimeter, OBD2-Diagnosegeräte, CarPlay-Displays, Dashcams und LED-Scheinwerfer.',
      'juguetes-hobbies': 'Gilt für Kameradrohnen, RC-Autos, Klemmbausteine, Actionfiguren, Plüschtiere und Gesellschaftsspiele.',
      'deportes-outdoor': 'Gilt für Fahrradzubehör, Stirnlampen, Campingzelte, Angelausrüstung, Fitnessbänder und Sportbekleidung.',
      'mascotas': 'Gilt für Futterautomaten & Trinkbrunnen für Hunde und Katzen, Haustierbetten, Geschirre, Leinen und Spielzeug.',
      'bebes-oficina': 'Gilt für Baby- und Kinderkleidung, Wickeltaschen, Schulranzen, Notizbücher, Stifte und Büroorganisation.'
    }
  },
  it: {
    allUsers: 'TUTTI GLI UTENTI',
    newUsers: 'NUOVI UTENTI APP / PACCHETTO',
    aliTitle: (catName) => `Coupon Verificato per ${catName}`,
    temuTitle: (pct, catName) => `Coupon -${pct}% su ${catName}`,
    coversPrefix: 'Cosa copre:',
    catCovers: {
      'moda-ropa': 'Sconto diretto su abiti, camicie, pantaloni, sneaker, borse, zaini, occhiali da sole e orologi.',
      'smart-home': 'Sconta macchine da caffè, friggitrici ad aria, utensili da cucina, biancheria, organizer, lampade LED e aspirapolvere.',
      'belleza-cuidado': 'Valido su pennelli trucco, cosmetici, lampade UV unghie, asciugacapelli, piastre, rasoi elettrici e skincare.',
      'tech-gadgets': 'Valido su Mini PC, notebook, tablet, SSD, RAM, proiettori portatili, telecamere di sicurezza e router Wi-Fi.',
      'accesorios-moviles': 'Valido su caricatori rapidi USB-C, power bank, auricolari Bluetooth, smartwatch, cavi e cover per smartphone.',
      'perifericos-gaming': 'Valido su controller PC/Mobile/Switch, console portatili retrò, tastiere meccaniche, mouse da gaming e cuffie.',
      'herramientas-autos': 'Valido su trapani a batteria, multimetri, scanner auto OBD2, schermi CarPlay, dashcam e fari LED.',
      'juguetes-hobbies': 'Valido su droni con telecamera, auto RC, costruzioni a blocchi, action figure, peluche e giochi da tavolo.',
      'deportes-outdoor': 'Valido su accessori ciclismo, torce ricaricabili, tende da campeggio, pesca, bande elastiche e abbigliamento sportivo.',
      'mascotas': 'Valido su distributori automatici di cibo e acqua per cani e gatti, cucce lavabili, pettorine, guinzagli e giochi.',
      'bebes-oficina': 'Valido su abbigliamento neonati e bambini, borse cambio, zaini scuola, quaderni, pennarelli e articoli per ufficio.'
    }
  },
  nl: {
    allUsers: 'ALLE GEBRUIKERS',
    newUsers: 'NIEUWE APP-GEBRUIKERS / BUNDEL',
    aliTitle: (catName) => `Geverifieerde Kortingscode voor ${catName}`,
    temuTitle: (pct, catName) => `${pct}% Korting Coupon op ${catName}`,
    coversPrefix: 'Geldt voor:',
    catCovers: {
      'moda-ropa': 'Directe korting op jurken, shirts, broeken, sneakers, handtassen, rugzakken, zonnebrillen en horloges.',
      'smart-home': 'Korting op koffiemachines, airfryers, keukengerei, beddengoed, kastenorganizers, ledlampen en stofzuigers.',
      'belleza-cuidado': 'Geldt voor make-upkwasten, cosmetica, UV-nagellampen, föhns, stijltangen, elektrische scheerapparaten en huidverzorging.',
      'tech-gadgets': 'Geldt voor Mini-pc’s, laptops, tablets, SSD’s, RAM, draagbare beamers, beveiligingscamera’s en wifi-routers.',
      'accesorios-moviles': 'Geldt voor USB-C-snelladers, powerbanks, draadloze oordopjes, smartwatches, kabels en telefoonhoesjes.',
      'perifericos-gaming': 'Geldt voor pc-/mobiele/Switch-controllers, retro-handhelds, mechanische toetsenborden, gamingmuizen en headsets.',
      'herramientas-autos': 'Geldt voor accuboormachines, multimeters, OBD2-autoscanners, CarPlay-schermen, dashcams en ledverlichting.',
      'juguetes-hobbies': 'Geldt voor cameradrones, RC-auto’s, bouwstenen, actiefiguren, knuffels en bordspellen.',
      'deportes-outdoor': 'Geldt voor fietsaccessoires, oplaadbare hoofdlampen, kampeertenten, visspullen, weerstandsbanden en sportkleding.',
      'mascotas': 'Geldt voor automatische voerbakken en drinkfonteinen voor honden en katten, manden, tuigjes, riemen en speeltjes.',
      'bebes-oficina': 'Geldt voor baby- en kinderkleding, luiertassen, schooltassen, schriften, stiften en bureau-organizers.'
    }
  },
  pl: {
    allUsers: 'WSZYSCY UŻYTKOWNICY',
    newUsers: 'NOWI UŻYTKOWNICY APLIKACJI / PAKIET',
    aliTitle: (catName) => `Zweryfikowany Kupon na: ${catName}`,
    temuTitle: (pct, catName) => `Kupon -${pct}% na: ${catName}`,
    coversPrefix: 'Co obejmuje:',
    catCovers: {
      'moda-ropa': 'Bezpośredni rabat na sukienki, koszule, spodnie, buty sportowe, torebki, plecaki, okulary przeciwsłoneczne i zegarki.',
      'smart-home': 'Rabat na ekspresy do kawy, frytkownice beztłuszczowe, przybory kuchenne, pościel, organizery, lampy LED i odkurzacze.',
      'belleza-cuidado': 'Obejmuje pędzle do makijażu, kosmetyki, lampy UV do paznokci, suszarki, prostownice, golarki i pielęgnację twarzy.',
      'tech-gadgets': 'Obejmuje Mini PC, laptopy, tablety, dyski SSD, pamięć RAM, projektory przenośne, kamery Wi-Fi i routery.',
      'accesorios-moviles': 'Obejmuje szybkie ładowarki USB-C, powerbanki, słuchawki bezprzewodowe, smartwatche, kable i etui na telefon.',
      'perifericos-gaming': 'Obejmuje kontrolery do PC/Switch/telefonu, przenośne konsole retro, klawiatury mechaniczne, myszki i słuchawki.',
      'herramientas-autos': 'Obejmuje wkrętarki akumulatorowe, multimetry, skanery OBD2, ekrany CarPlay, wideorejestratory i oświetlenie LED.',
      'juguetes-hobbies': 'Obejmuje drony z kamerą, samochody RC, klocki konstrukcyjne, figurki kolekcjonerskie, pluszaki i gry planszowe.',
      'deportes-outdoor': 'Obejmuje akcesoria rowerowe, latarki czołowe, namioty kempingowe, sprzęt wędkarski, gumy oporowe i odzież sportową.',
      'mascotas': 'Obejmuje automatyczne karmniki i poidła dla psów i kotów, legowiska, szelki, smycze, szczotki i zabawki.',
      'bebes-oficina': 'Obejmuje ubranka niemowlęce i dziecięce, torby dla mam, plecaki szkolne, zeszyty, markery i artykuły biurowe.'
    }
  },
  ja: {
    allUsers: '全ユーザー対象',
    newUsers: 'アプリ新規 / クーポンパック',
    aliTitle: (catName) => `${catName} 向け公式割引クーポン`,
    temuTitle: (pct, catName) => `${catName} 対象 ${pct}% OFF クーポン`,
    coversPrefix: '対象商品：',
    catCovers: {
      'moda-ropa': 'ワンピース、シャツ、パンツ、スニーカー、バッグ、リュック、サングラス、腕時計に直接適用されます。',
      'smart-home': 'コーヒーメーカー、ノンフライヤー、調理器具、寝具、収納ボックス、LED照明、掃除機が割引対象です。',
      'belleza-cuidado': 'メイクブラシ、コスメ、UVネイルライト、ドライヤー、ヘアアイロン、電動シェーバー、スキンケア用品に対応。',
      'tech-gadgets': 'ミニPC、ノートPC、タブレット、SSD、メモリ、モバイルプロジェクター、防犯カメラ、Wi-Fiルーターに対応。',
      'accesorios-moviles': 'USB-C急速充電器、モバイルバッテリー、ワイヤレスイヤホン、スマートウォッチ、ケーブル、スマホケースに対応。',
      'perifericos-gaming': 'PC/Switch/スマホ対応コントローラー、レトロ携帯ゲーム機、メカニカルキーボード、ゲーミングマウスに対応。',
      'herramientas-autos': '電動ドリル、デジタルマルチメーター、OBD2診断機、CarPlayモニター、ドライブレコーダー、LEDライトに対応。',
      'juguetes-hobbies': 'カメラ付きドローン、RCカー、ブロック玩具、フィギュア、ぬいぐるみ、ボードゲームに対応。',
      'deportes-outdoor': '自転車アクセサリー、充電式ヘッドライト、キャンプ用テント、釣り具、トレーニングチューブ、スポーツウェアに対応。',
      'mascotas': '犬・猫用の自動給餌器・給水器、洗えるペットベッド、ハーネス、リード、グルーミングブラシ、おもちゃに対応。',
      'bebes-oficina': 'ベビー・キッズ服、マザーズバッグ、通学リュック、ノート、マーカー、電卓、デスク収納用品に対応。'
    }
  },
  ko: {
    allUsers: '모든 회원 사용 가능',
    newUsers: '앱 신규 회원 / 쿠폰팩',
    aliTitle: (catName) => `${catName} 전용 공식 할인 코드`,
    temuTitle: (pct, catName) => `${catName} ${pct}% 할인 쿠폰`,
    coversPrefix: '적용 대상:',
    catCovers: {
      'moda-ropa': '원피스, 셔츠, 바지, 운동화, 가방, 백팩, 선글라스, 시계 구매 시 즉시 할인됩니다.',
      'smart-home': '커피머신, 에어프라이어, 주방용품, 침구류, 수납 정리함, LED 조명, 무선 청소기에 적용됩니다.',
      'belleza-cuidado': '메이크업 브러시, 화장품, UV 네일 램프, 헤어드라이어, 고데기, 전기면도기, 스킨케어 용품에 적용됩니다.',
      'tech-gadgets': '미니 PC, 노트북, 태블릿, SSD, RAM, 미니 빔프로젝터, 홈카메라, Wi-Fi 공유기에 적용됩니다.',
      'accesorios-moviles': 'USB-C 고속 충전기, 보조배터리, 블루투스 이어폰, 스마트워치, 케이블, 휴대폰 케이스에 적용됩니다.',
      'perifericos-gaming': 'PC/모바일/스위치 게임패드, 레트로 휴대용 게임기, 기계식 키보드, 게이밍 마우스, 헤드셋에 적용됩니다.',
      'herramientas-autos': '무선 전동드릴, 멀티미터, OBD2 차량 스캐너, 카플레이 모니터, 블랙박스, 차량용 LED에 적용됩니다.',
      'juguetes-hobbies': '카메라 드론, RC카, 조립 블록, 피규어, 봉제인형, 보드게임 및 취미용품에 적용됩니다.',
      'deportes-outdoor': '자전거 용품, 충전식 헤드랜턴, 캠핑 텐트, 낚시 장비, 홈트레이닝 밴드, 스포츠웨어에 적용됩니다.',
      'mascotas': '강아지·고양이 자동 급식기 및 급수기, 애견 방석, 하네스, 목줄, 브러시, 장난감에 적용됩니다.',
      'bebes-oficina': '유아 및 아동복, 기저귀 가방, 책가방, 노트, 마커펜, 계산기, 데스크 정리용품에 적용됩니다.'
    }
  },
  ar: {
    allUsers: 'لجميع المستخدمين',
    newUsers: 'مستخدمي التطبيق الجدد / حزمة',
    aliTitle: (catName) => `كود خصم موثق لقسم ${catName}`,
    temuTitle: (pct, catName) => `كوبون خصم ${pct}% على ${catName}`,
    coversPrefix: 'المنتجات المشمولة:',
    catCovers: {
      'moda-ropa': 'خصم مباشر على الفساتين، القمصان، البناطيل، الأحذية الرياضية، الحقائب، النظارات الشمسية والساعات.',
      'smart-home': 'يشمل ماكينات القهوة، القلايات الهوائية، أدوات المطبخ، المفارش، منظمات الخزائن، إضاءة LED والمكانس.',
      'belleza-cuidado': 'يشمل فرش المكياج، مستحضرات التجميل، أجهزة تجفيف الأظافر، مجففات الشعر، ماكينات الحلاقة والعناية بالبشرة.',
      'tech-gadgets': 'يشمل أجهزة الكمبيوتر المصغرة Mini PC، اللابتوب، التابلت، أقراص SSD، البروجيكتور، الكاميرات وراوترات Wi-Fi.',
      'accesorios-moviles': 'يشمل شواحن USB-C السريعة، بنوك الطاقة، سماعات البلوتوث، الساعات الذكية، الكابلات وأغطية الهواتف.',
      'perifericos-gaming': 'يشمل يدات التحكم للكمبيوتر والجوال، أجهزة الألعاب المحمولة، لوحات المفاتيح الميكانيكية، الماوس والسماعات.',
      'herramientas-autos': 'يشمل المثاقب اللاسلكية، أجهزة القياس، فاحص السيارات OBD2، شاشات CarPlay، كاميرات الطريق وإضاءة LED.',
      'juguetes-hobbies': 'يشمل طائرات الدرون بالكاميرا، سيارات التحكم عن بعد، مكعبات البناء، المجسمات والألعاب التعليمية.',
      'deportes-outdoor': 'يشمل مستلزمات الدراجات، الكشافات القابلة للشحن، خيام التخييم، معدات الصيد، حبال المقاومة والملابس الرياضية.',
      'mascotas': 'يشمل موزعات الطعام والماء الآلية للقطط والكلاب، الأسرّة، الأطواق، فرش العناية وألعاب الحيوانات الأليفة.',
      'bebes-oficina': 'يشمل ملابس الرضع والأطفال، حقائب المدرسة، الدفاتر، الأقلام، الآلات الحاسبة ومنظمات المكتب.'
    }
  },
  zh: {
    allUsers: '所有用户可用',
    newUsers: 'App 新用户 / 优惠券包',
    aliTitle: (catName) => `${catName} 官方验证立减码`,
    temuTitle: (pct, catName) => `${catName} 专属 ${pct}% OFF 折扣券`,
    coversPrefix: '适用商品：',
    catCovers: {
      'moda-ropa': '直接抵扣连衣裙、衬衫、裤装、运动鞋、手提包、双肩包、太阳镜及手表配饰。',
      'smart-home': '适用于咖啡机、空气炸锅、厨房用具、床品、衣柜收纳盒、LED 灯具及吸尘器。',
      'belleza-cuidado': '适用于化妆刷、美妆工具、美甲 UV 灯、吹风机、直发器、电动剃须刀及护肤仪器。',
      'tech-gadgets': '适用于迷你主机 (Mini PC)、笔记本、平板、SSD 固态硬盘、内存、便携投影仪、安防摄像头及路由器。',
      'accesorios-moviles': '适用于 USB-C 快充头、充电宝、蓝牙耳机、智能手表、数据线及手机保护壳。',
      'perifericos-gaming': '适用于 PC/Switch/手机游戏手柄、复古掌机、机械键盘、电竞鼠标及游戏耳机。',
      'herramientas-autos': '适用于无线电钻、万用表、OBD2 汽车诊断仪、CarPlay 车载屏、行车记录仪及 LED 车灯。',
      'juguetes-hobbies': '适用于航拍无人机、遥控车、积木拼装玩具、手办模型、毛绒玩具及桌游。',
      'deportes-outdoor': '适用于骑行装备、充电头灯、露营帐篷、钓鱼用具、健身阻力带及运动服饰。',
      'mascotas': '适用于猫狗自动喂食器、饮水机、可水洗宠物窝、牵引绳、梳毛刷及宠物玩具。',
      'bebes-oficina': '适用于婴童服装、妈咪包、学生书包、笔记本、马克笔、计算器及桌面收纳文具。'
    }
  },
  ru: {
    allUsers: 'ДЛЯ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ',
    newUsers: 'НОВЫМ ПОЛЬЗОВАТЕЛЯМ / ПАКЕТ',
    aliTitle: (catName) => `Проверенный промокод на категорию «${catName}»`,
    temuTitle: (pct, catName) => `Купон -${pct}% на категорию «${catName}»`,
    coversPrefix: 'На что действует:',
    catCovers: {
      'moda-ropa': 'Прямая скидка на платья, рубашки, брюки, кроссовки, сумки, рюкзаки, солнцезащитные очки и часы.',
      'smart-home': 'Скидка на кофеварки, аэрогрили, кухонную утварь, постельное белье, органайзеры, LED-лампы и пылесосы.',
      'belleza-cuidado': 'Действует на кисти для макияжа, косметику, УФ-лампы для маникюра, фены, выпрямители, электробритвы и уход.',
      'tech-gadgets': 'Действует на мини-ПК, ноутбуки, планшеты, SSD-накопители, ОЗУ, проекторы, IP-камеры и Wi-Fi роутеры.',
      'accesorios-moviles': 'Действует на быстрые зарядки USB-C, повербанки, беспроводные наушники, смарт-часы, кабели и чехлы.',
      'perifericos-gaming': 'Действует на геймпады для ПК/Switch/смартфонов, ретро-консоли, механические клавиатуры, игровые мыши и гарнитуры.',
      'herramientas-autos': 'Действует на аккумуляторные дрели, мультиметры, автосканеры OBD2, экраны CarPlay, видеорегистраторы и LED-лампы.',
      'juguetes-hobbies': 'Действует на дроны с камерой, радиоуправляемые машинки, конструкторы, коллекционные фигурки и настольные игры.',
      'deportes-outdoor': 'Действует на велоаксессуары, налобные фонари, палатки, рыболовные снасти, фитнес-резинки и спортивную одежду.',
      'mascotas': 'Действует на автокормушки и поилки для кошек и собак, лежанки, шлейки, поводки, щетки и игрушки.',
      'bebes-oficina': 'Действует на детскую одежду, школьные рюкзаки, тетради, маркеры, калькуляторы и настольные органайзеры.'
    }
  },
  tr: {
    allUsers: 'TÜM KULLANICILAR',
    newUsers: 'YENİ UYGULAMA KULLANICILARI / PAKET',
    aliTitle: (catName) => `${catName} İçin Doğrulanmış İndirim Kodu`,
    temuTitle: (pct, catName) => `${catName} Kategorisinde %${pct} İndirim Kuponu`,
    coversPrefix: 'Kapsadığı ürünler:',
    catCovers: {
      'moda-ropa': 'Elbise, gömlek, pantolon, spor ayakkabı, çanta, sırt çantası, güneş gözlüğü ve saatlerde doğrudan indirim sağlar.',
      'smart-home': 'Kahve makineleri, airfryer, mutfak gereçleri, nevresim, dolap düzenleyiciler, LED lambalar ve süpürgelerde geçerlidir.',
      'belleza-cuidado': 'Makyaj fırçaları, kozmetik, UV tırnak lambaları, saç kurutma makineleri, düzleştiriciler ve tıraş makinelerinde geçerlidir.',
      'tech-gadgets': 'Mini PC, dizüstü bilgisayar, tablet, SSD, RAM, taşınabilir projeksiyon, güvenlik kamerası ve Wi-Fi yönlendiricilerde geçerlidir.',
      'accesorios-moviles': 'USB-C hızlı şarj cihazları, powerbank, kablosuz kulaklık, akıllı saat, kablo ve telefon kılıflarında geçerlidir.',
      'perifericos-gaming': 'PC/Mobil/Switch oyun kolları, taşınabilir retro konsollar, mekanik klavyeler, oyuncu fareleri ve kulaklıklarda geçerlidir.',
      'herramientas-autos': 'Şarjlı matkaplar, multimetreler, OBD2 araç arıza tespit cihazları, CarPlay ekranlar, araç kameraları ve LED farlarda geçerlidir.',
      'juguetes-hobbies': 'Kameralı drone, uzaktan kumandalı arabalar, yapı blokları, figürler, peluş oyuncaklar ve kutu oyunlarında geçerlidir.',
      'deportes-outdoor': 'Bisiklet aksesuarları, şarjlı kafa lambaları, kamp çadırları, balıkçılık ekipmanları, direnç bantları ve spor giyimde geçerlidir.',
      'mascotas': 'Kedi ve köpek otomatik mama/su kapları, yıkanabilir yataklar, tasmalar, bakım fırçaları ve oyuncaklarda geçerlidir.',
      'bebes-oficina': 'Bebek ve çocuk giyim, bakım çantaları, okul çantaları, defterler, kalemler ve masaüstü düzenleyicilerde geçerlidir.'
    }
  },
  sv: {
    allUsers: 'ALLA ANVÄNDARE',
    newUsers: 'NYA APP-ANVÄNDARE / PAKET',
    aliTitle: (catName) => `Verifierad Rabattkod för ${catName}`,
    temuTitle: (pct, catName) => `${pct}% Rabattkupong på ${catName}`,
    coversPrefix: 'Vad den täcker:',
    catCovers: {
      'moda-ropa': 'Direktrabatt på klänningar, skjortor, byxor, sneakers, handväskor, ryggsäckar, solglasögon och klockor.',
      'smart-home': 'Rabatt på kaffebryggare, airfryers, köksredskap, sängkläder, garderobsorganisatörer, LED-lampor och dammsugare.',
      'belleza-cuidado': 'Gäller sminkborstar, kosmetika, UV-nagellampor, hårtorkar, plattänger, rakapparater och hudvård.',
      'tech-gadgets': 'Gäller Mini-datorer, laptops, surfplattor, SSD-diskar, RAM, portabla projektorer, säkerhetskameror och Wi-Fi-routrar.',
      'accesorios-moviles': 'Gäller USB-C-snabbladdare, powerbanks, trådlösa hörlurar, smartklockor, kablar och mobilskal.',
      'perifericos-gaming': 'Gäller handkontroller för PC/Mobil/Switch, retro-handkonsoler, mekaniska tangentbord, gamingmöss och headsets.',
      'herramientas-autos': 'Gäller skruvdragare, multimetrar, OBD2-bilskannrar, CarPlay-skärmar, dashcams och LED-belysning.',
      'juguetes-hobbies': 'Gäller kameradrönare, radiostyrda bilar, byggklossar, samlarfigurer, gosedjur och sällskapsspel.',
      'deportes-outdoor': 'Gäller cykeltillbehör, uppladdningsbara pannlampor, tält, fiskeutrustning, träningsband och sportkläder.',
      'mascotas': 'Gäller automatiska foder- och vattenautomater för hund och katt, bäddar, selar, koppel och husdjursleksaker.',
      'bebes-oficina': 'Gäller baby- och barnkläder, skötväskor, skolryggsäckar, anteckningsböcker, pennor och skrivbordstillbehör.'
    }
  },
  no: {
    allUsers: 'ALLE BRUKERE',
    newUsers: 'NYE APP-BRUKERE / PAKKE',
    aliTitle: (catName) => `Verifisert Rabattkode for ${catName}`,
    temuTitle: (pct, catName) => `${pct}% Rabattkupong på ${catName}`,
    coversPrefix: 'Hva den dekker:',
    catCovers: {
      'moda-ropa': 'Direkte rabatt på kjoler, skjorter, bukser, joggesko, vesker, ryggsekker, solbriller og klokker.',
      'smart-home': 'Rabatt på kaffetraktere, airfryere, kjøkkenutstyr, sengetøy, oppbevaring, LED-lamper og støvsugere.',
      'belleza-cuidado': 'Gjelder sminkekoster, kosmetikk, UV-neglelamper, hårfønere, rettetenger, barbermaskiner og hudpleie.',
      'tech-gadgets': 'Gjelder Mini-PC-er, bærbare PC-er, nettbrett, SSD-er, RAM, bærbare projektorer, kameraer og Wi-Fi-rutere.',
      'accesorios-moviles': 'Gjelder USB-C-hurtigladere, powerbanker, trådløse ørepropper, smartklokker, kabler og mobildeksler.',
      'perifericos-gaming': 'Gjelder kontrollere for PC/Mobil/Switch, retro håndholdte konsoller, mekaniske tastaturer, gamingmus og headset.',
      'herramientas-autos': 'Gjelder batteridriller, multimetre, OBD2-bilskannere, CarPlay-skjermer, dashbordkameraer og LED-lys.',
      'juguetes-hobbies': 'Gjelder kameradroner, radiostyrte biler, byggeklosser, samlefigurer, kosedyr og brettspill.',
      'deportes-outdoor': 'Gjelder sykkelutstyr, oppladbare hodelykter, telt, fiskeutstyr, treningsstrikk og treningstøy.',
      'mascotas': 'Gjelder automatiske fôr- og vannautomater for hund og katt, senger, seler, bånd og kjæledyrleker.',
      'bebes-oficina': 'Gjelder baby- og barneklær, stellevesker, skolesekker, notatbøker, tusjer og kontorrekvisita.'
    }
  },
  da: {
    allUsers: 'ALLE BRUGERE',
    newUsers: 'NYE APP-BRUGERE / PAKKE',
    aliTitle: (catName) => `Verificeret Rabatkupone til ${catName}`,
    temuTitle: (pct, catName) => `${pct}% Rabatkupone på ${catName}`,
    coversPrefix: 'Hvad den dækker:',
    catCovers: {
      'moda-ropa': 'Direkte rabat på kjoler, skjorter, bukser, sneakers, håndtasker, rygsække, solbriller og ure.',
      'smart-home': 'Rabat på kaffemaskiner, airfryers, køkkenudstyr, sengetøj, opbevaring, LED-lamper og støvsugere.',
      'belleza-cuidado': 'Gælder makeupbørster, kosmetik, UV-neglelamper, hårtørrere, glattejern, barbermaskiner og hudpleje.',
      'tech-gadgets': 'Gælder Mini-PC’er, bærbare computere, tablets, SSD’er, RAM, bærbare projektorer, kameraer og Wi-Fi-routere.',
      'accesorios-moviles': 'Gælder USB-C-hurtigopladere, powerbanks, trådløse høretelefoner, smartwatches, kabler og mobilcovers.',
      'perifericos-gaming': 'Gælder controllere til PC/Mobil/Switch, retro håndholdte konsoller, mekaniske tastaturer, gamingmus og headsets.',
      'herramientas-autos': 'Gælder akku-boremaskiner, multimetre, OBD2-bilscannere, CarPlay-skærme, dashcams og LED-lygter.',
      'juguetes-hobbies': 'Gælder kameradroner, fjernstyrede biler, byggeklodser, figurer, bamser og brætspil.',
      'deportes-outdoor': 'Gælder cykeltilbehør, genopladelige pandelamper, telte, fiskeudstyr, træningselastikker og sportstøj.',
      'mascotas': 'Gælder automatiske foder- og vandautomater til hunde og katte, senge, seler, snore og legetøj.',
      'bebes-oficina': 'Gælder baby- og børnetøj, pusletasker, skoletasker, notesbøger, tuscher og kontorartikler.'
    }
  },
  fi: {
    allUsers: 'KAIKILLE KÄYTTÄJILLE',
    newUsers: 'UUDET SOVELLUSKÄYTTÄJÄT / PAKETTI',
    aliTitle: (catName) => `Vahvistettu Alennuskoodi: ${catName}`,
    temuTitle: (pct, catName) => `${pct} % Alennuskuponki: ${catName}`,
    coversPrefix: 'Mihin käy:',
    catCovers: {
      'moda-ropa': 'Suora alennus mekoista, paidoista, housuista, tennareista, käsilaukuista, repuista, aurinkolaseista ja kelloista.',
      'smart-home': 'Alennus kahvinkeittimistä, airfryereista, keittiövälineistä, vuodevaatteista, säilytyksestä, LED-valoista ja imureista.',
      'belleza-cuidado': 'Koskee meikkisiveltimiä, kosmetiikkaa, UV-kynsiuuneja, hiustenkuivaajia, suoristusrautoja, parranajokoneita ja ihonhoitoa.',
      'tech-gadgets': 'Koskee Mini-PC-tietokoneita, kannettavia, tabletteja, SSD-levyjä, RAM-muisteja, projektoreita, kameroita ja Wi-Fi-reitittimiä.',
      'accesorios-moviles': 'Koskee USB-C-pikalatureita, varavirtalähteitä, langattomia kuulokkeita, älykelloja, kaapeleita ja puhelinkuoria.',
      'perifericos-gaming': 'Koskee PC-/mobiili-/Switch-peliohjaimia, retrokonsoleita, mekaanisia näppäimistöjä, pelihiiriä ja kuulokkeita.',
      'herramientas-autos': 'Koskee akkuporakoneita, yleismittareita, OBD2-vikakoodinlukijoita, CarPlay-näyttöjä, kojelautakameroita ja LED-valoja.',
      'juguetes-hobbies': 'Koskee kameradrooneja, RC-autoja, rakennuspalikoita, keräilyhahmoja, pehmoleluja ja lautapelejä.',
      'deportes-outdoor': 'Koskee pyöräilytarvikkeita, ladattavia otsalamppuja, telttoja, kalastusvälineitä, vastuskuminauhoja ja urheiluvaatteita.',
      'mascotas': 'Koskee koirien ja kissojen ruoka- ja juoma-automaatteja, petejä, valjaita, talutushihnoja ja leluja.',
      'bebes-oficina': 'Koskee vauvan- ja lastenvaatteita, hoitolaukkuja, koulureppuja, vihkoja, tusseja ja toimistotarvikkeita.'
    }
  },
  el: {
    allUsers: 'ΓΙΑ ΟΛΟΥΣ ΤΟΥΣ ΧΡΗΣΤΕΣ',
    newUsers: 'ΝΕΟΙ ΧΡΗΣΤΕΣ ΕΦΑΡΜΟΓΗΣ / ΠΑΚΕΤΟ',
    aliTitle: (catName) => `Επαληθευμένο Κουπόνι για ${catName}`,
    temuTitle: (pct, catName) => `Κουπόνι -${pct}% σε ${catName}`,
    coversPrefix: 'Τι καλύπτει:',
    catCovers: {
      'moda-ropa': 'Άμεση έκπτωση σε φορέματα, πουκάμισα, παντελόνια, αθλητικά παπούτσια, τσάντες, σακίδια, γυαλιά ηλίου και ρολόγια.',
      'smart-home': 'Έκπτωση σε καφετιέρες, φριτέζες αέρος, είδη κουζίνας, λευκά είδη, οργάνωση σπιτιού, λάμπες LED και σκούπες.',
      'belleza-cuidado': 'Ισχύει για πινέλα μακιγιάζ, καλλυντικά, φουρνάκια νυχιών UV, πιστολάκια, ισιωτικά, ξυριστικές μηχανές και περιποίηση.',
      'tech-gadgets': 'Ισχύει για Mini PC, λάπτοπ, τάμπλετ, δίσκους SSD, μνήμες RAM, φορητούς προτζέκτορες, κάμερες και Wi-Fi routers.',
      'accesorios-moviles': 'Ισχύει για ταχυφορτιστές USB-C, power banks, ασύρματα ακουστικά, smartwatches, καλώδια και θήκες κινητών.',
      'perifericos-gaming': 'Ισχύει για χειριστήρια PC/Κινητού/Switch, φορητές κονσόλες retro, μηχανικά πληκτρολόγια, gaming ποντίκια και ακουστικά.',
      'herramientas-autos': 'Ισχύει για επαναφορτιζόμενα δραπανοκατσάβιδα, πολύμετρα, διαγνωστικά OBD2, οθόνες CarPlay, κάμερες αυτοκινήτου και LED.',
      'juguetes-hobbies': 'Ισχύει για drones με κάμερα, τηλεκατευθυνόμενα, τουβλάκια κατασκευών, φιγούρες, λούτρινα και επιτραπέζια.',
      'deportes-outdoor': 'Ισχύει για αξεσουάρ ποδηλάτου, φακούς κεφαλής, σκηνές κάμπινγκ, είδη αλιείας, λάστιχα γυμναστικής και αθλητικά ρούχα.',
      'mascotas': 'Ισχύει για αυτόματες ταΐστρες και ποτίστρες σκύλων/γατών, κρεβατάκια, σαμάρια, λουριά και παιχνίδια κατοικίδιων.',
      'bebes-oficina': 'Ισχύει για βρεφικά και παιδικά ρούχα, σχολικές τσάντες, τετράδια, μαρκαδόρους, αριθμομηχανές και είδη γραφείου.'
    }
  },
  cs: {
    allUsers: 'VŠICHNI UŽIVATELÉ',
    newUsers: 'NOVÍ UŽIVATELÉ APLIKACE / BALÍČEK',
    aliTitle: (catName) => `Ověřený Slevový Kupón na: ${catName}`,
    temuTitle: (pct, catName) => `Kupón -${pct} % na: ${catName}`,
    coversPrefix: 'Na co platí:',
    catCovers: {
      'moda-ropa': 'Přímá sleva na šaty, košile, kalhoty, tenisky, kabelky, batohy, sluneční brýle a hodinky.',
      'smart-home': 'Sleva na kávovary, horkovzdušné fritézy, kuchyňské potřeby, ložní prádlo, organizéry, LED osvětlení a vysavače.',
      'belleza-cuidado': 'Platí na kosmetické štětce, make-up, UV lampy na nehty, fény, žehličky na vlasy, holicí strojky a péči o pleť.',
      'tech-gadgets': 'Platí na Mini PC, notebooky, tablety, SSD disky, RAM, přenosné projektory, bezpečnostní kamery a Wi-Fi routery.',
      'accesorios-moviles': 'Platí na rychlonabíječky USB-C, powerbanky, bezdrátová sluchátka, chytré hodinky, kabely a kryty na mobil.',
      'perifericos-gaming': 'Platí na herní ovladače pro PC/Mobil/Switch, retro kapesní konzole, mechanické klávesnice, herní myši a sluchátka.',
      'herramientas-autos': 'Platí na aku vrtačky, multimetry, autodiagnostiku OBD2, obrazovky CarPlay, autokamery a LED autožárovky.',
      'juguetes-hobbies': 'Platí na drony s kamerou, RC auta, stavebnice, sběratelské figurky, plyšáky a společenské hry.',
      'deportes-outdoor': 'Platí na cyklistické doplňky, nabíjecí čelovky, stany, rybářské vybavení, posilovací gumy a sportovní oblečení.',
      'mascotas': 'Platí na automatická krmítka a fontány pro psy a kočky, pelíšky, postroje, vodítka, kartáče a hračky.',
      'bebes-oficina': 'Platí na kojenecké a dětské oblečení, přebalovací tašky, školní batohy, sešity, fixy a kancelářské potřeby.'
    }
  },
  ro: {
    allUsers: 'TOȚI UTILIZATORII',
    newUsers: 'UTILIZATORI NOI APLICAȚIE / PACHET',
    aliTitle: (catName) => `Cupon Verificat pentru ${catName}`,
    temuTitle: (pct, catName) => `Cupon -${pct}% la ${catName}`,
    coversPrefix: 'Ce acoperă:',
    catCovers: {
      'moda-ropa': 'Reducere directă la rochii, cămăși, pantaloni, adidași, genți, rucsacuri, ochelari de soare și ceasuri.',
      'smart-home': 'Reducere la espressoare, friteuze cu aer cald (airfryer), ustensile de bucătărie, lenjerii, organizatoare, lămpi LED și aspiratoare.',
      'belleza-cuidado': 'Se aplică la pensule de machiaj, cosmetice, lămpi UV unghii, uscătoare de păr, plăci de îndreptat și aparate de ras.',
      'tech-gadgets': 'Se aplică la Mini PC-uri, laptopuri, tablete, SSD-uri, memorii RAM, proiectoare portabile, camere supraveghere și routere Wi-Fi.',
      'accesorios-moviles': 'Se aplică la încărcătoare rapide USB-C, baterii externe (powerbank), căști Bluetooth, smartwatch-uri, cabluri și huse.',
      'perifericos-gaming': 'Se aplică la controllere PC/Mobil/Switch, console portabile retro, tastaturi mecanice, mouse-uri și căști de gaming.',
      'herramientas-autos': 'Se aplică la bormașini cu acumulator, multimetre, testere auto OBD2, ecrane CarPlay, camere auto și becuri LED.',
      'juguetes-hobbies': 'Se aplică la drone cu cameră, mașini RC, seturi de construcție, figurine, plușuri și jocuri de societate.',
      'deportes-outdoor': 'Se aplică la accesorii ciclism, lanterne frontale, corturi camping, articole pescuit, benzi fitness și echipament sport.',
      'mascotas': 'Se aplică la hrănitoare și adăpătoare automate pentru câini și pisici, culcușuri, hamuri, lese și jucării.',
      'bebes-oficina': 'Se aplică la haine pentru bebeluși și copii, ghiozdane școlare, caiete, markere, calculatoare și articole de birou.'
    }
  },
  hu: {
    allUsers: 'MINDEN FELHASZNÁLÓNAK',
    newUsers: 'ÚJ APP-FELHASZNÁLÓK / CSOMAG',
    aliTitle: (catName) => `Ellenőrzött Kuponkód: ${catName}`,
    temuTitle: (pct, catName) => `${pct}% Kedvezmény Kupon: ${catName}`,
    coversPrefix: 'Mire érvényes:',
    catCovers: {
      'moda-ropa': 'Azonnali kedvezmény ruhákra, ingekre, nadrágokra, sportcipőkre, táskákra, hátizsákokra, napszemüvegekre és órákra.',
      'smart-home': 'Kedvezmény kávéfőzőkre, forrólevegős sütőkre (airfryer), konyhai eszközökre, ágyneműkre, rendszerezőkre és porszívókra.',
      'belleza-cuidado': 'Érvényes sminkecsetekre, kozmetikumokra, UV műkörmös lámpákra, hajszárítókra, hajvasalókra, borotvákra és bőrápolásra.',
      'tech-gadgets': 'Érvényes Mini PC-kre, laptopokra, tabletekre, SSD-kre, RAM-okra, hordozható projektorokra, kamerákra és Wi-Fi routerekre.',
      'accesorios-moviles': 'Érvényes USB-C gyorstöltőkre, powerbankokra, Bluetooth fülhallgatókra, okosórákra, kábelekre és telefontokokra.',
      'perifericos-gaming': 'Érvényes PC/Mobil/Switch kontrollerekre, retró kézikonzolokra, mechanikus billentyűzetekre, gamer egerekre és fejhallgatókra.',
      'herramientas-autos': 'Érvényes akkus fúrókra, multiméterekre, OBD2 autódiagnosztikára, CarPlay kijelzőkre, menetrögzítő kamerákra és LED-ekre.',
      'juguetes-hobbies': 'Érvényes kamerás drónokra, távirányítós autókra, építőkockákra, figurákra, plüssökre és társasjátékokra.',
      'deportes-outdoor': 'Érvényes kerékpáros kiegészítőkre, fejlámpákra, kemping sátrakra, horgászfelszerelésre, erősítő szalagokra és sportruházatra.',
      'mascotas': 'Érvényes automata kutya- és macskaetetőkre, itatókutakra, fekhelyekre, hámokra, pórázokra és kisállatjátékokra.',
      'bebes-oficina': 'Érvényes baba- és gyerekruhákra, pelenkázótáskákra, iskolatáskákra, füzetekre, filctollakra és irodai rendszerezőkre.'
    }
  },
  uk: {
    allUsers: 'ДЛЯ ВСІХ КОРИСТУВАЧІВ',
    newUsers: 'НОВИМ КОРИСТУВАЧАМ ДОДАТКУ / ПАКЕТ',
    aliTitle: (catName) => `Перевірений Промокод на категорію «${catName}»`,
    temuTitle: (pct, catName) => `Купон -${pct}% на категорію «${catName}»`,
    coversPrefix: 'На що діє:',
    catCovers: {
      'moda-ropa': 'Пряма знижка на сукні, сорочки, штани, кросівки, сумки, рюкзаки, сонцезахисні окуляри та годинники.',
      'smart-home': 'Знижка на кавоварки, мультипечі (аерогрилі), кухонне приладдя, постільну білизну, органайзери, LED-лампи та пилососи.',
      'belleza-cuidado': 'Діє на пензлі для макіяжу, косметику, УФ-лампи для манікюру, фени, вирівнювачі, електробритви та догляд за шкірою.',
      'tech-gadgets': 'Діє на Міні-ПК, ноутбуки, планшети, SSD-накопичувачі, ОЗП, портативні проектори, камери безпеки та Wi-Fi роутери.',
      'accesorios-moviles': 'Діє на швидкі зарядні пристрої USB-C, повербанки, бездротові навушники, смарт-годинники, кабелі та чохли.',
      'perifericos-gaming': 'Діє на геймпади для ПК/Смартфона/Switch, ретро-консолі, механічні клавіатури, ігрові миші та гарнітури.',
      'herramientas-autos': 'Діє на акумуляторні шуруповерти, мультиметри, автосканери OBD2, екрани CarPlay, відеореєстратори та LED-фари.',
      'juguetes-hobbies': 'Діє на дрони з камерою, радіокеровані машинки, конструктори, колекційні фігурки, м’які іграшки та настільні ігри.',
      'deportes-outdoor': 'Діє на велоаксесуари, акумуляторні ліхтарі, туристичні намети, рибальське спорядження, фітнес-резинки та спортивний одяг.',
      'mascotas': 'Діє на автогодівниці та поїлки для котів і собак, лежанки, шлейки, повідці, щітки та іграшки для тварин.',
      'bebes-oficina': 'Діє на дитячий одяг, шкільні рюкзаки, зошити, маркери, калькулятори та настільні офісні органайзери.'
    }
  },
  th: {
    allUsers: 'ผู้ใช้ทุกคน',
    newUsers: 'ผู้ใช้ใหม่ในแอป / แพ็กเกจคูปอง',
    aliTitle: (catName) => `โค้ดส่วนลดยืนยันแล้วสำหรับ ${catName}`,
    temuTitle: (pct, catName) => `คูปองลด ${pct}% สำหรับ ${catName}`,
    coversPrefix: 'ใช้ได้กับสินค้า:',
    catCovers: {
      'moda-ropa': 'ส่วนลดตรงสำหรับชุดเดรส เสื้อเชิ้ต กางเกง รองเท้าผ้าใบ กระเป๋าถือ เป้สะพายหลัง แว่นกันแดด และนาฬิกา',
      'smart-home': 'ลดราคาเครื่องชงกาแฟ หม้อทอดไร้น้ำมัน เครื่องครัว เครื่องนอน กล่องจัดระเบียบ โคมไฟ LED และเครื่องดูดฝุ่น',
      'belleza-cuidado': 'ใช้ได้กับแปรงแต่งหน้า เครื่องสำอาง เครื่องอบเล็บ UV ไดร์เป่าผม ที่หนีบผม เครื่องโกนหนวดไฟฟ้า และสกินแคร์',
      'tech-gadgets': 'ใช้ได้กับมินิพีซี โน้ตบุ๊ก แท็บเล็ต SSD แรม โปรเจคเตอร์พกพา กล้องวงจรปิด และเราเตอร์ Wi-Fi',
      'accesorios-moviles': 'ใช้ได้กับหัวชาร์จเร็ว USB-C พาวเวอร์แบงค์ หูฟังบลูทูธ สมาร์ทวอทช์ สายชาร์จ และเคสมือถือ',
      'perifericos-gaming': 'ใช้ได้กับจอยเกม PC/มือถือ/Switch เครื่องเล่นเกมพกพาเรโทร คีย์บอร์ดแมคคานิคอล เมาส์เกมมิ่ง และหูฟัง',
      'herramientas-autos': 'ใช้ได้กับสว่านไร้สาย มัลติมิเตอร์ เครื่องสแกนรถยนต์ OBD2 จอ CarPlay กล้องติดรถยนต์ และไฟหน้า LED',
      'juguetes-hobbies': 'ใช้ได้กับโดรนติดกล้อง รถบังคับวิทยุ ตัวต่อบล็อก ฟิกเกอร์สะสม ตุ๊กตา และบอร์ดเกม',
      'deportes-outdoor': 'ใช้ได้กับอุปกรณ์จักรยาน ไฟฉายคาดหัว เต็นท์แคมป์ปิ้ง อุปกรณ์ตกปลา ยางยืดออกกำลังกาย และชุดกีฬา',
      'mascotas': 'ใช้ได้กับเครื่องให้อาหารและน้ำอัตโนมัติสำหรับสุนัขและแมว ที่นอนสัตว์เลี้ยง สายจูง แปรงขน และของเล่น',
      'bebes-oficina': 'ใช้ได้กับเสื้อผ้าเด็กอ่อนและเด็กโต กระเป๋านักเรียน สมุดโน้ต ปากกามาร์กเกอร์ เครื่องคิดเลข และอุปกรณ์สำนักงาน'
    }
  },
  vi: {
    allUsers: 'TẤT CẢ NGƯỜI DÙNG',
    newUsers: 'NGƯỜI DÙNG MỚI TRÊN APP / GÓI MÃ',
    aliTitle: (catName) => `Mã Giảm Giá Xác Thực cho ${catName}`,
    temuTitle: (pct, catName) => `Coupon Giảm ${pct}% cho ${catName}`,
    coversPrefix: 'Áp dụng cho:',
    catCovers: {
      'moda-ropa': 'Giảm trực tiếp cho váy đầm, áo sơ mi, quần, giày thể thao, túi xách, ba lô, kính mát và đồng hồ.',
      'smart-home': 'Giảm giá máy pha cà phê, nồi chiên không dầu, đồ dùng nhà bếp, chăn ga, hộp lưu trữ, đèn LED và máy hút bụi.',
      'belleza-cuidado': 'Áp dụng cho cọ trang điểm, mỹ phẩm, đèn UV làm móng, máy sấy tóc, máy duỗi tóc, máy cạo râu và chăm sóc da.',
      'tech-gadgets': 'Áp dụng cho Mini PC, laptop, máy tính bảng, ổ cứng SSD, RAM, máy chiếu mini, camera an ninh và bộ phát Wi-Fi.',
      'accesorios-moviles': 'Áp dụng cho củ sạc nhanh USB-C, sạc dự phòng, tai nghe Bluetooth, đồng hồ thông minh, cáp sạc và ốp lưng.',
      'perifericos-gaming': 'Áp dụng cho tay cầm chơi game PC/Điện thoại/Switch, máy chơi game cầm tay retro, bàn phím cơ và chuột gaming.',
      'herramientas-autos': 'Áp dụng cho máy khoan pin, đồng hồ vạn năng, máy đọc lỗi OBD2, màn hình CarPlay, camera hành trình và đèn LED.',
      'juguetes-hobbies': 'Áp dụng cho flycam, xe điều khiển từ xa, bộ lắp ráp积木, mô hình nhân vật, thú bông và board game.',
      'deportes-outdoor': 'Áp dụng cho phụ kiện xe đạp, đèn đội đầu sạc pin, lều cắm trại, đồ câu cá, dây kháng lực tập gym và đồ thể thao.',
      'mascotas': 'Áp dụng cho máy cho chó mèo ăn uống tự động, nệm thú cưng, dây dắt, lược chải lông và đồ chơi thú cưng.',
      'bebes-oficina': 'Áp dụng cho quần áo trẻ sơ sinh và trẻ em, cặp sách học sinh, sổ tay, bút màu, máy tính và đồ dùng văn phòng.'
    }
  },
  he: {
    allUsers: 'לכל המשתמשים',
    newUsers: 'משתמשי אפליקציה חדשים / חבילה',
    aliTitle: (catName) => `קופון מאומת עבור ${catName}`,
    temuTitle: (pct, catName) => `קופון ${pct}% הנחה על ${catName}`,
    coversPrefix: 'על מה חל הקופון:',
    catCovers: {
      'moda-ropa': 'הנחה ישירה על שמלות, חולצות, מכנסיים, נעלי ספורט, תיקים, תרמילים, משקפי שמש ושעונים.',
      'smart-home': 'הנחה על מכונות קפה, סירי טיגון באוויר (Air Fryer), כלי מטבח, מצעים, ארגוניות, תאורת LED ושואבי אבק.',
      'belleza-cuidado': 'חל על מברשות איפור, קוסמטיקה, מנורות UV לציפורניים, מייבשי שיער, מחליקים, מכונות גילוח וטיפוח פנים.',
      'tech-gadgets': 'חל על מחשבי Mini PC, מחשבים ניידים, טאבלטים, כונני SSD, זיכרון RAM, מקרנים ניידים, מצלמות אבטחה ונתבי Wi-Fi.',
      'accesorios-moviles': 'חל על מטענים מהירים USB-C, סוללות גיבוי (Power Bank), אוזניות אלחוטיות, שעונים חכמים, כבלים וכיסויים לטלפון.',
      'perifericos-gaming': 'חל על שלטי משחק למחשב/סמארטפון/Switch, קונסולות רטרו ניידות, מקלדות מכניות, עכברי גיימינג ואוזניות.',
      'herramientas-autos': 'חל על מקדחות אלחוטיות, מולטימטרים, סורקי תקלות לרכב OBD2, מסכי CarPlay, מצלמות דרך ונורות LED.',
      'juguetes-hobbies': 'חל על רחפנים עם מצלמה, מכוניות שלט רחוק, אבני הרכבה, בובות אספנות, בובות פרווה ומשחקי קופסה.',
      'deportes-outdoor': 'חל על אביזרי אופניים, פנסי ראש נטענים, אוהלי קמפינג, ציוד דיג, גומיות כושר וביגוד ספורט.',
      'mascotas': 'חל על מאכילים ומזרקות מים אוטומטיות לכלבים וחתולים, מיטות רחיצות, רתמות, רצועות וצעצועים לחיות מחמד.',
      'bebes-oficina': 'חל על בגדי תינוקות וילדים, תיקי החתלה, ילקוטים לבית הספר, מחברות, טושים וארגוניות לשולחן העבודה.'
    }
  },
  ms: {
    allUsers: 'SEMUA PENGGUNA',
    newUsers: 'PENGGUNA BAHARU APP / PAKEJ',
    aliTitle: (catName) => `Kupon Disahkan untuk ${catName}`,
    temuTitle: (pct, catName) => `Kupon Diskaun ${pct}% untuk ${catName}`,
    coversPrefix: 'Produk yang dilindungi:',
    catCovers: {
      'moda-ropa': 'Diskaun terus untuk pakaian, kemeja, seluar, kasut sukan, beg tangan, beg galas, cermin mata hitam dan jam tangan.',
      'smart-home': 'Diskaun untuk mesin kopi, air fryer, peralatan dapur, cadar, kotak penyimpanan, lampu LED dan pembersih vakum.',
      'belleza-cuidado': 'Sah untuk berus solek, kosmetik, lampu kuku UV, pengering rambut, pelurus rambut, pencukur elektrik dan penjagaan kulit.',
      'tech-gadgets': 'Sah untuk Mini PC, komputer riba, tablet, SSD, RAM, projektor mudah alih, kamera keselamatan dan penghala Wi-Fi.',
      'accesorios-moviles': 'Sah untuk pengecas pantas USB-C, powerbank, fon telinga Bluetooth, jam tangan pintar, kabel dan sarung telefon.',
      'perifericos-gaming': 'Sah untuk alat kawalan permainan PC/Mudah Alih/Switch, konsol mudah alih retro, papan kekunci mekanikal dan tetikus gaming.',
      'herramientas-autos': 'Sah untuk gerudi tanpa wayar, multimeter, pengimbas kereta OBD2, skrin CarPlay, dashcam dan lampu LED kereta.',
      'juguetes-hobbies': 'Sah untuk dron berkamera, kereta kawalan jauh (RC), blok binaan, patung koleksi, anak patung dan permainan papan.',
      'deportes-outdoor': 'Sah untuk aksesori basikal, lampu kepala boleh cas, khemah perkhemahan, peralatan memancing, jalur rintangan dan pakaian sukan.',
      'mascotas': 'Sah untuk bekas makanan dan air automatik kucing & anjing, tilam boleh basuh, abah-abah, tali dan mainan haiwan.',
      'bebes-oficina': 'Sah untuk pakaian bayi & kanak-kanak, beg lampin, beg sekolah, buku nota, pen penanda, kalkulator dan alat tulis pejabat.'
    }
  }
};

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
  const tpl = COUPON_LANG_TEMPLATES[lang] || COUPON_LANG_TEMPLATES.en;

  return CHECKOUT_COUPONS.filter((c) => {
    if (!availableStores.includes(c.store)) return false;
    if (storeFilter && c.store !== storeFilter) return false;
    if (categoryFilter && c.category !== categoryFilter) return false;
    return true;
  }).map((c) => {
    const categoryLabel = dict.categories[c.category] || c.category;

    let localizedTitle = c.title[lang];
    if (!localizedTitle) {
      localizedTitle = c.store === 'aliexpress'
        ? tpl.aliTitle(categoryLabel)
        : tpl.temuTitle(c.discountPct, categoryLabel);
    }

    let appliesToText = c.appliesTo[lang];
    if (!appliesToText) {
      const catCoverDesc = tpl.catCovers[c.category] || COUPON_LANG_TEMPLATES.en.catCovers[c.category];
      appliesToText = `${tpl.coversPrefix} ${catCoverDesc}`;
    }

    let eligibilityText = c.userEligibility[lang];
    if (!eligibilityText) {
      eligibilityText = c.store === 'aliexpress' ? tpl.allUsers : tpl.newUsers;
    }

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
      categoryLabel
    };
  });
}
