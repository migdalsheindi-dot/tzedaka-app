import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { JAR_VIEWBOX_HEIGHT, JAR_VIEWBOX_WIDTH } from '../utils/jarGeometry';
import { CoinAnimation } from './CoinAnimation';
import { TzedakaBox } from './TzedakaBox';

type Props = {
  jarSize: number;
  coinCount: number;
  dropTrigger: number;
  pileIndex: number;
  onDropComplete: () => void;
  withEffects?: boolean;
};

const ASPECT = JAR_VIEWBOX_HEIGHT / JAR_VIEWBOX_WIDTH;
const FLOAT_MS = 3800;

/** La Tzedaká flotando suavemente, con su halo dorado y la moneda que cae encima. */
export function JarStage({ jarSize, coinCount, dropTrigger, pileIndex, onDropComplete, withEffects }: Props) {
  const reduce = useReducedMotion();
  const jarHeight = jarSize * ASPECT;
  const glowSize = jarSize * 1.6;
  const floatHeight = jarSize * 0.07;

  const float = useSharedValue(0);
  useEffect(() => {
    if (reduce) return;
    float.value = withRepeat(withTiming(1, { duration: FLOAT_MS, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [reduce, float]);

  // Flota hacia arriba y abajo con una leve inclinación; la sombra respira al revés.
  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -float.value * floatHeight },
      { rotate: `${(float.value - 0.5) * 1.8}deg` },
    ],
  }));
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 0.55 - float.value * 0.25,
    transform: [{ scaleX: 1 - float.value * 0.16 }],
  }));

  return (
    <View style={[styles.stage, { width: glowSize, height: jarHeight + jarSize * 0.34 }]}>
      <Svg
        width={glowSize}
        height={glowSize}
        viewBox="0 0 100 100"
        style={[styles.glow, { top: (jarHeight - glowSize) / 2 + jarSize * 0.1 }]}
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient id="halo" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#E3C277" stopOpacity={0.5} />
            <Stop offset="0.55" stopColor="#E3C277" stopOpacity={0.13} />
            <Stop offset="1" stopColor="#E3C277" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill="url(#halo)" />
      </Svg>

      <Animated.View style={[{ width: jarSize, height: jarHeight, marginTop: jarSize * 0.1 }, floatStyle]}>
        <TzedakaBox size={jarSize} coinCount={coinCount} />
        <CoinAnimation
          jarSize={jarSize}
          trigger={dropTrigger}
          pileIndex={pileIndex}
          onDropComplete={onDropComplete}
          withEffects={withEffects}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.groundShadow, { width: jarSize * 0.9, bottom: jarSize * 0.02 }, shadowStyle]}
      >
        <Svg width="100%" height={18} viewBox="0 0 100 18" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id="ground" cx="50" cy="9" rx="50" ry="9" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#000" stopOpacity={0.7} />
              <Stop offset="1" stopColor="#000" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50" cy="9" rx="50" ry="9" fill="url(#ground)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  glow: {
    position: 'absolute',
    alignSelf: 'center',
  },
  groundShadow: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
