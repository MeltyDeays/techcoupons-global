import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import { CATEGORY_SLUGS, DEFAULT_LOCALE } from '../config/locales.js';
import { getCouponsForLocale } from '../data/couponsGenerator.js';
import { Shield, Plus, Trash2, Download, Copy, Check, ArrowLeft, Settings, Link2, Tag } from 'lucide-react';

const STORAGE_KEY_COUPONS = 'ecosistema_b_custom_coupons_v1';
const STORAGE_KEY_SETTINGS = 'ecosistema_b_custom_settings_v1';

export function getCustomCoupons() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCustomAffiliateSettings() {
  if (typeof window === 'undefined') return AFFILIATE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return raw ? { ...AFFILIATE_CONFIG, ...JSON.parse(raw) } : AFFILIATE_CONFIG;
  } catch {
    return AFFILIATE_CONFIG;
  }
}

export default function AdminDashboard() {
  const [settings, setSettings] = useState(getCustomAffiliateSettings);
  const [customCoupons, setCustomCoupons] = useState(getCustomCoupons);
  const [savedToast, setSavedToast] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    store: 'temu',
    category: 'tech-gadgets',
    code: '',
    title: '',
    discountPct: 30,
    basePriceUsd: 45,
    minSpendUsd: 30,
    isSecretSearch: false,
    customAffiliateUrl: ''
  });

  const baseCatalog = getCouponsForLocale('en-us');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(customCoupons));
  }, [customCoupons]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    setSavedToast('Configuración de enlaces CPA guardada correctamente.');
    setTimeout(() => setSavedToast(''), 3500);
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.title.trim()) return;

    const item = {
      id: `custom-${Date.now()}`,
      store: newCoupon.store,
      category: newCoupon.category,
      code: newCoupon.code.trim(),
      isSecretSearch: Boolean(newCoupon.isSecretSearch),
      discountPct: Number(newCoupon.discountPct) || 20,
      basePriceUsd: Number(newCoupon.basePriceUsd) || 35,
      minSpendUsd: Number(newCoupon.minSpendUsd) || 20,
      customAffiliateUrl: newCoupon.customAffiliateUrl.trim(),
      productName: {
        en: newCoupon.title.trim(),
        es: newCoupon.title.trim()
      }
    };

    setCustomCoupons([item, ...customCoupons]);
    setNewCoupon({
      store: 'temu',
      category: 'tech-gadgets',
      code: '',
      title: '',
      discountPct: 30,
      basePriceUsd: 45,
      minSpendUsd: 30,
      isSecretSearch: false,
      customAffiliateUrl: ''
    });
    setSavedToast(`Cupón "${item.code}" agregado al catálogo.`);
    setTimeout(() => setSavedToast(''), 3500);
  };

  const handleDeleteCoupon = (id) => {
    setCustomCoupons(customCoupons.filter((c) => c.id !== id));
  };

  const handleExportConfig = async () => {
    const payload = JSON.stringify({ affiliateConfig: settings, customCoupons }, null, 2);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(payload);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Admin Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">
                Panel de Administración — Cupones & Redes CPA
              </h1>
              <p className="text-xs text-slate-400">
                Gestiona tus enlaces globales de Admitad (Temu), AliExpress Portals y códigos promocionales en los 24 países.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportConfig}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              {copiedJson ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedJson ? 'JSON Copiado' : 'Exportar Config JSON'}</span>
            </button>

            <Link
              to={`/${DEFAULT_LOCALE}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ver Tienda Pública</span>
            </Link>
          </div>
        </div>

        {savedToast && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300">
            {savedToast}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Panel 1: Enlaces CPA Globales (Admitad & AliExpress Portals) */}
          <form
            onSubmit={handleSaveSettings}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Link2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">
                1. Configuración de Enlaces de Afiliado (Admitad / Portals)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dominio Principal (GitHub Student Pack)
              </label>
              <input
                type="url"
                value={settings.siteDomain}
                onChange={(e) => setSettings({ ...settings, siteDomain: e.target.value })}
                placeholder="https://tudominio.tech"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-orange-400 mb-1">
                Enlace Global de Afiliado Temu (Admitad Many GEOs)
              </label>
              <input
                type="url"
                value={settings.temuBaseTrackingUrl}
                onChange={(e) => setSettings({ ...settings, temuBaseTrackingUrl: e.target.value })}
                placeholder="Vacío durante auditoría (ej. https://ad.admitad.com/g/...)"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-orange-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500">
                Si está vacío, los botones llevan a https://www.temu.com limpio para pasar revisión.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">
                Enlace Global de Afiliado AliExpress (Portals / Admitad)
              </label>
              <input
                type="url"
                value={settings.aliexpressBaseTrackingUrl}
                onChange={(e) => setSettings({ ...settings, aliexpressBaseTrackingUrl: e.target.value })}
                placeholder="Vacío durante auditoría (ej. https://s.click.aliexpress.com/e/...)"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sidebarBanners?.active || false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sidebarBanners: { ...settings.sidebarBanners, active: e.target.checked }
                    })
                  }
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500"
                />
                <span>Activar Banners Patrocinados en Barra Lateral (&lt;aside&gt;)</span>
              </label>

              {settings.sidebarBanners?.active && (
                <div className="space-y-2 pl-5">
                  <input
                    type="url"
                    value={settings.sidebarBanners.temuBannerUrl || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sidebarBanners: { ...settings.sidebarBanners, temuBannerUrl: e.target.value }
                      })
                    }
                    placeholder="URL de afiliado Banner Temu"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                  />
                  <input
                    type="url"
                    value={settings.sidebarBanners.aliexpressBannerUrl || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sidebarBanners: { ...settings.sidebarBanners, aliexpressBannerUrl: e.target.value }
                      })
                    }
                    placeholder="URL de afiliado Banner AliExpress"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              Guardar Enlaces de Monetización
            </button>
          </form>

          {/* Panel 2: Agregar Nuevo Cupón / Oferta */}
          <form
            onSubmit={handleAddCoupon}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">
                2. Publicar Nuevo Cupón o Producto
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tienda</label>
                <select
                  value={newCoupon.store}
                  onChange={(e) => setNewCoupon({ ...newCoupon, store: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                >
                  <option value="temu">Temu</option>
                  <option value="aliexpress">AliExpress</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                <select
                  value={newCoupon.category}
                  onChange={(e) => setNewCoupon({ ...newCoupon, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                >
                  {CATEGORY_SLUGS.map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título del Producto o Promoción
              </label>
              <input
                type="text"
                required
                value={newCoupon.title}
                onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                placeholder="Ej. Control GameSir G7 SE Hall Effect / Paquete $100 Temu"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">Código Cupón</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  placeholder="credit777"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">% Descuento</label>
                <input
                  type="number"
                  value={newCoupon.discountPct}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountPct: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Base (USD)</label>
                <input
                  type="number"
                  value={newCoupon.basePriceUsd}
                  onChange={(e) => setNewCoupon({ ...newCoupon, basePriceUsd: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deep-Link Específico del Producto (Opcional)
              </label>
              <input
                type="url"
                value={newCoupon.customAffiliateUrl}
                onChange={(e) => setNewCoupon({ ...newCoupon, customAffiliateUrl: e.target.value })}
                placeholder="Si lo dejas vacío, usará el enlace global de la tienda"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newCoupon.isSecretSearch}
                onChange={(e) => setNewCoupon({ ...newCoupon, isSecretSearch: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500"
              />
              <span>Es código secreto de barra de búsqueda (ej. credit777 / wincredit)</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              + Agregar Cupón a las 24 Regiones
            </button>
          </form>
        </div>

        {/* Lista de Cupones Activos */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">
                Inventario de Cupones ({customCoupons.length} personalizados + {baseCatalog.length} base)
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2.5">Tienda</th>
                  <th className="px-3 py-2.5">Código</th>
                  <th className="px-3 py-2.5">Producto</th>
                  <th className="px-3 py-2.5">Categoría</th>
                  <th className="px-3 py-2.5">Descuento</th>
                  <th className="px-3 py-2.5">Origen</th>
                  <th className="px-3 py-2.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {customCoupons.map((c) => (
                  <tr key={c.id} className="bg-emerald-950/15">
                    <td className="px-3 py-2.5 font-bold uppercase text-emerald-400">{c.store}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-300">{c.code}</td>
                    <td className="px-3 py-2.5 text-slate-100">{c.productName?.en || c.title}</td>
                    <td className="px-3 py-2.5 text-slate-400">{c.category}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-300">-{c.discountPct}%</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        CUSTOM ADMIN
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-2 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-500/30"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Borrar</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {baseCatalog.map((c) => (
                  <tr key={c.id}>
                    <td className="px-3 py-2.5 font-bold uppercase text-slate-300">{c.store}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-300">{c.code}</td>
                    <td className="px-3 py-2.5 text-slate-300">{c.title}</td>
                    <td className="px-3 py-2.5 text-slate-400">{c.category}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-400">-{c.discountPct}%</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                        BASE SSG (24 GEOs)
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-500">Fijo en Build</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
