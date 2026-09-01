import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@tzedaka/pendingDonation';

/**
 * Donación esperando confirmación (el usuario ya fue redirigido a Mercado
 * Pago pero todavía no confirmó si completó el pago). Se persiste para que
 * sobreviva si la app se cierra del todo mientras el usuario está en
 * Mercado Pago: al reabrirla, se detecta el pendiente y se le vuelve a
 * pedir la confirmación en vez de perder silenciosamente la donación.
 */
export function usePendingDonation() {
  const [pendingAmount, setPendingAmountState] = useState<number | null>(null);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      const amount = raw ? Number(raw) : NaN;
      if (!Number.isNaN(amount) && amount > 0) {
        setPendingAmountState(amount);
        setRestoredFromStorage(true);
      }
    });
  }, []);

  const setPendingAmount = useCallback((amount: number) => {
    setPendingAmountState(amount);
    AsyncStorage.setItem(STORAGE_KEY, String(amount));
  }, []);

  const clearPendingAmount = useCallback(() => {
    setPendingAmountState(null);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return { pendingAmount, setPendingAmount, clearPendingAmount, restoredFromStorage };
}
