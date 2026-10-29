import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { colors } from '../theme';

const BLUR = {
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
} as object;

/**
 * Superficie de cristal pequeña (pills, badges): relleno translúcido, borde
 * de 1px blanco al 8% y desenfoque del fondo (solo web).
 */
export const glass: ViewStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.hairline,
  ...BLUR,
};

const BORDER_BASE = ['rgba(255,255,255,0.32)', 'rgba(255,255,255,0.05)', 'rgba(232,199,122,0.26)'] as const;
const BORDER_HOT = ['rgba(246,226,164,1)', 'rgba(232,199,122,0.22)', 'rgba(246,226,164,0.85)'] as const;

type GlassCardProps = {
  radius: number;
  /** 0 → 1: enciende el borde dorado y el halo (hover / foco). */
  active?: SharedValue<number>;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
};

/**
 * Tarjeta de cristal avanzado: borde de 1px con degradado iluminado,
 * fondo translúcido con desenfoque, sombra profunda y un halo dorado que
 * se enciende con `active`.
 */
export function GlassCard({ radius, active, children, style, innerStyle }: GlassCardProps) {
  const hotStyle = useAnimatedStyle(() => ({ opacity: active ? active.value : 0 }));
  const fill = { flex: 1, borderRadius: radius } as const;

  return (
    <View
      style={[
        { borderRadius: radius, padding: 1, boxShadow: '0px 28px 70px rgba(0, 0, 0, 0.55)' },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, boxShadow: '0px 0px 44px rgba(232, 199, 122, 0.38)' },
          hotStyle,
        ]}
      />
      <LinearGradient
        colors={BORDER_BASE}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius }, hotStyle]}>
        <LinearGradient colors={BORDER_HOT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={fill} />
      </Animated.View>
      <View
        style={[
          { borderRadius: radius - 1, backgroundColor: 'rgba(10, 11, 17, 0.82)', ...BLUR },
          innerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
