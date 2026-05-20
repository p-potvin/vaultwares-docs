[CmdletBinding()]
param(
  [string]$ReposRoot = "C:\Users\Administrator\Desktop\Github Repos",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$DocsRoot = Split-Path $PSScriptRoot -Parent
$TemplatesDir = Join-Path $DocsRoot "instructions\templates"
$LegacyDir = Join-Path $DocsRoot "instructions\legacy"

$AgentsTemplatePath = Join-Path $TemplatesDir "AGENTS.stub.md"
$ClaudeTemplatePath = Join-Path $TemplatesDir "CLAUDE.stub.md"

if (-not (Test-Path -LiteralPath $AgentsTemplatePath)) { throw "Missing template: $AgentsTemplatePath" }
if (-not (Test-Path -LiteralPath $ClaudeTemplatePath)) { throw "Missing template: $ClaudeTemplatePath" }

$agentsStub = Get-Content -Raw -LiteralPath $AgentsTemplatePath -Encoding utf8
$claudeStub = Get-Content -Raw -LiteralPath $ClaudeTemplatePath -Encoding utf8

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Backup-IfExists {
  param(
    [Parameter(Mandatory=$true)][string]$RepoName,
    [Parameter(Mandatory=$true)][string]$FilePath
  )
  if (-not (Test-Path -LiteralPath $FilePath)) { return }
  $repoLegacyDir = Join-Path $LegacyDir $RepoName
  if (-not $DryRun) { New-Item -ItemType Directory -Force -Path $repoLegacyDir | Out-Null }
  $fileName = Split-Path $FilePath -Leaf
  $backupPath = Join-Path $repoLegacyDir "$fileName.$timestamp.bak"
  Write-Output "  backup: $FilePath -> $backupPath"
  if (-not $DryRun) { Copy-Item -LiteralPath $FilePath -Destination $backupPath -Force }
}

function Write-StubFile {
  param(
    [Parameter(Mandatory=$true)][string]$FilePath,
    [Parameter(Mandatory=$true)][string]$Content
  )
  Write-Output "  write:  $FilePath"
  if ($DryRun) { return }
  Set-Content -LiteralPath $FilePath -Value $Content -Encoding utf8
}

$repos = Get-ChildItem -LiteralPath $ReposRoot -Directory -Force | Sort-Object Name
Write-Output "Found $($repos.Count) repos under $ReposRoot"

foreach ($repo in $repos) {
  $repoName = $repo.Name
  $repoPath = $repo.FullName
  $agentsPath = Join-Path $repoPath "AGENTS.md"
  $claudePath = Join-Path $repoPath "CLAUDE.md"

  Write-Output ""
  Write-Output "Repo: $repoName"

  # Never overwrite the Tier-1 Source of Truth repo's own instructions.
  # This script propagates stubs to other repos; `vaultwares-docs` is the canonical full instructions set.
  try {
    if ((Resolve-Path -LiteralPath $repoPath).Path -eq (Resolve-Path -LiteralPath $DocsRoot).Path) {
      Write-Output "  skip: vaultwares-docs (SSOT)"
      continue
    }
  }
  catch {
    # If resolution fails, fall back to name-based skip.
    if ($repoName -eq 'vaultwares-docs') {
      Write-Output "  skip: vaultwares-docs (SSOT)"
      continue
    }
  }

  Backup-IfExists -RepoName $repoName -FilePath $agentsPath
  Backup-IfExists -RepoName $repoName -FilePath $claudePath

  Write-StubFile -FilePath $agentsPath -Content ($agentsStub.TrimEnd() + "`r`n")
  Write-StubFile -FilePath $claudePath -Content ($claudeStub.TrimEnd() + "`r`n")
}

Write-Output ""
Write-Output "Done."
