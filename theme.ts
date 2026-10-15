/**
 * Sistema de diseño de Tzedaká ISEJ.
 *
 * Paleta: azul marino profundo (confianza, institucional) + rojo ISEJ como
 * acento de marca + dorado cálido (las monedas, el impacto) sobre un fondo
 * crema suave. Todos los textos cumplen contraste AA sobre su fondo.
 */
export const colors = {
  navy900: '#0A1630',
  navy800: '#0F1F45',
  navy700: '#17306A',
  navy600: '#244A94',

  red: '#D0271D',
  redSoft: '#FCE9E7',

  gold: '#F2B84B',
  goldDeep: '#C98A16',
  goldSoft: '#FFF4D9',

  bg: '#F7F5F0',
  card: '#FFFFFF',
  border: '#E9E4D8',

  ink: '#0F1B33',
  body: '#44506A',
  muted: '#6F7A90',

  green: '#1F9D6B',
  greenSoft: '#E3F5EC',

  onDark: '#FFFFFF',
  onDarkMuted: 'rgba(255,255,255,0.72)',
  glass: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.22)',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;

export const shadows = {
  card: '0px 1px 2px rgba(15, 27, 51, 0.05), 0px 8px 24px rgba(15, 27, 51, 0.06)',
  raised: '0px 2px 4px rgba(15, 27, 51, 0.08), 0px 16px 40px rgba(15, 27, 51, 0.14)',
  glow: '0px 12px 40px rgba(242, 184, 75, 0.35)',
} as const;

/** Ancho máximo del contenido en desktop. */
export const MAX_CONTENT_WIDTH = 1120;

/** A partir de este ancho se usa el layout de desktop (dos columnas). */
export const DESKTOP_BREAKPOINT = 900;
