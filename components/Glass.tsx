import { StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { View } from 'react-native';
import { colors } from '../theme';

/**
 * Superficie de "cristal": relleno translúcido, borde de 1px blanco al 8% y
 * desenfoque del fondo (backdrop-filter, solo web; en nativo queda el
 * relleno translúcido).
 */
export const glass: ViewStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.hairline,
  ...({
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
  } as object),
};

/** Luz ambiental de fondo: un resplandor índigo arriba y uno dorado abajo. */
export function BackgroundGlow() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="indigo" cx="12%" cy="0%" rx="70%" ry="55%">
            <Stop offset="0" stopColor={colors.indigo} stopOpacity={0.55} />
            <Stop offset="1" stopColor={colors.indigo} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="gold" cx="88%" cy="38%" rx="55%" ry="40%">
            <Stop offset="0" stopColor={colors.goldDeep} stopOpacity={0.28} />
            <Stop offset="1" stopColor={colors.goldDeep} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#indigo)" />
        <Rect width="100%" height="100%" fill="url(#gold)" />
      </Svg>
    </View>
  );
}
