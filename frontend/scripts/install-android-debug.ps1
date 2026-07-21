param(
  [string]$ToolRoot = (Join-Path $env:LOCALAPPDATA 'ExcellenceLyceeMobile'),
  [string]$Serial = ''
)

$ErrorActionPreference = 'Stop'
$FrontendRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$Adb = Join-Path $ToolRoot 'android-sdk\platform-tools\adb.exe'
$Apk = Join-Path $FrontendRoot 'artifacts\Excellence-Lycee-debug.apk'

if (-not (Test-Path -LiteralPath $Adb)) { throw 'ADB absent. Lance d’abord npm run mobile:setup.' }
if (-not (Test-Path -LiteralPath $Apk)) { throw 'APK absent. Lance d’abord npm run mobile:apk.' }

$deviceLines = & $Adb devices | Select-Object -Skip 1 | Where-Object { $_ -match '\sdevice$' }
$deviceIds = @($deviceLines | ForEach-Object { ($_ -split '\s+')[0] })

if ($Serial) {
  if ($deviceIds -notcontains $Serial) { throw "Appareil Android introuvable : $Serial" }
  $target = $Serial
} elseif ($deviceIds.Count -eq 1) {
  $target = $deviceIds[0]
} elseif ($deviceIds.Count -eq 0) {
  throw 'Aucun téléphone détecté. Active les options développeur et le débogage USB, puis accepte la clé de ce PC.'
} else {
  throw "Plusieurs appareils détectés. Relance avec -Serial <identifiant>."
}

& $Adb -s $target install -r $Apk
if ($LASTEXITCODE -ne 0) { throw 'L’installation de l’APK a échoué.' }
Write-Host "Excellence Lycée est installée sur $target."
