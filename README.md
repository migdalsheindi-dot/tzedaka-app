# Tzedaká — App de donación diaria (ISEJ)

App minimalista en React Native (Expo, Managed Workflow) para donar Tzedaká en segundos para [ISEJ](https://www.isej.com/): elegís un monto, ves una moneda cayendo en la alcancía, y te redirige a Mercado Pago para completar el pago.

Repo: https://github.com/migdalsheindi-dot/tzedaka-app
Demo web pública (para probar el diseño/flujo desde cualquier navegador — no reemplaza la app nativa): https://migdalsheindi-dot.github.io/tzedaka-app/

## Estructura del proyecto

App de una sola pantalla: la Tzedaká, los montos y una reseña breve de ISEJ.

```
tzedaka-app/
  theme.ts                 Sistema de diseño oscuro: paleta (#050507 + dorado metálico + índigo),
                           tipografía (Syne títulos / Plus Jakarta Sans texto / Space Grotesk cifras)
  app/
    _layout.tsx            Layout raíz (fuentes + providers)
    index.tsx              Pantalla única: lógica de donación
    +not-found.tsx         Cualquier ruta vieja vuelve al inicio
  components/
    DonationSection.tsx    Título + alcancía + montos (2 columnas en desktop, apilado en móvil)
    AmountButton.tsx       Tarjeta de monto: inclinación 3D + luz que sigue al cursor, borde dorado,
                           rebote elástico al presionar; "Otro monto" con destello y pulso continuos
    JarStage.tsx           La alcancía flotando (floating) con halo dorado y sombra que respira
    Atmosphere.tsx         Fondo #050507 con luces ambientales difusas que derivan lentamente
    Reveal.tsx             Aparición fade-in-up al hacer scroll (IntersectionObserver, bezier suave)
    TzedakaBox.tsx         Ilustración SVG de la alcancía (jarra transparente + tapa/base de madera)
    Coin.tsx               Moneda dorada metálica (borde acanalado, relieve y destello)
    CoinAnimation.tsx      La moneda cruza la pantalla con rastro de partículas doradas, destello en
                           la ranura y onda al impactar; sonido y vibración exactamente en el impacto
    Glass.tsx              GlassCard: cristal con borde degradado de 1px, blur y halo dorado
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
2. Se ve caer la moneda en la alcancía (`components/CoinAnimation.tsx`) y en el
   impacto suenan (Web Audio API) y vibran a la vez. Para los 5 montos fijos
   la moneda queda guardada en la alcancía (AsyncStorage). Recién después
   se abre Mercado Pago:
   - **Escritorio y app nativa:** caída pausada (~1,2 s); redirección ~0,15 s
     después del impacto.
   - **Celular / tablet (web):** la redirección se programa **dentro del gesto
     del toque** (`getTapProfile()` en `utils/mercadopago.ts`) y la duración de
     la caída depende del sistema, porque iOS (Universal Links) solo entrega el
     link a la app si la navegación sale a ≤ ~1 s del toque, y Chrome en
     Android tolera hasta ~5 s (con intent a la app de Mercado Pago):
     - **iPhone/iPad:** impacto a 1,85 s, redirección a ~2 s. ⚠️ Pasa el límite
       de ~1 s de iOS: si en iPhone no abre la app de Mercado Pago, volver a
       `timeline(440, 380, ...)` en `components/CoinAnimation.tsx` (impacto 0,82 s).
     - **Android:** impacto a 2,1 s, redirección a ~2,35 s.
   - **Suena con el celular en silencio:** en iOS el interruptor de silencio
     mutea el Web Audio, así que en el toque se activa la sesión de audio de
     reproducción (`navigator.audioSession.type = 'playback'` + un `<audio>`
     inaudible; ver `hooks/useCoinSound.web.ts`). En la app nativa,
     `setAudioModeAsync({ playsInSilentMode: true })`.
3. La redirección va siempre a Mercado Pago
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
