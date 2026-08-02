$ErrorActionPreference = "Stop"

$Server = "root@62.109.10.56"
$KeyPath = Join-Path $env:USERPROFILE ".ssh\housephoto_codex_ed25519"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Archive = Join-Path $env:TEMP "housephoto-release.tgz"
$RemoteScript = Join-Path $ProjectRoot "scripts\remote-deploy-housephoto.sh"

if (-not (Test-Path -LiteralPath $KeyPath)) {
  throw "SSH key was not found: $KeyPath"
}

Push-Location $ProjectRoot
try {
  Write-Host "[1/4] Building the static production site..." -ForegroundColor Cyan
  $env:STATIC_EXPORT = "1"
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "The production build failed." }

  Write-Host "[2/4] Packaging the site..." -ForegroundColor Cyan
  if (Test-Path -LiteralPath $Archive) { Remove-Item -LiteralPath $Archive -Force }
  tar -C (Join-Path $ProjectRoot "out") -czf $Archive .
  if ($LASTEXITCODE -ne 0) { throw "Could not create the site archive." }

  Write-Host "[3/4] Uploading the release to the server..." -ForegroundColor Cyan
  scp -i $KeyPath -o StrictHostKeyChecking=accept-new $Archive "${Server}:/tmp/housephoto-release.tgz"
  if ($LASTEXITCODE -ne 0) { throw "Could not upload the site archive." }
  scp -i $KeyPath -o StrictHostKeyChecking=accept-new $RemoteScript "${Server}:/tmp/remote-deploy-housephoto.sh"
  if ($LASTEXITCODE -ne 0) { throw "Could not upload the remote deployment script." }

  Write-Host "[4/4] Connecting HousePhoto to Nginx..." -ForegroundColor Cyan
  ssh -i $KeyPath -o StrictHostKeyChecking=accept-new $Server "bash /tmp/remote-deploy-housephoto.sh"
  if ($LASTEXITCODE -ne 0) { throw "The server stopped the deployment. See the message above." }

  Write-Host "Done. HousePhoto is installed alongside the existing sites." -ForegroundColor Green
}
finally {
  Remove-Item Env:STATIC_EXPORT -ErrorAction SilentlyContinue
  if (Test-Path -LiteralPath $Archive) { Remove-Item -LiteralPath $Archive -Force }
  Pop-Location
}
