# Tzedaká — App de donación diaria (ISEJ)

App minimalista en React Native (Expo, Managed Workflow) para donar Tzedaká en segundos para [ISEJ](https://www.isej.com/): elegís un monto, ves una moneda cayendo en la alcancía, y te redirige a Mercado Pago para completar el pago.

Repo: https://github.com/migdalsheindi-dot/tzedaka-app
Demo web pública (para probar el diseño/flujo desde cualquier navegador — no reemplaza la app nativa): https://migdalsheindi-dot.github.io/tzedaka-app/

## Estructura del proyecto

```
tzedaka-app/
  theme.ts                 Sistema de diseño: paleta, tipografía (Inter), radios, sombras, breakpoints
  app/                    Rutas (Expo Router)
    _layout.tsx           Layout raíz (Stack + providers)
    (tabs)/
      _layout.tsx          Tabs: Donar / Mi Impacto
      index.tsx            Pantalla principal (donación rápida)
      impact.tsx            Pantalla "Mi Impacto"
  components/
    DonationHero.tsx        Hero: propuesta de valor + alcancía + montos (layout 2 columnas en desktop)
    JarStage.tsx            La alcancía con su halo dorado y la moneda que cae
    TzedakaBox.tsx          Ilustración SVG de la alcancía (jarra transparente + tapa/base de madera)
    CoinAnimation.tsx       Caída de la moneda hasta su lugar en la pila + sonido/vibración al impacto
    AmountButton.tsx        Botón de monto (hover + micro-interacción de resorte)
    InfoSections.tsx        Cómo funciona, Sobre ISEJ, señales de confianza y footer
    ImpactGallery.tsx       Carrusel de fotos de actividades de ISEJ
    ImpactCard.tsx          Tarjeta de logro de impacto
    IsejHeader.tsx          Barra superior de marca (logo de ISEJ)
    layout.tsx              Container, SectionHeader y hook de responsividad (useIsWide)
    Coin.tsx                Ilustración SVG de la moneda que cae
  hooks/
    useDonations.ts         Persistencia local (AsyncStorage): historial + total
    useCoinSound.ts          Reproducción del sonido de moneda (expo-audio)
  utils/
    currency.ts              Formateo de pesos argentinos (ARS)
    mercadopago.ts            Resuelve el link de Mercado Pago según el monto
    impact.ts                  Umbrales y textos de impacto (editar con datos reales)
    jarGeometry.ts              Geometría compartida de la alcancía y la pila de monedas
  assets/
    sounds/coin-drop.mp3       Sonido de moneda cayendo ("Gold coin prize", Mixkit, licencia libre)
    isej/                       Logo y fotos reales de ISEJ (isej.com), usados en el header y la galería
```

## Flujo de donación

1. El usuario toca un monto rápido ($500 a $10.000) o "Otro monto".
2. Se dispara de inmediato la animación de la moneda cayendo en la
   alcancía (~1.6s, `components/CoinAnimation.tsx`). El sonido y la
   vibración (`expo-haptics`) se disparan juntos justo en el instante en
   que la moneda impacta la pila, no al tocar el botón. Para los 5 montos
   fijos, la donación ya se guarda en ese momento (AsyncStorage + total de
   "Mi Impacto").
3. Apenas termina la animación, redirige automáticamente a Mercado Pago
   (`utils/mercadopago.ts`), sin pantallas ni pasos intermedios:
   - **Monto fijo** ($500 / $1.000 / $2.000 / $5.000 / $10.000): va directo
     al checkout específico de ese monto (`mpago.la/...`), ya armado y
     listo para pagar.
   - **"Otro monto":** va al link base de ISEJ
     (`https://link.mercadopago.com.ar/isej770`), donde la persona
     ingresa el monto en el checkout. Como ese monto no se conoce dentro
     de la app, este caso no se suma a "Mi Impacto" (solo se muestra la
     animación como agradecimiento).

   En web, la redirección navega la misma pestaña (`window.location.href`)
   en vez de abrir una nueva — abrir una pestaña nueva con delay (recién al
   terminar la animación) es bloqueado como popup en varios navegadores
   mobile. En iOS/Android nativo llama `Linking.openURL` directo, que abre
   la app de Mercado Pago si está instalada o el navegador si no.

   **Nota:** si en algún celular estos links abren la app de Mercado Libre
   en vez de Mercado Pago (o piden iniciar sesión primero), es un
   comportamiento del lado de Mercado Pago/del dispositivo (asociación de
   universal links entre ambas apps cuando están las dos instaladas), no
   de la app — no hay forma de controlarlo desde acá.

**Límite conocido (Fase 1, sin backend):** no hay forma de verificar que
el pago en Mercado Pago se completó realmente — se cuenta como donación
en cuanto se toca el monto, no cuando se confirma el pago del otro lado.
Para eso hace falta una Fase 2 con backend + webhooks de Mercado Pago
(ver más abajo).


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
  (AsyncStorage) — se registran al tocar el monto, no hay verificación real
  de que el pago en Mercado Pago se haya completado. Para eso hace falta
  una futura Fase 2 con backend + webhooks de Mercado Pago (Checkout
  Pro/API, no los links de cobro actuales).
- El sonido de moneda (`assets/sounds/coin-drop.mp3`) es "Gold coin prize"
  de [Mixkit](https://mixkit.co/free-sound-effects/coin/) — de uso libre
  comercial, sin atribución obligatoria.
