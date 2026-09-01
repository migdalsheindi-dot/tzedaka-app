import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'amount' | 'custom';
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AmountButton({ label, onPress, variant = 'amount', disabled }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'custom' && styles.customButton,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      <Text style={[styles.label, variant === 'custom' && styles.customLabel]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: '30%',
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#2F6FED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#2F6FED',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  customLabel: {
    color: '#2F6FED',
  },
});
