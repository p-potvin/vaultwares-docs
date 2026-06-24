[CmdletBinding()]
param(
    [string]$SourcePath,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$NL = [Environment]::NewLine

$ScriptRoot = Split-Path $PSScriptRoot -Parent
if (-not $SourcePath) { $SourcePath = Join-Path $ScriptRoot 'AGENTS.md' }

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
    $text = ($text -split "\r?\n" | Where-Object { $_.Trim() -ne '' }) -join [Environment]::NewLine
    return $text.Trim()
}

function Write-MarkerContent {
    param($FilePath, $Content, $StartMarker, $EndMarker)
    $NL = [Environment]::NewLine
    $wrappedContent = $StartMarker + $NL + $Content + $NL + $EndMarker

    if (-not (Test-Path $FilePath)) {
        $parentDir = Split-Path $FilePath -Parent
        if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Path $parentDir -Force | Out-Null }
        Set-Content -LiteralPath $FilePath -Value $wrappedContent -Encoding utf8
        return
    }

    $existing = Get-Content -Raw -LiteralPath $FilePath -Encoding utf8
    $pattern = [regex]::Escape($StartMarker) + '[\s\S]*?' + [regex]::Escape($EndMarker)
    if ($existing -match $pattern) {
        $updated = $existing -replace $pattern, $wrappedContent
    } else {
        $updated = $existing.TrimEnd() + $NL + $NL + $wrappedContent + $NL
    }
    Set-Content -LiteralPath $FilePath -Value $updated -Encoding utf8
}

function Write-JsonSystemPrompt {
    param($JsonPath, $Content)
    if (-not (Test-Path $JsonPath)) { return }
    $plainText = ConvertTo-PlainText $Content
    try {
        $json = Get-Content -Raw -LiteralPath $JsonPath -Encoding utf8 | ConvertFrom-Json
        if (-not ($json.PSObject.Properties.Name -contains 'settings')) {
            $json | Add-Member -NotePropertyName 'settings' -NotePropertyValue ([PSCustomObject]@{}) -Force
        }
        $json.settings | Add-Member -NotePropertyName 'systemPrompt' -NotePropertyValue $plainText -Force
        $jsonText = $json | ConvertTo-Json -Depth 10
        Set-Content -LiteralPath $JsonPath -Value $jsonText -Encoding utf8
    } catch { Write-Warning "Failed JSON: $_" }
}

$targets = @(
    @{ Name = 'Claude Code'; Path = Join-Path $env:USERPROFILE '.claude\CLAUDE.md'; Method = 'marker' },
    @{ Name = 'VS Code'; Path = Join-Path $env:APPDATA 'Code\User\prompts\vaultwares.instructions.md'; Method = 'full' },
    @{ Name = 'Windsurf'; Path = Join-Path $env:USERPROFILE '.codeium\windsurf\memories\global_rules.md'; Method = 'marker' },
    @{ Name = 'Gemini'; Path = Join-Path $env:USERPROFILE '.gemini\GEMINI.md'; Method = 'marker' },
    @{ Name = 'Codex'; Path = Join-Path $env:USERPROFILE '.codex\AGENTS.md'; Method = 'full' },
    @{ Name = 'OpenCode'; Path = Join-Path $env:USERPROFILE '.config\opencode\AGENTS.md'; Method = 'full' },
    @{ Name = 'Claude Desktop'; Path = Join-Path $env:APPDATA 'Claude\claude_desktop_config.json'; Method = 'json' }
    @{ Name = 'Mistral'; Path = Join-Path $env:USERPROFILE '.agents\AGENTS.md'; Method = 'marker' }
)

foreach ($target in $targets) {
    Write-Output "Syncing $($target.Name)..."
    try {
        if ($target.Method -eq 'marker') {
            Write-MarkerContent -FilePath $target.Path -Content $sourceContent -StartMarker $markerStart -EndMarker $markerEnd
        } elseif ($target.Method -eq 'full') {
            $wrappedContent = $markerStart + [Environment]::NewLine + $sourceContent + [Environment]::NewLine + $markerEnd
            $parentDir = Split-Path $target.Path -Parent
            if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Path $parentDir -Force | Out-Null }
            Set-Content -LiteralPath $target.Path -Value $wrappedContent -Encoding utf8
        } elseif ($target.Method -eq 'json') {
            Write-JsonSystemPrompt -JsonPath $target.Path -Content $sourceContent
        }
        Write-Output "  OK"
    } catch { Write-Warning "  FAILED: $_" }
}

Write-Output "Sync complete."
exit 0
