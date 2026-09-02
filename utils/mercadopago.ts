import { Alert, Linking, Platform } from 'react-native';

/**
 * Link de cobro de Mercado Pago de ISEJ. El usuario ingresa/confirma el
 * monto en el checkout de Mercado Pago.
 *
 * Antes se usaba un link corto (`mpago.la/...`) distinto por cada monto
 * fijo, pero esos links a veces abrían la app de Mercado Libre en vez de
 * Mercado Pago (o pedían iniciar sesión primero) en algunos celulares — se
 * volvió a este único link base, que redirige directo y de forma
 * consistente.
 */
export const MERCADOPAGO_BASE_URL = 'https://link.mercadopago.com.ar/isej770';

/**
 * Abre una URL de Mercado Pago.
 *
 * En web, `Linking.openURL` abre una pestaña nueva vía `window.open`, que
 * los navegadores (sobre todo en mobile) bloquean como popup cuando se
 * llama con delay — como acá, que se dispara recién al terminar la
 * animación de la moneda, no en el instante del click. Por eso en web
 * navegamos la misma pestaña (`window.location.href`), que no se bloquea.
 *
 * En iOS y Android nativo, `Linking.openURL` no tiene esa restricción y ya
 * resuelve automáticamente a la app nativa de Mercado Pago si está
 * instalada, o al navegador si no lo está.
 */
async function openMercadoPagoUrl(url: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
    return true;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
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

/** Abre el link de Mercado Pago para completar la donación. */
export async function openMercadoPagoDonation(): Promise<boolean> {
  return openMercadoPagoUrl(MERCADOPAGO_BASE_URL);
}
