import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

const coinDropSource = require('../assets/sounds/coin-drop.mp3');

/** En nativo no hace falta "desbloquear" el audio; existe por paridad con la versión web. */
export function primeCoinSound() {}

// El sonido de la moneda tiene que oírse aunque el celular esté en silencio.
setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

export function useCoinSound() {
  const player = useAudioPlayer(coinDropSource);

  const playCoinSound = useCallback(async () => {
    try {
      await player.seekTo(0);
      player.play();
    } catch {
      // El sonido es un detalle decorativo: si falla, la donación sigue su curso.
    }
  }, [player]);

  return { playCoinSound };
}
