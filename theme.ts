/**
 * Sistema de diseño de Tzedaká ISEJ — versión oscura y sofisticada.
 *
 * Lienzo casi negro (#050507) con acentos dorados metálicos y un toque de
 * índigo profundo como luz ambiental. Superficies de "cristal": relleno
 * translúcido + borde de 1px blanco al 8% + desenfoque de fondo.
 * Títulos en Syne (carácter), texto en Plus Jakarta Sans y cifras en Space Grotesk.
 */
export const colors = {
  bg: '#050507',
  indigo: '#2B2F8F',

  surface: 'rgba(255,255,255,0.045)',
  surfaceStrong: 'rgba(255,255,255,0.08)',
  hairline: 'rgba(255,255,255,0.08)',
  hairlineStrong: 'rgba(255,255,255,0.16)',

  text: '#F4F1EA',
  textMuted: 'rgba(244,241,234,0.64)',
  textFaint: 'rgba(244,241,234,0.42)',

  gold: '#E8C77A',
  goldDeep: '#B8893A',
  goldInk: '#1A1304',
  goldGradient: ['#F3DC9E', '#D9AE52', '#A87A2A'] as const,
} as const;

export const fonts = {
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemibold: 'PlusJakartaSans_600SemiBold',
  display: 'Syne_700Bold',
  displayHeavy: 'Syne_800ExtraBold',
  figure: 'SpaceGrotesk_500Medium',
  figureBold: 'SpaceGrotesk_700Bold',
} as const;

export const radius = {
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 72,
} as const;

/** Alto táctil mínimo cómodo para botones. */
export const TOUCH_TARGET = 56;

/** Ancho máximo del contenido en desktop. */
export const MAX_CONTENT_WIDTH = 1080;

/** A partir de este ancho se usa el layout de desktop (dos columnas). */
export const DESKTOP_BREAKPOINT = 900;

/** Curva de aceleración elegante (ease-out expo suave) para las entradas. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
