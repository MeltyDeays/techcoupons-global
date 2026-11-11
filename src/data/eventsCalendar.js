// Automatic Annual Event Calendar & Countdown Engine for AliExpress & Temu
// Automatically detects active seasonal sales (11.11, Choice Day, Black Friday, 12.12, Anniversary, 618)
// and localizes the banner, countdown labels, and 11.11 filter button across all 27 native languages.

export const ANNUAL_EVENTS_SCHEDULE = [
  {
    id: '11-11-singles-day',
    codeTag: '11.11 & BLACK FRIDAY',
    codeTagByStore: {
      aliexpress: 'ALIEXPRESS 11.11',
      temu: 'TEMU BLACK FRIDAY'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: true,
    // Nov 1 to Nov 18 every year (AliExpress 11.11 Singles Day + Temu Early Black Friday)
    isActiveOnDate: (m, d) => m === 11 && d >= 1 && d <= 18,
    getEndDate: (year) => new Date(year, 10, 18, 23, 59, 59),
    getStartDate: (year) => new Date(year, 10, 1, 0, 0, 0)
  },
  {
    id: 'black-friday-cyber-monday',
    codeTag: 'BLACK FRIDAY & CYBER WEEK',
    codeTagByStore: {
      aliexpress: 'ALIEXPRESS BLACK FRIDAY',
      temu: 'TEMU BLACK FRIDAY'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: false,
    // Nov 19 to Dec 3 every year
    isActiveOnDate: (m, d) => (m === 11 && d >= 19) || (m === 12 && d <= 3),
    getEndDate: (year) => new Date(year, 11, 3, 23, 59, 59),
    getStartDate: (year) => new Date(year, 10, 19, 0, 0, 0)
  },
  {
    id: '12-12-year-end-sale',
    codeTag: '12.12 LIQUIDACIÓN',
    codeTagByStore: {
      aliexpress: 'ALIEXPRESS 12.12',
      temu: 'TEMU 12.12'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: false,
    // Dec 8 to Dec 15 every year
    isActiveOnDate: (m, d) => m === 12 && d >= 8 && d <= 15,
    getEndDate: (year) => new Date(year, 11, 15, 23, 59, 59),
    getStartDate: (year) => new Date(year, 11, 8, 0, 0, 0)
  },
  {
    id: 'anniversary-sale',
    codeTag: 'ANIVERSARIO & PRIMAVERA',
    codeTagByStore: {
      aliexpress: 'ANIVERSARIO ALIEXPRESS',
      temu: 'TEMU SPRING SALE'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: false,
    // Mar 18 to Mar 28 every year
    isActiveOnDate: (m, d) => m === 3 && d >= 18 && d <= 28,
    getEndDate: (year) => new Date(year, 2, 28, 23, 59, 59),
    getStartDate: (year) => new Date(year, 2, 18, 0, 0, 0)
  },
  {
    id: '618-mid-year-sale',
    codeTag: '618 & SUMMER SALE',
    codeTagByStore: {
      aliexpress: 'ALIEXPRESS 618',
      temu: 'TEMU SUMMER MEGA SALE'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: false,
    // Jun 12 to Jun 25 every year
    isActiveOnDate: (m, d) => m === 6 && d >= 12 && d <= 25,
    getEndDate: (year) => new Date(year, 5, 25, 23, 59, 59),
    getStartDate: (year) => new Date(year, 5, 12, 0, 0, 0)
  },
  {
    id: 'back-to-school',
    codeTag: 'REGRESO A CLASES',
    codeTagByStore: {
      aliexpress: 'ALIEXPRESS REGRESO A CLASES',
      temu: 'TEMU REGRESO A CLASES'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: false,
    // Aug 18 to Aug 28 every year
    isActiveOnDate: (m, d) => m === 8 && d >= 18 && d <= 28,
    getEndDate: (year, monthIdx) => new Date(year, 7, 28, 23, 59, 59),
    getStartDate: (year, monthIdx) => new Date(year, 7, 18, 0, 0, 0)
  },
  {
    id: 'choice-day-monthly',
    codeTag: 'CHOICE & SUPER AHORRO',
    codeTagByStore: {
      aliexpress: 'CHOICE DAY',
      temu: 'TEMU SUPER AHORRO'
    },
    stores: ['aliexpress', 'temu'],
    hasVerifiedEventCodes: false,
    // Day 1 to Day 7 of every month (except Nov where 11.11 / Black Friday takes priority)
    isActiveOnDate: (m, d) => m !== 11 && d >= 1 && d <= 7,
    getEndDate: (year, monthIdx) => new Date(year, monthIdx, 7, 23, 59, 59),
    getStartDate: (year, monthIdx) => new Date(year, monthIdx, 1, 0, 0, 0)
  }
];

export function getActiveOrNextEvent(referenceDate = new Date()) {
  const ref = referenceDate instanceof Date && !isNaN(referenceDate.getTime())
    ? referenceDate
    : new Date(referenceDate);
  const now = !isNaN(ref.getTime()) ? ref : new Date();

  const year = now.getUTCFullYear();
  const monthIdx = now.getUTCMonth(); // 0-11
  const month = monthIdx + 1; // 1-12
  const day = now.getUTCDate();

  // 1. Check if any major event is currently active today
  for (const ev of ANNUAL_EVENTS_SCHEDULE) {
    if (ev.isActiveOnDate(month, day)) {
      const endDate = ev.getEndDate(year, monthIdx);
      return {
        ...ev,
        status: 'LIVE',
        targetDate: endDate
      };
    }
  }

  // 2. Otherwise find the next upcoming event (either next month's Choice Day or next major event)
  const candidates = [];
  for (const ev of ANNUAL_EVENTS_SCHEDULE) {
    if (ev.id === 'choice-day-monthly') {
      const nextMonthIdx = monthIdx + 1;
      candidates.push({
        ...ev,
        status: 'UPCOMING',
        targetDate: new Date(year, nextMonthIdx, 1, 0, 0, 0)
      });
    } else {
      let start = ev.getStartDate(year, monthIdx);
      if (start <= now) {
        start = ev.getStartDate(year + 1, monthIdx);
      }
      candidates.push({
        ...ev,
        status: 'UPCOMING',
        targetDate: start
      });
    }
  }

  candidates.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
  return candidates[0];
}

export const EVENT_BANNER_I18N = {
  es: {
    liveBadge: 'EVENTO OFICIAL EN VIVO',
    upcomingBadge: 'PRÓXIMO EVENTO PROGRAMADO',
    endsIn: 'Termina en:',
    startsIn: 'Inicia en:',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Ver Cupones 11.11 y Black Friday',
    showing1111Btn: 'Mostrando 11.11 y Black Friday (Ver Todos)',
    calendarNote: 'Calendario automático anual: Choice Day & Súper Ahorro (días 1–7), 11.11 AliExpress & Black Friday Temu (Nov 1–18), Black Friday Global (Nov 19–Dic 3), 12.12 (Dic 8–15).',
    events: {
      '11-11-singles-day': {
        title: 'Festival 11.11 AliExpress & Black Friday Temu',
        desc: 'Escalera oficial 11.11 de AliExpress ($3 a $120 OFF) + Lote de cupones de Black Friday Anticipado en Temu ($100 USD + 30% OFF).'
      },
      'black-friday-cyber-monday': {
        title: 'Black Friday Oficial & Cyber Week en AliExpress y Temu',
        desc: 'Temporada principal de rebajas de Viernes Negro y Cyber Monday con códigos de carrito acumulables hasta 90% OFF.'
      },
      '12-12-year-end-sale': {
        title: 'Gran Venta 12.12 de Fin de Año y Liquidación Navideña',
        desc: 'Última gran liquidación anual con cupones globales IFP en AliExpress y paquetes navideños en Temu.'
      },
      'anniversary-sale': {
        title: 'Aniversario AliExpress & Venta de Primavera Temu',
        desc: 'Cumpleaños de AliExpress con cupones por niveles y Gran Venta de Primavera en Temu con envíos prioritarios.'
      },
      '618-mid-year-sale': {
        title: 'Mega Oferta 618 AliExpress & Gran Liquidación de Verano Temu',
        desc: 'Descuentos masivos de mitad de año en tecnología, moda, herramientas y accesorios del hogar.'
      },
      'back-to-school': {
        title: 'Temporada de Regreso a Clases en AliExpress y Temu',
        desc: 'Rebajas especiales en laptops, Mini PCs, mochilas, papelería y tecnología de estudio.'
      },
      'choice-day-monthly': {
        title: 'Choice Day AliExpress & Días de Súper Ahorro Temu',
        desc: 'Activación automática del día 1 al 7 de cada mes con códigos renovados y envíos prioritarios gratis.'
      }
    }
  },
  en: {
    liveBadge: 'OFFICIAL LIVE EVENT',
    upcomingBadge: 'NEXT SCHEDULED SALE',
    endsIn: 'Ends in:',
    startsIn: 'Starts in:',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Filter 11.11 & Black Friday Codes',
    showing1111Btn: 'Showing 11.11 & Black Friday (Show All)',
    calendarNote: 'Auto-scheduled annual calendar: Choice Day & Super Savings (1st–7th), 11.11 AliExpress & Temu Black Friday (Nov 1–18), Black Friday Global (Nov 19–Dec 3), 12.12 (Dec 8–15).',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Festival & Temu Black Friday Deals',
        desc: 'Verified 11.11 tiered promo codes ($3 to $120 OFF) + Temu Early Black Friday $100 coupon bundles.'
      },
      'black-friday-cyber-monday': {
        title: 'Official Black Friday & Cyber Week at AliExpress & Temu',
        desc: 'Major holiday price drops and stackable checkout codes up to 90% OFF across all supported markets.'
      },
      '12-12-year-end-sale': {
        title: '12.12 Year-End Mega Sale & Holiday Clearance',
        desc: 'Final major global clearance of the year with verified IFP checkout coupons and holiday bundles.'
      },
      'anniversary-sale': {
        title: 'AliExpress Anniversary Sale & Temu Spring Clearance',
        desc: 'Sitewide AliExpress birthday celebration with tiered checkout codes and Temu seasonal spring deals.'
      },
      '618-mid-year-sale': {
        title: '618 Mid-Year Sale & Temu Summer Mega Clearance',
        desc: 'Mid-year sitewide discounts on electronics, home appliances, fashion, and outdoor gear.'
      },
      'back-to-school': {
        title: 'Back to School Savings Event at AliExpress & Temu',
        desc: 'Special promo tiers on laptops, Mini PCs, stationery, backpacks, and apparel.'
      },
      'choice-day-monthly': {
        title: 'AliExpress Choice Day & Temu Monthly Super Savings',
        desc: 'Automatically active on the first 7 days of each month with refreshed sitewide promo codes.'
      }
    }
  },
  pt: {
    liveBadge: 'EVENTO OFICIAL AO VIVO',
    upcomingBadge: 'PRÓXIMO EVENTO PROGRAMADO',
    endsIn: 'Termina em:',
    startsIn: 'Começa em:',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Ver Cupons 11.11 e Globais',
    showing1111Btn: 'Mostrando Cupons 11.11 (Ver Todos)',
    calendarNote: 'Calendário automático anual: Choice Day (dias 1-7), 11.11 (1-18 Nov), Black Friday (19 Nov-3 Dez), 12.12 (8-15 Dez).',
    events: {
      '11-11-singles-day': {
        title: 'Festival Global de Compras 11.11 AliExpress & Ofertas Temu',
        desc: 'Códigos escalonados oficiais do 11.11 ativos agora (de US$ 3 a US$ 120 OFF equivalentes) + códigos globais.'
      }
    }
  },
  fr: {
    liveBadge: 'ÉVÉNEMENT OFFICIEL EN DIRECT',
    upcomingBadge: 'PROCHAIN ÉVÉNEMENT PROGRAMMÉ',
    endsIn: 'Se termine dans :',
    startsIn: 'Commence dans :',
    days: 'j',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Voir les Codes 11.11 & Globaux',
    showing1111Btn: 'Codes 11.11 affichés (Tout voir)',
    calendarNote: 'Calendrier annuel automatique : Choice Day (1-7 du mois), 11.11 (1-18 nov.), Black Friday (19 nov.-3 déc.), 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Festival Mondial du Shopping 11.11 AliExpress & Offres Temu',
        desc: 'Codes promo officiels 11.11 par paliers actifs (de 3 $ à 120 $ de remise immédiate) + codes universels.'
      }
    }
  },
  de: {
    liveBadge: 'OFFIZIELLES LIVE-EVENT',
    upcomingBadge: 'NÄCHSTES GEPLANTES EVENT',
    endsIn: 'Endet in:',
    startsIn: 'Startet in:',
    days: 'T',
    hours: 'Std',
    minutes: 'Min',
    seconds: 'Sek',
    filter1111Btn: 'Nur 11.11 & Globale Gutscheine',
    showing1111Btn: '11.11 Gutscheine aktiv (Alle zeigen)',
    calendarNote: 'Automatischer Jahreskalender: Choice Day (1.–7.), 11.11 Sale (1.–18. Nov.), Black Friday (19. Nov.–3. Dez.), 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Shopping Festival & Temu Deals',
        desc: 'Geprüfte 11.11 Staffel-Gutscheine jetzt live ($3 bis $120 Sofortrabatt) + weltweite IFP-Codes.'
      }
    }
  },
  it: {
    liveBadge: 'EVENTO UFFICIALE DAL VIVO',
    upcomingBadge: 'PROSSIMO EVENTO IN PROGRAMMA',
    endsIn: 'Termina tra:',
    startsIn: 'Inizia tra:',
    days: 'g',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Vedi Coupon 11.11 e Globali',
    showing1111Btn: 'Coupon 11.11 attivi (Mostra tutti)',
    calendarNote: 'Calendario annuale automatico: Choice Day (1-7 del mese), 11.11 (1-18 nov), Black Friday (19 nov-3 dic), 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Festival Mondiale dello Shopping 11.11 AliExpress & Temu',
        desc: 'Codici sconto ufficiali 11.11 a scaglioni attivi ora (da 3$ a 120$ di sconto diretto) + codici globali.'
      }
    }
  },
  nl: {
    liveBadge: 'OFFICIEEL LIVE EVENEMENT',
    upcomingBadge: 'VOLGEND GEPLAND EVENEMENT',
    endsIn: 'Eindigt over:',
    startsIn: 'Start over:',
    days: 'd',
    hours: 'u',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Toon 11.11 & Globale Codes',
    showing1111Btn: '11.11 Codes actief (Toon alles)',
    calendarNote: 'Automatische jaarkalender: Choice Day (1–7), 11.11 Sale (1–18 nov), Black Friday (19 nov–3 dec), 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Shopping Festival & Temu Deals',
        desc: 'Geverifieerde 11.11 kortingscodes nu actief ($3 tot $120 directe korting) + wereldwijde codes.'
      }
    }
  },
  pl: {
    liveBadge: 'OFICJALNE WYDARZENIE NA ŻYWO',
    upcomingBadge: 'KOLEJNA WYPRZEDAŻ',
    endsIn: 'Kończy się za:',
    startsIn: 'Zaczyna się za:',
    days: 'd',
    hours: 'g',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Pokaż Kupony 11.11 i Globalne',
    showing1111Btn: 'Aktywne Kupony 11.11 (Pokaż wszystkie)',
    calendarNote: 'Automatyczny kalendarz: Choice Day (1–7 dnia miesiąca), 11.11 (1–18 XI), Black Friday (19 XI–3 XII), 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Światowy Festiwal Zakupów 11.11 AliExpress i Promocje Temu',
        desc: 'Zweryfikowane kody rabatowe 11.11 aktywne teraz (od 3$ do 120$ zniżki) + kody globalne.'
      }
    }
  },
  ja: {
    liveBadge: '公式セール開催中',
    upcomingBadge: '次回開催予定のセール',
    endsIn: '終了まで残り:',
    startsIn: '開始まであと:',
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    filter1111Btn: '11.11＆全世界共通コードを表示',
    showing1111Btn: '11.11コード表示中（すべて表示）',
    calendarNote: '年間自動カレンダー：Choice Day（毎月1〜7日）、11.11独身の日（11/1〜11/18）、ブラックフライデー、12.12セール。',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 独身の日グローバルセール＆Temu特大キャンペーン',
        desc: '11.11公式段階割引コードが現在有効（最大$120相当OFF）＋全世界共通IFPプロモコード。'
      }
    }
  },
  ko: {
    liveBadge: '공식 프로모션 진행 중',
    upcomingBadge: '예정된 글로벌 세일',
    endsIn: '종료까지 남은 시간:',
    startsIn: '시작까지 남은 시간:',
    days: '일',
    hours: '시간',
    minutes: '분',
    seconds: '초',
    filter1111Btn: '11.11 광군제 & 글로벌 코드 보기',
    showing1111Btn: '11.11 코드만 표시 중 (전체 보기)',
    calendarNote: '연간 자동 캘린더: 초이스 데이(매월 1~7일), 11.11 광군제(11/1~11/18), 블랙프라이데이, 12.12 세일.',
    events: {
      '11-11-singles-day': {
        title: '알리익스프레스 11.11 광군제 글로벌 페스티벌 & 테무 특가',
        desc: '현재 사용 가능한 11.11 공식 금액대별 프로모션 코드($3~$120 즉시 할인) 및 글로벌 공용 코드.'
      }
    }
  },
  ar: {
    liveBadge: 'حدث رسمي مباشر الآن',
    upcomingBadge: 'الحدث القادم المجدول',
    endsIn: 'ينتهي خلال:',
    startsIn: 'يبدأ خلال:',
    days: 'يوم',
    hours: 'ساعة',
    minutes: 'د',
    seconds: 'ث',
    filter1111Btn: 'عرض أكواد 11.11 والأكواد العالمية',
    showing1111Btn: 'يتم عرض أكواد 11.11 (عرض الكل)',
    calendarNote: 'تقويم تلقائي سنوي: يوم الاختيار Choice Day (1-7 شهرياً)، مهرجان 11.11 (1-18 نوفمبر)، الجمعة البيضاء، 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'مهرجان التسوق العالمي 11.11 على AliExpress وعروض Temu الكبرى',
        desc: 'أكواد خصم 11.11 الرسمية الموثقة فعالة الآن (خصم فوري من 3$ حتى 120$) بالإضافة إلى الأكواد العالمية.'
      }
    }
  },
  zh: {
    liveBadge: '官方大促进行中',
    upcomingBadge: '即将开启的促销活动',
    endsIn: '距离结束还剩：',
    startsIn: '距离开始还剩：',
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',
    filter1111Btn: '仅看 11.11 及全球通用码',
    showing1111Btn: '当前显示 11.11 专属码（查看全部）',
    calendarNote: '全年自动排期日历：每月 Choice Day (1-7日)、11.11 全球狂欢节 (11月1-18日)、黑五网一、12.12 年终大促。',
    events: {
      '11-11-singles-day': {
        title: '速卖通 AliExpress 11.11 全球狂欢节 & Temu 年度大促',
        desc: '11.11 官方阶梯满减码现已生效（立减 $3 至 $120 等值货币）+ 全球通用 IFP 优惠码。'
      }
    }
  },
  ru: {
    liveBadge: 'ОФИЦИАЛЬНАЯ РАСПРОДАЖА ИДЕТ',
    upcomingBadge: 'СЛЕДУЮЩАЯ РАСПРОДАЖА',
    endsIn: 'До конца акции:',
    startsIn: 'До начала:',
    days: 'дн',
    hours: 'ч',
    minutes: 'м',
    seconds: 'с',
    filter1111Btn: 'Показать промокоды 11.11 и Глобальные',
    showing1111Btn: 'Показаны промокоды 11.11 (Показать все)',
    calendarNote: 'Автоматический календарь: Choice Day (1–7 числа), распродажа 11.11 (1–18 ноября), Черная пятница, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Всемирный фестиваль шопинга 11.11 на AliExpress и акции Temu',
        desc: 'Официальные ступенчатые промокоды 11.11 активны прямо сейчас (скидки от $3 до $120) + глобальные коды.'
      }
    }
  },
  tr: {
    liveBadge: 'RESMİ CANLI ETKİNLİK',
    upcomingBadge: 'SIRADAKİ PLANLI İNDİRİM',
    endsIn: 'Bitmesine kalan:',
    startsIn: 'Başlamasına kalan:',
    days: 'g',
    hours: 's',
    minutes: 'dk',
    seconds: 'sn',
    filter1111Btn: '11.11 ve Küresel Kodları Göster',
    showing1111Btn: '11.11 Kodları Gösteriliyor (Tümünü Gör)',
    calendarNote: 'Otomatik yıllık takvim: Choice Day (her ayın 1-7’si), 11.11 Festivali (1-18 Kasım), Efsane Cuma, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Küresel Alışveriş Festivali ve Temu Fırsatları',
        desc: 'Doğrulanmış 11.11 kademeli indirim kodları şu anda aktif (3$ ile 120$ arası anında indirim) + küresel kodlar.'
      }
    }
  },
  sv: {
    liveBadge: 'OFFICIELLT LIVE-EVENT',
    upcomingBadge: 'NÄSTA SCHEMALAGDA REA',
    endsIn: 'Slutar om:',
    startsIn: 'Börjar om:',
    days: 'd',
    hours: 't',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Visa 11.11 & Globala Rabattkoder',
    showing1111Btn: 'Visar 11.11-koder (Visa alla)',
    calendarNote: 'Automatisk årskalender: Choice Day (1–7 varje månad), 11.11-rean (1–18 nov), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Shopping Festival & Temu-erbjudanden',
        desc: 'Verifierade rabattkoder för 11.11 är aktiva nu ($3 till $120 rabatt) + globala IFP-koder.'
      }
    }
  },
  no: {
    liveBadge: 'OFFISIELT LIVE-SALG',
    upcomingBadge: 'NESTE PLANLAGTE SALG',
    endsIn: 'Avsluttes om:',
    startsIn: 'Starter om:',
    days: 'd',
    hours: 't',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Vis 11.11 & Globale Rabattkoder',
    showing1111Btn: 'Viser 11.11-koder (Vis alle)',
    calendarNote: 'Automatisk årskalender: Choice Day (1.–7. hver måned), 11.11-salget (1.–18. nov), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Shopping Festival & Temu-tilbud',
        desc: 'Verifiserte 11.11-rabattkoder er aktive nå ($3 til $120 i direkte rabatt) + globale IFP-koder.'
      }
    }
  },
  da: {
    liveBadge: 'OFFICIELT LIVE-EVENT',
    upcomingBadge: 'NÆSTE PLANLAGTE UDSALG',
    endsIn: 'Slutter om:',
    startsIn: 'Starter om:',
    days: 'd',
    hours: 't',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Vis 11.11 & Globale Rabatkoder',
    showing1111Btn: 'Viser 11.11-koder (Vis alle)',
    calendarNote: 'Automatisk årskalender: Choice Day (1.–7. hver måned), 11.11-udsalg (1.–18. nov), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Shopping Festival & Temu-tilbud',
        desc: 'Verificerede 11.11-rabatkoder er aktive nu ($3 til $120 i direkte rabat) + globale IFP-koder.'
      }
    }
  },
  fi: {
    liveBadge: 'VIRALLINEN LIVE-KAMPANJA',
    upcomingBadge: 'SEURAAVA KAMPANJA',
    endsIn: 'Päättyy:',
    startsIn: 'Alkaa:',
    days: 'pv',
    hours: 't',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Näytä 11.11 & Globaalit Koodit',
    showing1111Btn: 'Näytetään 11.11-koodit (Näytä kaikki)',
    calendarNote: 'Automaattinen vuosikalenteri: Choice Day (kuun 1.–7. pv), 11.11-kampanja (1.–18.11.), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Global Shopping Festival & Temu-tarjoukset',
        desc: 'Vahvistetut 11.11-porrasalennuskoodit ovat voimassa nyt (3–120 $ alennus) + globaalit IFP-koodit.'
      }
    }
  },
  el: {
    liveBadge: 'ΕΠΙΣΗΜΗ ΠΡΟΣΦΟΡΑ ΣΕ ΕΞΕΛΙΞΗ',
    upcomingBadge: 'ΕΠΟΜΕΝΗ ΠΡΟΓΡΑΜΜΑΤΙΣΜΕΝΗ ΕΚΠΤΩΣΗ',
    endsIn: 'Λήγει σε:',
    startsIn: 'Ξεκινά σε:',
    days: 'ημ',
    hours: 'ώρ',
    minutes: 'λ',
    seconds: 'δ',
    filter1111Btn: 'Εμφάνιση Κωδικών 11.11 & Global',
    showing1111Btn: 'Κωδικοί 11.11 ενεργοί (Εμφάνιση όλων)',
    calendarNote: 'Αυτόματο ετήσιο ημερολόγιο: Choice Day (1–7 κάθε μήνα), 11.11 Festival (1–18 Νοε), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: ' Παγκόσμιο Φεστιβάλ Αγορών 11.11 AliExpress & Προσφορές Temu'.trim(),
        desc: 'Οι επίσημοι κλιμακωτοί κωδικοί 11.11 είναι ενεργοί τώρα (έκπτωση 3$ έως 120$) + καθολικοί κωδικοί IFP.'
      }
    }
  },
  cs: {
    liveBadge: 'OFICIÁLNÍ AKCE PRÁVĚ PROBÍHÁ',
    upcomingBadge: 'DALŠÍ PLÁNOVANÁ AKCE',
    endsIn: 'Končí za:',
    startsIn: 'Začíná za:',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Zobrazit Kupóny 11.11 a Globální',
    showing1111Btn: 'Zobrazeny kupóny 11.11 (Zobrazit vše)',
    calendarNote: 'Automatický roční kalendář: Choice Day (1.–7. den v měsíci), výprodej 11.11 (1.–18. 11.), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Světový nákupní festival 11.11 na AliExpress a akce Temu',
        desc: 'Ověřené odstupňované slevové kódy 11.11 jsou právě aktivní (sleva 3 $ až 120 $) + globální IFP kódy.'
      }
    }
  },
  ro: {
    liveBadge: 'EVENIMENT OFICIAL ÎN DESFĂȘURARE',
    upcomingBadge: 'URMĂTOAREA CAMPANIE PROGRAMATĂ',
    endsIn: 'Se încheie în:',
    startsIn: 'Începe în:',
    days: 'z',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Vezi Cupoanele 11.11 și Globale',
    showing1111Btn: 'Cupoane 11.11 afișate (Vezi toate)',
    calendarNote: 'Calendar anual automat: Choice Day (zilele 1–7), Festivalul 11.11 (1–18 nov.), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Festivalul Global de Cumpărături 11.11 AliExpress & Oferte Temu',
        desc: 'Codurile promoționale oficiale 11.11 pe praguri sunt active acum (reduceri între 3$ și 120$) + coduri globale.'
      }
    }
  },
  hu: {
    liveBadge: 'HIVATALOS ÉLŐ AKCIÓ',
    upcomingBadge: 'KÖVETKEZŐ ÜTEMEZETT VÁSÁR',
    endsIn: 'Hátralévő idő:',
    startsIn: 'Kezdésig:',
    days: 'n',
    hours: 'ó',
    minutes: 'p',
    seconds: 'mp',
    filter1111Btn: '11.11 és Globális Kuponok Mutatása',
    showing1111Btn: '11.11 kuponok aktívak (Összes mutatása)',
    calendarNote: 'Automatikus éves naptár: Choice Day (hó 1–7.), 11.11 Fesztivál (nov. 1–18.), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'AliExpress 11.11 Globális Vásárlási Fesztivál és Temu Akciók',
        desc: 'Az ellenőrzött 11.11 sávos kuponkódok most aktívak (3$–120$ azonnali kedvezmény) + globális IFP kódok.'
      }
    }
  },
  uk: {
    liveBadge: 'ОФІЦІЙНИЙ РОЗПРОДАЖ ТРИВАЄ',
    upcomingBadge: 'НАСТУПНИЙ ЗАПЛАНОВАНИЙ РОЗПРОДАЖ',
    endsIn: 'Закінчується через:',
    startsIn: 'Починається через:',
    days: 'дн',
    hours: 'год',
    minutes: 'хв',
    seconds: 'с',
    filter1111Btn: 'Показати промокоди 11.11 та Глобальні',
    showing1111Btn: 'Показано коди 11.11 (Показати всі)',
    calendarNote: 'Автоматичний календар: Choice Day (1–7 числа), розпродаж 11.11 (1–18 листопада), Чорна п’ятниця, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Всесвітній фестиваль шопінгу 11.11 на AliExpress та акції Temu',
        desc: 'Перевірені ступінчасті промокоди 11.11 активні просто зараз (знижки від $3 до $120) + глобальні коди.'
      }
    }
  },
  th: {
    liveBadge: 'แคมเปญทางการกำลังจัดโปร',
    upcomingBadge: 'แคมเปญถัดไปตามปฏิทิน',
    endsIn: 'สิ้นสุดในอีก:',
    startsIn: 'เริ่มในอีก:',
    days: 'วัน',
    hours: 'ชม.',
    minutes: 'นาที',
    seconds: 'วิ',
    filter1111Btn: 'ดูเฉพาะโค้ด 11.11 และโค้ดทั่วโลก',
    showing1111Btn: 'กำลังแสดงโค้ด 11.11 (ดูทั้งหมด)',
    calendarNote: 'ปฏิทินอัตโนมัติประจำปี: Choice Day (วันที่ 1–7 ของทุกเดือน), มหกรรม 11.11 (1–18 พ.ย.), Black Friday, 12.12',
    events: {
      '11-11-singles-day': {
        title: 'มหกรรมช้อปปิ้งระดับโลก AliExpress 11.11 & ดีลพิเศษ Temu',
        desc: 'โค้ดส่วนลดขั้นบันได 11.11 ใช้งานได้ทันที (ลดตั้งแต่ $3 ถึง $120) พร้อมโค้ดสากล IFP ที่ใช้ได้ทุกประเทศ'
      }
    }
  },
  vi: {
    liveBadge: 'SỰ KIỆN CHÍNH THỨC ĐANG DIỄN RA',
    upcomingBadge: 'SỰ KIỆN SẮP TỚI',
    endsIn: 'Kết thúc sau:',
    startsIn: 'Bắt đầu sau:',
    days: 'ng',
    hours: 'g',
    minutes: 'ph',
    seconds: 's',
    filter1111Btn: 'Xem Mã 11.11 & Mã Toàn Cầu',
    showing1111Btn: 'Đang hiện Mã 11.11 (Xem tất cả)',
    calendarNote: 'Lịch tự động hàng năm: Choice Day (mùng 1–7 hàng tháng), Siêu sale 11.11 (1–18/11), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Lễ Hội Mua Sắm Toàn Cầu AliExpress 11.11 & Siêu Sale Temu',
        desc: 'Mã giảm giá theo bậc 11.11 chính thức đang hoạt động (giảm từ 3$ đến 120$) + mã IFP toàn cầu.'
      }
    }
  },
  he: {
    liveBadge: 'אירוע רשמי בשידור חי',
    upcomingBadge: 'המבצע המתוזמן הבא',
    endsIn: 'מסתיים בעוד:',
    startsIn: 'מתחיל בעוד:',
    days: 'ימים',
    hours: 'ש׳',
    minutes: 'ד׳',
    seconds: 'שנ׳',
    filter1111Btn: 'הצג קופوني 11.11 וקופונים גלובליים',
    showing1111Btn: 'מציג קופוני 11.11 (הצג הכל)',
    calendarNote: 'לוח שנה אוטומטי: Choice Day (1–7 בכל חודש), פסטיבל 11.11 (1–18 בנובמבר), בלאק פריידי, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'פסטיבל הקניות העולמי 11.11 של AliExpress ומבצעי Temu',
        desc: 'קודי קופון מדורגים רשמיים ל-11.11 פעילים כעת (הנחה של $3 עד $120) + קודי IFP גלובליים.'
      }
    }
  },
  ms: {
    liveBadge: 'ACARA RASMI SEDANG BERLANGSUNG',
    upcomingBadge: 'JUALAN BERJADUAL SETERUSNYA',
    endsIn: 'Tamat dalam:',
    startsIn: 'Bermula dalam:',
    days: 'h',
    hours: 'j',
    minutes: 'm',
    seconds: 's',
    filter1111Btn: 'Papar Kod 11.11 & Kod Global',
    showing1111Btn: 'Memaparkan Kod 11.11 (Papar Semua)',
    calendarNote: 'Kalendar tahunan automatik: Choice Day (1–7 hb setiap bulan), Jualan 11.11 (1–18 Nov), Black Friday, 12.12.',
    events: {
      '11-11-singles-day': {
        title: 'Festival Membeli-belah Global 11.11 AliExpress & Tawaran Temu',
        desc: 'Kod diskaun bertingkat rasmi 11.11 aktif sekarang (diskaun $3 hingga $120) + kod IFP global.'
      }
    }
  }
};

export function getEventDateLabel(event, lang = 'es', now = new Date()) {
  if (!event) return '';
  const year = now.getFullYear();
  const monthIdx = now.getMonth();
  const start = event.getStartDate ? event.getStartDate(year, monthIdx) : new Date();
  const end = event.getEndDate ? event.getEndDate(year, monthIdx) : new Date();

  try {
    const dtf = new Intl.DateTimeFormat(lang, { month: 'long', day: 'numeric' });
    if (typeof dtf.formatRange === 'function') {
      return dtf.formatRange(start, end);
    }
    return `${start.getDate()} – ${end.getDate()}`;
  } catch (e) {
    return `${start.getDate()} – ${end.getDate()}`;
  }
}

export function getEventBannerText(
  lang = 'en',
  eventId = '11-11-singles-day',
  hasTemu = true,
  storeFilter = null
) {
  const pack = EVENT_BANNER_I18N[lang] || EVENT_BANNER_I18N.en;
  const evText =
    pack.events?.[eventId] ||
    EVENT_BANNER_I18N.en.events[eventId] ||
    EVENT_BANNER_I18N.en.events['11-11-singles-day'];

  let title = evText.title || '';
  let desc = evText.desc || '';
  let tagPrefix = '';
  let filter1111Btn = pack.filter1111Btn;
  let showing1111Btn = pack.showing1111Btn;

  if (storeFilter === 'temu' && hasTemu) {
    tagPrefix = 'TEMU';
    if (eventId === '11-11-singles-day') {
      title = lang === 'es' ? 'Temu Black Friday Anticipado & Paquetes de Cupones' : 'Temu Early Black Friday Sale & Coupon Bundles';
      desc = lang === 'es' ? 'Gran venta anticipada de Black Friday en Temu con paquetes de $100 USD en cupones + 30% OFF directo en pedidos calificados de la app.' : 'Early Black Friday clearance in Temu with $100 coupon bundles + 30% OFF on qualifying app orders.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones Black Friday Temu' : 'Filter Temu Black Friday Deals';
      showing1111Btn = lang === 'es' ? 'Mostrando Black Friday Temu (Ver Todos)' : 'Showing Temu Black Friday Deals (Show All)';
    } else if (eventId === 'choice-day-monthly') {
      title = lang === 'es' ? 'Días de Súper Ahorro Mensual en Temu' : 'Temu Monthly Super Savings Week';
      desc = lang === 'es' ? 'Descuentos relámpago de inicio de mes con envíos prioritarios y créditos promocionales.' : 'Month-start flash discounts with priority shipping and promo credits.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones Súper Ahorro Temu' : 'Filter Temu Super Savings Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Súper Ahorro (Ver Todos)' : 'Showing Super Savings (Show All)';
    } else if (eventId === 'black-friday-cyber-monday') {
      title = lang === 'es' ? 'Temu Black Friday Oficial & Cyber Week' : 'Temu Official Black Friday & Cyber Week';
      desc = lang === 'es' ? 'Rebajas principales de Black Friday con hasta 90% OFF y cupones de ajuste de precio garantizados.' : 'Official Black Friday holiday clearance with up to 90% OFF and price adjustment guarantee.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones Black Friday Temu' : 'Filter Temu Black Friday Deals';
      showing1111Btn = lang === 'es' ? 'Mostrando Black Friday Temu (Ver Todos)' : 'Showing Temu Black Friday Deals (Show All)';
    } else if (eventId === '12-12-year-end-sale') {
      title = lang === 'es' ? 'Gran Liquidación 12.12 de Fin de Año en Temu' : 'Temu 12.12 Year-End Mega Clearance';
      desc = lang === 'es' ? 'Últimas rebajas navideñas con paquetes de cupones y entrega garantizada.' : 'Year-end holiday deals with stackable coupon packs.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones 12.12 Temu' : 'Filter Temu 12.12 Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Cupones 12.12 (Ver Todos)' : 'Showing 12.12 Codes (Show All)';
    } else if (eventId === 'anniversary-sale') {
      title = lang === 'es' ? 'Gran Venta de Primavera y Ahorro en Temu' : 'Temu Spring Mega Clearance';
      desc = lang === 'es' ? 'Liquidación oficial de primavera con cupones acumulados y envío gratis.' : 'Spring savings with stackable coupon packs and free shipping.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones de Primavera Temu' : 'Filter Temu Spring Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Primavera (Ver Todos)' : 'Showing Spring Codes (Show All)';
    } else if (eventId === '618-mid-year-sale') {
      title = lang === 'es' ? 'Gran Liquidación de Verano Temu (Summer Mega Sale)' : 'Temu Summer Mega Sale';
      desc = lang === 'es' ? 'Mega rebajas de temporada veraniega con descuentos de hasta el 70% en moda y hogar.' : 'Summer mega clearance with sitewide markdowns up to 70% OFF.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones de Verano Temu' : 'Filter Temu Summer Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Verano (Ver Todos)' : 'Showing Summer Codes (Show All)';
    } else if (eventId === 'back-to-school') {
      title = lang === 'es' ? 'Temporada Escolar y Regreso a Clases en Temu' : 'Temu Back to School Savings';
      desc = lang === 'es' ? 'Ofertas especiales en papelería, mochilas, calzado y gadgets para estudiantes.' : 'Special discounts on backpacks, stationery, apparel, and study gadgets.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones Escolares Temu' : 'Filter Temu School Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Cupones Escolares (Ver Todos)' : 'Showing School Codes (Show All)';
    }
  } else if (storeFilter === 'aliexpress' || !hasTemu) {
    tagPrefix = 'ALIEXPRESS';
    if (eventId === '11-11-singles-day') {
      title = lang === 'es' ? 'Festival Mundial de Compras 11.11 AliExpress' : 'AliExpress 11.11 Global Shopping Festival';
      desc = lang === 'es' ? 'Códigos escalonados oficiales del 11.11 verificados hoy (desde $3 hasta $120 USD de descuento directo).' : 'Verified official 11.11 tiered promo codes active today ($3 to $120 USD direct discount).';
      filter1111Btn = lang === 'es' ? 'Ver Solo Cupones 11.11 AliExpress' : 'Filter 11.11 AliExpress Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Cupones 11.11 (Ver Todos)' : 'Showing 11.11 Codes (Show All)';
    } else if (eventId === 'choice-day-monthly') {
      title = lang === 'es' ? 'Choice Day Mensual de AliExpress' : 'AliExpress Monthly Choice Day';
      desc = lang === 'es' ? 'Días Choice del 1 al 7 de cada mes con códigos renovados y envíos gratis.' : 'Choice Days from the 1st to 7th of every month with refreshed promo codes.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones Choice Day' : 'Filter Choice Day Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Choice Day (Ver Todos)' : 'Showing Choice Day (Show All)';
    } else if (eventId === 'anniversary-sale') {
      title = lang === 'es' ? 'Aniversario Oficial de AliExpress' : 'AliExpress Official Anniversary Sale';
      desc = lang === 'es' ? 'Gran celebración de cumpleaños con códigos por niveles en todas las categorías.' : 'Annual birthday celebration with tiered codes across all categories.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones de Aniversario' : 'Filter Anniversary Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Aniversario (Ver Todos)' : 'Showing Anniversary (Show All)';
    } else if (eventId === '618-mid-year-sale') {
      title = lang === 'es' ? 'Mega Oferta de Mitad de Año 618 AliExpress' : 'AliExpress 618 Mid-Year Mega Sale';
      desc = lang === 'es' ? 'Festival 618 de mitad de año con subsidios directos y cupones de tienda.' : 'Mid-year 618 festival with sitewide subsidies and tiered coupons.';
      filter1111Btn = lang === 'es' ? 'Ver Cupones 618' : 'Filter 618 Codes';
      showing1111Btn = lang === 'es' ? 'Mostrando Cupones 618 (Ver Todos)' : 'Showing 618 Codes (Show All)';
    } else {
      title = title
        .replace(/\s*(&|\+|y|and)\s*(Ofertas\s+|Mega\s+Deals\s+|Tawaran\s+)?Temu(\s+[A-Za-z0-9\s]+)?/gi, '')
        .replace(/\s+Temu/gi, '')
        .trim();
      desc = desc
        .replace(/\s*(y|and|&)\s*Temu[^.]*/gi, '')
        .replace(/AliExpress y Temu/gi, 'AliExpress')
        .replace(/AliExpress and Temu/gi, 'AliExpress')
        .trim();
    }
  } else if (eventId === '11-11-singles-day' && hasTemu) {
    filter1111Btn = lang === 'es' ? 'Ver Cupones 11.11 y Black Friday' : 'Filter 11.11 & Black Friday Codes';
    showing1111Btn = lang === 'es' ? 'Mostrando 11.11 y Black Friday (Ver Todos)' : 'Showing 11.11 & Black Friday (Show All)';
  }

  return {
    ...pack,
    title,
    desc,
    tagPrefix,
    filter1111Btn,
    showing1111Btn
  };
}
