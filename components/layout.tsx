import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { DESKTOP_BREAKPOINT, MAX_CONTENT_WIDTH, colors, fonts, spacing } from '../theme';

/** Hook de responsividad compartido: ¿estamos en layout de desktop? */
export function useIsWide() {
  const { width } = useWindowDimensions();
  return { width, isWide: width >= DESKTOP_BREAKPOINT };
}

/** Centra el contenido con un ancho máximo y gutters laterales. */
export function Container({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const { isWide } = useIsWide();
  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: isWide ? spacing.xl : spacing.md },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
};

export function SectionHeader({ eyebrow, title, subtitle, align = 'left' }: SectionHeaderProps) {
  const { isWide } = useIsWide();
  const textAlign = align;
  return (
    <View style={[styles.sectionHeader, align === 'center' && { alignItems: 'center' }]}>
      {eyebrow ? <Text style={[styles.eyebrow, { textAlign }]}>{eyebrow}</Text> : null}
      <Text style={[styles.sectionTitle, { textAlign, fontSize: isWide ? 32 : 26 }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sectionSubtitle, { textAlign }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  sectionHeader: {
    marginBottom: spacing.lg,
    maxWidth: 640,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.red,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.extrabold,
    color: colors.ink,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.body,
    marginTop: spacing.sm,
  },
});
