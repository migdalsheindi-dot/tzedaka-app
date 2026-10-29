import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { DESKTOP_BREAKPOINT, MAX_CONTENT_WIDTH, spacing } from '../theme';

/** Hook de responsividad compartido: ¿estamos en layout de desktop? */
export function useIsWide() {
  const { width, height } = useWindowDimensions();
  return { width, height, isWide: width >= DESKTOP_BREAKPOINT };
}

/** Centra el contenido con un ancho máximo y gutters laterales. */
export function Container({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const { isWide } = useIsWide();
  return (
    <View
      style={[styles.container, { paddingHorizontal: isWide ? spacing.xl : spacing.md }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
});
