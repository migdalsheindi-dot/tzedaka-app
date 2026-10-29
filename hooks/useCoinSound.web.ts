import { Asset } from 'expo-asset';
import { useCallback, useEffect } from 'react';

const coinDropSource = require('../assets/sounds/coin-drop.mp3');

/**
 * Sonido de moneda con Web Audio API: el archivo se descarga una vez y se
 * decodifica a un AudioBuffer en memoria, así cada reproducción es
 * instantánea (sin latencia de <audio>) y se puede solapar sin cortes.
 */
let context: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let rawData: Promise<ArrayBuffer | null> | null = null;
let decoding: Promise<void> | null = null;

function getContext(): AudioContext | null {
  if (context) return context;
  const Ctor =
    typeof window !== 'undefined'
      ? window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined;
  if (!Ctor) return null;
  context = new Ctor({ latencyHint: 'interactive' });
  return context;
}

/** Descarga el archivo (no requiere gesto del usuario). */
function preloadRawData() {
  if (!rawData) {
    rawData = (async () => {
      try {
        const uri = Asset.fromModule(coinDropSource).uri;
        const response = await fetch(uri);
        return await response.arrayBuffer();
      } catch {
        return null;
      }
    })();
  }
  return rawData;
}

function decodeAudio(ctx: AudioContext, data: ArrayBuffer): Promise<AudioBuffer> {
  // Safari viejo solo soporta la versión con callbacks.
  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(data, resolve, reject);
  });
}

/** Decodifica el archivo a AudioBuffer (se puede hacer con el contexto suspendido). */
function ensureDecoded(ctx: AudioContext) {
  if (buffer || decoding) return;
  decoding = preloadRawData()
    .then(async (data) => {
      if (!data) return;
      buffer = await decodeAudio(ctx, data.slice(0));
    })
    .catch(() => {})
    .finally(() => {
      decoding = null;
    });
}

/**
 * Desbloquea el audio. Debe llamarse dentro de un gesto del usuario (el
 * toque en un monto): los navegadores —sobre todo iOS Safari— solo permiten
 * reanudar el AudioContext así.
 */
export function primeCoinSound() {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  ensureDecoded(ctx);
}

function play() {
  const ctx = context;
  if (!ctx || !buffer) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}

export function useCoinSound() {
  // Descarga y decodifica el sonido apenas se monta la pantalla, así el
  // primer toque ya suena sin demora.
  useEffect(() => {
    const ctx = getContext();
    if (ctx) ensureDecoded(ctx);
  }, []);

  const playCoinSound = useCallback(() => {
    try {
      play();
    } catch {
      // El sonido es un detalle decorativo: si falla, la donación sigue su curso.
    }
  }, []);

  return { playCoinSound };
}
