/**
 * Sistema de diseño de Tzedaká ISEJ.
 *
 * Estética sobria y distinguida: marfil como lienzo, azul medianoche como
 * contraste de alto impacto y dorado champagne como único acento cálido.
 * Títulos en serif (Fraunces) para dar seriedad; texto en Inter para
 * legibilidad. Contrastes AA sobre cada fondo.
 */
export const colors = {
  midnight: '#0E1424',
  midnight2: '#1C2650',

  ivory: '#FAF8F3',
  card: '#FFFFFF',
  border: '#E7E2D6',

  ink: '#0F1424',
  body: '#4A5163',
  muted: '#7B8194',

  gold: '#C9A24B',
  goldDeep: '#9A7424',
  goldSoft: '#F6EEDC',

  onDark: '#FFFFFF',
  onDarkMuted: 'rgba(255,255,255,0.7)',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  serif: 'Fraunces_600SemiBold',
  serifBold: 'Fraunces_700Bold',
} as const;

export const radius = {
  md: 16,
  lg: 24,
  xl: 36,
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

export const shadows = {
  card: '0px 1px 2px rgba(15, 20, 36, 0.04), 0px 10px 30px rgba(15, 20, 36, 0.06)',
  raised: '0px 4px 8px rgba(15, 20, 36, 0.06), 0px 30px 60px rgba(15, 20, 36, 0.22)',
} as const;

/** Ancho máximo del contenido en desktop. */
export const MAX_CONTENT_WIDTH = 1080;

/** A partir de este ancho se usa el layout de desktop (dos columnas). */
export const DESKTOP_BREAKPOINT = 900;
