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

/** Abre `Linking.openURL` directo, sin pasos intermedios. */
async function openUrl(url: string): Promise<void> {
  // En web, `Linking.openURL` abre una pestaña nueva vía `window.open`,
  // que los navegadores mobile bloquean como popup si se llama con delay
  // (recién al terminar la animación, no en el instante del click). Por
  // eso en web se navega la misma pestaña en vez de abrir una nueva.
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
    return;
  }
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
