<#
Build and sync script for Windows / PowerShell.
Usage: .\build-mobile.ps1 [-Open]
#>
param(
  [switch]$Open
)

Write-Host "Building web app..."
npm run build

Write-Host "Syncing Capacitor plugins and native projects..."
npx cap sync

Write-Host "Opening Android project in Android Studio..."
npx cap open android

Write-Host "Done. Android Studio should open shortly."
