import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Link2,
  Image as ImageIcon,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Plus,
  Package,
  TicketPercent,
  RefreshCw
} from 'lucide-react';
import { VERIFIED_COUPONS, validateCoupon, MAX_VERIFIED_AGE_DAYS } from '../data/verifiedCoupons.js';
import { CATEGORY_SLUGS } from '../data/i18nDictionaries.js';
import { SECTION_I18N } from '../data/multilingualSections.js';
import { LOCALES } from '../config/locales.js';
import { parseTrackingLinkInput, parseSiteStripeImageInput } from '../utils/sitestripeParser.js';
import { slugifyCategory } from '../utils/manualCatalog.js';
import { copyTextSafe } from '../utils/clipboard.js';

const today = () => new Date().toISOString().slice(0, 16);

const EMPTY_COUPON = {
  id: '', store: 'aliexpress', code: '', countries: 'us', userType: 'all', currency: 'USD',
  discountType: 'fixed', discountValue: '', maxDiscount: '', minSpend: '', validFrom: today(), validUntil: '',
  channel: 'both', sourceUrl: '', lastVerifiedAt: today(), affiliateUrl: '', category: '',
  titleEs: '', titleEn: '', notesEs: '', notesEn: ''
};

const EMPTY_PRODUCT = {
  trackingInput: '',
  imageInput: '',
  title: '',
  originPrice: '',
  discountPrice: '',
  discount: '',
  currency: 'USD',
  countries: 'global',
  productId: '',
  category: 'perifericos-gaming',
  newCategoryName: ''
};

const ADMIN_SECRET_STORAGE_KEY = 'cuponestech_admin_secret';

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

const inputCls = 'w-full rounded-lg border border-[#D8C8B4] bg-white px-2.5 py-1.5 text-sm text-[#1F1B18] focus:border-[#B85332] focus:outline-none';

export default function AdminDashboard() {
  const [mode, setMode] = useState('products');

  // --- Estado de productos manuales SiteStripe ---
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [editedFields, setEditedFields] = useState({});
  const editedFieldsRef = useRef({});
  const [adminSecret, setAdminSecret] = useState(() => {
    try {
      return window.sessionStorage.getItem(ADMIN_SECRET_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [extracting, setExtracting] = useState(false);
  const [extractNotice, setExtractNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [dbConfigured, setDbConfigured] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [imgPreviewError, setImgPreviewError] = useState(false);

  // --- Estado de cupones verificados (flujo existente) ---
  const [form, setForm] = useState(EMPTY_COUPON);
  const [copied, setCopied] = useState(false);

  const canonicalLabels = SECTION_I18N.es?.catShort || {};

  const buildAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    const secret = adminSecret.trim();
    if (secret) {
      headers['x-admin-secret'] = secret;
      headers.Authorization = `Bearer ${secret}`;
    }
    return headers;
  }, [adminSecret]);

  const loadCatalogState = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) return;
      const data = await res.json();
      if (data?.ok) {
        setPublishedProducts(Array.isArray(data.products) ? data.products : []);
        setCustomCategories(Array.isArray(data.categories) ? data.categories : []);
        setDbConfigured(data.dbConfigured !== false);
      }
    } catch {
      // Silencioso en local sin servidor API
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogState();
  }, [loadCatalogState]);

  const handleSecretChange = (e) => {
    const val = e.target.value;
    setAdminSecret(val);
    try {
      if (val) window.sessionStorage.setItem(ADMIN_SECRET_STORAGE_KEY, val);
      else window.sessionStorage.removeItem(ADMIN_SECRET_STORAGE_KEY);
    } catch {
      // Ignorar si sessionStorage no está disponible
    }
  };

  const setProductField = (key) => (e) => {
    const value = e.target.value;
    if (key === 'imageInput') setImgPreviewError(false);
    editedFieldsRef.current = { ...editedFieldsRef.current, [key]: true };
    setEditedFields((prev) => ({ ...prev, [key]: true }));
    setProductForm((prev) => ({ ...prev, [key]: value }));
  };

  const parsedTracking = parseTrackingLinkInput(productForm.trackingInput);
  const parsedImage = parseSiteStripeImageInput(productForm.imageInput);
  const isNewCategoryMode = productForm.category === '__new__';
  const generatedSlug = isNewCategoryMode ? slugifyCategory(productForm.newCategoryName) : '';

  useEffect(() => {
    setImgPreviewError(false);
  }, [parsedImage.imageUrl]);

  const handleExtractMetadata = async () => {
    if (!parsedTracking.isValid) {
      setExtractNotice({
        type: 'warning',
        message: 'Ingresa primero un tracking link válido (ej. https://s.click.aliexpress.com/e/_c441YyEz).'
      });
      return;
    }

    setExtracting(true);
    setExtractNotice(null);
    try {
      const res = await fetch('/api/aliexpress-metadata', {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ url: parsedTracking.trackingUrl })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        let message = data?.error || `No se pudieron obtener datos automáticamente (HTTP ${res.status}). Completa los campos manualmente.`;
        if (res.status === 401) {
          message = 'Acceso no autorizado (HTTP 401): ingresa o verifica el campo "Admin Secret" en la parte superior para extraer metadatos.';
        } else if (res.status === 503) {
          message = data?.error || 'Servicio en producción sin ADMIN_SECRET configurado (HTTP 503). Configura ADMIN_SECRET en las variables de entorno del servidor o completa los campos manualmente.';
        }
        setExtractNotice({
          type: 'warning',
          message
        });
        return;
      }

      const meta = data.metadata || {};
      const shouldResetPreview = Boolean(meta.imageUrl);
      setProductForm((prev) => {
        const edited = editedFieldsRef.current;
        const fillImage = !prev.imageInput.trim() && Boolean(meta.imageUrl);
        return {
          ...prev,
          title: edited.title && prev.title.trim() ? prev.title : (meta.title || prev.title),
          originPrice: edited.originPrice && prev.originPrice.trim() ? prev.originPrice : (meta.originPrice || prev.originPrice),
          discountPrice: edited.discountPrice && prev.discountPrice.trim() ? prev.discountPrice : (meta.discountPrice || prev.discountPrice),
          discount: edited.discount && prev.discount.trim() ? prev.discount : (meta.discount || prev.discount),
          currency: edited.currency && prev.currency.trim() ? prev.currency : (meta.currency || prev.currency || 'USD'),
          productId: edited.productId && prev.productId.trim() ? prev.productId : (meta.productId || prev.productId),
          imageInput: fillImage ? meta.imageUrl : prev.imageInput
        };
      });
      if (shouldResetPreview && !productForm.imageInput.trim()) {
        setImgPreviewError(false);
      }

      if (data.blocked || data.partial) {
        setExtractNotice({
          type: 'warning',
          message: data.warning || 'AliExpress limitó la lectura automática. Puedes completar o editar cualquier campo manualmente.'
        });
      } else {
        setExtractNotice({
          type: 'success',
          message: 'Metadatos extraídos correctamente. Revisa o ajusta los campos editables antes de publicar.'
        });
      }
    } catch {
      setExtractNotice({
        type: 'warning',
        message: 'Sin conexión con /api/aliexpress-metadata. Completa los campos manualmente y guarda cuando quieras.'
      });
    } finally {
      setExtracting(false);
    }
  };

  const handlePublishProduct = async (e) => {
    e.preventDefault();
    setSaveNotice(null);

    if (!parsedTracking.isValid) {
      setSaveNotice({ type: 'error', message: parsedTracking.error });
      return;
    }
    if (!parsedImage.isValid) {
      setSaveNotice({ type: 'error', message: parsedImage.error });
      return;
    }
    if (!productForm.title.trim()) {
      setSaveNotice({ type: 'error', message: 'Ingresa el título del producto antes de publicar.' });
      return;
    }
    if (isNewCategoryMode && !generatedSlug) {
      setSaveNotice({ type: 'error', message: 'Ingresa un nombre válido para la nueva categoría.' });
      return;
    }

    const selectedCustomCat = customCategories.find((c) => c.slug === productForm.category);
    const categoryLabel = isNewCategoryMode
      ? productForm.newCategoryName.trim()
      : (canonicalLabels[productForm.category] || selectedCustomCat?.label || productForm.category);

    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify({
          trackingUrl: parsedTracking.trackingUrl,
          imageInput: productForm.imageInput,
          title: productForm.title.trim(),
          originPrice: productForm.originPrice.trim(),
          discountPrice: productForm.discountPrice.trim(),
          discount: productForm.discount.trim(),
          currency: productForm.currency.trim().toUpperCase() || 'USD',
          countries: productForm.countries,
          productId: productForm.productId.trim(),
          category: isNewCategoryMode ? generatedSlug : productForm.category,
          categoryLabel,
          newCategoryName: isNewCategoryMode ? productForm.newCategoryName.trim() : ''
        })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        let message = data?.error || `Error guardando producto (HTTP ${res.status}).`;
        if (res.status === 401) {
          message = 'No autorizado (HTTP 401): ingresa o verifica el "Admin Secret" en la barra superior antes de publicar.';
        } else if (res.status === 503) {
          message = data?.error || 'Servidor no listo (HTTP 503): verifica que ADMIN_SECRET y DATABASE_URL estén configurados en las variables de entorno del servidor.';
        }
        setSaveNotice({
          type: 'error',
          message
        });
        return;
      }

      setSaveNotice({
        type: 'success',
        message: `Producto publicado en categoría "${categoryLabel}" (${data.product?.ProductId || ''}).`
      });
      setProductForm({
        ...EMPTY_PRODUCT,
        category: data.category?.slug || (isNewCategoryMode ? generatedSlug : productForm.category)
      });
      editedFieldsRef.current = {};
      setEditedFields({});
      setExtractNotice(null);
      await loadCatalogState();
    } catch {
      setSaveNotice({
        type: 'error',
        message: 'Error de red al conectar con /api/products.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setSaveNotice(null);
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: buildAuthHeaders()
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        let message = data?.error || `No se pudo eliminar (HTTP ${res.status}).`;
        if (res.status === 401) {
          message = 'No autorizado (HTTP 401): ingresa o verifica el "Admin Secret" en la barra superior antes de eliminar.';
        } else if (res.status === 503) {
          message = data?.error || 'Servidor no listo (HTTP 503): verifica que ADMIN_SECRET y DATABASE_URL estén configurados en el servidor.';
        }
        setSaveNotice({ type: 'error', message });
        return;
      }
      setPublishedProducts((prev) => prev.filter((p) => (p.id || p.ProductId) !== id));
    } catch {
      setSaveNotice({ type: 'error', message: 'Error de red al eliminar producto.' });
    }
  };

  const handleCopyLink = async (id, url) => {
    const ok = await copyTextSafe(url);
    if (!ok) return;
    setCopiedId(id);
    setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
  };

  const resetProductForm = () => {
    setProductForm(EMPTY_PRODUCT);
    editedFieldsRef.current = {};
    setEditedFields({});
    setExtractNotice(null);
    setSaveNotice(null);
    setImgPreviewError(false);
  };

  // --- Helpers de cupones (flujo existente) ---
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const draft = toCoupon(form);
  const draftErrors = validateCoupon(draft);
  const json = JSON.stringify(draft, null, 2);
  const isoList = [...new Set(LOCALES.map((l) => l.iso))].join(', ');
  const copy = async () => {
    const ok = await copyTextSafe(`${json},`);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const field = (label, k, props = {}) => (
    <label className="block text-xs font-bold text-[#574B40]">
      {label}
      <input className={inputCls} value={form[k]} onChange={set(k)} {...props} />
    </label>
  );
  const select = (label, k, opts) => (
    <label className="block text-xs font-bold text-[#574B40]">
      {label}
      <select className={inputCls} value={form[k]} onChange={set(k)}>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-8 font-sans text-[#1F1B18] bg-[#FCF9F4] min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DED4C6] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Panel de Administración · CuponesTech</h1>
          <p className="text-sm text-[#574B40]">
            Publicación directa de productos AliExpress (SiteStripe) y generador de cupones verificados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('products')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold border transition ${
              mode === 'products'
                ? 'bg-[#B85332] text-[#FCF9F4] border-[#B85332] shadow-sm'
                : 'bg-white text-[#574B40] border-[#D8C8B4] hover:border-[#B85332]'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Productos AliExpress (SiteStripe)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('coupons')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold border transition ${
              mode === 'coupons'
                ? 'bg-[#B85332] text-[#FCF9F4] border-[#B85332] shadow-sm'
                : 'bg-white text-[#574B40] border-[#D8C8B4] hover:border-[#B85332]'
            }`}
          >
            <TicketPercent className="h-4 w-4" />
            <span>Cupones verificados</span>
          </button>
        </div>
      </header>

      {mode === 'products' ? (
        <div className="space-y-8">
          {/* Barra de token admin opcional + estado DB */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#DED4C6] bg-[#F6F2EA] px-4 py-3">
            <label className="flex flex-1 items-center gap-2 text-xs font-bold text-[#574B40]">
              <Lock className="h-4 w-4 text-[#B85332] shrink-0" />
              <span className="shrink-0">Admin Secret (si aplica):</span>
              <input
                type="password"
                value={adminSecret}
                onChange={handleSecretChange}
                placeholder="Opcional si ADMIN_SECRET está configurado"
                className="w-full max-w-xs rounded-lg border border-[#D8C8B4] bg-white px-2.5 py-1 text-xs font-normal"
              />
            </label>
            <div className="flex items-center gap-2 text-xs">
              {!dbConfigured && (
                <span className="rounded-lg bg-[#9E4224]/10 px-2.5 py-1 font-bold text-[#9E4224]">
                  DATABASE_URL no configurada en servidor
                </span>
              )}
              <a
                href="/#catalogo-ofertas"
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B4] bg-white px-2.5 py-1 font-bold text-[#574B40] hover:border-[#B85332] hover:text-[#B85332]"
              >
                <span>Ver catálogo</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>

          {/* Formulario SiteStripe + Vista Previa */}
          <section className="grid gap-6 lg:grid-cols-12">
            <form onSubmit={handlePublishProduct} className="lg:col-span-7 space-y-4 rounded-2xl border border-[#DED4C6] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Alta manual con AliExpress SiteStripe</h2>
                <button type="button" onClick={resetProductForm} className="text-xs font-bold text-[#6E6055] underline">
                  Limpiar
                </button>
              </div>

              {/* R1 Campo 1: Tracking link */}
              <div className="space-y-1.5 rounded-xl border border-[#DED4C6] bg-[#FCF9F4] p-3.5">
                <label className="block text-xs font-extrabold text-[#1F1B18]">
                  1. Tracking link de afiliado (SiteStripe "Get link") *
                  <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="https://s.click.aliexpress.com/e/_c441YyEz"
                      value={productForm.trackingInput}
                      onChange={setProductField('trackingInput')}
                    />
                    <button
                      type="button"
                      onClick={handleExtractMetadata}
                      disabled={extracting}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1F1B18] px-3.5 py-1.5 text-xs font-bold text-[#FCF9F4] hover:bg-[#38312B] disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#FFE000]" />
                      <span>{extracting ? 'Extrayendo...' : 'Extraer datos'}</span>
                    </button>
                  </div>
                </label>
                {productForm.trackingInput.trim() && (
                  <p className={`text-[11px] font-bold ${parsedTracking.isValid ? 'text-[#3D6352]' : 'text-[#9E4224]'}`}>
                    {parsedTracking.isValid
                      ? `Enlace válido: ${parsedTracking.trackingUrl}`
                      : parsedTracking.error}
                  </p>
                )}
              </div>

              {/* Aviso de extracción (siempre no bloqueante - R2) */}
              {extractNotice && (
                <div
                  className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                    extractNotice.type === 'success'
                      ? 'border-[#3D6352]/40 bg-[#3D6352]/10 text-[#2E4E3F]'
                      : 'border-[#D4A359] bg-[#F8F2E8] text-[#7A3B24]'
                  }`}
                >
                  {extractNotice.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{extractNotice.message}</span>
                </div>
              )}

              {/* R1 Campo 2: URL o HTML de imagen SiteStripe */}
              <div className="space-y-1.5 rounded-xl border border-[#DED4C6] bg-[#FCF9F4] p-3.5">
                <label className="block text-xs font-extrabold text-[#1F1B18]">
                  2. URL o código HTML de imagen (SiteStripe) *
                  <textarea
                    rows={3}
                    className={`${inputCls} mt-1.5 font-mono text-xs`}
                    placeholder={'<a href="https://s.click.aliexpress.com/e/_c441YyEz target="_blank"><img src="//ae-pic-a1.aliexpress-media.com/kf/..." /></a> o https://...'}
                    value={productForm.imageInput}
                    onChange={setProductField('imageInput')}
                  />
                </label>
                {productForm.imageInput.trim() && (
                  <div className="space-y-1">
                    <p className={`text-[11px] font-bold break-all ${parsedImage.isValid ? 'text-[#3D6352]' : 'text-[#9E4224]'}`}>
                      {parsedImage.isValid
                        ? `Imagen resuelta (${parsedImage.sourceType === 'html' ? 'HTML SiteStripe' : 'URL directa'}): ${parsedImage.imageUrl}`
                        : parsedImage.error}
                    </p>
                    {parsedImage.extractedTrackingUrl && !productForm.trackingInput.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          editedFieldsRef.current = { ...editedFieldsRef.current, trackingInput: true };
                          setEditedFields((prev) => ({ ...prev, trackingInput: true }));
                          setProductForm((prev) => ({ ...prev, trackingInput: parsedImage.extractedTrackingUrl }));
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-[#B85332]/10 px-2 py-0.5 text-[11px] font-bold text-[#B85332] hover:bg-[#B85332]/20"
                      >
                        <Link2 className="h-3 w-3" />
                        <span>Usar tracking detectado en HTML ({parsedImage.extractedTrackingUrl})</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* R2 Campos editables del producto */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#574B40]">
                  Título / descripción del producto *
                  <input
                    type="text"
                    className={`${inputCls} mt-1`}
                    placeholder="Ej. GameSir X5 Lite Control Móvil USB-C"
                    value={productForm.title}
                    onChange={setProductField('title')}
                  />
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <label className="block text-xs font-bold text-[#574B40]">
                    Precio oferta
                    <input
                      type="text"
                      className={`${inputCls} mt-1`}
                      placeholder="19.99"
                      value={productForm.discountPrice}
                      onChange={setProductField('discountPrice')}
                    />
                  </label>
                  <label className="block text-xs font-bold text-[#574B40]">
                    Precio original
                    <input
                      type="text"
                      className={`${inputCls} mt-1`}
                      placeholder="39.99"
                      value={productForm.originPrice}
                      onChange={setProductField('originPrice')}
                    />
                  </label>
                  <label className="block text-xs font-bold text-[#574B40]">
                    % Descuento
                    <input
                      type="text"
                      className={`${inputCls} mt-1`}
                      placeholder="Auto o 50%"
                      value={productForm.discount}
                      onChange={setProductField('discount')}
                    />
                  </label>
                  <label className="block text-xs font-bold text-[#574B40]">
                    Moneda
                    <input
                      type="text"
                      className={`${inputCls} mt-1 uppercase`}
                      placeholder="USD"
                      value={productForm.currency}
                      onChange={setProductField('currency')}
                    />
                  </label>
                </div>

                {/* R3 Selector / Creación de Categoría */}
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <label className="block text-xs font-bold text-[#574B40]">
                    Categoría en el catálogo *
                    <select
                      className={`${inputCls} mt-1`}
                      value={productForm.category}
                      onChange={setProductField('category')}
                    >
                      <optgroup label="Categorías oficiales">
                        {CATEGORY_SLUGS.map((slug) => (
                          <option key={slug} value={slug}>
                            {canonicalLabels[slug] || slug}
                          </option>
                        ))}
                      </optgroup>
                      {customCategories.length > 0 && (
                        <optgroup label="Categorías personalizadas">
                          {customCategories
                            .filter((c) => !CATEGORY_SLUGS.includes(c.slug))
                            .map((c) => (
                              <option key={c.slug} value={c.slug}>
                                {c.label || c.slug}
                              </option>
                            ))}
                        </optgroup>
                      )}
                      <option value="__new__">+ Crear nueva categoría...</option>
                    </select>
                  </label>

                  <label className="block text-xs font-bold text-[#574B40]">
                    Países (ISO2 separados por coma o global)
                    <input
                      type="text"
                      className={`${inputCls} mt-1`}
                      placeholder="global o mx,us,es"
                      value={productForm.countries}
                      onChange={setProductField('countries')}
                    />
                  </label>
                </div>

                {isNewCategoryMode && (
                  <div className="rounded-xl border border-[#B85332]/30 bg-[#FCF9F4] p-3">
                    <label className="block text-xs font-bold text-[#574B40]">
                      Nombre de la nueva categoría *
                      <div className="mt-1 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-[#B85332] shrink-0" />
                        <input
                          type="text"
                          className={inputCls}
                          placeholder="Ej. Controles Gaming"
                          value={productForm.newCategoryName}
                          onChange={setProductField('newCategoryName')}
                        />
                      </div>
                    </label>
                    {generatedSlug && (
                      <p className="mt-1 text-[11px] font-bold text-[#3D6352]">
                        Slug generado: <code>{generatedSlug}</code>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {saveNotice && (
                <div
                  className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
                    saveNotice.type === 'success'
                      ? 'border-[#3D6352]/40 bg-[#3D6352]/10 text-[#2E4E3F]'
                      : 'border-[#9E4224]/40 bg-[#9E4224]/10 text-[#9E4224]'
                  }`}
                >
                  {saveNotice.message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#B85332] px-4 py-2.5 text-sm font-extrabold text-[#FCF9F4] hover:bg-[#9E4224] transition shadow-sm disabled:opacity-50"
              >
                {saving ? 'Publicando en catálogo...' : 'Publicar producto en catálogo'}
              </button>
            </form>

            {/* Vista previa de tarjeta en tiempo real */}
            <aside className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-[#DED4C6] bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-[#574B40] uppercase tracking-wider">
                  Vista previa en catálogo
                </h3>
                <div className="overflow-hidden rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] max-w-xs mx-auto">
                  <div className="relative aspect-square w-full bg-[#F2ECE1] flex items-center justify-center overflow-hidden">
                    {parsedImage.isValid && !imgPreviewError ? (
                      <img
                        src={parsedImage.imageUrl}
                        alt={productForm.title || 'Vista previa'}
                        onError={() => setImgPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-[#8A7B70] p-4 text-center">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs font-semibold">
                          {imgPreviewError
                            ? 'No se pudo cargar la vista previa (la URL se guardará tal cual)'
                            : 'Pega URL o HTML SiteStripe para ver la imagen'}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 rounded-lg bg-[#1F1B18]/85 px-2 py-0.5 text-[10px] font-bold text-[#FCF9F4] flex items-center gap-1">
                      <Tag className="h-3 w-3 text-[#FFE000]" />
                      <span>
                        {isNewCategoryMode
                          ? (productForm.newCategoryName.trim() || 'Nueva categoría')
                          : (canonicalLabels[productForm.category]
                              || customCategories.find((c) => c.slug === productForm.category)?.label
                              || productForm.category)}
                      </span>
                    </span>
                    {productForm.discount && (
                      <span className="absolute top-2 right-2 rounded-lg bg-[#B85332] px-2 py-0.5 text-[11px] font-extrabold text-[#FCF9F4]">
                        -{productForm.discount.replace(/^-/, '')}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-2">
                    <h4 className="text-sm font-bold text-[#1F1B18] line-clamp-2">
                      {productForm.title.trim() || 'Título del producto AliExpress'}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#B85332]">
                        {productForm.discountPrice || productForm.originPrice || 'USD --'}
                      </span>
                      {productForm.originPrice && productForm.originPrice !== productForm.discountPrice && (
                        <span className="text-xs text-[#8A7B70] line-through">
                          {productForm.originPrice}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <span className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#B85332] px-2.5 py-2 text-xs font-bold text-[#FCF9F4]">
                        <span>Ver Oferta</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                      <span className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#D8C8B4] bg-white px-2.5 py-2 text-xs font-bold text-[#1F1B18]">
                        <Copy className="h-3 w-3" />
                        <span>Copiar enlace</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          {/* Lista de productos manuales publicados */}
          <section className="rounded-2xl border border-[#DED4C6] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                Productos manuales publicados ({publishedProducts.length})
              </h2>
              <button
                type="button"
                onClick={loadCatalogState}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#574B40] hover:text-[#B85332]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingProducts ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>

            {publishedProducts.length === 0 ? (
              <p className="text-sm text-[#6E6055]">
                No hay productos manuales guardados en la base de datos todavía.
              </p>
            ) : (
              <ul className="divide-y divide-[#EFE7DA]">
                {publishedProducts.map((item) => {
                  const id = item.id || item.ProductId;
                  const promoUrl = item['Promotion Url'];
                  const isCopied = copiedId === id;
                  return (
                    <li key={id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item['Image Url']}
                          alt={item['Product Desc']}
                          className="h-14 w-14 rounded-xl object-cover border border-[#DED4C6] bg-[#F2ECE1] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#1F1B18] truncate">{item['Product Desc']}</p>
                          <p className="text-xs text-[#574B40] truncate">
                            <span className="font-bold text-[#B85332]">{item['Discount Price'] || item['Origin Price'] || 'Sin precio'}</span>
                            {' · '}
                            <span>Categoría: {item.categoryLabel || item.category}</span>
                            {' · '}
                            <span>{(item.countries || ['global']).join(', ')}</span>
                          </p>
                          <p className="text-[11px] text-[#6E6055] truncate">{promoUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(id, promoUrl)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B4] bg-[#FCF9F4] px-2.5 py-1.5 text-xs font-bold text-[#1F1B18] hover:border-[#B85332]"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-[#3D6352]" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                        </button>
                        <a
                          href={promoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B4] bg-[#FCF9F4] px-2.5 py-1.5 text-xs font-bold text-[#1F1B18] hover:border-[#B85332]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Abrir</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#9E4224]/30 bg-[#9E4224]/10 px-2.5 py-1.5 text-xs font-bold text-[#9E4224] hover:bg-[#9E4224]/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <div>
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
              <button type="button" onClick={() => setForm(EMPTY_COUPON)} className="text-xs font-bold text-[#6E6055] underline">Limpiar</button>
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
        </div>
      )}
    </main>
  );
}
