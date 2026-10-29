import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { primeCoinSound } from '../hooks/useCoinSound';
import { colors, fonts, radius, TOUCH_TARGET } from '../theme';
import { GlassCard } from './Glass';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'amount' | 'custom';
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CARD_HEIGHT = TOUCH_TARGET + 12;

export function AmountButton({ label, onPress, variant = 'amount', disabled }: Props) {
  const reduce = useReducedMotion();
  const isCustom = variant === 'custom';

  const scale = useSharedValue(1);
  const active = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const spotX = useSharedValue(60);
  const spotY = useSharedValue(30);
  const ref = useRef<unknown>(null);

  // Inclinación 3D y luz que sigue al cursor (solo web con mouse).
  useEffect(() => {
    if (Platform.OS !== 'web' || isCustom || reduce) return;
    const node = ref.current as HTMLElement | null;
    if (!node || typeof node.addEventListener !== 'function') return;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      tiltY.value = withTiming((px - 0.5) * 16, { duration: 120 });
      tiltX.value = withTiming(-(py - 0.5) * 16, { duration: 120 });
      spotX.value = px * rect.width;
      spotY.value = py * rect.height;
    };
    const onLeave = () => {
      tiltX.value = withSpring(0, { damping: 12, stiffness: 140 });
      tiltY.value = withSpring(0, { damping: 12, stiffness: 140 });
    };
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [isCustom, reduce, spotX, spotY, tiltX, tiltY]);

  const rootStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
      { scale: scale.value },
    ],
  }));

  const spotProps = useAnimatedProps(() => ({ cx: spotX.value, cy: spotY.value }));
  const spotStyle = useAnimatedStyle(() => ({ opacity: active.value }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(active.value, [0, 1], [colors.text, colors.gold]),
  }));

  // "Otro monto": destello que cruza el botón + pulso de luz que invita al toque.
  const sweep = useSharedValue(0);
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (!isCustom || reduce) return;
    sweep.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withDelay(1700, withTiming(0, { duration: 0 }))
      ),
      -1
    );
    pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [isCustom, reduce, sweep, pulse]);
  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -220 + sweep.value * 760 }, { skewX: '-20deg' }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: 0.45 + pulse.value * 0.55 }));

  const setActive = (on: boolean) => {
    active.value = withTiming(on ? 1 : 0, { duration: 220 });
  };

  const handlePress = () => {
    primeCoinSound(); // desbloquea el audio dentro del gesto del usuario
    // El botón ya se achicó al apoyar el dedo; acá rebota con efecto elástico.
    // La acción se dispara en el mismo gesto (sin temporizadores) para que la
    // redirección a Mercado Pago siga "pegada" al toque.
    scale.value = withSpring(1, { damping: 5, stiffness: 240, mass: 0.7 });
    onPress();
  };

  return (
    <AnimatedPressable
      ref={ref as never}
      accessibilityRole="button"
      accessibilityLabel={isCustom ? 'Donar otro monto' : `Donar ${label}`}
      onHoverIn={() => {
        scale.value = withSpring(1.035, { damping: 9, stiffness: 220 });
        setActive(true);
      }}
      onHoverOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 220 });
        setActive(false);
      }}
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 80 });
        setActive(true);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 6, stiffness: 260, mass: 0.7 });
        setActive(false);
      }}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.root, rootStyle, disabled && styles.disabled]}
    >
      {isCustom ? (
        <View style={styles.customWrap}>
          <Animated.View pointerEvents="none" style={[styles.customGlow, pulseStyle]} />
          <LinearGradient
            colors={colors.goldGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.customFill}
          >
            <Animated.View pointerEvents="none" style={[styles.sweep, sweepStyle]}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.65)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            <Text style={styles.customLabel}>{label}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.goldInk} />
          </LinearGradient>
        </View>
      ) : (
        <GlassCard radius={radius.md} active={active} innerStyle={styles.cardInner}>
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, spotStyle]}>
            <Svg width="100%" height="100%">
              <Defs>
                <RadialGradient id="spot" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor="#F6E2A4" stopOpacity={0.3} />
                  <Stop offset="1" stopColor="#F6E2A4" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <AnimatedCircle animatedProps={spotProps} r={90} fill="url(#spot)" />
            </Svg>
          </Animated.View>
          <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
        </GlassCard>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: CARD_HEIGHT,
    cursor: 'pointer',
  },
  cardInner: {
    minHeight: CARD_HEIGHT - 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    fontFamily: fonts.figureBold,
    fontSize: 25,
    letterSpacing: -1.2,
  },
  customWrap: {
    borderRadius: radius.md,
  },
  customGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
    boxShadow: '0px 0px 34px rgba(232, 199, 122, 0.55)',
  },
  customFill: {
    minHeight: CARD_HEIGHT,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  customLabel: {
    fontFamily: fonts.display,
    fontSize: 17,
    letterSpacing: -0.3,
    color: colors.goldInk,
  },
  disabled: {
    opacity: 0.45,
  },
});
