import { Linking, Platform } from 'react-native';

/** Checkout de Mercado Pago listo para pagar, uno por cada monto fijo. */
const MERCADOPAGO_QUICK_LINKS: Record<number, string> = {
  500: 'https://mpago.la/1z1jJzT',
  1000: 'https://mpago.la/2eaercD',
  2000: 'https://mpago.la/1hAk8uu',
  5000: 'https://mpago.la/1psWXZf',
  10000: 'https://mpago.la/1ZHFDPq',
};

/** Link base de cobro de Mercado Pago, para "Otro monto". */
export const MERCADOPAGO_BASE_URL = 'https://link.mercadopago.com.ar/isej770';

/** Paquete de la app de Mercado Pago en Android (no confundir con Mercado Libre). */
const MERCADOPAGO_ANDROID_PACKAGE = 'com.mercadopago.wallet';

/**
 * Intent de Android que le pide a Chrome abrir el link *directamente en la
 * app de Mercado Pago*. Si la app no está instalada, Chrome usa
 * `browser_fallback_url` y abre el mismo link en el navegador.
 */
function toAndroidIntent(url: string): string {
  const { host, pathname, search } = new URL(url);
  const fallback = encodeURIComponent(url);
  return (
    `intent://${host}${pathname}${search}#Intent;scheme=https;` +
    `package=${MERCADOPAGO_ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`
  );
}

/**
 * Abre el link de Mercado Pago en la misma pestaña, sin iframes ni
 * `target="_blank"` (abrir una pestaña nueva con delay lo bloquean los
 * navegadores mobile).
 *
 * - Android: Intent que fuerza la app de Mercado Pago. Si Chrome lo bloquea
 *   (no cambió nada a los 1,2 s), se navega al link https normal.
 * - iOS/desktop: navegación directa al link corto; en iOS es el sistema el
 *   que decide si abre la app (Universal Links) y no se puede forzar desde
 *   una web.
 */
function openOnWeb(url: string) {
  if (typeof window === 'undefined') return;

  const isAndroid = /Android/i.test(navigator.userAgent);
  if (!isAndroid) {
    window.location.href = url;
    return;
  }

  window.location.href = toAndroidIntent(url);
  setTimeout(() => {
    // Si seguimos acá y visibles, el intent no se ejecutó: caemos al link normal.
    if (document.visibilityState === 'visible') {
      window.location.href = url;
    }
  }, 1200);
}

/**
 * ¿Navegador de celular o tablet? Ahí el link a Mercado Pago tiene que
 * abrirse en el mismo toque: iOS (Universal Links) y Android (intents) solo
 * entregan el link a la app si la navegación nace de un gesto del usuario;
 * un salto de página programado con temporizador cae en la web (y a veces
 * pasa por Mercado Libre).
 */
export function opensAtTap(): boolean {
  return getTapProfile() !== null;
}

export type TapProfile = 'ios' | 'android';

/**
 * Qué tipo de celular es, para elegir cuánto puede durar la caída de la
 * moneda antes de abrir Mercado Pago: iOS exige que la navegación salga a
 * menos de ~1 s del toque; Chrome en Android tolera hasta ~5 s.
 */
export function getTapProfile(): TapProfile | null {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  const isIpadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || isIpadOs) return 'ios';
  return null;
}

async function openUrl(url: string): Promise<void> {
  if (Platform.OS === 'web') {
    openOnWeb(url);
    return;
  }
  // En la app nativa el sistema resuelve solo: app de Mercado Pago si está instalada.
  await Linking.openURL(url);
}

/** Abre el checkout de Mercado Pago del monto fijo elegido. */
export async function openMercadoPagoDonation(amount: number): Promise<void> {
  const url = MERCADOPAGO_QUICK_LINKS[Math.round(amount)] ?? MERCADOPAGO_BASE_URL;
  await openUrl(url);
}

/** Abre el link base de Mercado Pago para que el usuario ingrese su propio monto. */
export async function openMercadoPagoCustomAmount(): Promise<void> {
  await openUrl(MERCADOPAGO_BASE_URL);
}
