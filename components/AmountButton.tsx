import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, fonts, radius } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'amount' | 'custom';
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Botón de monto pensado para ir sobre el fondo azul del hero. */
export function AmountButton({ label, onPress, variant = 'amount', disabled }: Props) {
  const scale = useSharedValue(1);
  const [hovered, setHovered] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCustom = variant === 'custom';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={isCustom ? 'Donar otro monto' : `Donar ${label}`}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 18, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 300 });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isCustom ? styles.custom : styles.solid,
        hovered && !disabled && (isCustom ? styles.customHover : styles.solidHover),
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      <Text style={[styles.label, isCustom ? styles.customLabel : styles.solidLabel]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: '30%',
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    cursor: 'pointer',
  },
  solid: {
    backgroundColor: colors.card,
    borderColor: colors.card,
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.25)',
  },
  solidHover: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    boxShadow: '0px 10px 26px rgba(242, 184, 75, 0.45)',
  },
  custom: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
  },
  customHover: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: colors.onDark,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.extrabold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  solidLabel: {
    color: colors.navy800,
  },
  customLabel: {
    color: colors.onDark,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
