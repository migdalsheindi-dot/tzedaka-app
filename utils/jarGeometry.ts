/**
 * Geometría compartida de la alcancía (viewBox del SVG) y de las
 * posiciones donde se apilan las monedas acumuladas. La usan tanto el
 * componente estático (TzedakaBox, que dibuja la pila ya guardada) como
 * la animación de caída (CoinAnimation, que necesita saber a qué
 * posición exacta "aterriza" cada moneda nueva).
 */

export const JAR_VIEWBOX_WIDTH = 220;
export const JAR_VIEWBOX_HEIGHT = 262;
export const JAR_CENTER_X = 110;

// Punto de entrada de la moneda (arriba, fuera del frasco) y ranura de la tapa.
export const JAR_ENTRY_POINT = { x: JAR_CENTER_X, y: -60 };
export const JAR_SLOT_POINT = { x: JAR_CENTER_X, y: 52 };

// Límites del interior transparente donde se apilan las monedas.
const INTERIOR_LEFT = 62;
const INTERIOR_RIGHT = 158;
const INTERIOR_FLOOR_Y = 226;
const INTERIOR_CEILING_Y = 112;

const COIN_RX = 8;
const COIN_RY = 4;
const COINS_PER_ROW = 7;
const ROW_STEP_X = (INTERIOR_RIGHT - INTERIOR_LEFT) / COINS_PER_ROW;
const ROW_STEP_Y = 6.5;

/** Cantidad máxima de monedas que se dibujan en la pila por razones de performance/legibilidad visual. */
export const MAX_VISIBLE_COINS = 40;

/** Pseudo-random determinístico (mismo índice -> mismo resultado siempre). */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export type CoinSlot = { x: number; y: number; rotation: number };

/** Posición dentro de la pila para la moneda número `index` (0-based). */
export function getCoinPileSlot(index: number): CoinSlot {
  const capped = Math.min(Math.max(index, 0), MAX_VISIBLE_COINS - 1);
  const row = Math.floor(capped / COINS_PER_ROW);
  const col = capped % COINS_PER_ROW;

  const jitterX = (seededRandom(capped * 3.13 + 1) - 0.5) * (ROW_STEP_X * 0.35);
  const jitterY = (seededRandom(capped * 7.77 + 2) - 0.5) * 2.4;
  const rotation = (seededRandom(capped * 5.31 + 3) - 0.5) * 40;

  const x = INTERIOR_LEFT + COIN_RX + col * ROW_STEP_X + jitterX;
  const y = Math.max(INTERIOR_FLOOR_Y - row * ROW_STEP_Y + jitterY, INTERIOR_CEILING_Y);

  return { x, y, rotation };
}

export const COIN_STACK_RX = COIN_RX;
export const COIN_STACK_RY = COIN_RY;
