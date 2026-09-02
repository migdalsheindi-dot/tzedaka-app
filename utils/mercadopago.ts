import { Alert, Linking, Platform } from 'react-native';

/**
 * Link base de cobro de Mercado Pago de ISEJ, para "Otro monto": el usuario
 * ingresa la cantidad directamente en el checkout de Mercado Pago.
 */
export const MERCADOPAGO_BASE_URL = 'https://link.mercadopago.com.ar/isej770';

/**
 * Checkouts rápidos de Mercado Pago, uno por cada monto fijo, ya armados y
 * listos para pagar sin que el usuario tenga que tipear nada.
 */
const MERCADOPAGO_QUICK_LINKS: Record<number, string> = {
  500: 'https://mpago.la/1z1jJzT',
  1000: 'https://mpago.la/2eaercD',
  2000: 'https://mpago.la/1hAk8uu',
  5000: 'https://mpago.la/1psWXZf',
  10000: 'https://mpago.la/1ZHFDPq',
};

/**
 * Devuelve el link de Mercado Pago del checkout rápido para un monto fijo,
 * o `null` si el monto no tiene un link propio (usar el link base en ese caso).
 */
export function getQuickCheckoutUrl(amount: number): string | null {
  return MERCADOPAGO_QUICK_LINKS[Math.round(amount)] ?? null;
}

/**
 * Abre una URL de Mercado Pago. En iOS y Android, Linking.openURL ya
 * resuelve automáticamente a la app nativa de Mercado Pago si está
 * instalada, o al navegador si no lo está — no hace falta lógica de
 * plataforma adicional.
 */
async function openMercadoPagoUrl(url: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen && Platform.OS !== 'web') {
      Alert.alert(
        'No se pudo abrir Mercado Pago',
        'Verificá tu conexión a internet e intentá nuevamente.'
      );
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch (error) {
    Alert.alert(
      'No se pudo abrir Mercado Pago',
      'Ocurrió un problema al intentar redirigirte. Intentá nuevamente.'
    );
    return false;
  }
}

/** Abre el checkout rápido del monto fijo elegido. */
export async function openMercadoPagoDonation(amount: number): Promise<boolean> {
  const url = getQuickCheckoutUrl(amount) ?? MERCADOPAGO_BASE_URL;
  return openMercadoPagoUrl(url);
}

/** Abre el link base de Mercado Pago para que el usuario ingrese su propio monto. */
export async function openMercadoPagoCustomAmount(): Promise<boolean> {
  return openMercadoPagoUrl(MERCADOPAGO_BASE_URL);
}
