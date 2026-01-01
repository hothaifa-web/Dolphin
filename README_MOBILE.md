# Mobile Build (Capacitor) — Android APK

This project uses Vite + React. You can wrap it with Capacitor to produce Android and iOS native apps.

Prerequisites
- Node.js (16+), npm
- Android Studio (for Android build)
- Java JDK (11+)

Install Capacitor (if not installed):

```bash
npm install --save @capacitor/core @capacitor/cli
npx cap init EcomApp com.example.ecomapp
```

Configure webDir
- The Capacitor config (`capacitor.config.json`) uses `webDir: "dist"` by default (Vite build output).

Install Capacitor Android platform

```bash
npx cap add android
```

Build the web app (production)

```bash
npm run build
# For Vite, this produces a `dist` folder
```

Copy web assets to native project

```bash
npx cap copy android
```

Open Android Studio and build APK

```bash
npx cap open android
```

- In Android Studio: select the `android` module, then `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
- Or run from command-line (requires Android SDK tooling):

```bash
cd android
./gradlew assembleRelease
# produced APK in android/app/build/outputs/apk/release/
```

Run on device (debug)

```bash
npx cap open android
# then run from Android Studio or use `adb install` on the generated APK
```

Notes & Tips
- During development you can point Capacitor to the dev server by setting `server.url` in `capacitor.config.json` and enabling `cleartext`.
- For production builds remove the `server.url` value so assets are bundled into the APK.
- Make sure the app has the required runtime permissions for location and phone if you implement calling or maps.

Map Dependencies (react-leaflet)

```bash
npm install react-leaflet leaflet
```

Capacitor plugins (optional)

- `@capacitor/geolocation` for geolocation permissions and native location APIs
- `@capacitor/app` and `@capacitor/device` for platform integration

Security
- Do not store secrets in `capacitor.config.json`.

If you want, I can add a small `build-mobile.sh` script to automate `npm run build && npx cap copy android` and include CI notes.
