# Tzedaká — App de donación diaria (ISEJ)

App minimalista en React Native (Expo, Managed Workflow) para donar Tzedaká en segundos para [ISEJ](https://www.isej.com/): elegís un monto, ves una moneda cayendo en la alcancía, y te redirige a Mercado Pago para completar el pago.

Repo: https://github.com/migdalsheindi-dot/tzedaka-app
Demo web pública (para probar el diseño/flujo desde cualquier navegador — no reemplaza la app nativa): https://migdalsheindi-dot.github.io/tzedaka-app/

## Estructura del proyecto

App de una sola pantalla: la Tzedaká, los montos y una reseña breve de ISEJ.

```
tzedaka-app/
  theme.ts                 Sistema de diseño oscuro: paleta (#0A0B0E + dorado metálico + índigo),
                           tipografía (Plus Jakarta Sans / Inter / Space Grotesk), radios, breakpoints
  app/
    _layout.tsx            Layout raíz (fuentes + providers)
    index.tsx              Pantalla única: lógica de donación
    +not-found.tsx         Cualquier ruta vieja vuelve al inicio
  components/
    DonationSection.tsx    Título + alcancía + montos (2 columnas en desktop, apilado en móvil)
    AmountButton.tsx       Tarjeta de monto de cristal: rebote (spring), borde y brillo dorado al activarse
    JarStage.tsx           La alcancía con su halo y la moneda que cae
    TzedakaBox.tsx         Ilustración SVG de la alcancía (jarra transparente + tapa/base de madera)
    Coin.tsx               Moneda dorada metálica (borde acanalado, relieve y destello)
    CoinAnimation.tsx      Caída de la moneda + sonido y vibración exactamente en el impacto
    Glass.tsx              Superficie de cristal (blur + borde 1px al 8%) y luz ambiental de fondo
    AboutIsej.tsx          Reseña breve de ISEJ + footer
    IsejHeader.tsx         Barra superior mínima (logo de ISEJ)
    layout.tsx             Container y hook de responsividad (useIsWide)
  hooks/
    useDonations.ts        Persistencia local de las monedas de la alcancía (AsyncStorage)
    useCoinSound.ts        Sonido en nativo (expo-audio)
    useCoinSound.web.ts    Sonido en web con Web Audio API (AudioBuffer precargado, sin latencia)
  utils/
    feedback.ts            Vibración en nativo (expo-haptics: golpe + rebote)
    feedback.web.ts        Vibración en web: navigator.vibrate([15, 30, 10, 20, 25])
    mercadopago.ts         Links de Mercado Pago por monto + apertura directa de la app
    currency.ts            Formateo de pesos argentinos (ARS)
    jarGeometry.ts         Geometría compartida de la alcancía y la pila de monedas
  scripts/post-export.mjs  Parchea el HTML exportado (safe-area, theme-color, 404.html, .nojekyll)
  assets/
    sounds/coin-drop.mp3   Sonido de moneda ("Gold coin prize", Mixkit, licencia libre)
    isej/logo.png          Logo de ISEJ (isej.com)
```

## Flujo de donación

1. El usuario toca un monto rápido ($500 a $10.000) o "Otro monto".
2. Se dispara de inmediato la animación de la moneda cayendo en la
   alcancía (~1.6s, `components/CoinAnimation.tsx`). El sonido y la
   vibración se disparan juntos justo en el instante en que la moneda
   impacta la pila, no al tocar el botón. En web el sonido usa Web Audio
   API (AudioBuffer precargado, desbloqueado en el toque) y la vibración
   `navigator.vibrate([15, 30, 10, 20, 25])` (iOS Safari no soporta
   vibración web); en nativo, `expo-audio` y `expo-haptics`. Para los 5 montos
   fijos, la moneda queda guardada en la alcancía (AsyncStorage).
3. Apenas termina la animación, redirige automáticamente a Mercado Pago
   (`utils/mercadopago.ts`), sin pantallas ni pasos intermedios:
   - **Monto fijo** ($500 / $1.000 / $2.000 / $5.000 / $10.000): va directo
     al checkout específico de ese monto (`mpago.la/...`), ya armado y
     listo para pagar.
   - **"Otro monto":** va al link base de ISEJ
     (`https://link.mercadopago.com.ar/isej770`), donde la persona
     ingresa el monto en el checkout. Como ese monto no se conoce dentro
     de la app, la moneda solo se anima (no queda guardada en la pila).

   Apertura del link (`utils/mercadopago.ts`), siempre en la misma
   pestaña y sin iframes ni `target="_blank"` (abrir una pestaña nueva con
   delay lo bloquean los navegadores mobile):
   - **Android (web):** un Intent que fuerza la app de Mercado Pago
     (`com.mercadopago.wallet`), con `browser_fallback_url` al mismo link
     si no está instalada; si Chrome bloqueara el intent, a los 1,2 s se
     navega al link https normal.
   - **iOS / desktop (web):** navegación directa a `mpago.la/...`. En iOS
     es el sistema (Universal Links) quien decide qué app abre el link y
     una web no puede forzarlo; no se usa el esquema `mercadopago://`
     porque no hay ruta documentada para links de pago y quedaría muerto
     si la app no está instalada.
   - **App nativa:** `Linking.openURL` directo.

   **Nota:** si en algún celular estos links abren Mercado Libre en vez de
   Mercado Pago (o piden iniciar sesión), es la asociación de Universal
   Links entre ambas apps del lado del dispositivo.

**Límite conocido (Fase 1, sin backend):** no hay forma de verificar que
el pago en Mercado Pago se completó realmente — se cuenta como donación
en cuanto se toca el monto, no cuando se confirma el pago del otro lado.
Para eso hace falta una Fase 2 con backend + webhooks de Mercado Pago
(ver más abajo).


## Cómo republicar la demo web (GitHub Pages)

La demo pública es un build estático publicado en la rama `gh-pages`,
separada del código fuente en `main`. Para actualizarla tras un cambio:

```bash
npm run deploy:web
```

Eso exporta (`expo export -p web`), parchea el HTML (`scripts/post-export.mjs`)
y publica `dist/` con `gh-pages --dotfiles` (el flag es obligatorio: sin
`.nojekyll` GitHub ignora la carpeta `_expo` y el sitio queda en blanco).

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

- El logo de `assets/isej/` se bajó del sitio oficial (isej.com) — reemplazalo
  por el archivo original en alta resolución cuando esté disponible.
- Los íconos/splash en `assets/` (afuera de `isej/`) son los placeholders
  que genera Expo — reemplazalos por el branding real antes de publicar.
- Las monedas de la alcancía son **locales al dispositivo**
  (AsyncStorage) — se registran al tocar el monto, no hay verificación real
  de que el pago en Mercado Pago se haya completado. Para eso hace falta
  una futura Fase 2 con backend + webhooks de Mercado Pago (Checkout
  Pro/API, no los links de cobro actuales).
- El sonido de moneda (`assets/sounds/coin-drop.mp3`) es "Gold coin prize"
  de [Mixkit](https://mixkit.co/free-sound-effects/coin/) — de uso libre
  comercial, sin atribución obligatoria.
