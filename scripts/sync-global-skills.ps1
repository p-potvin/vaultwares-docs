[CmdletBinding()]
param(
    [string]$SourceDir,
    [string]$SkillName,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$NL = [Environment]::NewLine

$ScriptRoot = Split-Path $PSScriptRoot -Parent
if (-not $SourceDir) { $SourceDir = Join-Path $ScriptRoot 'skills' }

if (-not (Test-Path $SourceDir)) {
    Write-Error "Source skills directory not found: $SourceDir"
    exit 1
}

# ----- helpers --------------------------------------------------------------

function Parse-SkillFile {
    param([string]$Path)
    $raw = Get-Content -Raw -LiteralPath $Path -Encoding utf8
    $fm = [ordered]@{}
    $body = $raw

    # Match a leading YAML frontmatter block delimited by --- lines.
    $rx = [regex]'^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?'
    $m = $rx.Match($raw)
    if ($m.Success) {
        $body = $raw.Substring($m.Length)
        $fmText = $m.Groups[1].Value
        $currentKey = $null
        foreach ($line in ($fmText -split "\r?\n")) {
            if ($line -match '^([A-Za-z0-9_-]+):\s*(.*)$') {
                $currentKey = $matches[1]
                $val = $matches[2].Trim()
                if ($val -eq '>' -or $val -eq '|') {
                    $fm[$currentKey] = ''  # multiline buffer
                    $fm["__multi_$currentKey"] = $true
                } else {
                    $fm[$currentKey] = $val
                }
            } elseif ($currentKey -and $line -match '^\s+(.+)$') {
                # continuation line for multiline scalar
                $cont = $matches[1].Trim()
                if ($fm[$currentKey]) { $fm[$currentKey] += ' ' + $cont }
                else { $fm[$currentKey] = $cont }
            }
        }
        # purge internal markers
        foreach ($k in @($fm.Keys)) { if ($k -like '__multi_*') { $fm.Remove($k) } }
    }
    return @{ Frontmatter = $fm; Body = $body.TrimStart(); Raw = $raw }
}

function Ensure-Dir {
    param([string]$Dir)
    if (-not (Test-Path $Dir)) { New-Item -ItemType Directory -Path $Dir -Force | Out-Null }
}

function Write-Log {
    param([string]$Action, [string]$Path)
    if ($DryRun) { Write-Output "  [DRY] would $Action -> $Path" }
    else        { Write-Output "  $Action -> $Path" }
}

# ----- adapters -------------------------------------------------------------
# Each adapter signature: ($skillName, $parsed, $targetRoot)

function Adapter-CopyVerbatim {
    param($SkillName, $Parsed, $TargetRoot)
    $dir  = Join-Path $TargetRoot $SkillName
    $file = Join-Path $dir 'SKILL.md'
    if (-not $DryRun) {
        Ensure-Dir $dir
        Set-Content -LiteralPath $file -Value $Parsed.Raw -Encoding utf8
    }
    Write-Log 'write' $file
}

function Adapter-FlattenToMarkdown {
    # Windsurf-style: single .md per skill, no frontmatter, prepend a header so
    # the host has context but the file is plain markdown.
    param($SkillName, $Parsed, $TargetRoot)
    Ensure-Dir-OrNoop $TargetRoot
    $file = Join-Path $TargetRoot "$SkillName.md"
    $desc = if ($Parsed.Frontmatter.Contains('description')) { $Parsed.Frontmatter['description'] } else { '' }
    $bodyStartsWithH1 = $Parsed.Body -match '^\s*#\s+\S'
    $header = ''
    if (-not $bodyStartsWithH1) { $header += "# $SkillName$NL$NL" }
    if ($desc) { $header += "_${desc}_$NL$NL" }
    $content = $header + $Parsed.Body
    if (-not $DryRun) {
        Ensure-Dir $TargetRoot
        Set-Content -LiteralPath $file -Value $content -Encoding utf8
    }
    Write-Log 'write' $file
}

function Adapter-ToPromptMd {
    # VS Code prompts: <name>.prompt.md with frontmatter limited to description.
    param($SkillName, $Parsed, $TargetRoot)
    $file = Join-Path $TargetRoot "$SkillName.prompt.md"
    $desc = if ($Parsed.Frontmatter.Contains('description')) { $Parsed.Frontmatter['description'] } else { $SkillName }
    # Escape any embedded double quotes for the YAML scalar.
    $descEsc = $desc -replace '"', '\"'
    $fm = "---$NL" + "mode: agent$NL" + "description: `"$descEsc`"$NL" + "---$NL$NL"
    $content = $fm + $Parsed.Body
    if (-not $DryRun) {
        Ensure-Dir $TargetRoot
        Set-Content -LiteralPath $file -Value $content -Encoding utf8
    }
    Write-Log 'write' $file
}

function Ensure-Dir-OrNoop { param([string]$Dir) }  # placeholder; real Ensure-Dir is gated by -DryRun in callers

# ----- registry -------------------------------------------------------------

$targets = @(
    @{ Name = 'Claude Code'; Root = (Join-Path $env:USERPROFILE '.claude\skills');                       Adapter = 'Adapter-CopyVerbatim'     },
    @{ Name = 'Codex';       Root = (Join-Path $env:USERPROFILE '.codex\skills');                        Adapter = 'Adapter-CopyVerbatim'     },
    @{ Name = 'Gemini';      Root = (Join-Path $env:USERPROFILE '.gemini\skills');                       Adapter = 'Adapter-CopyVerbatim'     },
    @{ Name = 'OpenCode';    Root = (Join-Path $env:USERPROFILE '.config\opencode\skills');              Adapter = 'Adapter-CopyVerbatim'     },
    @{ Name = 'Windsurf';    Root = (Join-Path $env:USERPROFILE '.codeium\windsurf\memories\skills');    Adapter = 'Adapter-FlattenToMarkdown'},
    @{ Name = 'VS Code';     Root = (Join-Path $env:APPDATA      'Code\User\prompts');                   Adapter = 'Adapter-ToPromptMd'       }
    # Claude Desktop: no per-skill primitive — intentionally skipped in v1.
)

# ----- main loop ------------------------------------------------------------

$skillDirs = Get-ChildItem -LiteralPath $SourceDir -Directory
if ($SkillName) {
    $skillDirs = $skillDirs | Where-Object { $_.Name -eq $SkillName }
    if (-not $skillDirs) {
        Write-Error "Skill not found in source: $SkillName"
        exit 1
    }
}

if (-not $skillDirs) {
    Write-Output "No skills found in $SourceDir"
    exit 0
}

foreach ($skill in $skillDirs) {
    $skillFile = Join-Path $skill.FullName 'SKILL.md'
    if (-not (Test-Path $skillFile)) {
        Write-Warning "Skipping $($skill.Name): no SKILL.md"
        continue
    }
    $parsed = Parse-SkillFile -Path $skillFile
    Write-Output "Syncing skill: $($skill.Name)"
    foreach ($target in $targets) {
        Write-Output " -> $($target.Name)"
        try {
            & $target.Adapter $skill.Name $parsed $target.Root
        } catch {
            Write-Warning "    FAILED ($($target.Name)): $_"
        }
    }
}

Write-Output ""
Write-Output ("Skill sync " + ($(if ($DryRun) { 'dry-run' } else { 'complete' })) + ".")
exit 0
