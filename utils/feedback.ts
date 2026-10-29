import * as Haptics from 'expo-haptics';

/** Vibración de impacto (iOS/Android nativo): golpe seco + pequeño rebote. */
export function impactFeedback() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 70);
}
