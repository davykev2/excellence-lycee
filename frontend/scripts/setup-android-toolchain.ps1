param(
  [string]$ToolRoot = (Join-Path $env:LOCALAPPDATA 'ExcellenceLyceeMobile')
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$ToolRoot = [System.IO.Path]::GetFullPath($ToolRoot)
$JdkRoot = Join-Path $ToolRoot 'jdk-21'
$SdkRoot = Join-Path $ToolRoot 'android-sdk'
$CacheRoot = Join-Path $ToolRoot 'downloads'
$ExtractRoot = Join-Path $ToolRoot 'extract'

$JdkUrl = 'https://aka.ms/download-jdk/microsoft-jdk-21-windows-x64.zip'
$JdkArchive = Join-Path $CacheRoot 'microsoft-jdk-21-windows-x64.zip'
$JdkChecksumUrl = "$JdkUrl.sha256sum.txt"
$AndroidToolsUrl = 'https://dl.google.com/android/repository/commandlinetools-win-14742923_latest.zip'
$AndroidToolsArchive = Join-Path $CacheRoot 'commandlinetools-win-14742923_latest.zip'
$AndroidToolsSha1 = '16b3f45ddb3d85ea6bbe6a1c0b47146daf0db450'

function Assert-InToolRoot([string]$Path) {
  $resolved = [System.IO.Path]::GetFullPath($Path)
  if (-not $resolved.StartsWith($ToolRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Chemin d'outillage inattendu : $resolved"
  }
  return $resolved
}

function Reset-ToolDirectory([string]$Path) {
  $safePath = Assert-InToolRoot $Path
  if (Test-Path -LiteralPath $safePath) {
    Remove-Item -LiteralPath $safePath -Recurse -Force
  }
  New-Item -ItemType Directory -Path $safePath -Force | Out-Null
}

function Download-File([string]$Url, [string]$Destination) {
  if (Test-Path -LiteralPath $Destination) {
    Write-Host "Archive déjà présente : $Destination"
    return
  }

  Write-Host "Téléchargement : $Url"
  & curl.exe -fL --retry 3 --retry-delay 2 $Url -o $Destination
  if ($LASTEXITCODE -ne 0) {
    throw "Échec du téléchargement : $Url"
  }
}

New-Item -ItemType Directory -Path $ToolRoot, $CacheRoot -Force | Out-Null

if (-not (Test-Path -LiteralPath (Join-Path $JdkRoot 'bin\java.exe'))) {
  Download-File $JdkUrl $JdkArchive
  $checksumResponse = Invoke-WebRequest -UseBasicParsing -Uri $JdkChecksumUrl
  $checksumText = if ($checksumResponse.Content -is [byte[]]) {
    [System.Text.Encoding]::UTF8.GetString($checksumResponse.Content)
  } else {
    [string]$checksumResponse.Content
  }
  $expectedJdkHash = [regex]::Match($checksumText, '[0-9a-fA-F]{64}').Value.ToUpperInvariant()
  if (-not $expectedJdkHash) {
    throw 'La somme SHA-256 publiée par Microsoft est illisible.'
  }
  $actualJdkHash = (Get-FileHash -LiteralPath $JdkArchive -Algorithm SHA256).Hash
  if ($actualJdkHash -ne $expectedJdkHash) {
    Remove-Item -LiteralPath (Assert-InToolRoot $JdkArchive) -Force
    throw 'Le contrôle SHA-256 du JDK Microsoft a échoué.'
  }

  Reset-ToolDirectory $ExtractRoot
  Expand-Archive -LiteralPath $JdkArchive -DestinationPath $ExtractRoot -Force
  $extractedJdk = Get-ChildItem -LiteralPath $ExtractRoot -Directory | Select-Object -First 1
  if (-not $extractedJdk) { throw 'Archive JDK invalide.' }
  if (Test-Path -LiteralPath $JdkRoot) { Remove-Item -LiteralPath (Assert-InToolRoot $JdkRoot) -Recurse -Force }
  Move-Item -LiteralPath $extractedJdk.FullName -Destination $JdkRoot
}

if (-not (Test-Path -LiteralPath (Join-Path $SdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat'))) {
  Download-File $AndroidToolsUrl $AndroidToolsArchive
  $actualAndroidHash = (Get-FileHash -LiteralPath $AndroidToolsArchive -Algorithm SHA1).Hash.ToLowerInvariant()
  if ($actualAndroidHash -ne $AndroidToolsSha1) {
    Remove-Item -LiteralPath (Assert-InToolRoot $AndroidToolsArchive) -Force
    throw 'Le contrôle d’intégrité des outils Android a échoué.'
  }

  Reset-ToolDirectory $ExtractRoot
  Expand-Archive -LiteralPath $AndroidToolsArchive -DestinationPath $ExtractRoot -Force
  $sourceTools = Join-Path $ExtractRoot 'cmdline-tools'
  if (-not (Test-Path -LiteralPath (Join-Path $sourceTools 'bin\sdkmanager.bat'))) {
    throw 'Archive des outils Android invalide.'
  }

  $latestTools = Join-Path $SdkRoot 'cmdline-tools\latest'
  New-Item -ItemType Directory -Path (Split-Path $latestTools -Parent) -Force | Out-Null
  if (Test-Path -LiteralPath $latestTools) { Remove-Item -LiteralPath (Assert-InToolRoot $latestTools) -Recurse -Force }
  Move-Item -LiteralPath $sourceTools -Destination $latestTools
}

$env:JAVA_HOME = $JdkRoot
$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot
$env:Path = "$(Join-Path $JdkRoot 'bin');$(Join-Path $SdkRoot 'platform-tools');$env:Path"

$SdkManager = Join-Path $SdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat'
$licenseAnswers = ((1..100 | ForEach-Object { 'y' }) -join [Environment]::NewLine)
$licenseAnswers | & $SdkManager --sdk_root=$SdkRoot --licenses | Out-Host
if ($LASTEXITCODE -ne 0) { throw 'Impossible d’accepter les licences du SDK Android.' }

& $SdkManager --sdk_root=$SdkRoot 'platform-tools' 'platforms;android-36' 'build-tools;36.0.0'
if ($LASTEXITCODE -ne 0) { throw 'Impossible d’installer les composants Android API 36.' }

Write-Host "JAVA_HOME=$JdkRoot"
Write-Host "ANDROID_SDK_ROOT=$SdkRoot"
& (Join-Path $JdkRoot 'bin\java.exe') -version
