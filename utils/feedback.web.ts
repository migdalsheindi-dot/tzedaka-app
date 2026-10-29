// Patrón pensado como impacto físico: golpe, rebote corto, asentamiento.
const IMPACT_PATTERN = [15, 30, 10, 20, 25];

/**
 * Vibración de impacto en web. `navigator.vibrate` existe en Android
 * (Chrome/Firefox/Edge); iOS Safari no lo implementa, así que ahí es no-op.
 */
export function impactFeedback() {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(IMPACT_PATTERN);
    }
  } catch {
    // La vibración es un extra: nunca debe romper la donación.
  }
}
