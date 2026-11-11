import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import { FULL_CATEGORIES_BY_LANG, EXTRA_NATIONAL_LANGUAGE_PACKS } from './extraLanguagesPacks.js';

export const BASE_DOMAIN = AFFILIATE_CONFIG.siteDomain;

export const CATEGORY_SLUGS = [
  'moda-ropa',
  'smart-home',
  'belleza-cuidado',
  'tech-gadgets',
  'accesorios-moviles',
  'perifericos-gaming',
  'herramientas-autos',
  'juguetes-hobbies',
  'deportes-outdoor',
  'mascotas',
  'bebes-oficina'
];

export const LANGUAGE_PACKS = {
  en: {
    navHome: 'All Deals',
    navTemu: 'Temu Codes',
    navAli: 'AliExpress Deals',
    navCategories: 'Categories',
    disclosure: 'Affiliate Disclosure: We earn a commission on qualifying purchases via verified partner links (Admitad / AliExpress Portals) at no extra cost to you.',
    heroBadge: 'VERIFIED PROMO CODES FOR ALL CATEGORIES',
    heroTitle: 'Official Promo Codes & Store Discounts for {country}',
    heroSubtitle: 'Verified checkout coupons for clothing, shoes, home & kitchen, beauty, tools, toys, pets, and electronics in {currency}.',
    btnGetCode: 'Reveal & Copy Code',
    btnCopied: 'Code Copied!',
    btnGoStore: 'Go to Official Store',
    minSpend: 'Min. spend',
    verifiedBadge: 'Verified: Nov 2026',
    expiresLabel: 'Valid thru Dec 2026',
    exclusiveTag: 'APP & WEB CODE',
    secretSearchTag: 'SECRET SEARCH KEY',
    modalTitle: 'Code Copied to Clipboard!',
    modalSteps: [
      'Your promo code has been copied automatically.',
      'Paste it in the Promo Code box at checkout before completing payment.',
      'Minimum order value applies in local currency ({currency}).'
    ],
    sidebarTitle: 'Partner Picks',
    sidebarSponsor: 'Sponsored Direct Offer',
    categories: {
      'moda-ropa': 'Clothing, Shoes & Fashion',
      'smart-home': 'Home, Kitchen & Decor',
      'belleza-cuidado': 'Beauty, Makeup & Care',
      'tech-gadgets': 'Tech, Computers & Electronics',
      'accesorios-moviles': 'Phones, Earbuds & Chargers',
      'perifericos-gaming': 'Gaming & Consoles',
      'herramientas-autos': 'Tools, Car & Moto',
      'juguetes-hobbies': 'Toys, Drones & Hobbies',
      'deportes-outdoor': 'Sports, Gym & Outdoors',
      'mascotas': 'Pets (Dogs & Cats)',
      'bebes-oficina': 'Baby, Kids & Stationery',
      'redes-wifi': 'Wi-Fi & Networking'
    },
    seoGuideTitle: 'Complete Guide: How to Stack Temu & AliExpress Coupons in {country} (2026)',
    seoSection1Title: '1. How to Apply Hidden Search Codes & Stack Cart Discounts',
    seoSection1Body: 'Shoppers in {country} can maximize hardware savings by combining store-wide promo codes with seller-specific vouchers. On Temu, typing secret trigger keywords like credit777, wincredit, or box777 directly into the app search bar unlocks localized coupon bundles worth up to 100 {currency}. On AliExpress, always combine Choice Day promo codes with automatic Spend & Save thresholds before finalizing checkout. Every code listed on this portal is manually audited for regional validity and SafeSearch compliance.',
    seoSection2Title: '2. Local Shipping Methods, Delivery Times & Free Shipping Thresholds in {country}',
    seoSection2Body: 'Orders shipped to {country} benefit from consolidated air freight and local last-mile couriers. Standard delivery takes 5 to 9 business days with real-time customs clearance included. Free standard shipping activates automatically once your cart reaches the regional minimum threshold in {currency}, while Express DHL/FedEx upgrades remain available for high-ticket peripherals and mini PCs.',
    tableHeaders: ['Store', 'Shipping Method', 'Estimated Delivery', 'Free Shipping Threshold'],
    faqs: [
      {
        q: 'Why does a Temu secret search code only work in the mobile app?',
        a: 'Campaigns such as credit777 and wincredit are tied to device telemetry in {country}. Enter the keyword in the main search bar within 24 hours of installing or opening the app to claim the bundle.'
      },
      {
        q: 'Can I combine AliExpress promo codes with seller coupons in {currency}?',
        a: 'Yes. AliExpress allows stacking one platform-wide promo code, one store coupon, and Coins discounts simultaneously on the same checkout screen.'
      },
      {
        q: 'Are customs duties included for orders delivered to {country}?',
        a: 'Most Choice and Direct items include pre-calculated VAT/import taxes at checkout so you do not pay surprise courier fees upon delivery.'
      },
      {
        q: 'How often are these hardware promo codes verified?',
        a: 'Our automated verification engine tests voucher limits every 6 hours across all 23 supported regions.'
      }
    ],
    legal: {
      privacyTitle: 'Privacy Policy & Cookie Compliance',
      privacyBody: 'We respect your privacy. This platform operates without invasive tracking scripts or forced redirects. Outbound affiliate links use standard rel="noopener noreferrer sponsored" attributes via official CPA networks (Admitad and AliExpress Portals).',
      termsTitle: 'Terms of Service & Coupon Usage',
      termsBody: 'All promotional codes, bundles, and discounts are subject to merchant availability and regional cart rules in {country}. We do not process payments directly.',
      aboutTitle: 'About Our Global Verification Platform',
      aboutBody: 'We are an independent hardware and consumer electronics deal aggregator indexing verified discounts across 23 international markets.',
      contactTitle: 'Contact & Partner Inquiries',
      contactBody: 'For CPA compliance inquiries, merchant partnerships, or broken code reports, reach our editorial engineering desk at compliance@tudominio.xyz.'
    }
  },
  es: {
    navHome: 'Todas las Ofertas',
    navTemu: 'Cupones Temu',
    navAli: 'Ofertas AliExpress',
    navCategories: 'Categorías',
    disclosure: 'Aviso de Afiliados: Obtenemos una comisión por compras elegibles mediante enlaces verificados (Admitad / AliExpress Portals) sin costo adicional para ti.',
    heroBadge: 'CUPONES VERIFICADOS PARA TODAS LAS CATEGORÍAS',
    heroTitle: 'Códigos Promocionales y Descuentos Oficiales para {country}',
    heroSubtitle: 'Cupones verificados para ropa, calzado, hogar, belleza, herramientas, juguetes, mascotas y tecnología en {currency}.',
    btnGetCode: 'Ver y Copiar Código',
    btnCopied: '¡Código Copiado!',
    btnGoStore: 'Ir a la Tienda Oficial',
    minSpend: 'Compra mín.',
    verifiedBadge: 'Verificado: Nov 2026',
    expiresLabel: 'Válido hasta Dic 2026',
    exclusiveTag: 'CÓDIGO WEB Y APP',
    secretSearchTag: 'CLAVE SECRETA EN BUSCADOR',
    modalTitle: '¡Código Copiado al Portapapeles!',
    modalSteps: [
      'El código promocional se copió automáticamente.',
      'Pégalo en la casilla de Código Promocional antes de pagar tu pedido.',
      'Aplica el monto mínimo indicado en tu moneda local ({currency}).'
    ],
    sidebarTitle: 'Ofertas Destacadas',
    sidebarSponsor: 'Oferta Patrocinada Directa',
    categories: {
      'moda-ropa': 'Ropa, Calzado y Moda',
      'smart-home': 'Hogar, Cocina y Muebles',
      'belleza-cuidado': 'Belleza, Maquillaje y Salud',
      'tech-gadgets': 'Tecnología y Computadoras',
      'accesorios-moviles': 'Celulares, Audífonos y Carga',
      'perifericos-gaming': 'Videojuegos y Consolas',
      'herramientas-autos': 'Herramientas, Autos y Motos',
      'juguetes-hobbies': 'Juguetes, Drones y Hobbies',
      'deportes-outdoor': 'Deportes, Gym y Aire Libre',
      'mascotas': 'Mascotas (Perros y Gatos)',
      'bebes-oficina': 'Bebés, Niños y Papelería',
      'redes-wifi': 'Wi-Fi y Redes'
    },
    seoGuideTitle: 'Guía Completa: Cómo Apilar Cupones de Temu y AliExpress en {country} (2026)',
    seoSection1Title: '1. Cómo Aplicar Códigos Ocultos de Búsqueda y Acumular Descuentos',
    seoSection1Body: 'Los compradores en {country} pueden maximizar su ahorro en hardware combinando códigos generales con cupones de vendedor. En Temu, escribir comandos secretos como credit777, wincredit o box777 directamente en el buscador de la aplicación desbloquea paquetes de cupones valorados en moneda local ({currency}). En AliExpress, combina siempre los códigos de Choice Day con los descuentos automáticos de "Gasta y Ahorra" antes de pagar. Además, si compras desde Latinoamérica o mediante casillero internacional en Miami (ES-US), puedes aprovechar precios en USD libres de recargos locales.',
    seoSection2Title: '2. Métodos de Envío Locales, Tiempos de Entrega y Uso de Casilleros en Miami',
    seoSection2Body: 'Los pedidos enviados a {country} cuentan con logística aérea consolidada y entrega de última milla certificada. El envío estándar demora entre 6 y 12 días hábiles. Si utilizas un casillero en Miami (freight forwarder en Florida con código postal 33166/33122) para consolidar periféricos gaming o routers de alto valor, selecciona la región ES-US o EN-US para obtener envío gratis dentro de EE. UU. en 4 a 6 días y reducir costos aduaneros.',
    tableHeaders: ['Tienda', 'Método de Envío', 'Tiempo Estimado', 'Umbral de Envío Gratis'],
    faqs: [
      {
        q: '¿Cómo funcionan los códigos secretos de búsqueda en Temu como credit777?',
        a: 'A diferencia de un cupón tradicional de carrito, debes escribir la palabra clave exacta en la barra superior de búsqueda de la app de Temu en {country} para abrir la ruleta o paquete de recompensas.'
      },
      {
        q: '¿Conviene enviar directo a {country} o usar casillero en Miami?',
        a: 'Para pedidos menores al umbral libre de impuestos de {country}, el envío directo de Temu y AliExpress Standard Shipping es más económico. Para compras mayores o hardware pesado, un casillero en Miami optimiza el flete por libra.'
      },
      {
        q: '¿Se pueden acumular cupones de AliExpress con monedas y cupones de tienda?',
        a: 'Sí. El sistema de pago permite aplicar simultáneamente un código promocional global, un cupón del vendedor y el descuento automático de Monedas en {currency}.'
      },
      {
        q: '¿Cada cuánto se actualizan estos códigos para {country}?',
        a: 'Nuestro equipo verifica el stock de usos de cada cupón diariamente para garantizar compatibilidad con las campañas vigentes de Admitad y AliExpress Portals.'
      }
    ],
    legal: {
      privacyTitle: 'Política de Privacidad y Protección de Datos',
      privacyBody: 'Operamos bajo estricto cumplimiento de privacidad sin scripts invasivos ni redirecciones forzadas. Los enlaces de salida utilizan atributos estándar rel="noopener noreferrer sponsored" hacia redes oficiales.',
      termsTitle: 'Términos de Servicio y Uso de Cupones',
      termsBody: 'Todos los códigos y promociones están sujetos a disponibilidad del comercio y reglas de carrito en {country}. No procesamos pagos ni datos bancarios.',
      aboutTitle: 'Sobre Nuestra Plataforma Global de Cupones',
      aboutBody: 'Somos un índice técnico especializado en hardware, periféricos y electrónica de consumo con cobertura verificada en 23 mercados internacionales.',
      contactTitle: 'Contacto y Soporte de Afiliación',
      contactBody: 'Para auditorías de redes CPA, alianzas comerciales o reporte de cupones expirados, escríbenos a compliance@tudominio.xyz.'
    }
  },
  de: {
    navHome: 'Alle Angebote',
    navTemu: 'Temu Gutscheine',
    navAli: 'AliExpress Deals',
    navCategories: 'Kategorien',
    disclosure: 'Affiliate-Hinweis: Wir erhalten eine Provision für qualifizierte Käufe über verifizierte Partnerlinks (Admitad / AliExpress Portals) ohne Mehrkosten für Sie.',
    heroBadge: 'GEPRÜFTE HARDWARE- & TECH-GUTSCHEINE',
    heroTitle: 'Offizielle Gutscheincodes & Versteckte Bundles für {country}',
    heroSubtitle: 'Täglich getestet für GameSir-Controller, Wi-Fi 6 Router, mechanische Tastaturen und Gadgets in {currency}.',
    btnGetCode: 'Code Anzeigen & Kopieren',
    btnCopied: 'Code Kopiert!',
    btnGoStore: 'Zum Offiziellen Shop',
    minSpend: 'Mindestbestellwert',
    verifiedBadge: 'Geprüft: Nov 2026',
    expiresLabel: 'Gültig bis Dez 2026',
    exclusiveTag: 'APP & WEB GUTSCHEIN',
    secretSearchTag: 'GEHEIMER SUCHBEGRIFF',
    modalTitle: 'Gutscheincode in die Zwischenablage kopiert!',
    modalSteps: [
      'Ihr Aktionscode wurde automatisch kopiert.',
      'Fügen Sie ihn an der Kasse oder direkt in die Temu/AliExpress-Suchleiste ein.',
      'Es gilt der regionale Mindestbestellwert in {currency}.'
    ],
    sidebarTitle: 'Top Hardware-Empfehlungen',
    sidebarSponsor: 'Gesponsertes Direktangebot',
    categories: {
      'tech-gadgets': 'Tech-Gadgets & Mini-PCs',
      'perifericos-gaming': 'Gaming-Peripherie & Controller',
      'smart-home': 'Smart Home & Automation',
      'redes-wifi': 'Wi-Fi 6 & Mesh-Netzwerke',
      'accesorios-moviles': 'GaN-Ladegeräte & mobiles Zubehör'
    },
    seoGuideTitle: 'Kompletter Leitfaden: Temu & AliExpress Gutscheine in {country} kombinieren (2026)',
    seoSection1Title: '1. Versteckte Suchcodes einlösen & Warenkorb-Rabatte stapeln',
    seoSection1Body: 'Käufer in {country} können beim Hardware-Kauf massiv sparen, indem sie Plattform-Gutscheine mit Verkäufer-Rabatten kombinieren. Wenn Sie bei Temu geheime Suchbegriffe wie credit777, wincredit oder box777 direkt in die Suchleiste eingeben, schalten Sie exklusive Gutscheinpakete in {currency} frei. Bei AliExpress lassen sich Choice-Day-Codes nahtlos mit automatischen Mengenrabatten kombinieren. Alle gelisteten Codes beinhalten die gesetzliche Mehrwertsteuer (inkl. MwSt.).',
    seoSection2Title: '2. Versandarten, Lieferzeiten & Versandkostenfrei-Grenzen in {country}',
    seoSection2Body: 'Bestellungen nach {country} werden über europäische Logistikzentren und lokale Partner wie DHL oder Hermes abgewickelt. Die Standardlieferung dauert 5 bis 8 Werktage inklusive Zollabfertigung (IOSS). Ab dem regionalen Mindestbestellwert in {currency} ist der Standardversand komplett kostenlos.',
    tableHeaders: ['Shop', 'Versandart', 'Lieferzeit', 'Versandkostenfrei ab'],
    faqs: [
      {
        q: 'Wie funktionieren geheime Temu-Suchcodes in {country}?',
        a: 'Geben Sie Begriffe wie credit777 direkt in das Suchfeld der Temu-App ein, um sofort das regionale Gutschein-Bundle in {currency} zu aktivieren.'
      },
      {
        q: 'Fallen bei Lieferungen nach {country} zusätzliche Zollgebühren an?',
        a: 'Nein, bei Bestellungen unter 150 EUR wird die Einfuhrumsatzsteuer direkt an der Kasse über das IOSS-Verfahren abgeführt.'
      },
      {
        q: 'Kann ich mehrere AliExpress-Codes gleichzeitig nutzen?',
        a: 'Sie können pro Bestellung einen globalen Plattform-Code mit Verkäufer-Coupons und Münz-Rabatten kombinieren.'
      },
      {
        q: 'Wie oft werden die Gutscheincodes geprüft?',
        a: 'Unsere Datenbank überprüft alle Hardware-Codes alle 6 Stunden auf aktive Kontingente.'
      }
    ],
    legal: {
      privacyTitle: 'Datenschutzerklärung & Cookie-Richtlinie',
      privacyBody: 'Diese Plattform nutzt keine invasiven Tracking-Skripte oder erzwungene Weiterleitungen. Alle Partnerlinks verwenden das offizielle Attribut rel="noopener noreferrer sponsored".',
      termsTitle: 'Nutzungsbedingungen',
      termsBody: 'Alle Gutscheincodes unterliegen den jeweiligen Bedingungen der Händler in {country}.',
      aboutTitle: 'Über Unsere Plattform',
      aboutBody: 'Unabhängiges Vergleichsportal für verifizierte Hardware- und Elektronik-Gutscheine in 23 Ländern.',
      contactTitle: 'Kontakt & Impressum-Anfragen',
      contactBody: 'Für Partner- und Compliance-Anfragen erreichen Sie uns unter compliance@tudominio.xyz.'
    }
  },
  fr: {
    navHome: 'Toutes les Offres',
    navTemu: 'Codes Temu',
    navAli: 'Promos AliExpress',
    navCategories: 'Catégories',
    disclosure: 'Divulgation d’affiliation : Nous percevons une commission sur les achats éligibles via nos liens partenaires vérifiés (Admitad / AliExpress Portals) sans frais supplémentaires pour vous.',
    heroBadge: 'CODES PROMO HARDWARE & TECH VÉRIFIÉS',
    heroTitle: 'Codes Promotionnels Officiels & Bundles Cachés pour {country}',
    heroSubtitle: 'Testés quotidiennement sur les manettes GameSir, routeurs Wi-Fi 6, claviers mécaniques et gadgets en {currency}.',
    btnGetCode: 'Afficher & Copier le Code',
    btnCopied: 'Code Copié !',
    btnGoStore: 'Aller sur la Boutique',
    minSpend: 'Achat min.',
    verifiedBadge: 'Vérifié : Nov 2026',
    expiresLabel: 'Valide jusqu’en Déc 2026',
    exclusiveTag: 'CODE APP & WEB',
    secretSearchTag: 'MOT-CLÉ SECRET',
    modalTitle: 'Code Copié dans le Presse-papiers !',
    modalSteps: [
      'Votre code promotionnel a été copié automatiquement.',
      'Collez-le lors du paiement ou dans la barre de recherche Temu/AliExpress.',
      'Montant minimum de commande applicable en {currency}.'
    ],
    sidebarTitle: 'Sélection Hardware Partenaire',
    sidebarSponsor: 'Offre Sponsorisée Directe',
    categories: {
      'tech-gadgets': 'Gadgets Tech & Mini PC',
      'perifericos-gaming': 'Périphériques Gaming & Manettes',
      'smart-home': 'Maison Connectée & Domotique',
      'redes-wifi': 'Réseaux Wi-Fi 6 & Mesh',
      'accesorios-moviles': 'Chargeurs GaN & Accessoires Mobiles'
    },
    seoGuideTitle: 'Guide Complet : Cumuler les Coupons Temu & AliExpress en {country} (2026)',
    seoSection1Title: '1. Comment appliquer les codes secrets et cumuler les réductions panier',
    seoSection1Body: 'Les acheteurs situés en {country} peuvent réduire considérablement le prix de leurs périphériques gaming et équipements réseau en combinant les codes globaux avec les coupons vendeurs. Sur Temu, saisissez des mots-clés secrets comme credit777, wincredit ou box777 directement dans la barre de recherche pour débloquer des packs de réduction en {currency}. Sur AliExpress, associez les codes Choice Day aux remises automatiques avant de valider votre panier.',
    seoSection2Title: '2. Modes de livraison, délais et seuils de livraison gratuite en {country}',
    seoSection2Body: 'Les commandes expédiées vers {country} bénéficient d’un acheminement aérien rapide et d’une livraison locale suivie (Colissimo, Chronopost, Postes Canada). Le délai moyen est de 5 à 9 jours ouvrés avec TVA incluse. La livraison standard est offerte dès que votre panier atteint le seuil minimum en {currency}.',
    tableHeaders: ['Boutique', 'Mode de Livraison', 'Délai Estimé', 'Livraison Gratuite dès'],
    faqs: [
      {
        q: 'Comment utiliser un code de recherche secret sur Temu en {country} ?',
        a: 'Tapez directement le code (ex. credit777) dans la barre de recherche principale de l’application Temu pour ouvrir le pack de coupons en {currency}.'
      },
      {
        q: 'Les taxes et frais de douane sont-ils inclus pour {country} ?',
        a: 'Oui, la TVA applicable est calculée directement lors du paiement pour éviter tout frais supplémentaire à la livraison.'
      },
      {
        q: 'Peut-on cumuler un code promo AliExpress avec un coupon vendeur ?',
        a: 'Absolument. Vous pouvez cumuler un code promo plateforme, un coupon boutique et vos pièces AliExpress sur une même commande.'
      },
      {
        q: 'À quelle fréquence ces codes sont-ils vérifiés ?',
        a: 'Chaque code est testé toutes les 6 heures par notre système pour garantir sa validité en {country}.'
      }
    ],
    legal: {
      privacyTitle: 'Politique de Confidentialité',
      privacyBody: 'Aucun script publicitaire intrusif ni redirection forcée. Tous nos liens affiliés utilisent l’attribut standard rel="noopener noreferrer sponsored".',
      termsTitle: 'Conditions Générales d’Utilisation',
      termsBody: 'Les offres et codes promotionnels sont soumis aux conditions des marchands partenaires en {country}.',
      aboutTitle: 'À Propos de Notre Plateforme',
      aboutBody: 'Portail international spécialisé dans la vérification de coupons tech et hardware sur 23 marchés.',
      contactTitle: 'Contact & Conformité CPA',
      contactBody: 'Pour toute question relative aux partenariats : compliance@tudominio.xyz.'
    }
  },
  pt: {
    navHome: 'Todas as Ofertas',
    navTemu: 'Cupons Temu',
    navAli: 'Ofertas AliExpress',
    navCategories: 'Categorias',
    disclosure: 'Aviso de Afiliados: Recebemos uma comissão por compras qualificadas através de links verificados (Admitad / AliExpress Portals) sem custo extra para você.',
    heroBadge: 'CUPONS DE HARDWARE E TECNOLOGIA VERIFICADOS',
    heroTitle: 'Códigos Promocionais e Bundles Ocultos para {country}',
    heroSubtitle: 'Testados diariamente em controles GameSir, roteadores Wi-Fi 6, teclados mecânicos e gadgets em {currency}.',
    btnGetCode: 'Ver e Copiar Código',
    btnCopied: 'Código Copiado!',
    btnGoStore: 'Ir para a Loja Oficial',
    minSpend: 'Compra mín.',
    verifiedBadge: 'Verificado: Nov 2026',
    expiresLabel: 'Válido até Dez 2026',
    exclusiveTag: 'CÓDIGO APP E WEB',
    secretSearchTag: 'CHAVE SECRETA DE BUSCA',
    modalTitle: 'Código Copiado para a Área de Transferência!',
    modalSteps: [
      'O código promocional foi copiado automaticamente.',
      'Cole no checkout ou diretamente na barra de pesquisa da Temu/AliExpress.',
      'Sujeito a valor mínimo de pedido em moeda local ({currency}).'
    ],
    sidebarTitle: 'Destaques de Hardware',
    sidebarSponsor: 'Oferta Patrocinada Direta',
    categories: {
      'tech-gadgets': 'Gadgets Tech e Mini PCs',
      'perifericos-gaming': 'Periféricos Gamer e Controles',
      'smart-home': 'Casa Inteligente e Automação',
      'redes-wifi': 'Redes Wi-Fi 6 e Mesh',
      'accesorios-moviles': 'Carregadores GaN e Acessórios Mobile'
    },
    seoGuideTitle: 'Guia Completo: Como Acumular Cupons da Temu e AliExpress em {country} (2026)',
    seoSection1Title: '1. Como Aplicar Códigos Secretos de Pesquisa e Somar Descontos no Carrinho',
    seoSection1Body: 'Os compradores em {country} podem economizar muito em hardware combinando códigos globais com cupons de loja. Na Temu, digitar palavras-chave secretas como credit777, wincredit ou box777 diretamente na barra de busca do aplicativo libera pacotes de cupons exclusivos em {currency}. No AliExpress, combine os códigos do Choice Day com os descontos automáticos de economize mais no carrinho (com conformidade Remessa Conforme no Brasil e IVA incluído em Portugal).',
    seoSection2Title: '2. Métodos de Envio, Prazos de Entrega e Frete Grátis em {country}',
    seoSection2Body: 'As encomendas enviadas para {country} contam com frete aéreo expresso e rastreamento ponta a ponta pelos Correios ou transportadoras locais. O prazo médio de entrega varia de 6 a 11 dias úteis. O frete grátis padrão é ativado automaticamente ao atingir o valor mínimo regional em {currency}.',
    tableHeaders: ['Loja', 'Método de Envio', 'Prazo Estimado', 'Frete Grátis a partir de'],
    faqs: [
      {
        q: 'Como funcionam os códigos secretos de busca da Temu em {country}?',
        a: 'Digite códigos como credit777 na barra de pesquisa do app Temu para desbloquear pacotes de descontos em {currency}.'
      },
      {
        q: 'Os impostos de importação já estão incluídos para {country}?',
        a: 'Sim, tanto no Brasil (Remessa Conforme) quanto em Portugal (IOSS), os tributos aplicáveis são calculados de forma transparente no checkout.'
      },
      {
        q: 'Posso acumular cupom do AliExpress com moedas e cupom do vendedor?',
        a: 'Sim! Você pode aplicar um código promocional geral, um cupom da loja e moedas simultaneamente.'
      },
      {
        q: 'Com que frequência os cupons são testados?',
        a: 'Nossa plataforma valida os limites de uso de cada código a cada 6 horas.'
      }
    ],
    legal: {
      privacyTitle: 'Política de Privacidade e Cookies',
      privacyBody: 'Operamos sem scripts invasivos ou redirecionamentos forçados. Todos os links de afiliados utilizam rel="noopener noreferrer sponsored".',
      termsTitle: 'Termos de Uso',
      termsBody: 'Todos os cupons dependem das regras de carrinho e disponibilidade em {country}.',
      aboutTitle: 'Sobre Nossa Plataforma',
      aboutBody: 'Portal técnico independente de cupons verificados para hardware e eletrônicos em 23 países.',
      contactTitle: 'Contato e Conformidade CPA',
      contactBody: 'Para auditorias de redes de afiliados ou suporte: compliance@tudominio.xyz.'
    }
  },
  it: {
    navHome: 'Tutte le Offerte',
    navTemu: 'Codici Temu',
    navAli: 'Offerte AliExpress',
    navCategories: 'Categorie',
    disclosure: 'Informativa di Affiliazione: Riceviamo una commissione sugli acquisti idonei tramite link partner verificati (Admitad / AliExpress Portals) senza costi aggiuntivi per te.',
    heroBadge: 'COUPON HARDWARE E TECH VERIFICATI',
    heroTitle: 'Codici Promo Ufficiali e Bundle Segreti per {country}',
    heroSubtitle: 'Testati ogni giorno su controller GameSir, router Wi-Fi 6, tastiere meccaniche e dispositivi in {currency}.',
    btnGetCode: 'Mostra e Copia Codice',
    btnCopied: 'Codice Copiato!',
    btnGoStore: 'Vai allo Store Ufficiale',
    minSpend: 'Spesa min.',
    verifiedBadge: 'Verificato: Nov 2026',
    expiresLabel: 'Valido fino a Dic 2026',
    exclusiveTag: 'CODICE APP & WEB',
    secretSearchTag: 'CHIAVE SEGRETA DI RICERCA',
    modalTitle: 'Codice Copiato negli Appunti!',
    modalSteps: [
      'Il codice promozionale è stato copiato automaticamente.',
      'Incollalo al checkout o nella barra di ricerca di Temu/AliExpress.',
      'Si applica la spesa minima regionale in {currency}.'
    ],
    sidebarTitle: 'Hardware Consigliato',
    sidebarSponsor: 'Offerta Sponsorizzata Diretta',
    categories: {
      'tech-gadgets': 'Gadget Tech e Mini PC',
      'perifericos-gaming': 'Periferiche Gaming e Controller',
      'smart-home': 'Smart Home e Domotica',
      'redes-wifi': 'Reti Wi-Fi 6 e Mesh',
      'accesorios-moviles': 'Caricatori GaN e Accessori Mobile'
    },
    seoGuideTitle: 'Guida Completa: Come Cumulare i Coupon Temu e AliExpress in {country} (2026)',
    seoSection1Title: '1. Come Applicare i Codici Segreti e Sommare gli Sconti a Carrello',
    seoSection1Body: 'Gli acquirenti in {country} possono ottenere il massimo risparmio su periferiche gaming e hardware combinando i codici globali con i voucher del venditore. Su Temu, digitando parole chiave segrete come credit777, wincredit o box777 nella barra di ricerca dell’app si sbloccano pacchetti esclusivi in {currency}. Su AliExpress, abbina i codici Choice Day agli sconti automatici a carrello con IVA inclusa.',
    seoSection2Title: '2. Metodi di Spedizione, Tempi di Consegna e Soglie di Spedizione Gratuita in {country}',
    seoSection2Body: 'Gli ordini destinati in {country} viaggiano tramite logistica aerea prioritaria e corrieri espressi locali (Poste Italiane, Bartolini, GLS). La consegna standard richiede 5-8 giorni lavorativi con sdoganamento automatico IOSS. La spedizione standard è gratuita superata la soglia minima in {currency}.',
    tableHeaders: ['Store', 'Metodo di Spedizione', 'Tempi Stimati', 'Spedizione Gratuita da'],
    faqs: [
      {
        q: 'Come funzionano i codici segreti di ricerca Temu in {country}?',
        a: 'Inserisci la parola chiave come credit777 direttamente nella barra di ricerca dell’app Temu per riscattare il pacchetto di coupon in {currency}.'
      },
      {
        q: 'I dazi doganali sono inclusi per le spedizioni in {country}?',
        a: 'Sì, l’IVA viene calcolata direttamente al checkout senza costi aggiuntivi alla consegna.'
      },
      {
        q: 'Posso combinare i codici AliExpress con i coupon del venditore?',
        a: 'Certamente, puoi applicare un codice piattaforma, un coupon negozio e le monete nello stesso ordine.'
      },
      {
        q: 'Quanto spesso vengono controllati questi codici?',
        a: 'Tutti i codici vengono verificati automaticamente ogni 6 ore.'
      }
    ],
    legal: {
      privacyTitle: 'Informativa sulla Privacy',
      privacyBody: 'Nessuno script di tracciamento invasivo o reindirizzamento forzato. Utilizziamo solo link conformi rel="noopener noreferrer sponsored".',
      termsTitle: 'Termini e Condizioni',
      termsBody: 'Tutti i coupon sono soggetti a disponibilità e requisiti di spesa minima in {country}.',
      aboutTitle: 'Chi Siamo',
      aboutBody: 'Portale internazionale dedicato alla verifica di codici sconto per hardware ed elettronica in 23 mercati.',
      contactTitle: 'Contatti e Conformità CPA',
      contactBody: 'Per richieste commerciali o segnalazioni: compliance@tudominio.xyz.'
    }
  },
  nl: {
    navHome: 'Alle Deals',
    navTemu: 'Temu Codes',
    navAli: 'AliExpress Deals',
    navCategories: 'Categorieën',
    disclosure: 'Affiliate Verklaring: Wij ontvangen een commissie op in aanmerking komende aankopen via geverifieerde partnerlinks (Admitad / AliExpress Portals) zonder extra kosten voor u.',
    heroBadge: 'GEVERIFIEERDE HARDWARE & TECH KORTINGSCODES',
    heroTitle: 'Officiële Promotiecodes & Verborgen Bundles voor {country}',
    heroSubtitle: 'Dagelijks getest voor GameSir controllers, Wi-Fi 6 routers, mechanische toetsenborden en gadgets in {currency}.',
    btnGetCode: 'Toon & Kopieer Code',
    btnCopied: 'Code Gekopieerd!',
    btnGoStore: 'Naar Officiële Winkel',
    minSpend: 'Min. besteding',
    verifiedBadge: 'Geverifieerd: Nov 2026',
    expiresLabel: 'Geldig t/m Dec 2026',
    exclusiveTag: 'APP & WEB CODE',
    secretSearchTag: 'GEHEIME ZOEKSLEUTEL',
    modalTitle: 'Kortingscode Gekopieerd naar Klembord!',
    modalSteps: [
      'Uw promotiecode is automatisch gekopieerd.',
      'Plak de code bij het afrekenen of in de zoekbalk van Temu/AliExpress.',
      'Minimale bestelwaarde van toepassing in {currency}.'
    ],
    sidebarTitle: 'Aanbevolen Hardware',
    sidebarSponsor: 'Gesponsorde Directe Deal',
    categories: {
      'tech-gadgets': 'Tech Gadgets & Mini-PC’s',
      'perifericos-gaming': 'Gaming Randapparatuur & Controllers',
      'smart-home': 'Smart Home & Domotica',
      'redes-wifi': 'Wi-Fi 6 & Mesh Netwerken',
      'accesorios-moviles': 'GaN Opladers & Mobiele Accessoires'
    },
    seoGuideTitle: 'Complete Gids: Temu & AliExpress Kortingscodes Stapelen in {country} (2026)',
    seoSection1Title: '1. Verborgen zoekcodes toepassen & winkelwagenkorting combineren',
    seoSection1Body: 'Consumenten in {country} besparen optimaal op gaming-gear en netwerkapparatuur door platformcodes te combineren met verkoperscoupons. Typ op Temu geheime zoekwoorden zoals credit777, wincredit of box777 rechtstreeks in de zoekbalk van de app om kortingsbundels in {currency} te ontgrendelen. Combineer op AliExpress Choice Day-codes met automatische bundelkortingen inclusief btw.',
    seoSection2Title: '2. Verzendmethoden, levertijden & gratis verzending in {country}',
    seoSection2Body: 'Bestellingen naar {country} worden snel geleverd via Europese hubs en PostNL of DHL. De standaard levertijd bedraagt 5 tot 8 werkdagen zonder verrassingskosten bij de douane. Gratis verzending geldt automatisch boven het minimale bestelbedrag in {currency}.',
    tableHeaders: ['Winkel', 'Verzendmethode', 'Geschatte Levertijd', 'Gratis Verzending vanaf'],
    faqs: [
      {
        q: 'Hoe werken geheime zoekcodes op Temu in {country}?',
        a: 'Voer de code zoals credit777 direct in de zoekbalk van de Temu-app in om het couponpakket in {currency} te activeren.'
      },
      {
        q: 'Zijn btw en invoerrechten inbegrepen voor {country}?',
        a: 'Ja, voor bestellingen onder 150 EUR wordt de btw direct bij het afrekenen voldaan.'
      },
      {
        q: 'Kan ik AliExpress-codes combineren met winkelcoupons?',
        a: 'Ja, u kunt één platformcode, één verkoperscoupon en munten tegelijk inwisselen.'
      },
      {
        q: 'Hoe vaak worden deze codes gecontroleerd?',
        a: 'Ons systeem controleert elke 6 uur of alle codes nog actief zijn.'
      }
    ],
    legal: {
      privacyTitle: 'Privacybeleid & Cookies',
      privacyBody: 'Wij gebruiken geen invasieve scripts of gedwongen omleidingen. Alle partnerlinks bevatten rel="noopener noreferrer sponsored".',
      termsTitle: 'Gebruiksvoorwaarden',
      termsBody: 'Kortingscodes zijn afhankelijk van beschikbaarheid en winkelwagenvoorwaarden in {country}.',
      aboutTitle: 'Over Ons Platform',
      aboutBody: 'Onafhankelijk platform voor geverifieerde hardware- en elektronicakortingscodes in 23 landen.',
      contactTitle: 'Contact & CPA Compliance',
      contactBody: 'Neem voor zakelijke vragen contact op via compliance@tudominio.xyz.'
    }
  },
  pl: {
    navHome: 'Wszystkie Oferty',
    navTemu: 'Kody Temu',
    navAli: 'Promocje AliExpress',
    navCategories: 'Kategorie',
    disclosure: 'Informacja afiliacyjna: Otrzymujemy prowizję od kwalifikujących się zakupów za pośrednictwem zweryfikowanych linków partnerskich (Admitad / AliExpress Portals) bez dodatkowych kosztów dla Ciebie.',
    heroBadge: 'ZWERYFIKOWANE KODY RABATOWE NA HARDWARE I TECH',
    heroTitle: 'Oficjalne Kody Promocyjne i Ukryte Pakiety dla: {country}',
    heroSubtitle: 'Codziennie testowane na kontrolerach GameSir, routerach Wi-Fi 6, klawiaturach mechanicznych i gadżetach w {currency}.',
    btnGetCode: 'Pokaż i Skopiuj Kod',
    btnCopied: 'Kod Skopiowany!',
    btnGoStore: 'Przejdź do Sklepu',
    minSpend: 'Min. zamówienie',
    verifiedBadge: 'Zweryfikowano: Lis 2026',
    expiresLabel: 'Ważny do Gru 2026',
    exclusiveTag: 'KOD APP I WEB',
    secretSearchTag: 'TAJNE HASŁO WYSZUKIWANIA',
    modalTitle: 'Kod Skopiowany do Schowka!',
    modalSteps: [
      'Twój kod rabatowy został automatycznie skopiowany.',
      'Wklej go przy kasie lub bezpośrednio w pasku wyszukiwania Temu/AliExpress.',
      'Obowiązuje minimalna kwota zamówienia w walucie lokalnej ({currency}).'
    ],
    sidebarTitle: 'Polecany Sprzęt',
    sidebarSponsor: 'Oferta Sponsorowana',
    categories: {
      'tech-gadgets': 'Gadżety Tech i Mini PC',
      'perifericos-gaming': 'Peryferia Gamingowe i Kontrolery',
      'smart-home': 'Smart Home i Automatyka',
      'redes-wifi': 'Sieci Wi-Fi 6 i Mesh',
      'accesorios-moviles': 'Ładowarki GaN i Akcesoria Mobilne'
    },
    seoGuideTitle: 'Kompletny Przewodnik: Jak Łączyć Kupony Temu i AliExpress w kraju {country} (2026)',
    seoSection1Title: '1. Jak stosować tajne kody wyszukiwania i łączyć rabaty koszykowe',
    seoSection1Body: 'Kupujący w kraju {country} mogą maksymalnie obniżyć ceny sprzętu komputerowego, łącząc ogólne kody rabatowe z kuponami sprzedawców. W aplikacji Temu wpisanie tajnych haseł takich jak credit777, wincredit lub box777 bezpośrednio w wyszukiwarkę odblokowuje pakiety kuponów w {currency}. Na AliExpress łącz kody Choice Day z automatycznymi zniżkami w koszyku.',
    seoSection2Title: '2. Metody dostawy, czas realizacji i progi darmowej wysyłki ({country})',
    seoSection2Body: 'Zamówienia do kraju {country} realizowane są przez europejskie magazyny oraz InPost Paczkomaty i kurierów DPD/DHL. Standardowa dostawa trwa od 5 do 8 dni roboczych z opłaconym podatkiem VAT. Darmowa wysyłka aktywuje się po przekroczeniu progu minimalnego w {currency}.',
    tableHeaders: ['Sklep', 'Metoda Dostawy', 'Czas Dostawy', 'Darmowa Wysyłka od'],
    faqs: [
      {
        q: 'Jak działają tajne kody wyszukiwania Temu w kraju {country}?',
        a: 'Wpisz hasło np. credit777 w pasku wyszukiwania aplikacji Temu, aby odebrać pakiet kuponów w {currency}.'
      },
      {
        q: 'Czy podatek VAT i cło są wliczone w cenę?',
        a: 'Tak, podatek VAT jest naliczany automatycznie przy płatności zgodnie z procedurą IOSS.'
      },
      {
        q: 'Czy można łączyć kody AliExpress z kuponami sprzedawców?',
        a: 'Tak, możesz jednocześnie użyć kodu głównego, kuponu sklepu oraz zniżki za monety.'
      },
      {
        q: 'Jak często sprawdzana jest ważność kodów?',
        a: 'Nasz system weryfikuje aktywność każdego kodu co 6 godzin.'
      }
    ],
    legal: {
      privacyTitle: 'Polityka Prywatności',
      privacyBody: 'Brak inwazyjnych skryptów śledzących i wymuszonych przekierowań. Wszystkie linki partnerskie posiadają atrybut rel="noopener noreferrer sponsored".',
      termsTitle: 'Regulamin Serwisu',
      termsBody: 'Wszystkie kody rabatowe podlegają warunkom sprzedawców w kraju {country}.',
      aboutTitle: 'O Naszej Platformie',
      aboutBody: 'Niezależny indeks zweryfikowanych kuponów na sprzęt i elektronikę w 23 krajach.',
      contactTitle: 'Kontakt i Zgodność CPA',
      contactBody: 'Kontakt w sprawach afiliacyjnych: compliance@tudominio.xyz.'
    }
  },
  ja: {
    navHome: 'すべてのセール',
    navTemu: 'Temu クーポン',
    navAli: 'AliExpress 特価',
    navCategories: 'カテゴリー',
    disclosure: 'アフィリエイト開示：当サイトは認証済みパートナーリンク（Admitad / AliExpress Portals）を通じて適格な購入から手数料を受け取りますが、ユーザーの追加費用は一切発生しません。',
    heroBadge: '検証済みハードウェア＆テック系クーポン',
    heroTitle: '{country}向け公式プロモコード＆シークレットバンドル',
    heroSubtitle: 'GameSirコントローラー、Wi-Fi 6ルーター、メカニカルキーボード、最新ガジェットで毎日テスト済み（通貨：{currency}）。',
    btnGetCode: 'コードを表示してコピー',
    btnCopied: 'コピー完了！',
    btnGoStore: '公式ストアへ移動',
    minSpend: '最低注文金額',
    verifiedBadge: '確認済み: 2026年11月',
    expiresLabel: '2026年12月まで有効',
    exclusiveTag: 'アプリ＆WEBコード',
    secretSearchTag: '検索シークレットキー',
    modalTitle: 'クーポンコードをコピーしました！',
    modalSteps: [
      'プロモーションコードがクリップボードに自動コピーされました。',
      '決済画面、またはTemu/AliExpressの検索バーに直接貼り付けてください。',
      '{currency}建ての最低注文金額が適用されます。'
    ],
    sidebarTitle: '注目ハードウェア厳選',
    sidebarSponsor: 'スポンサー直販オファー',
    categories: {
      'tech-gadgets': 'テックガジェット＆ミニPC',
      'perifericos-gaming': 'ゲーミング周辺機器＆コントローラー',
      'smart-home': 'スマートホーム＆自動化機器',
      'redes-wifi': 'Wi-Fi 6＆メッシュネットワーク',
      'accesorios-moviles': 'GaN急速充電器＆モバイル機器'
    },
    seoGuideTitle: '完全ガイド：{country}でTemuとAliExpressのクーポンを併用して最大限割引する方法 (2026年)',
    seoSection1Title: '1. シークレット検索コードの適用とカート割引の重ね掛け手順',
    seoSection1Body: '{country}のユーザーは、全体プロモコードとストアクーポンを組み合わせることで、ゲーミングデバイスやネットワーク機器を最安値で購入できます。Temuアプリの上部検索バーに「credit777」「wincredit」「box777」などのシークレットキーワードを直接入力すると、{currency}建ての限定クーポンバンドルが解放されます。AliExpressではChoice Dayコードと自動割引を決済時に併用可能です。',
    seoSection2Title: '2. {country}向けの配送方法、到着日数、送料無料ライン（{currency}）',
    seoSection2Body: '{country}への発送は優先航空便およびヤマト運輸・佐川急便・日本郵便などの国内配送網で迅速に届けられます。標準配送は4〜7営業日で到着し、規定の最低注文金額（{currency}）を満たすと送料が完全無料になります。',
    tableHeaders: ['ストア', '配送方法', '到着目安', '送料無料ライン'],
    faqs: [
      {
        q: 'Temuのシークレット検索コード（credit777など）はどう使いますか？',
        a: '決済画面ではなく、Temuアプリのメイン検索バーにキーワードを直接入力して検索すると、{currency}対応の特別クーポンパックが開きます。'
      },
      {
        q: '{country}への配送に関税や追加費用はかかりますか？',
        a: '通常の個人輸入範囲内の注文では、決済時に表示される金額以外の追加手数料は発生しません。'
      },
      {
        q: 'AliExpressのプロモコードとストアクーポンは併用できますか？',
        a: 'はい、プラットフォーム共通コード、ショップクーポン、コイン割引を1回の決済で同時に適用できます。'
      },
      {
        q: 'クーポンコードの有効性はどのくらいの頻度で確認されていますか？',
        a: '当システムの自動検証エンジンが6時間ごとに全23地域のコード残数をチェックしています。'
      }
    ],
    legal: {
      privacyTitle: 'プライバシーポリシー',
      privacyBody: '当サイトは不正な追跡スクリプトや強制リダイレクトを一切使用しません。すべてのアフィリエイトリンクは標準の rel="noopener noreferrer sponsored" 属性を使用しています。',
      termsTitle: '利用規約',
      termsBody: '掲載されているすべてのクーポンおよび割引は、{country}における各ストアの規約および在庫状況に準拠します。',
      aboutTitle: '当プラットフォームについて',
      aboutBody: '世界23地域で検証済みのPCハードウェア・ガジェット特化型クーポンインデックスです。',
      contactTitle: 'お問い合わせ・CPAコンプライアンス窓口',
      contactBody: '提携およびコンプライアンスに関するご連絡先：compliance@tudominio.xyz'
    }
  },
  ko: {
    navHome: '전체 특가',
    navTemu: 'Temu 쿠폰',
    navAli: 'AliExpress 프로모션',
    navCategories: '카테고리',
    disclosure: '제휴 공개: 당사는 검증된 파트너 링크(Admitad / AliExpress Portals)를 통한 적격 구매에 대해 추가 비용 없이 수수료를 제공받습니다.',
    heroBadge: '검증된 하드웨어 및 테크 할인 코드',
    heroTitle: '{country} 공식 프로모션 코드 및 시크릿 번들',
    heroSubtitle: 'GameSir 컨트롤러, Wi-Fi 6 공유기, 기계식 키보드 및 스마트 기기 매일 테스트 완료 ({currency} 기준).',
    btnGetCode: '코드 확인 및 복사',
    btnCopied: '복사 완료!',
    btnGoStore: '공식 스토어로 이동',
    minSpend: '최소 주문 금액',
    verifiedBadge: '검증됨: 2026년 11월',
    expiresLabel: '2026년 12월까지 유효',
    exclusiveTag: '앱 & 웹 전용 코드',
    secretSearchTag: '시크릿 검색 키워드',
    modalTitle: '할인 코드가 클립보드에 복사되었습니다!',
    modalSteps: [
      '프로모션 코드가 자동으로 복사되었습니다.',
      '결제 단계에서 붙여넣거나 Temu/AliExpress 검색창에 직접 입력하세요.',
      '현지 통화({currency}) 기준 최소 주문 금액이 적용됩니다.'
    ],
    sidebarTitle: '추천 하드웨어 특가',
    sidebarSponsor: '스폰서 공식 혜택',
    categories: {
      'tech-gadgets': '테크 가젯 & 미니 PC',
      'perifericos-gaming': '게이밍 기어 & 컨트롤러',
      'smart-home': '스마트 홈 & IoT',
      'redes-wifi': 'Wi-Fi 6 & 메시 공유기',
      'accesorios-moviles': 'GaN 충전기 & 모바일 액세서리'
    },
    seoGuideTitle: '완벽 가이드: {country}에서 Temu 및 AliExpress 쿠폰 중복 적용 방법 (2026)',
    seoSection1Title: '1. 시크릿 검색 코드 사용법 및 장바구니 중복 할인 팁',
    seoSection1Body: '{country} 구매자는 플랫폼 프로모션 코드와 판매자 스토어 쿠폰을 결합하여 게이밍 기어와 하드웨어 구매 비용을 극대화하여 절약할 수 있습니다. Temu 앱 상단 검색창에 credit777, wincredit, box777 같은 시크릿 키워드를 입력하면 {currency} 전용 쿠폰 팩이 즉시 활성화됩니다. AliExpress에서는 Choice Day 할인 코드와 자동 할인을 동시에 적용할 수 있습니다.',
    seoSection2Title: '2. {country} 직배송 방법, 배송 기간 및 무료 배송 기준 ({currency})',
    seoSection2Body: '{country}행 주문은 전용 항공 물류와 국내 택배사(CJ대한통운, 우체국택배 등)를 통해 평균 4~7영업일 내에 빠르게 배송됩니다. 개인통관고유부호를 입력하면 통관이 원활하게 진행되며, 최소 주문 기준({currency}) 달성 시 무료 배송이 자동 적용됩니다.',
    tableHeaders: ['스토어', '배송 방식', '예상 배송 기간', '무료 배송 기준'],
    faqs: [
      {
        q: 'Temu 시크릿 검색 코드(credit777 등)는 어떻게 사용하나요?',
        a: '결제 창이 아닌 Temu 모바일 앱 상단 검색창에 키워드를 직접 입력하면 {currency} 쿠폰 번들 페이지가 열립니다.'
      },
      {
        q: '{country} 배송 시 관부가세가 부과되나요?',
        a: '미화 150달러 이하의 개인 직구 물품은 목록통관 대상으로 관부가세가 면제됩니다.'
      },
      {
        q: 'AliExpress 프로모션 코드와 스토어 쿠폰을 중복 사용할 수 있나요?',
        a: '네, 플랫폼 코드 1개, 판매자 쿠폰 1개 및 코인 할인을 동시에 적용할 수 있습니다.'
      },
      {
        q: '쿠폰 코드는 얼마나 자주 업데이트되나요?',
        a: '자동 검증 시스템이 6시간마다 코드 소진 여부를 확인합니다.'
      }
    ],
    legal: {
      privacyTitle: '개인정보 처리방침',
      privacyBody: '당사는 침해적인 추적 스크립트나 강제 리디렉션을 사용하지 않으며 모든 제휴 링크에 rel="noopener noreferrer sponsored" 표준을 준수합니다.',
      termsTitle: '이용 약관',
      termsBody: '모든 프로모션 코드는 {country} 내 판매자 정책 및 재고 상황에 따릅니다.',
      aboutTitle: '플랫폼 소개',
      aboutBody: '전 세계 23개 국가의 검증된 하드웨어 및 전자제품 할인 정보를 제공하는 기술 인덱스입니다.',
      contactTitle: '문의 및 CPA 규정 준수',
      contactBody: '파트너십 및 제휴 문의: compliance@tudominio.xyz'
    }
  },
  ar: {
    navHome: 'جميع الكوبونات',
    navTemu: 'كوبونات Temu',
    navAli: 'كوبونات AliExpress',
    navCategories: 'الفئات',
    disclosure: 'إفصاح التسويق بالعمولة: نحصل على عمولة من عمليات الشراء المؤهلة عبر روابط الشركاء المعتمدة (Admitad / AliExpress Portals) دون أي تكلفة إضافية عليك.',
    heroBadge: 'كوبونات خصم مباشرة ومعتمدة للدفع',
    heroTitle: 'أكواد خصم حقيقية للسلة ومخصصة لـ {country}',
    heroSubtitle: 'أكواد خصم مباشرة عند الدفع لأذرع التحكم والحواسيب والشبكات والمنزل الذكي بعملة {currency}.',
    btnGetCode: 'إظهار ونسخ الكود',
    btnCopied: 'تم نسخ الكود!',
    btnGoStore: 'الذهاب إلى المتجر الرسمي',
    minSpend: 'الحد الأدنى للطلب',
    verifiedBadge: 'مؤكد: نوفمبر 2026',
    expiresLabel: 'صالح حتى ديسمبر 2026',
    exclusiveTag: 'كود خصم مباشر بالسلة',
    secretSearchTag: 'كود نشاط في شريط البحث',
    modalTitle: 'تم نسخ كود الخصم إلى الحافظة!',
    modalSteps: [
      'تم نسخ الكود الترويجي تلقائياً.',
      'الصقه في خانة كود الخصم عند إتمام الدفع في سلة التسوق.',
      'يطبق الحد الأدنى للطلب بالعملة المحلية ({currency}).'
    ],
    sidebarTitle: 'خطوات التوفير الذكي',
    sidebarSponsor: 'دليل معتمد',
    categories: {
      'tech-gadgets': 'أجهزة الكمبيوتر والتقنية',
      'perifericos-gaming': 'أذرع التحكم وملحقات الألعاب',
      'smart-home': 'المنزل الذكي والأجهزة المنزلية',
      'redes-wifi': 'راوترات وشبكات Wi-Fi',
      'accesorios-moviles': 'شواحن سريعة وملحقات الهواتف'
    },
    seoGuideTitle: 'الدليل الشامل: كيفية استخدام كوبونات Temu و AliExpress واسترداد فرق السعر في {country}',
    seoSection1Title: '1. الفرق بين كوبونات الدفع المباشر وأكواد الأنشطة وميزة تعديل السعر (Price Adjustment)',
    seoSection1Body: 'في {country} يمكنك التوفير بطريقتين: الأولى هي لصق كود الخصم المباشر في صفحة الدفع النهائية، والثانية هي ميزة تعديل السعر خلال 30 يوماً؛ فإذا اشتريت منتجاً بـ 20 وانخفض سعره غداً إلى 15، يمكنك الضغط على زر طلب تعديل السعر داخل صفحة طلباتك لاسترداد فرق الـ 5 فوراً بعملة {currency}.',
    seoSection2Title: '2. طرق الشحن المحلية، مدة التوصيل، وحد الشحن المجاني في {country}',
    seoSection2Body: 'تستفيد الطلبات المتجهة إلى {country} من الشحن الجوي المباشر والتوصيل السريع حتى باب المنزل خلال 5 إلى 9 أيام عمل مع تفعيل الشحن المجاني عند بلوغ الحد الأدنى بعملة {currency}.',
    tableHeaders: ['المتجر', 'طريقة الشحن', 'مدة التوصيل المتوقعة', 'حد الشحن المجاني'],
    faqs: [
      {
        q: 'كيف أسترجع فرق السعر إذا رخص المنتج بعد شرائي له؟',
        a: 'ادخل إلى قسم طلباتك خلال 30 يوماً من الشراء واضغط على زر طلب تعديل السعر ليتم إرجاع الفرق فوراً بعملة {currency}.'
      },
      {
        q: 'هل تشمل الأسعار الضرائب والرسوم الجمركية في {country}؟',
        a: 'نعم، يتم احتساب الضرائب المقررة مباشرة عند الدفع دون رسوم مخفية.'
      },
      {
        q: 'هل يمكنني دمج كود خصم AliExpress مع قسيمة البائع؟',
        a: 'نعم، يمكنك تفعيل كود منصة عام مع قسيمة المتجر والعملات المعدنية في نفس الطلب.'
      },
      {
        q: 'كم مرة يتم التحقق من صلاحية هذه الأكواد؟',
        a: 'يتم فحص جميع الكوبونات كل 6 ساعات لضمان فعاليتها.'
      }
    ],
    legal: {
      privacyTitle: 'سياسة الخصوصية',
      privacyBody: 'نلتزم بعدم استخدام أي برمجيات تتبع مزعجة. جميع روابط الشركاء تستخدم وسم rel="noopener noreferrer sponsored".',
      termsTitle: 'شروط الخدمة',
      termsBody: 'تخضع جميع الكوبونات لشروط المتاجر والتوفر الإقليمي في {country}.',
      aboutTitle: 'عن منصتنا العالمية',
      aboutBody: 'دليل عالمي للتحقق من كوبونات التقنية والأجهزة عبر أكثر من 60 دولة.',
      contactTitle: 'اتصل بنا',
      contactBody: 'للاستفسارات: contacto@cuponestech.tech'
    }
  },
  zh: {
    navHome: '全部优惠券',
    navTemu: 'Temu 结账券',
    navAli: 'AliExpress 优惠码',
    navCategories: '商品分类',
    disclosure: '联盟披露：我们通过经认证的合作伙伴链接（Admitad / AliExpress Portals）从符合条件的购买中获取佣金，不会向您收取任何额外费用。',
    heroBadge: '已验证的结账直减优惠码',
    heroTitle: '{country} 专属官方折扣码与退差价指南',
    heroSubtitle: '适用于电脑硬件、游戏手柄、智能家居、Wi-Fi 路由器及快充配件的购物车直减码（货币：{currency}）。',
    btnGetCode: '显示并复制优惠码',
    btnCopied: '已复制！',
    btnGoStore: '前往官方商城',
    minSpend: '最低消费',
    verifiedBadge: '已验证：2026年11月',
    expiresLabel: '有效期至 2026年12月',
    exclusiveTag: '结账直减码',
    secretSearchTag: '搜索框隐藏活动词',
    modalTitle: '优惠码已复制到剪贴板！',
    modalSteps: [
      '您的专属优惠码已自动复制。',
      '请在购物车结账页面的“促销代码 / Promo Code”栏中粘贴使用。',
      '需满足当地货币（{currency}）最低订单金额。'
    ],
    sidebarTitle: '省钱与退差价指南',
    sidebarSponsor: '官方攻略',
    categories: {
      'tech-gadgets': '电脑主机与迷你PC',
      'perifericos-gaming': '游戏手柄与电竞外设',
      'smart-home': '智能家居与小家电',
      'redes-wifi': 'Wi-Fi 6 路由器与网络',
      'accesorios-moviles': '氮化镓快充与手机配件'
    },
    seoGuideTitle: '完整攻略：如何在 {country} 叠加使用 Temu 与 AliExpress 优惠券及申请 30 天退差价',
    seoSection1Title: '1. 结账直减券的使用方法与 30 天保价退差价（Price Adjustment）技巧',
    seoSection1Body: '在 {country} 购买电子硬件时，您可以在结账页面直接粘贴本页提供的折扣码立减。此外，如果您今天以 20 购买了商品，明天卖家降价到 15，您可以在订单详情页点击“申请价格调整（Price Adjustment）”，系统将立即退还 5 的差价（{currency}），无需退货。',
    seoSection2Title: '2. {country} 本地配送方式、时效及包邮门槛（{currency}）',
    seoSection2Body: '发往 {country} 的订单均采用航空专线与本地快递派送，通常 4 至 8 个工作日即可送达。满规定金额（{currency}）即享自动免运费。',
    tableHeaders: ['商城', '配送方式', '预计时效', '免运费门槛'],
    faqs: [
      {
        q: '买完商品后降价了怎么申请退还差价？',
        a: '在下单后 30 天内进入“我的订单”，点击“申请价格调整（Price Adjustment）”，差额将以 {currency} 立即退回。'
      },
      {
        q: '搜索框隐藏词（如 credit777）和结账优惠码有什么区别？',
        a: '结账优惠码是在付款时直接抵扣金额；而 credit777 等关键词是在 Temu 搜索栏输入以打开转盘或积分活动。'
      },
      {
        q: 'AliExpress 平台码可以和店铺券叠加吗？',
        a: '可以，您可以同时叠加平台促销码、卖家店铺券和金币抵扣。'
      },
      {
        q: '这些优惠码多久更新一次？',
        a: '我们的系统每 6 小时自动检测所有优惠码的可用余量。'
      }
    ],
    legal: {
      privacyTitle: '隐私政策',
      privacyBody: '本站不使用任何侵入式追踪脚本或强制跳转，所有合作链接均遵循 rel="noopener noreferrer sponsored" 规范。',
      termsTitle: '服务条款',
      termsBody: '所有优惠券受限于 {country} 当地商城的库存与购物车规则。',
      aboutTitle: '关于我们',
      aboutBody: '覆盖全球 60 多个国家与地区的数码硬件优惠券验证平台。',
      contactTitle: '联系我们',
      contactBody: '合作与合规咨询：contacto@cuponestech.tech'
    }
  },
  ru: {
    navHome: 'Все Купоны',
    navTemu: 'Промокоды Temu',
    navAli: 'Купоны AliExpress',
    navCategories: 'Категории',
    disclosure: 'Партнерское уведомление: мы получаем комиссию за покупки по проверенным ссылкам (Admitad / AliExpress Portals) без доплат с вашей стороны.',
    heroBadge: 'ПРОВЕРЕННЫЕ ПРОМОКОДЫ ДЛЯ КОРЗИНЫ',
    heroTitle: 'Официальные купоны на скидку и возврат разницы цен для: {country}',
    heroSubtitle: 'Прямые промокоды при оплате на компьютеры, геймпады, умный дом, роутеры Wi-Fi и зарядные устройства в {currency}.',
    btnGetCode: 'Показать и скопировать код',
    btnCopied: 'Код скопирован!',
    btnGoStore: 'Перейти в магазин',
    minSpend: 'Мин. заказ',
    verifiedBadge: 'Проверено: Ноя 2026',
    expiresLabel: 'Действует до Дек 2026',
    exclusiveTag: 'ПРОМОКОД ДЛЯ ОПЛАТЫ',
    secretSearchTag: 'КОД АКЦИИ В ПОИСКЕ',
    modalTitle: 'Промокод скопирован в буфер обмена!',
    modalSteps: [
      'Промокод автоматически скопирован.',
      'Вставьте его в поле «Промокод» на странице оформления заказа.',
      'Действует при минимальной сумме заказа в {currency}.'
    ],
    sidebarTitle: 'Правила экономии',
    sidebarSponsor: 'Инструкция',
    categories: {
      'tech-gadgets': 'Компьютеры и Мини-ПК',
      'perifericos-gaming': 'Геймпады и Игровая периферия',
      'smart-home': 'Умный дом и Техника для дома',
      'redes-wifi': 'Роутеры Wi-Fi 6 и Сети',
      'accesorios-moviles': 'Зарядки GaN и Аксессуары'
    },
    seoGuideTitle: 'Полное руководство: Как применять промокоды Temu и AliExpress в стране {country} и возвращать разницу в цене',
    seoSection1Title: '1. Прямые купоны корзины и возврат разницы цены за 30 дней (Price Adjustment)',
    seoSection1Body: 'Покупатели в стране {country} могут экономить при оплате корзины, комбинируя промокоды платформы с купонами продавцов. Кроме того, если вы купили товар за 20, а завтра продавец снизил цену до 15, нажмите кнопку «Запросить корректировку цены» в разделе заказов в течение 30 дней, и вам мгновенно вернут разницу 5 в {currency}.',
    seoSection2Title: '2. Способы доставки, сроки и бесплатная доставка ({country})',
    seoSection2Body: 'Заказы в страну {country} доставляются авиапочтой и местными курьерскими службами за 6–12 рабочих дней с бесплатной доставкой от минимального порога в {currency}.',
    tableHeaders: ['Магазин', 'Способ доставки', 'Срок доставки', 'Бесплатно от'],
    faqs: [
      {
        q: 'Как вернуть разницу, если товар подешевел после покупки?',
        a: 'Откройте «Мои заказы» в течение 30 дней и нажмите «Корректировка цены (Price Adjustment)» — разница сразу вернется на баланс в {currency}.'
      },
      {
        q: 'Чем отличаются коды поиска (credit777) от обычных купонов?',
        a: 'Обычные промокоды вводятся при оплате корзины, а коды вроде credit777 вводятся в строку поиска приложения Temu для открытия мини-игр.'
      },
      {
        q: 'Можно ли совмещать промокод AliExpress с купоном продавца?',
        a: 'Да, при оформлении заказа можно применить общий промокод, купон магазина и монеты одновременно.'
      },
      {
        q: 'Как часто проверяются промокоды?',
        a: 'Все коды проверяются автоматически каждые 6 часов.'
      }
    ],
    legal: {
      privacyTitle: 'Политика конфиденциальности',
      privacyBody: 'Мы не используем навязчивые скрипты. Все партнерские ссылки содержат атрибут rel="noopener noreferrer sponsored".',
      termsTitle: 'Условия использования',
      termsBody: 'Все купоны зависят от правил магазина в регионе {country}.',
      aboutTitle: 'О платформе',
      aboutBody: 'Международный каталог проверенных промокодов на электронику в более чем 60 странах.',
      contactTitle: 'Контакты',
      contactBody: 'Связь с нами: contacto@cuponestech.tech'
    }
  },
  tr: {
    navHome: 'Tüm Kuponlar',
    navTemu: 'Temu Kuponları',
    navAli: 'AliExpress İndirimleri',
    navCategories: 'Kategoriler',
    disclosure: 'Satış Ortaklığı Bildirimi: Doğrulanmış iş ortağı bağlantıları (Admitad / AliExpress Portals) üzerinden yapılan alışverişlerden size ek maliyet yansımadan komisyon kazanabiliriz.',
    heroBadge: 'DOĞRULANMIŞ SEPET İNDİRİM KODLARI',
    heroTitle: '{country} İçin Resmi İndirim Kuponları ve Fiyat Farkı İade Rehberi',
    heroSubtitle: 'Bilgisayar, oyun kolları, akıllı ev ürünleri, Wi-Fi yönlendiriciler ve şarj cihazları için sepette geçerli kodlar ({currency}).',
    btnGetCode: 'Kodu Göster ve Kopyala',
    btnCopied: 'Kod Kopyalandı!',
    btnGoStore: 'Resmi Mağazaya Git',
    minSpend: 'Min. sepet',
    verifiedBadge: 'Doğrulandı: Kas 2026',
    expiresLabel: 'Ara 2026’ya kadar geçerli',
    exclusiveTag: 'SEPETTE İNDİRİM KODU',
    secretSearchTag: 'ARAMA ÇUBUĞU ETKİNLİK KODU',
    modalTitle: 'İndirim Kodu Panoya Kopyalandı!',
    modalSteps: [
      'Promosyon kodunuz otomatik olarak kopyalandı.',
      'Ödeme adımında "Promosyon Kodu" kutusuna yapıştırın.',
      '{currency} cinsinden minimum sepet tutarı geçerlidir.'
    ],
    sidebarTitle: 'Tasarruf İpuçları',
    sidebarSponsor: 'Resmi Rehber',
    categories: {
      'tech-gadgets': 'Bilgisayar ve Mini PC',
      'perifericos-gaming': 'Oyun Kolları ve Oyuncu Ekipmanı',
      'smart-home': 'Akıllı Ev ve Ev Aletleri',
      'redes-wifi': 'Wi-Fi 6 Modem ve Ağ Ürünleri',
      'accesorios-moviles': 'GaN Hızlı Şarj ve Telefon Aksesuarı'
    },
    seoGuideTitle: 'Kapsamlı Rehber: {country} İçin Temu & AliExpress Kupon Kullanımı ve Fiyat Farkı İadesi',
    seoSection1Title: '1. Sepet Kuponları ve 30 Günlük Fiyat Farkı İadesi (Price Adjustment)',
    seoSection1Body: '{country} içindeki kullanıcılar ödeme ekranında doğrudan indirim kodlarını kullanabilir. Ayrıca 20 birime aldığınız bir ürün ertesi gün 15 birime düşerse, "Siparişlerim" bölümünden "Fiyat Ayarlaması İste (Price Adjustment)" butonuna tıklayarak 5 birimlik farkı ({currency}) ürünü iade etmeden anında geri alabilirsiniz.',
    seoSection2Title: '2. {country} Teslimat Süreleri ve Ücretsiz Kargo Limitleri ({currency})',
    seoSection2Body: '{country} siparişleri hava kargo ve yerel kuryelerle 5-10 iş günü içinde teslim edilir. Minimum sepet tutarına ({currency}) ulaşıldığında standart kargo ücretsizdir.',
    tableHeaders: ['Mağaza', 'Kargo Yöntemi', 'Tahmini Teslimat', 'Ücretsiz Kargo Limiti'],
    faqs: [
      {
        q: 'Aldığım ürünün fiyatı düşerse aradaki farkı nasıl geri alırım?',
        a: 'Siparişten sonraki 30 gün içinde "Siparişlerim" sayfasındaki "Fiyat Ayarlaması (Price Adjustment)" düğmesine basarak farkı {currency} olarak anında geri alabilirsiniz.'
      },
      {
        q: 'credit777 gibi arama kodları ile normal kuponlar arasındaki fark nedir?',
        a: 'Normal kuponlar ödeme ekranında sepette indirim sağlar; credit777 gibi kodlar ise Temu arama çubuğuna yazılarak ödül oyunlarını açar.'
      },
      {
        q: 'AliExpress kuponları satıcı kuponlarıyla birleştirilebilir mi?',
        a: 'Evet, aynı siparişte hem genel platform kodunu hem de mağaza kuponunu birlikte kullanabilirsiniz.'
      },
      {
        q: 'Kuponlar ne sıklıkla kontrol ediliyor?',
        a: 'Tüm kodlar her 6 saatte bir otomatik olarak test edilmektedir.'
      }
    ],
    legal: {
      privacyTitle: 'Gizlilik Politikası',
      privacyBody: 'Zorunlu yönlendirme veya zararlı takip komut dosyaları kullanmıyoruz. Tüm bağlantılar rel="noopener noreferrer sponsored" standardındadır.',
      termsTitle: 'Kullanım Koşulları',
      termsBody: 'Tüm kuponlar {country} mağaza koşullarına tabidir.',
      aboutTitle: 'Hakkımızda',
      aboutBody: '66 ülkede doğrulanmış teknoloji ve ev ürünleri kupon platformu.',
      contactTitle: 'İletişim',
      contactBody: 'İletişim: contacto@cuponestech.tech'
    }
  },
  ...EXTRA_NATIONAL_LANGUAGE_PACKS
};

// Inject full 11-category dictionaries and normalize contact email across all 27 language packs
for (const [langKey, pack] of Object.entries(LANGUAGE_PACKS)) {
  if (FULL_CATEGORIES_BY_LANG[langKey]) {
    pack.categories = { ...FULL_CATEGORIES_BY_LANG[langKey] };
  }
  if (pack.legal?.contactBody) {
    pack.legal.contactBody = pack.legal.contactBody.replace(/compliance@tudominio\.xyz/g, 'contacto@cuponestech.tech');
  }
}
