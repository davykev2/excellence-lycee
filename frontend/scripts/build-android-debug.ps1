param(
  [string]$ToolRoot = (Join-Path $env:LOCALAPPDATA 'ExcellenceLyceeMobile')
)

$ErrorActionPreference = 'Stop'
$FrontendRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$JdkRoot = Join-Path $ToolRoot 'jdk-21'
$SdkRoot = Join-Path $ToolRoot 'android-sdk'
$Java = Join-Path $JdkRoot 'bin\java.exe'
$SdkManager = Join-Path $SdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat'

if (-not (Test-Path -LiteralPath $Java) -or -not (Test-Path -LiteralPath $SdkManager)) {
  throw 'Outillage Android absent. Lance d’abord npm run mobile:setup.'
}

$env:JAVA_HOME = $JdkRoot
$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot
$env:GRADLE_USER_HOME = Join-Path $ToolRoot 'gradle-home'
$env:Path = "$(Join-Path $JdkRoot 'bin');$(Join-Path $SdkRoot 'platform-tools');$env:Path"

Push-Location $FrontendRoot
try {
  npm run mobile:sync
  if ($LASTEXITCODE -ne 0) { throw 'La synchronisation Capacitor a échoué.' }

  Push-Location (Join-Path $FrontendRoot 'android')
  try {
    .\gradlew.bat --no-daemon assembleDebug
    if ($LASTEXITCODE -ne 0) { throw 'La compilation Gradle a échoué.' }
  } finally {
    Pop-Location
  }

  $sourceApk = Join-Path $FrontendRoot 'android\app\build\outputs\apk\debug\app-debug.apk'
  $artifactRoot = Join-Path $FrontendRoot 'artifacts'
  $artifactApk = Join-Path $artifactRoot 'Excellence-Lycee-debug.apk'
  if (-not (Test-Path -LiteralPath $sourceApk)) { throw 'APK introuvable après compilation.' }
  New-Item -ItemType Directory -Path $artifactRoot -Force | Out-Null
  Copy-Item -LiteralPath $sourceApk -Destination $artifactApk -Force
  Write-Host "APK=$artifactApk"
} finally {
  Pop-Location
}
