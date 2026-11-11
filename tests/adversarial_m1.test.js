import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { installMockStorage } from './helpers/mockStorage.js';
import { LOCALES } from '../src/config/locales.js';
import { autoPublishAiCoupons, getCouponsForLocale } from '../src/data/couponsGenerator.js';

describe('Tier 5 Adversarial: Milestone 1 Verification', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = installMockStorage();
  });

  // ==========================================================================
  // 1. Deduplication Stress & Edge Cases
  // ==========================================================================
  describe('1. Deduplication Stress Testing', () => {
    it('DEDUP-01: Intra-batch identical codes must be deduplicated (only 1 added)', () => {
      const batch = [
        { store: 'aliexpress', code: 'INTRA_DUP_01', title: 'Deal 1' },
        { store: 'aliexpress', code: 'INTRA_DUP_01', title: 'Deal 1 duplicate' }
      ];
      const added = autoPublishAiCoupons(batch);
      assert.equal(added, 1, 'Intra-batch duplicate codes must not result in multiple insertions');
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const stored = JSON.parse(raw);
      const matches = stored.filter(c => c.code.toLowerCase() === 'intra_dup_01');
      assert.equal(matches.length, 1, 'Only one coupon with code intra_dup_01 should exist in storage');
    });

    it('DEDUP-02: Intra-batch casing variations must be deduplicated', () => {
      const batch = [
        { store: 'aliexpress', code: 'CASE_VAR_01', title: 'Deal Upper' },
        { store: 'aliexpress', code: 'case_var_01', title: 'Deal Lower' }
      ];
      const added = autoPublishAiCoupons(batch);
      assert.equal(added, 1, 'Intra-batch case-differing codes must be deduplicated');
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const stored = JSON.parse(raw);
      const matches = stored.filter(c => c.code.toLowerCase() === 'case_var_01');
      assert.equal(matches.length, 1, 'Only one coupon should exist for case variation');
    });

    it('DEDUP-03: Codes matching tierKeys must be strictly rejected', () => {
      const batch = [
        { store: 'aliexpress', code: 'tier6_18_new', title: 'Tier key match' },
        { store: 'aliexpress', code: 'TIER3_18', title: 'Tier key uppercase match' },
        { store: 'aliexpress', code: 'tier120_600', title: 'Tier key top match' }
      ];
      const added = autoPublishAiCoupons(batch);
      assert.equal(added, 0, 'Codes matching tierKeys must be detected and rejected');
    });

    it('DEDUP-04: Concrete regional AliExpress codes must be rejected', () => {
      const regionalCodes = [
        'IFPSF035', // tier6 primary
        'IFPGQEE8', // tier6 backup
        'JJZ03F',   // tier3 en-us backup
        'ALIMX03',  // tier3 es-mx primary
        'AFFNOV01', // tier3 pt-br primary
        'OEUD1103', // tier3 EU primary
        'OEUD1108', // tier8 EU primary
        'JJZ130F'   // tier120 en-us backup
      ];
      for (const code of regionalCodes) {
        const added = autoPublishAiCoupons([{ store: 'aliexpress', code, title: `Test ${code}` }]);
        assert.equal(added, 0, `Regional code ${code} must be blocked by deduplication`);
      }
    });

    it('DEDUP-05: Whitespace-padded codes matching existing tiers must be rejected', () => {
      const added = autoPublishAiCoupons([
        { store: 'aliexpress', code: '   IFPSF035   ', title: 'Padded tier code' }
      ]);
      assert.equal(added, 0, 'Whitespace-padded base code must be trimmed and rejected');
    });

    it('DEDUP-06: Whitespace-only codes must be strictly rejected, never saved as empty string', () => {
      const added = autoPublishAiCoupons([
        { store: 'aliexpress', code: '   ', title: 'Whitespace only' },
        { store: 'aliexpress', code: '\t\n  ', title: 'Whitespace tabs and newlines' }
      ]);
      assert.equal(added, 0, 'Whitespace-only codes must be rejected and not saved');
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const stored = raw ? JSON.parse(raw) : [];
      const emptyCode = stored.find(c => !c.code || c.code.trim() === '');
      assert.equal(emptyCode, undefined, 'No empty or blank code coupon must slip into storage');
    });

    it('DEDUP-07: Null, undefined, empty, non-string, or "undefined" literal codes', () => {
      const badInputs = [
        { store: 'aliexpress', code: null, title: 'Null code' },
        { store: 'aliexpress', code: undefined, title: 'Undefined code' },
        { store: 'aliexpress', code: '', title: 'Empty string code' },
        { store: 'aliexpress', code: 0, title: 'Zero code' },
        { store: 'aliexpress', title: 'Missing code' }
      ];
      const added = autoPublishAiCoupons(badInputs);
      assert.equal(added, 0, 'Malformed coupon codes must not be inserted');
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      assert.equal(raw, null, 'Storage should remain empty');
    });

    it('DEDUP-08: Cross-batch duplicate prevention', () => {
      const first = autoPublishAiCoupons([{ store: 'aliexpress', code: 'CROSS_01', title: 'First' }]);
      assert.equal(first, 1);
      const second = autoPublishAiCoupons([{ store: 'aliexpress', code: '  cross_01  ', title: 'Second' }]);
      assert.equal(second, 0, 'Cross-batch case and whitespace variant must be deduplicated');
    });

    it('DEDUP-09: Backup code collision deduplication', () => {
      // Store a custom coupon with backupCode 'BACKUP_A'
      mockStorage.setItem('ecosistema_b_custom_coupons_v1', JSON.stringify([
        { id: 'custom-1', store: 'aliexpress', code: 'PRIMARY_A', backupCode: 'BACKUP_A', title: 'Existing' }
      ]));
      // AI radar tries to publish a coupon where code matches the existing backupCode
      const added = autoPublishAiCoupons([{ store: 'aliexpress', code: 'backup_a', title: 'Colliding code' }]);
      assert.equal(added, 0, 'Code colliding with existing backupCode must be rejected');
    });
  });

  // ==========================================================================
  // 2. Tombstone Ledger & Anti-Resurrection Stress Testing
  // ==========================================================================
  describe('2. Tombstone Ledger Stress Testing', () => {
    it('TOMB-01: Deleted coupon is tombstoned and strictly rejected on subsequent AI scan', () => {
      // Simulate existing coupon
      mockStorage.setItem('ecosistema_b_custom_coupons_v1', JSON.stringify([
        { id: 'custom-del-1', store: 'aliexpress', code: 'DEAD_COUPON_01', title: 'To Delete' }
      ]));

      // Admin deletes coupon: record in tombstones
      const tombstones = ['dead_coupon_01', 'custom-del-1'];
      mockStorage.setItem('ecosistema_b_coupon_tombstones_v1', JSON.stringify(tombstones));

      // AI radar discovers the same coupon again
      const added = autoPublishAiCoupons([
        { store: 'aliexpress', code: 'DEAD_COUPON_01', title: 'Zombie Deal' }
      ]);
      assert.equal(added, 0, 'Tombstoned coupon must be strictly rejected');
    });

    it('TOMB-02: Tombstone matching is case-insensitive and ignores surrounding whitespace', () => {
      mockStorage.setItem('ecosistema_b_coupon_tombstones_v1', JSON.stringify(['  tomb_case_99  ']));
      const added = autoPublishAiCoupons([
        { store: 'aliexpress', code: 'TOMB_CASE_99', title: 'Zombie Case Deal' },
        { store: 'aliexpress', code: '  tomb_case_99  ', title: 'Zombie Whitespace Deal' }
      ]);
      assert.equal(added, 0, 'Case and whitespace variants of tombstoned codes must be rejected');
    });

    it('TOMB-03: Tombstoned backup codes prevent resurrection of related coupons', () => {
      mockStorage.setItem('ecosistema_b_coupon_tombstones_v1', JSON.stringify(['tomb_backup_77']));
      const candidate1 = [{ store: 'aliexpress', code: 'TOMB_BACKUP_77', title: 'Zombie by Code' }];
      const candidate2 = [{ store: 'aliexpress', code: 'NEW_CODE_88', backupCode: 'TOMB_BACKUP_77', title: 'Zombie by Backup' }];
      assert.equal(autoPublishAiCoupons(candidate1), 0, 'Coupon with tombstoned code must be rejected');
      assert.equal(autoPublishAiCoupons(candidate2), 0, 'Coupon with tombstoned backupCode must be rejected');
    });

    it('TOMB-04: Malformed tombstone storage does not crash autoPublishAiCoupons', () => {
      const malformedPayloads = ['{ "not": "array" }', 'invalid json string', 'null', '12345'];
      for (const bad of malformedPayloads) {
        mockStorage.setItem('ecosistema_b_coupon_tombstones_v1', bad);
        assert.doesNotThrow(() => {
          autoPublishAiCoupons([{ store: 'aliexpress', code: 'SURVIVE_01', title: 'Survive' }]);
        }, `Must handle malformed tombstone storage: ${bad}`);
      }
    });
  });

  // ==========================================================================
  // 3. 27-Language Title Preservation Across Exotic Locales
  // ==========================================================================
  describe('3. 27-Language Title Preservation', () => {
    it('LANG-01: Discovered coupon title is preserved across all 27 languages', () => {
      const testTitle = '⚡ Xiaomi 14 Ultra 5G Global Edition - Mega Deal 2026';
      const added = autoPublishAiCoupons([
        { store: 'aliexpress', code: 'XIAOMI_GLOBAL', title: testTitle, discountPct: 25, discountUsd: 50, minSpendUsd: 300 }
      ]);
      assert.equal(added, 1, 'Coupon should be added');

      const exoticLocales = [
        { code: 'ar-ae', lang: 'ar', name: 'Arabic (UAE)' },
        { code: 'ja-jp', lang: 'ja', name: 'Japanese (Japan)' },
        { code: 'zh-cn', lang: 'zh', name: 'Chinese (China)' },
        { code: 'ru-ru', lang: 'ru', name: 'Russian (Russia)' },
        { code: 'vi-vn', lang: 'vi', name: 'Vietnamese (Vietnam)' },
        { code: 'he-il', lang: 'he', name: 'Hebrew (Israel)' },
        { code: 'th-th', lang: 'th', name: 'Thai (Thailand)' },
        { code: 'el-gr', lang: 'el', name: 'Greek (Greece)' },
        { code: 'cs-cz', lang: 'cs', name: 'Czech (Czechia)' },
        { code: 'hu-hu', lang: 'hu', name: 'Hungarian (Hungary)' },
        { code: 'fi-fi', lang: 'fi', name: 'Finnish (Finland)' },
        { code: 'da-dk', lang: 'da', name: 'Danish (Denmark)' },
        { code: 'ro-ro', lang: 'ro', name: 'Romanian (Romania)' },
        { code: 'sv-se', lang: 'sv', name: 'Swedish (Sweden)' },
        { code: 'pt-pt', lang: 'pt', name: 'Portuguese (Portugal)' },
        { code: 'fr-fr', lang: 'fr', name: 'French (France)' },
        { code: 'de-de', lang: 'de', name: 'German (Germany)' },
        { code: 'es-es', lang: 'es', name: 'Spanish (Spain)' },
        { code: 'en-us', lang: 'en', name: 'English (US)' }
      ];

      for (const loc of exoticLocales) {
        const catalog = getCouponsForLocale(loc.code);
        const coupon = catalog.find(c => c.code === 'XIAOMI_GLOBAL');
        assert.ok(coupon, `Coupon must be present in ${loc.name} (${loc.code})`);
        assert.equal(
          coupon.title,
          testTitle,
          `Title in ${loc.name} (${loc.code}) must match the AI discovered title exactly`
        );
      }
    });

    it('LANG-02: Structured multilingual title preserves localized overrides while falling back for others', () => {
      const multilingualItem = {
        store: 'aliexpress',
        code: 'MULTI_LANG_01',
        title: {
          en: 'Super Smartphone 50% OFF',
          ar: 'خصم 50% على الهاتف الذكي الفائق',
          ja: 'スーパースマートフォン 50% オフ',
          zh: '超级智能手机 5折特惠'
        }
      };

      const added = autoPublishAiCoupons([multilingualItem]);
      assert.equal(added, 1);

      // Verify specific localized titles
      const arCoupon = getCouponsForLocale('ar-ae').find(c => c.code === 'MULTI_LANG_01');
      assert.equal(arCoupon?.title, 'خصم 50% على الهاتف الذكي الفائق', 'Arabic locale must get Arabic title');

      const jaCoupon = getCouponsForLocale('ja-jp').find(c => c.code === 'MULTI_LANG_01');
      assert.equal(jaCoupon?.title, 'スーパースマートフォン 50% オフ', 'Japanese locale must get Japanese title');

      const zhCoupon = getCouponsForLocale('zh-cn').find(c => c.code === 'MULTI_LANG_01');
      assert.equal(zhCoupon?.title, '超级智能手机 5折特惠', 'Chinese locale must get Chinese title');

      // Verify fallback for exotic language without explicit translation (e.g. Russian, Vietnamese)
      const ruCoupon = getCouponsForLocale('ru-ru').find(c => c.code === 'MULTI_LANG_01');
      assert.equal(ruCoupon?.title, 'Super Smartphone 50% OFF', 'Russian locale must fall back to English title');

      const viCoupon = getCouponsForLocale('vi-vn').find(c => c.code === 'MULTI_LANG_01');
      assert.equal(viCoupon?.title, 'Super Smartphone 50% OFF', 'Vietnamese locale must fall back to English title');
    });

    it('LANG-03: All 27 unique languages in LOCALES have non-generic titles when AI title is provided', () => {
      const customTitle = 'Universal AI Audio Gadget 2026';
      autoPublishAiCoupons([{ store: 'aliexpress', code: 'UNI_AUDIO_01', title: customTitle }]);

      const testedLanguages = new Set();
      for (const loc of LOCALES) {
        if (testedLanguages.has(loc.lang)) continue;
        testedLanguages.add(loc.lang);

        const catalog = getCouponsForLocale(loc.code);
        const item = catalog.find(c => c.code === 'UNI_AUDIO_01');
        assert.ok(item, `Coupon must exist in locale ${loc.code}`);
        assert.equal(
          item.title,
          customTitle,
          `Locale ${loc.code} (lang: ${loc.lang}) must have preserved title, got: ${item.title}`
        );
      }
      assert.equal(testedLanguages.size, 27, 'All 27 unique languages must be tested');
    });
  });
});
