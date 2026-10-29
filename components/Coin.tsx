import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

type Props = {
  size?: number;
};

/** Moneda dorada metálica: borde acanalado, relieve interior y destello. */
export function Coin({ size = 40 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Defs>
        <RadialGradient id="coinBody" cx="0.35" cy="0.3" r="0.9">
          <Stop offset="0" stopColor="#FFF3C4" />
          <Stop offset="0.45" stopColor="#E9BC52" />
          <Stop offset="1" stopColor="#A9761A" />
        </RadialGradient>
        <LinearGradient id="coinRim" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE9A0" />
          <Stop offset="0.5" stopColor="#C9922B" />
          <Stop offset="1" stopColor="#7A5210" />
        </LinearGradient>
        <LinearGradient id="coinInner" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#B9852A" />
          <Stop offset="1" stopColor="#F6D77E" />
        </LinearGradient>
      </Defs>

      {/* Canto y cuerpo */}
      <Circle cx="20" cy="20" r="19" fill="url(#coinRim)" />
      <Circle cx="20" cy="20" r="17" fill="url(#coinBody)" />
      {/* Acanalado del borde */}
      <Circle
        cx="20"
        cy="20"
        r="18"
        stroke="#7A5210"
        strokeWidth={0.8}
        strokeDasharray="1.1 1.1"
        opacity={0.55}
      />
      {/* Relieve interior */}
      <Circle cx="20" cy="20" r="13" stroke="url(#coinInner)" strokeWidth={1.4} />
      <SvgText x="20.6" y="27.4" fontSize="18" fontWeight="700" fill="#7A5210" opacity={0.5} textAnchor="middle">
        ₪
      </SvgText>
      <SvgText x="20" y="26.8" fontSize="18" fontWeight="700" fill="#FFE9A0" textAnchor="middle">
        ₪
      </SvgText>
      {/* Destello */}
      <Path d="M9 14 C 11 9, 16 6.5, 22 6.5" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
    </Svg>
  );
}
