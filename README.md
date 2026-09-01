# Tzedaká — App de donación diaria (ISEJ)

App minimalista en React Native (Expo, Managed Workflow) para donar Tzedaká en segundos para [ISEJ](https://www.isej.com/): elegís un monto, ves una moneda cayendo en la alcancía, y te redirige a Mercado Pago para completar el pago.

Repo: https://github.com/migdalsheindi-dot/tzedaka-app
Demo web pública (para probar el diseño/flujo desde cualquier navegador — no reemplaza la app nativa): https://migdalsheindi-dot.github.io/tzedaka-app/

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
    IsejHeader.tsx          Logo de ISEJ + frase motivacional de encabezado
    TzedakaBox.tsx         Ilustración SVG de la alcancía (jarra transparente + tapa/base de madera, etiqueta en español)
    Coin.tsx                Ilustración SVG de la moneda que cae
    CoinAnimation.tsx       Animación de la moneda cayendo hasta su lugar en la pila (Reanimated)
    AmountButton.tsx        Botón de monto con feedback táctil
    CustomAmountModal.tsx   Modal "Otro monto"
    ConfirmDonationModal.tsx Modal "¿Completaste tu donación?" (post Mercado Pago)
    ImpactCard.tsx          Tarjeta de impacto/logro
    ImpactGallery.tsx        Carrusel de fotos de actividades de ISEJ
  hooks/
    useDonations.ts         Persistencia local (AsyncStorage): historial + total
    usePendingDonation.ts    Donación esperando confirmación (persistida)
    useCoinSound.ts          Reproducción del sonido de moneda (expo-audio)
  utils/
    currency.ts              Formateo de pesos argentinos (ARS)
    mercadopago.ts            Resuelve el link de Mercado Pago según el monto
    impact.ts                  Umbrales y textos de impacto (editar con datos reales)
    jarGeometry.ts              Geometría compartida de la alcancía y la pila de monedas
  assets/
    sounds/coin-drop.wav       Sonido corto de moneda cayendo (sintetizado)
    isej/                       Logo y fotos reales de ISEJ (isej.com), usados en el header y la galería
```

## Flujo de donación

1. El usuario toca un monto rápido ($500 a $10.000) o carga "Otro monto".
2. Se abre inmediatamente el link de Mercado Pago que corresponda
   (`utils/mercadopago.ts` → `getMercadoPagoUrl`) con `Linking.openURL`,
   que abre la app nativa de Mercado Pago si está instalada, o el
   navegador si no:
   - **Exactamente $1.000:** va directo al checkout rápido ya armado
     (`https://mpago.la/2eaercD`), listo para pagar sin tipear nada.
   - **Cualquier otro monto** (rápido o "Otro monto"): va al link base de
     ISEJ (`https://link.mercadopago.com.ar/isej770`), donde el usuario
     ingresa/confirma el monto en el checkout.

   **Todavía no se suma nada** en este paso: ni la moneda ni el monto se
   registran hasta confirmar el pago (paso 3).
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


## Cómo republicar la demo web (GitHub Pages)

La demo pública es un build estático (`expo export -p web`) publicado en la
rama `gh-pages` del repo, separada del código fuente en `main`. Para
actualizarla después de un cambio:

```bash
npx expo export -p web
touch dist/.nojekyll        # sin esto, GitHub ignora la carpeta _expo
cp dist/index.html dist/404.html   # fallback para rutas al recargar (SPA)
npx gh-pages -d dist -b gh-pages --dotfiles
```

El flag `--dotfiles` es obligatorio: sin él, `gh-pages` excluye `.nojekyll`
y el sitio queda roto (pantalla en blanco, bundle JS con 404).

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

- El logo y las fotos de `assets/isej/` se bajaron del sitio oficial
  (isej.com) para esta primera versión — reemplazalas por los archivos
  originales en alta resolución que tenga la institución cuando estén
  disponibles, y confirmá que las fotos elegidas para la galería sean las
  que ISEJ quiere mostrar públicamente.
- Los íconos/splash en `assets/` (afuera de `isej/`) son los placeholders
  que genera Expo — reemplazalos por el branding real antes de publicar.
- Los umbrales y textos de `utils/impact.ts` ("con $X ayudaste a...") son
  ilustrativos: ajustalos con los valores reales de la organización.
- El total y el historial de donaciones son **locales al dispositivo**
  (AsyncStorage) — no hay backend ni verificación real de que el pago en
  Mercado Pago se completó; se confía en que el usuario confirme
  honestamente con "Sí, ya doné". Para verificación real hace falta una
  futura Fase 2 con backend + webhooks de Mercado Pago (Checkout Pro/API,
  no el link de cobro actual).
