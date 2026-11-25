/**
 * Copia texto al portapapeles de forma segura sin rechazos no manejados.
 * Usa navigator.clipboard.writeText con respaldo textarea + execCommand('copy').
 * @returns {Promise<boolean>} true únicamente si la copia tuvo éxito.
 */
export async function copyTextSafe(text) {
  if (text == null || text === '') return false;
  const value = String(text);

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fallback a execCommand en contextos sin permiso o HTTP local
  }

  try {
    if (
      typeof document !== 'undefined' &&
      document.body &&
      typeof document.createElement === 'function'
    ) {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange?.(0, value.length);
      const ok = typeof document.execCommand === 'function'
        ? document.execCommand('copy')
        : false;
      document.body.removeChild(textarea);
      return Boolean(ok);
    }
  } catch {
    // Portapapeles no disponible
  }

  return false;
}
