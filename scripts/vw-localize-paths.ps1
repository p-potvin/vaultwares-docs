<#
.SYNOPSIS
    Rewrites Windows user paths in the VaultWares workspace to match this machine.

.DESCRIPTION
    Documentation and instructions across the workspace hard-code the author's
    Windows profile (`C:\Users\Administrator\...`). On any other machine those
    paths are wrong, so every agent session starts by being told to mentally
    substitute a different username — a shim that has to be repeated in every
    new chat, costs tokens, and silently fails whenever an agent greps for a
    literal path instead.

    This makes the checkout say what is true locally. Run `-Apply` after cloning
    (or whenever new docs land) and paths match this machine; run `-Normalize`
    before committing to put the placeholder back so the repo stays portable.

    ONLY PATHS ARE TOUCHED. A replacement happens exclusively where the name
    directly follows `Users\` or `Users/`. The word "Administrator" on its own —
    a Windows group, a database role, a Jira permission, prose about the
    administrator account — is never rewritten, because rewriting those would
    change meaning rather than location.

.PARAMETER Root
    Workspace root to scan. Defaults to the parent of this script's repository,
    i.e. the directory holding all the VaultWares checkouts.

.PARAMETER User
    Username to localize to. Defaults to $env:USERNAME.

.PARAMETER Apply
    Placeholder / legacy author name -> this machine's username.

.PARAMETER Normalize
    This machine's username -> `{windows_user}` placeholder. Use before committing.

.PARAMETER Check
    Report what would change and exit non-zero if anything would. For CI or a
    pre-commit hook.

.EXAMPLE
    .\vw-localize-paths.ps1 -Check

.EXAMPLE
    .\vw-localize-paths.ps1 -Apply

.EXAMPLE
    .\vw-localize-paths.ps1 -Normalize -WhatIf
#>
[CmdletBinding(SupportsShouldProcess, DefaultParameterSetName = 'Check')]
param(
    [string]$Root,
    [string]$User = $env:USERNAME,

    [Parameter(ParameterSetName = 'Apply')]
    [switch]$Apply,

    [Parameter(ParameterSetName = 'Normalize')]
    [switch]$Normalize,

    [Parameter(ParameterSetName = 'Check')]
    [switch]$Check
)

$ErrorActionPreference = 'Stop'

# The placeholder committed to git, and the legacy literal that predates it.
$PLACEHOLDER = '{windows_user}'
$LEGACY_USER = 'Administrator'

if (-not $Root) {
    # scripts/ -> vaultwares-docs/ -> the workspace holding every checkout
    $Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
}
if (-not (Test-Path $Root)) { throw "Root not found: $Root" }
if ([string]::IsNullOrWhiteSpace($User)) { throw 'Could not determine the target username; pass -User.' }

# Text formats only. Rewriting a path inside a binary would corrupt it, and
# lockfiles/build output are regenerated rather than edited.
$INCLUDE_EXTENSIONS = @(
    '.md', '.mdx', '.txt', '.json', '.jsonc', '.yml', '.yaml', '.toml', '.ini', '.cfg',
    '.ps1', '.psm1', '.sh', '.bash', '.zsh', '.bat', '.cmd',
    '.py', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.env', '.example', '.service', '.html', '.css'
)

$EXCLUDE_DIRECTORIES = @(
    '.git', 'node_modules', '.venv', 'venv', '__pycache__', 'dist', 'build',
    '.next', '.cache', 'vendor', '.omx', 'coverage'
)

<#
    Paths that record history rather than describe the present.

    The agent ledger is by far the biggest source of `C:\Users\Administrator\...`
    in the workspace — several thousand entries across events/ and history/. Every
    one is a factual record of work that happened on a specific machine at a
    specific time. Rewriting them would not be localization, it would be
    rewriting the audit trail to claim work happened somewhere it did not. They
    are deliberately left alone even though they match.
#>
$EXCLUDE_PATH_PATTERNS = @(
    '\\agent-ledger\\events\\',
    '\\agent-ledger\\history\\',
    '\\agent-ledger\\archive\\'
)

$EXCLUDE_FILES = @('package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'poetry.lock', 'Cargo.lock')

function Get-CandidateFiles {
    param([string]$Base)

    $excludePattern = (
        ($EXCLUDE_DIRECTORIES | ForEach-Object { [regex]::Escape("\$_\") }) + $EXCLUDE_PATH_PATTERNS
    ) -join '|'

    # This script documents the paths it rewrites, so without excluding itself
    # it edits its own help text on every run and shows up as modified.
    $self = $PSCommandPath

    Get-ChildItem -Path $Base -Recurse -File -Force -ErrorAction SilentlyContinue |
        Where-Object {
            $INCLUDE_EXTENSIONS -contains $_.Extension.ToLower() -and
            $EXCLUDE_FILES -notcontains $_.Name -and
            $_.FullName -ne $self -and
            $_.Name -ne 'vw-localize-paths.ps1' -and
            "$($_.FullName)\" -notmatch $excludePattern
        }
}

# The whole safety story lives in these two patterns: the lookbehind pins the
# match to a path segment immediately after `Users\` or `Users/`.
$escapedUser = [regex]::Escape($User)
$escapedLegacy = [regex]::Escape($LEGACY_USER)
$escapedPlaceholder = [regex]::Escape($PLACEHOLDER)

if ($Apply) {
    $pattern = "(?<=Users[\\/])(?:$escapedPlaceholder|$escapedLegacy)(?=[\\/]|`"|'|\s|$)"
    $replacement = $User
    $verb = "localize to '$User'"
} elseif ($Normalize) {
    $pattern = "(?<=Users[\\/])(?:$escapedUser|$escapedLegacy)(?=[\\/]|`"|'|\s|$)"
    $replacement = $PLACEHOLDER
    $verb = "normalize to '$PLACEHOLDER'"
} else {
    # Check mode reports both directions so it is useful either way round.
    $pattern = "(?<=Users[\\/])(?:$escapedPlaceholder|$escapedLegacy)(?=[\\/]|`"|'|\s|$)"
    $replacement = $User
    $verb = "would localize to '$User'"
}

Write-Host "Root : $Root"
Write-Host "Mode : $verb"
Write-Host ''

$regex = [regex]::new($pattern)
$changedFiles = 0
$changedLines = 0

foreach ($file in Get-CandidateFiles -Base $Root) {
    $content = $null
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
    } catch {
        Write-Warning "Unreadable, skipped: $($file.FullName)"
        continue
    }

    $matches = $regex.Matches($content)
    if ($matches.Count -eq 0) { continue }

    $changedFiles++
    $changedLines += $matches.Count
    $relative = $file.FullName.Substring($Root.Length).TrimStart('\', '/')
    Write-Host ("  {0,-4} {1}" -f $matches.Count, $relative)

    if ($Check) { continue }

    if ($PSCmdlet.ShouldProcess($relative, $verb)) {
        $updated = $regex.Replace($content, $replacement)
        # Written back byte-for-byte apart from the replacement: no encoding
        # conversion, no line-ending normalisation, no trailing newline added.
        [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.UTF8Encoding]::new($false))
    }
}

Write-Host ''
if ($changedFiles -eq 0) {
    Write-Host 'Nothing to change — paths already match.'
    exit 0
}

Write-Host "$changedLines path(s) across $changedFiles file(s)."

if ($Check) {
    Write-Host 'Run with -Apply to localize them.'
    exit 1
}
exit 0
