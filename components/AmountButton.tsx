import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, radius, TOUCH_TARGET } from '../theme';
import { glass } from './Glass';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'amount' | 'custom';
  disabled?: boolean;
  /** Ancho fijo de la columna (para que todas las tarjetas de monto midan igual). */
  width?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Tarjeta de monto de cristal. Al pasar el mouse / tocar: escala con rebote
 * (spring), borde dorado y un brillo cálido detrás de la opción activa.
 */
export function AmountButton({ label, onPress, variant = 'amount', disabled, width }: Props) {
  const scale = useSharedValue(1);
  const active = useSharedValue(0);
  const isCustom = variant === 'custom';

  const setActive = (on: boolean) => {
    active.value = withTiming(on ? 1 : 0, { duration: 220 });
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isCustom
      ? 'transparent'
      : interpolateColor(active.value, [0, 1], [colors.hairline, colors.gold]),
    backgroundColor: isCustom
      ? 'transparent'
      : interpolateColor(active.value, [0, 1], ['rgba(255,255,255,0.045)', 'rgba(232,199,122,0.12)']),
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: active.value }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(active.value, [0, 1], [colors.text, colors.gold]),
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={isCustom ? 'Donar otro monto' : `Donar ${label}`}
      onHoverIn={() => {
        scale.value = withSpring(1.025, { damping: 12, stiffness: 260 });
        setActive(true);
      }}
      onHoverOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 260 });
        setActive(false);
      }}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 420 });
        setActive(true);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        setActive(false);
      }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isCustom ? styles.customButton : styles.amountButton,
        !isCustom && width ? { width, flexGrow: 0, flexBasis: width } : null,
        cardStyle,
        disabled && styles.disabled,
      ]}
    >
      <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
      {isCustom ? (
        <LinearGradient
          colors={colors.goldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.customFill}
        >
          <Text style={styles.customLabel}>{label}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.goldInk} />
        </LinearGradient>
      ) : (
        <View style={styles.row}>
          <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
    minHeight: TOUCH_TARGET + 8,
    borderRadius: radius.md,
    alignItems: 'stretch',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  amountButton: {
    ...glass,
    flexBasis: '30%',
    paddingHorizontal: 12,
    // `glass` define el color de borde/relleno; Reanimated los anima encima.
  },
  customButton: {
    flexBasis: '100%',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
    boxShadow: '0px 0px 36px rgba(232, 199, 122, 0.42)',
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.figureBold,
    fontSize: 24,
    letterSpacing: -0.5,
  },
  customFill: {
    minHeight: TOUCH_TARGET + 8,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  customLabel: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.goldInk,
  },
  disabled: {
    opacity: 0.45,
  },
});
