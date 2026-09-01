import Svg, { Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

type Props = {
  size?: number;
};

export function Coin({ size = 40 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Defs>
        <LinearGradient id="coinFace" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE9A8" />
          <Stop offset="1" stopColor="#F2B43C" />
        </LinearGradient>
      </Defs>
      <Circle cx="20" cy="20" r="18" fill="url(#coinFace)" stroke="#C98A16" strokeWidth={2} />
      <Circle cx="20" cy="20" r="13" fill="none" stroke="#C98A16" strokeWidth={1.2} opacity={0.6} />
      <SvgText
        x="20"
        y="27"
        fontSize="18"
        fontWeight="700"
        fill="#8A5A0E"
        textAnchor="middle"
      >
        ₪
      </SvgText>
    </Svg>
  );
}
