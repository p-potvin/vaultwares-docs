[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path $PSScriptRoot -Parent
$RouterPath = Join-Path $RepoRoot "instructions\ROUTER.md"
$DocsMirrorDir = Join-Path $RepoRoot "docs-content\ai-tools\assistant-protocols"

if (-not (Test-Path -LiteralPath $RouterPath)) { throw "Missing router: $RouterPath" }

$router = Get-Content -Raw -LiteralPath $RouterPath -Encoding utf8
$matches = [regex]::Matches($router, "instructions/(summaries|notes)/[A-Z0-9_-]+\.md") | ForEach-Object { $_.Value } | Sort-Object -Unique

$missing = @()
foreach ($p in $matches) {
  $abs = Join-Path $RepoRoot $p
  if (-not (Test-Path -LiteralPath $abs)) { $missing += $p }
}

if ($missing.Count -gt 0) {
  Write-Output "Missing referenced chapter files:"
  $missing | ForEach-Object { Write-Output "  $_" }
  exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $DocsMirrorDir "index.mdx"))) {
  throw "Missing docs mirror index: $DocsMirrorDir\\index.mdx"
}

Write-Output "OK: router references exist ($($matches.Count) files) and docs mirror index exists."

