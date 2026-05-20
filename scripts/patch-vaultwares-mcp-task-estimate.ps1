[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$DocsRepo = 'C:\Users\Administrator\Desktop\Github Repos\vaultwares-docs'
$McpRepo = 'C:\Users\Administrator\Desktop\Github Repos\vaultwares-mcp'

$payloadTaskEstimator = Join-Path $DocsRepo 'scripts\patches\vaultwares-mcp\task_estimator.py'
$targetTaskEstimator = Join-Path $McpRepo 'tools\task_estimator.py'
$serverPath = Join-Path $McpRepo 'vaultwares_mcp\server.py'
$creditOptPath = Join-Path $McpRepo 'tools\credit_optimizer.py'

foreach ($p in @($payloadTaskEstimator, $serverPath, $creditOptPath)) {
  if (-not (Test-Path -LiteralPath $p)) { throw "Missing required path: $p" }
}

$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
function Backup-File([string]$p) {
  $bak = "$p.$ts.bak"
  Copy-Item -LiteralPath $p -Destination $bak -Force
  Write-Output "backup: $p -> $bak"
}

Backup-File $serverPath
Backup-File $creditOptPath

New-Item -ItemType Directory -Force -Path (Split-Path $targetTaskEstimator -Parent) | Out-Null
Copy-Item -LiteralPath $payloadTaskEstimator -Destination $targetTaskEstimator -Force
Write-Output "wrote: $targetTaskEstimator"

# server.py: import + tool
$server = Get-Content -Raw -LiteralPath $serverPath -Encoding utf8
if ($server -notmatch 'from tools\.task_estimator import estimate_task') {
  $server = $server -replace 'from tools\.fast_navigation import fetch_url, fetch_urls\r?\n', "from tools.fast_navigation import fetch_url, fetch_urls`r`nfrom tools.task_estimator import estimate_task`r`n"
}

if ($server -notmatch 'def task_estimate\(') {
  $tier1AnchorLf = "`n`n`n# ---------------------------------------------------------------------------`n# Tier 1"
  $tier1AnchorCrLf = "`r`n`r`n`r`n# ---------------------------------------------------------------------------`r`n# Tier 1"
  $endFunc = $server.IndexOf($tier1AnchorLf)
  if ($endFunc -lt 0) { $endFunc = $server.IndexOf($tier1AnchorCrLf) }
  if ($endFunc -lt 0) { throw "Tier 1 anchor not found in server.py" }

  $toolBlock = @'


@mcp.tool
def task_estimate(
    protocols: list[str] | None = None,
    repos: int = 1,
    files_read: int = 0,
    files_changed: int = 0,
    tools: int = 0,
    commands: int = 0,
    include_time_estimates: bool = True,
) -> dict[str, Any]:
    """Estimate task size (token-first).

    This is intentionally decoupled from credit optimization.
    Primary output is estimated_output_tokens; time is derived if requested.
    """
    if (blocked := _rate_and_count("task_estimate")) is not None:
        return blocked
    return estimate_task(
        protocols=protocols or [],
        repos=int(repos),
        files_read=int(files_read),
        files_changed=int(files_changed),
        tools=int(tools),
        commands=int(commands),
        include_time_estimates=bool(include_time_estimates),
    )
'@

  $server = $server.Substring(0, $endFunc) + $toolBlock + $server.Substring($endFunc)
}

Set-Content -LiteralPath $serverPath -Value $server -Encoding utf8
Write-Output "patched: $serverPath"

# credit_optimizer.py: close dangling bullet 6 and add token-first language.
$credit = Get-Content -Raw -LiteralPath $creditOptPath -Encoding utf8
$replacement = '  6. Handling long tasks  - Use a token-first estimate (time derived if needed) to decide when to stop and ask questions, batch work, or trigger long-running task protocols.' + "`r`n" + '"""'
$credit = $credit -replace '  6\. Handling\s*\r?\n"""', $replacement
Set-Content -LiteralPath $creditOptPath -Value $credit -Encoding utf8
Write-Output "patched: $creditOptPath"

Write-Output "done"
