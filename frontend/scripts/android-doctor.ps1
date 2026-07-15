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
$env:Path = "$(Join-Path $JdkRoot 'bin');$(Join-Path $SdkRoot 'platform-tools');$env:Path"

Push-Location $FrontendRoot
try {
  & $Java -version
  & $SdkManager --sdk_root=$SdkRoot --version
  node node_modules/@capacitor/cli/bin/capacitor doctor android
  if ($LASTEXITCODE -ne 0) { throw 'Le diagnostic Capacitor a échoué.' }
} finally {
  Pop-Location
}
