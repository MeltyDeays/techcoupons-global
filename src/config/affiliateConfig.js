/**
 * CONFIGURACIÓN CENTRAL DE MONETIZACIÓN Y ENLACES DE AFILIADO
 * -----------------------------------------------------------
 * Mantén este archivo con campos vacíos ("") mientras completas el registro
 * o durante la revisión inicial si aún no tienes tus deep-links de Admitad / AliExpress Portals.
 * Mientras estén vacíos, la plataforma funcionará en modo "Catálogo Editorial Limpio"
 * apuntando a las páginas oficiales sin IDs inventados.
 */
export const AFFILIATE_CONFIG = {
  // 1. Dominio real obtenido con GitHub Student Developer Pack (ej. "https://cuponestech.tech")
  siteDomain: 'https://cuponestech.tech',

  // 2. Correo de contacto visible en páginas legales (/privacy, /contact)
  contactEmail: 'contacto@cuponestech.tech',

  // 3. Red intermediaria CPA para Temu (ej. Admitad / Takeads / Partnerize)
  // Pega aquí tu enlace base de tracking cuando te aprueben el programa en Admitad.
  temuBaseTrackingUrl: '',

  // 4. AliExpress Portals / Admitad AliExpress
  // Pega aquí tu enlace base de tracking o link de campaña de AliExpress Portals.
  aliexpressBaseTrackingUrl: '',

  // 5. Banners laterales (<aside>) — Si active: false, se ocultan automáticamente
  sidebarBanners: {
    active: false,
    temuBannerUrl: '',
    aliexpressBannerUrl: ''
  }
};
