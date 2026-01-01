# Finish Setup & Mobile Build

Quick notes to finish mobile integration and avoid runtime errors.

1) Install native dependencies (required):

```bash
npm install react-leaflet leaflet
npm install @capacitor/core @capacitor/cli @capacitor/geolocation
npx cap sync
```

2) Build and open Android Studio (use helper scripts):

macOS / Linux:

```bash
./build-mobile.sh
```

Windows PowerShell:

```powershell
.\build-mobile.ps1
```

These scripts run:
- `npm run build`
- `npx cap sync`
- `npx cap open android`

3) Development tips
- If you add or remove native plugins, run `npx cap sync` again.
- When changing JS/CSS, re-run the build script before opening Android Studio.

4) Troubleshooting
- If you see `Failed to resolve import "react-leaflet"`, run `npm install react-leaflet leaflet` and then `npx cap sync`.
- If geolocation permissions are denied in the app, use the Retry button in the Live Tracking screen or enable location permissions in the device settings.

5) Files changed by the finish step
- `src/components/LiveTracking.jsx` — dynamic import + permission UI
- `src/components/OrderStatusCard.jsx` — high-contrast text
- `build-mobile.sh`, `build-mobile.ps1` — helper scripts
- `package.json` — added `react-leaflet` dependency

Happy testing — open Android Studio and run on a device for the best results.
