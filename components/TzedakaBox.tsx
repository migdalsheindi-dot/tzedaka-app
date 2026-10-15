import Svg, {
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {
  COIN_STACK_RX,
  COIN_STACK_RY,
  JAR_VIEWBOX_HEIGHT,
  JAR_VIEWBOX_WIDTH,
  MAX_VISIBLE_COINS,
  getCoinPileSlot,
} from '../utils/jarGeometry';

type Props = {
  size?: number;
  /** Cantidad de donaciones acumuladas: una moneda visual por cada una. */
  coinCount?: number;
};

export function TzedakaBox({ size = 220, coinCount = 0 }: Props) {
  const width = size;
  const height = size * (JAR_VIEWBOX_HEIGHT / JAR_VIEWBOX_WIDTH);
  const visibleCoins = Math.min(coinCount, MAX_VISIBLE_COINS);

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${JAR_VIEWBOX_WIDTH} ${JAR_VIEWBOX_HEIGHT}`}
      fill="none"
    >
      <Defs>
        <LinearGradient id="woodTop" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#DDB578" />
          <Stop offset="0.55" stopColor="#C08E4C" />
          <Stop offset="1" stopColor="#9C6B32" />
        </LinearGradient>
        <LinearGradient id="woodSide" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#B48A4C" />
          <Stop offset="0.5" stopColor="#96702F" />
          <Stop offset="1" stopColor="#7A5A26" />
        </LinearGradient>
        <RadialGradient id="woodSheen" cx="0.35" cy="0.3" r="0.75">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.45} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#EAF2FF" stopOpacity={0.5} />
          <Stop offset="0.16" stopColor="#FFFFFF" stopOpacity={0.65} />
          <Stop offset="0.4" stopColor="#DCE9FB" stopOpacity={0.16} />
          <Stop offset="0.85" stopColor="#DCE9FB" stopOpacity={0.28} />
          <Stop offset="1" stopColor="#EAF2FF" stopOpacity={0.55} />
        </LinearGradient>
        <LinearGradient id="coinFill" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFEBAE" />
          <Stop offset="1" stopColor="#E39B22" />
        </LinearGradient>
      </Defs>

      {/* Sombra de apoyo, difuminada con anillos concéntricos */}
      <Ellipse cx="110" cy="253" rx="70" ry="9" fill="#3D2A12" opacity={0.06} />
      <Ellipse cx="110" cy="252" rx="60" ry="7" fill="#3D2A12" opacity={0.1} />
      <Ellipse cx="110" cy="251" rx="48" ry="5" fill="#3D2A12" opacity={0.14} />

      {/* Base de madera (parte trasera, detrás de las monedas y el vidrio) */}
      <Rect x="46" y="226" width="128" height="18" fill="url(#woodSide)" />
      <Ellipse cx="110" cy="244" rx="64" ry="12" fill="url(#woodSide)" />
      <Ellipse cx="110" cy="226" rx="64" ry="12" fill="url(#woodTop)" />
      <Ellipse cx="110" cy="226" rx="64" ry="12" fill="url(#woodSheen)" />

      {/* Pila de monedas acumuladas, vista a través del cuerpo transparente */}
      <G>
        {Array.from({ length: visibleCoins }).map((_, i) => {
          const slot = getCoinPileSlot(i);
          return (
            <G key={i} transform={`translate(${slot.x} ${slot.y}) rotate(${slot.rotation})`}>
              <Ellipse
                rx={COIN_STACK_RX}
                ry={COIN_STACK_RY}
                fill="url(#coinFill)"
                stroke="#B9800F"
                strokeWidth={0.8}
              />
              <Ellipse
                rx={COIN_STACK_RX * 0.6}
                ry={COIN_STACK_RY * 0.6}
                fill="none"
                stroke="#B9800F"
                strokeWidth={0.5}
                opacity={0.5}
              />
            </G>
          );
        })}
      </G>

      {/* Cuerpo cilíndrico transparente (acrílico/vidrio) */}
      <Rect x="54" y="80" width="112" height="150" fill="url(#glass)" />
      <Rect
        x="54"
        y="80"
        width="112"
        height="150"
        fill="none"
        stroke="#C7D6EC"
        strokeWidth={1.5}
        opacity={0.85}
      />
      {/* Brillo diagonal del acrílico */}
      <Path d="M66 84 L78 84 L64 226 L58 226 Z" fill="#FFFFFF" opacity={0.3} />
      <Path d="M148 84 L152 84 L142 226 L138 226 Z" fill="#FFFFFF" opacity={0.18} />

      {/* Etiqueta con la marca, pegada al frente del vidrio */}
      <Rect
        x="60"
        y="122"
        width="100"
        height="38"
        rx="10"
        fill="#FBF7EF"
        opacity={0.97}
        stroke="#E4D9C2"
        strokeWidth={1}
      />
      <SvgText
        x="110"
        y="146"
        fontSize="17"
        fontFamily="Inter_800ExtraBold"
        fontWeight="800"
        fill="#0F1B33"
        textAnchor="middle"
        letterSpacing={0.5}
      >
        TZEDAKÁ
      </SvgText>
      <Rect x="90" y="151" width="40" height="2.5" rx="1.25" fill="#C9A24B" />

      {/* Anillo rojo decorativo, guiño a la identidad de ISEJ */}
      <Rect x="54" y="80" width="112" height="4" fill="#C9A24B" opacity={0.85} />

      {/* Tapa de madera (frente, tapa todo lo anterior) */}
      <Rect x="46" y="60" width="128" height="22" fill="url(#woodSide)" />
      <Ellipse cx="110" cy="82" rx="64" ry="12" fill="url(#woodSide)" />
      <Ellipse cx="110" cy="60" rx="64" ry="14" fill="url(#woodTop)" />
      <Ellipse cx="110" cy="60" rx="64" ry="14" fill="url(#woodSheen)" />
      <Ellipse cx="110" cy="60" rx="64" ry="14" stroke="#7A5A26" strokeWidth={1.5} fill="none" />

      {/* Ranura para las monedas */}
      <Ellipse cx="110" cy="58" rx="20" ry="5" fill="#4A3512" opacity={0.85} />
      <Ellipse cx="110" cy="57" rx="16" ry="3.4" fill="#2B1D08" opacity={0.6} />
    </Svg>
  );
}
