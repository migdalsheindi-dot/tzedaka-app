import { Alert, Linking, Platform } from 'react-native';

/**
 * Link base de cobro de Mercado Pago de ISEJ. El usuario ingresa/completa
 * el monto manualmente en el checkout — no acepta el monto por query string.
 */
export const MERCADOPAGO_BASE_URL = 'https://link.mercadopago.com.ar/isej770';

/**
 * Checkout rápido de Mercado Pago ya configurado y listo para pagar $1.000
 * directo, sin que el usuario tenga que tipear el monto.
 */
export const MERCADOPAGO_QUICK_1000_URL = 'https://mpago.la/2eaercD';
const MERCADOPAGO_QUICK_1000_AMOUNT = 1000;

/**
 * Devuelve el link de Mercado Pago correspondiente al monto elegido:
 * $1.000 exacto va directo al checkout rápido ya armado; cualquier otro
 * monto (rápido o "Otro monto") va al link base, donde el usuario lo
 * confirma/completa.
 */
export function getMercadoPagoUrl(amount: number): string {
  if (Math.round(amount) === MERCADOPAGO_QUICK_1000_AMOUNT) {
    return MERCADOPAGO_QUICK_1000_URL;
  }
  return MERCADOPAGO_BASE_URL;
}

/**
 * Abre el link de Mercado Pago que corresponda al monto elegido. En iOS y
 * Android, Linking.openURL ya resuelve automáticamente a la app nativa de
 * Mercado Pago si está instalada, o al navegador si no lo está — no hace
 * falta lógica de plataforma adicional.
 */
export async function openMercadoPagoDonation(amount: number): Promise<boolean> {
  const url = getMercadoPagoUrl(amount);
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
