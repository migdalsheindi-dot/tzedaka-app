import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, fonts, radius } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'amount' | 'custom';
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Tarjeta de monto: blanca y limpia, se invierte a medianoche al pasar el mouse. */
export function AmountButton({ label, onPress, variant = 'amount', disabled }: Props) {
  const scale = useSharedValue(1);
  const [hovered, setHovered] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCustom = variant === 'custom';
  const active = hovered && !disabled;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={isCustom ? 'Donar otro monto' : `Donar ${label}`}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 300 });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isCustom ? styles.custom : styles.amount,
        active && styles.active,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.label, isCustom && styles.customLabel, active && styles.activeLabel]}>
          {label}
        </Text>
        {isCustom ? (
          <Ionicons
            name="arrow-forward"
            size={18}
            color={active ? colors.onDark : colors.goldDeep}
          />
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
    minHeight: 64,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    cursor: 'pointer',
  },
  amount: {
    flexBasis: '30%',
    backgroundColor: colors.card,
    borderColor: colors.border,
    boxShadow: '0px 1px 2px rgba(15, 20, 36, 0.04), 0px 6px 16px rgba(15, 20, 36, 0.05)',
  },
  custom: {
    flexBasis: '100%',
    backgroundColor: colors.goldSoft,
    borderColor: 'transparent',
  },
  active: {
    backgroundColor: colors.midnight,
    borderColor: colors.midnight,
    boxShadow: '0px 14px 30px rgba(14, 20, 36, 0.28)',
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  customLabel: {
    fontSize: 16,
    color: colors.goldDeep,
  },
  activeLabel: {
    color: colors.onDark,
  },
});
