<#
.SYNOPSIS
    Syncs VaultWares AI Assistant instructions to each Host's Global Instructions Path.
.DESCRIPTION
    Reads vaultwares-docs/AGENTS.md (Tier 1 Source of Truth) and propagates its
    content to every supported Host's global instruction file. Uses marker-based
    injection so user content outside the markers is preserved.

    For JSON-based targets (Claude Desktop), markdown is stripped to plain text
    before injection.

    Run as Administrator via scheduled task or manually.

    Scheduled task uses the headless conhost pattern:
      Execute:   C:\Windows\System32\conhost.exe
      Arguments: --headless powershell.exe -NoProfile -WindowStyle Hidden
                 -NonInteractive -ExecutionPolicy Bypass -File "<this script>"
.NOTES
    Source: vaultwares-docs/scripts/sync-global-instructions.ps1
    See:    vaultwares-agentciation/docs/ARCHITECTURE.md
#>

[CmdletBinding()]
param(
    [string]$SourcePath,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$ScriptRoot = Split-Path $PSScriptRoot -Parent
if (-not $SourcePath) {
    $SourcePath = Join-Path $ScriptRoot 'AGENTS.md'
}

if (-not (Test-Path $SourcePath)) {
    Write-Error "Source file not found: $SourcePath"
    exit 1
}

$sourceContent = Get-Content -Raw -LiteralPath $SourcePath -Encoding utf8

$markerStart = '<!-- VAULTWARES-SYNC:START -->'
$markerEnd   = '<!-- VAULTWARES-SYNC:END -->'

function ConvertTo-PlainText {
    param([string]$Markdown)
    $text = $Markdown
    $text = $text -replace '(?m)^#{1,6}\s+', ''
    $text = $text -replace '\*\*([^*]+)\*\*', '$1'
    $text = $text -replace '\*([^*]+)\*', '$1'
    $text = $text -replace '`([^`]+)`', '$1'
    $text = $text -replace '```[\s\S]*?```', ''
    $text = $text -replace '\[([^\]]+)\]\([^)]+\)', '$1'
    $text = $text -replace '> ', ''
    $text = $text -replace '(?m)^\| .+$', ''
    $text = $text -replace '(?m)^\|[-| :]+\|$', ''
    $text = $text -replace '(?m)^---+$', ''
    $text = ($text -split "`n" | Where-Object { $_.Trim() -ne '' }) -join "`n"
    return $text.Trim()
}

function Inject-MarkerContent {
    param(
        [string]$FilePath,
        [string]$Content,
        [string]$StartMarker,
        [string]$EndMarker
    )

    $wrappedContent = "$StartMarker`n$Content`n$EndMarker"

    if (-not (Test-Path $FilePath)) {
        $parentDir = Split-Path $FilePath -Parent
        if (-not (Test-Path $parentDir)) {
            if ($DryRun) {
                Write-Output "  [DRY RUN] Would create directory: $parentDir"
                return
            }
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        if ($DryRun) {
            Write-Output "  [DRY RUN] Would create: $FilePath"
            return
        }
        Set-Content -LiteralPath $FilePath -Value $wrappedContent -Encoding utf8
        return
    }

    $existing = Get-Content -Raw -LiteralPath $FilePath -Encoding utf8

    $pattern = [regex]::Escape($StartMarker) + '[\s\S]*?' + [regex]::Escape($EndMarker)
    if ($existing -match $pattern) {
        $updated = $existing -replace $pattern, $wrappedContent
    }
    else {
        $updated = $existing.TrimEnd() + "`n`n$wrappedContent`n"
    }

    if ($DryRun) {
        Write-Output "  [DRY RUN] Would update: $FilePath"
        return
    }
    Set-Content -LiteralPath $FilePath -Value $updated -Encoding utf8
}

function Inject-JsonSystemPrompt {
    param(
        [string]$JsonPath,
        [string]$Content
    )

    if (-not (Test-Path $JsonPath)) {
        Write-Warning "Claude Desktop config not found at $JsonPath — skipping"
        return
    }

    $plainText = ConvertTo-PlainText $Content

    if ($DryRun) {
        Write-Output "  [DRY RUN] Would update systemPrompt in: $JsonPath"
        return
    }

    try {
        $json = Get-Content -Raw -LiteralPath $JsonPath -Encoding utf8 | ConvertFrom-Json

        if (-not ($json.PSObject.Properties.Name -contains 'settings')) {
            $json | Add-Member -NotePropertyName 'settings' -NotePropertyValue ([PSCustomObject]@{}) -Force
        }
        $json.settings | Add-Member -NotePropertyName 'systemPrompt' -NotePropertyValue $plainText -Force

        $jsonText = $json | ConvertTo-Json -Depth 10
        Set-Content -LiteralPath $JsonPath -Value $jsonText -Encoding utf8
    }
    catch {
        Write-Warning "Failed to update Claude Desktop config: $_"
    }
}

$homeDir = $env:USERPROFILE

$targets = @(
    @{
        Name     = 'Claude Code'
        Path     = Join-Path $homeDir '.claude\CLAUDE.md'
        Method   = 'marker'
    },
    @{
        Name     = 'VS Code (Copilot)'
        Path     = Join-Path $env:APPDATA 'Code\User\prompts\vaultwares.instructions.md'
        Method   = 'full'
    },
    @{
        Name     = 'Windsurf'
        Path     = Join-Path $homeDir '.codeium\windsurf\memories\global_rules.md'
        Method   = 'marker'
    },
    @{
        Name     = 'Antigravity / Gemini CLI'
        Path     = Join-Path $homeDir '.gemini\GEMINI.md'
        Method   = 'marker'
    },
    @{
        Name     = 'Codex CLI'
        Path     = Join-Path $homeDir '.codex\AGENTS.md'
        Method   = 'full'
    },
    @{
        Name     = 'OpenCode'
        Path     = Join-Path $homeDir '.config\opencode\AGENTS.md'
        Method   = 'full'
    },
    @{
        Name     = 'Claude Desktop'
        Path     = Join-Path $env:APPDATA 'Claude\claude_desktop_config.json'
        Method   = 'json'
    }
)

Write-Output "VaultWares Global Instructions Sync"
Write-Output "Source: $SourcePath"
Write-Output "Targets: $($targets.Count)"
if ($DryRun) { Write-Output "Mode: DRY RUN" }
Write-Output ''

$synced = 0
foreach ($target in $targets) {
    Write-Output "[$($target.Name)] $($target.Path)"

    try {
        switch ($target.Method) {
            'marker' {
                Inject-MarkerContent -FilePath $target.Path `
                    -Content $sourceContent `
                    -StartMarker $markerStart `
                    -EndMarker $markerEnd
            }
            'full' {
                $wrappedContent = "$markerStart`n$sourceContent`n$markerEnd"
                $parentDir = Split-Path $target.Path -Parent
                if (-not (Test-Path $parentDir)) {
                    if ($DryRun) {
                        Write-Output "  [DRY RUN] Would create directory: $parentDir"
                    }
                    else {
                        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
                    }
                }
                if ($DryRun) {
                    Write-Output "  [DRY RUN] Would write: $($target.Path)"
                }
                else {
                    Set-Content -LiteralPath $target.Path -Value $wrappedContent -Encoding utf8
                }
            }
            'json' {
                Inject-JsonSystemPrompt -JsonPath $target.Path -Content $sourceContent
            }
        }
        Write-Output "  OK"
        $synced++
    }
    catch {
        Write-Warning "  FAILED: $_"
    }
}

Write-Output ''
Write-Output "Synced $synced / $($targets.Count) targets."

exit 0
