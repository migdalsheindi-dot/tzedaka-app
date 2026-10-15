import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { JAR_VIEWBOX_HEIGHT, JAR_VIEWBOX_WIDTH } from '../utils/jarGeometry';
import { CoinAnimation } from './CoinAnimation';
import { TzedakaBox } from './TzedakaBox';

type Props = {
  jarSize: number;
  coinCount: number;
  dropTrigger: number;
  pileIndex: number;
  onDropComplete: () => void;
};

const ASPECT = JAR_VIEWBOX_HEIGHT / JAR_VIEWBOX_WIDTH;

/** La Tzedaká con su halo dorado y la moneda que cae encima. */
export function JarStage({ jarSize, coinCount, dropTrigger, pileIndex, onDropComplete }: Props) {
  const jarHeight = jarSize * ASPECT;
  const glowSize = jarSize * 1.55;

  return (
    <View style={[styles.stage, { width: glowSize, height: jarHeight + jarSize * 0.25 }]}>
      <Svg
        width={glowSize}
        height={glowSize}
        viewBox="0 0 100 100"
        style={[styles.glow, { top: (jarHeight - glowSize) / 2 + jarSize * 0.1 }]}
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient id="halo" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F2B84B" stopOpacity={0.55} />
            <Stop offset="0.55" stopColor="#F2B84B" stopOpacity={0.14} />
            <Stop offset="1" stopColor="#F2B84B" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill="url(#halo)" />
      </Svg>

      <View style={{ width: jarSize, height: jarHeight, marginTop: jarSize * 0.08 }}>
        <TzedakaBox size={jarSize} coinCount={coinCount} />
        <CoinAnimation
          jarSize={jarSize}
          trigger={dropTrigger}
          pileIndex={pileIndex}
          onDropComplete={onDropComplete}
        />
      </View>
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
});
