# Tzedaká — App de donación diaria

App minimalista en React Native (Expo, Managed Workflow) para donar Tzedaká en segundos: elegís un monto, ves una moneda cayendo en la alcancía, y te redirige a Mercado Pago para completar el pago.

## Estructura del proyecto

```
tzedaka-app/
  app/                    Rutas (Expo Router)
    _layout.tsx           Layout raíz (Stack + providers)
    (tabs)/
      _layout.tsx          Tabs: Donar / Mi Impacto
      index.tsx            Pantalla principal (donación rápida)
      impact.tsx            Pantalla "Mi Impacto"
  components/
    TzedakaBox.tsx         Ilustración SVG de la alcancía (jarra transparente + tapa/base de madera)
    Coin.tsx                Ilustración SVG de la moneda que cae
    CoinAnimation.tsx       Animación de la moneda cayendo hasta su lugar en la pila (Reanimated)
    AmountButton.tsx        Botón de monto con feedback táctil
    CustomAmountModal.tsx   Modal "Otro monto"
    ConfirmDonationModal.tsx Modal "¿Completaste tu donación?" (post Mercado Pago)
    ImpactCard.tsx          Tarjeta de impacto/logro
  hooks/
    useDonations.ts         Persistencia local (AsyncStorage): historial + total
    usePendingDonation.ts    Donación esperando confirmación (persistida)
    useCoinSound.ts          Reproducción del sonido de moneda (expo-audio)
  utils/
    currency.ts              Formateo de pesos argentinos (ARS)
    mercadopago.ts            Helper de redirección segura a Mercado Pago
    impact.ts                  Umbrales y textos de impacto (editar con datos reales)
    jarGeometry.ts              Geometría compartida de la alcancía y la pila de monedas
  assets/sounds/coin-drop.wav  Sonido corto de moneda cayendo (sintetizado)
```

## Flujo de donación

1. El usuario toca un monto rápido ($500 a $10.000) o carga "Otro monto".
2. Se abre inmediatamente el link de Mercado Pago
   (`https://link.mercadopago.com.ar/isej770?amount=<monto>`) con
   `Linking.openURL`, que abre la app nativa de Mercado Pago si está
   instalada, o el navegador si no. **Todavía no se suma nada**: ni la
   moneda ni el monto se registran en este paso.
3. Cuando el usuario vuelve a la app (Mercado Pago se cierra o la app pasa
   a primer plano de nuevo) aparece el modal "¿Completaste tu donación?".
   - **Sí, ya doné:** recién ahí se dispara la animación de la moneda
     cayendo hasta su lugar en la pila (queda guardada, visible detrás del
     vidrio), se guarda la donación en AsyncStorage y se suma al total de
     "Mi Impacto".
   - **Todavía no / Cancelar:** no se registra nada, la app queda como
     estaba antes de tocar el monto.
4. Si la app se cierra del todo mientras el usuario está en Mercado Pago
   (no solo pasa a background), el monto pendiente queda persistido
   (`usePendingDonation`) y se vuelve a pedir la confirmación apenas se
   reabre la app — no se pierde silenciosamente.

**Límite conocido (Fase 1, sin backend):** no hay forma de verificar
criptográficamente que el pago en Mercado Pago se completó — el "Sí, ya
doné" es una confirmación manual del usuario, no una verificación real del
pago. Para eso hace falta una Fase 2 con backend + webhooks de Mercado
Pago (ver más abajo).

**Nota sobre el monto en la URL:** `utils/mercadopago.ts` arma la URL con
`?amount=<monto>`. Si el link de Mercado Pago está configurado como "monto
a elección del pagador", ese parámetro debería prellenar el campo — pero
no hay una API pública documentada que lo garantice para este tipo de link
corto (`link.mercadopago.com.ar`). Probalo con un pago real chico para
confirmar que efectivamente prellena el monto.

## Cómo probar la app en iOS y Android en simultáneo

Todo se hace desde un único servidor de Expo (Metro). Parado en esta carpeta:

```bash
npx expo start
```

Esto abre una terminal interactiva con un código QR y accesos rápidos:

- **iOS (Simulator):** con Xcode instalado, presioná `i` en la terminal.
  Abre el simulador y **la primera vez instala automáticamente Expo Go**
  dentro del simulador para correr la app.
  - Alternativa con dispositivo físico: instalá "Expo Go" desde la App
    Store y escaneá el QR con la cámara del iPhone.
- **Android (Emulator):** con Android Studio y un emulador creado (AVD)
  corriendo, presioná `a` en la terminal. Instala Expo Go automáticamente
  en el emulador.
  - Alternativa con dispositivo físico: instalá "Expo Go" desde Google
    Play y escaneá el QR desde la app Expo Go (Android no usa la cámara
    del sistema para esto).

Ambas plataformas leen el mismo código en tiempo real (Fast Refresh), así
que podés tener el simulador de iOS y el emulador de Android abiertos al
mismo tiempo, contra el mismo `npx expo start`.

También podés levantar cada uno directo:

```bash
npm run ios       # abre iOS Simulator
npm run android   # abre Android Emulator
npm run web       # preview rápido en navegador (útil para iterar UI)
```

### Requisitos por plataforma

- **iOS:** macOS + Xcode completo instalado (no alcanza con las Command
  Line Tools) — `xcode-select -s /Applications/Xcode.app/Contents/Developer`.
- **Android:** Android Studio con un AVD (emulador) configurado, o un
  dispositivo Android con depuración USB / Expo Go.

## Notas para producción

- Los íconos/splash en `assets/` son los placeholders que genera Expo —
  reemplazalos por el branding real antes de publicar.
- Los umbrales y textos de `utils/impact.ts` ("con $X ayudaste a...") son
  ilustrativos: ajustalos con los valores reales de la organización.
- El total y el historial de donaciones son **locales al dispositivo**
  (AsyncStorage) — no hay backend ni verificación real de que el pago en
  Mercado Pago se completó; se confía en que el usuario confirme
  honestamente con "Sí, ya doné". Para verificación real hace falta una
  futura Fase 2 con backend + webhooks de Mercado Pago (Checkout Pro/API,
  no el link de cobro actual).
