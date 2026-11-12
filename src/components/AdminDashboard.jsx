import React, { useState } from 'react';
import { VERIFIED_COUPONS, validateCoupon, MAX_VERIFIED_AGE_DAYS } from '../data/verifiedCoupons.js';
import { LOCALES } from '../config/locales.js';

const today = () => new Date().toISOString().slice(0, 16);

const EMPTY = {
  id: '', store: 'aliexpress', code: '', countries: 'us', userType: 'all', currency: 'USD',
  discountType: 'fixed', discountValue: '', maxDiscount: '', minSpend: '', validFrom: today(), validUntil: '',
  channel: 'both', sourceUrl: '', lastVerifiedAt: today(), affiliateUrl: '', category: '',
  titleEs: '', titleEn: '', notesEs: '', notesEn: ''
};

function toCoupon(f) {
  const iso = (v) => (v ? new Date(v).toISOString() : '');
  return {
    id: f.id.trim(),
    store: f.store,
    code: f.code.trim(),
    countries: f.countries.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    userType: f.userType,
    currency: f.currency.trim().toUpperCase(),
    discountType: f.discountType,
    discountValue: Number(f.discountValue),
    maxDiscount: f.maxDiscount === '' ? null : Number(f.maxDiscount),
    minSpend: Number(f.minSpend || 0),
    validFrom: iso(f.validFrom),
    validUntil: iso(f.validUntil),
    channel: f.channel,
    sourceUrl: f.sourceUrl.trim(),
    lastVerifiedAt: iso(f.lastVerifiedAt),
    affiliateUrl: f.affiliateUrl.trim(),
    category: f.category || null,
    title: { es: f.titleEs.trim(), en: f.titleEn.trim() },
    notes: f.notesEs || f.notesEn ? { es: f.notesEs.trim(), en: f.notesEn.trim() } : undefined
  };
}

const input = 'w-full rounded-lg border border-[#D8C8B4] bg-white px-2.5 py-1.5 text-sm';

export default function AdminDashboard() {
  const [form, setForm] = useState(EMPTY);
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const draft = toCoupon(form);
  const draftErrors = validateCoupon(draft);
  const json = JSON.stringify(draft, null, 2);
  const isoList = [...new Set(LOCALES.map((l) => l.iso))].join(', ');

  const copy = async () => {
    try { await navigator.clipboard.writeText(`${json},`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const field = (label, k, props = {}) => (
    <label className="block text-xs font-bold text-[#574B40]">
      {label}
      <input className={input} value={form[k]} onChange={set(k)} {...props} />
    </label>
  );
  const select = (label, k, opts) => (
    <label className="block text-xs font-bold text-[#574B40]">
      {label}
      <select className={input} value={form[k]} onChange={set(k)}>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8 font-sans text-[#1F1B18] bg-[#FCF9F4] min-h-screen">
      <h1 className="text-2xl font-extrabold mb-1">Admin · Cupones verificados</h1>
      <p className="text-sm text-[#574B40] mb-6">
        Fuente única: <code>src/data/verifiedCoupons.js</code>. Solo se publican cupones completos, vigentes y verificados hace
        ≤ {MAX_VERIFIED_AGE_DAYS} días. Añade la entrada generada abajo al array <code>VERIFIED_COUPONS</code> y despliega.
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-extrabold mb-2">Estado actual ({VERIFIED_COUPONS.length})</h2>
        {VERIFIED_COUPONS.length === 0 ? (
          <p className="text-sm text-[#6E6055]">Sin cupones cargados. La web muestra el aviso "no hay cupones verificados".</p>
        ) : (
          <ul className="space-y-1.5">
            {VERIFIED_COUPONS.map((c) => {
              const errs = validateCoupon(c);
              return (
                <li key={c.id} className="rounded-lg border border-[#DED4C6] bg-white px-3 py-2 text-sm">
                  <strong>{c.store}</strong> · <code>{c.code}</code> · {(c.countries || []).join(',')} ·{' '}
                  {errs.length ? <span className="text-[#9E4224] font-bold">OCULTO: {errs.join(', ')}</span>
                    : <span className="text-[#3D6352] font-bold">PUBLICADO</span>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2.5">
          <h2 className="text-lg font-extrabold">Nuevo cupón</h2>
          {field('ID único', 'id', { placeholder: 'ali-us-1111-5off' })}
          {select('Tienda', 'store', ['aliexpress', 'temu'])}
          {field('Código', 'code')}
          {field(`Países (ISO2, coma). Disponibles: ${isoList}`, 'countries')}
          {select('Tipo de usuario', 'userType', ['all', 'new', 'existing'])}
          {field('Moneda del cupón (ISO 4217)', 'currency')}
          {select('Tipo de descuento', 'discountType', ['fixed', 'percent'])}
          {field('Valor del descuento', 'discountValue', { type: 'number', min: 0, step: '0.01' })}
          {field('Descuento máximo (opcional)', 'maxDiscount', { type: 'number', min: 0, step: '0.01' })}
          {field('Compra mínima (productos, sin envío)', 'minSpend', { type: 'number', min: 0, step: '0.01' })}
          {field('Válido desde', 'validFrom', { type: 'datetime-local' })}
          {field('Válido hasta', 'validUntil', { type: 'datetime-local' })}
          {select('Canal', 'channel', ['both', 'app', 'web'])}
          {field('URL fuente (https)', 'sourceUrl')}
          {field('Última verificación en checkout', 'lastVerifiedAt', { type: 'datetime-local' })}
          {field('Link de afiliado (opcional)', 'affiliateUrl')}
          {field('Categoría (vacío = todo el carrito)', 'category')}
          {field('Título ES', 'titleEs')}
          {field('Título EN', 'titleEn')}
          {field('Condiciones / exclusiones ES', 'notesEs')}
          {field('Condiciones / exclusiones EN', 'notesEn')}
          <button type="button" onClick={() => setForm(EMPTY)} className="text-xs font-bold text-[#6E6055] underline">Limpiar</button>
        </div>

        <div>
          <h2 className="text-lg font-extrabold mb-2">Entrada generada</h2>
          <p className={`mb-2 text-sm font-bold ${draftErrors.length ? 'text-[#9E4224]' : 'text-[#3D6352]'}`}>
            {draftErrors.length ? `No publicable: ${draftErrors.join(', ')}` : 'Válida: se publicará al desplegar.'}
          </p>
          <pre className="rounded-xl bg-[#1F1B18] text-[#F6F2EA] p-3 text-xs overflow-auto max-h-[600px]">{json}</pre>
          <button
            type="button"
            onClick={copy}
            disabled={draftErrors.length > 0}
            className="mt-2 rounded-xl bg-[#B85332] px-4 py-2 text-sm font-bold text-[#FCF9F4] disabled:opacity-40"
          >
            {copied ? 'Copiado' : 'Copiar entrada'}
          </button>
        </div>
      </section>
    </main>
  );
}
