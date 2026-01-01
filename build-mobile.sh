#!/usr/bin/env bash
set -euo pipefail

# Build web assets and sync with Capacitor (Android)
echo "Building web app..."
npm run build

echo "Syncing Capacitor plugins and native projects..."
npx cap sync

echo "Opening Android project in Android Studio..."
npx cap open android

echo "Done. Android Studio should open shortly."
