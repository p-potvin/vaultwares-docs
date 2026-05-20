[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$LedgerRepo = 'C:\Users\Administrator\Desktop\Github Repos\agent-ledger'
$RecordPath = Join-Path $LedgerRepo 'scripts\record-agent-change.ps1'
$RenderPath = Join-Path $LedgerRepo 'scripts\render-agent-ledger.ps1'

foreach ($p in @($RecordPath, $RenderPath)) {
  if (-not (Test-Path -LiteralPath $p)) { throw "Missing required path: $p" }
}

$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
function Backup-File([string]$p) {
  $bak = "$p.$ts.bak"
  Copy-Item -LiteralPath $p -Destination $bak -Force
  Write-Output "backup: $p -> $bak"
}

Backup-File $RecordPath
Backup-File $RenderPath

# ---------------------------------------------------------------------------
# record-agent-change.ps1
# ---------------------------------------------------------------------------

$record = Get-Content -Raw -LiteralPath $RecordPath -Encoding utf8

if ($record -notmatch '\[hashtable\]\$Flags') {
  $needle = "    [string[]]`$McpServersAccessed = @(),"
  if ($record -notlike "*$needle*") { throw "Param insertion anchor not found in record-agent-change.ps1" }
  $record = $record.Replace(
    $needle,
    $needle + "`r`n    [hashtable]`$Flags = @{},`r`n    [hashtable]`$Metrics = @{},"
  )
}

if ($record -notmatch '\$mergedMetrics') {
  $eventAnchor = "`$event = [ordered]@{"
  $pos = $record.IndexOf($eventAnchor)
  if ($pos -lt 0) { throw "Event anchor not found in record-agent-change.ps1" }
  $pre = $record.Substring(0, $pos)
  $post = $record.Substring($pos)
  $insert = @'
$computedMetrics = [ordered]@{
    commandsCount = @($Commands).Count
    filesCount = @($Files).Count
    toolsUsedCount = @($dedupedToolsUsed).Count
    mcpServersAccessedCount = @($dedupedMcpServersAccessed).Count
}
$mergedMetrics = [ordered]@{}
if ($Metrics) {
    foreach ($kv in $Metrics.GetEnumerator()) { $mergedMetrics[[string]$kv.Key] = $kv.Value }
}
foreach ($kv in $computedMetrics.GetEnumerator()) {
    if (-not $mergedMetrics.Contains([string]$kv.Key)) { $mergedMetrics[[string]$kv.Key] = $kv.Value }
}

'@
  $record = $pre + $insert + $post
}

if ($record -notmatch '\btelemetry\s*=\s*\[ordered\]@') {
  $runtimeNeedle = "    runtime = [ordered]@{"
  $pos = $record.IndexOf($runtimeNeedle)
  if ($pos -lt 0) { throw "Runtime anchor not found in record-agent-change.ps1" }

  $runtimeEndNeedle = "    workspaceRoot = `$WorkspaceRoot"
  $pos2 = $record.IndexOf($runtimeEndNeedle)
  if ($pos2 -lt 0) { throw "workspaceRoot anchor not found in record-agent-change.ps1" }

  # Insert telemetry right before workspaceRoot.
  $telemetryBlock = @'
    telemetry = [ordered]@{
        flags = $Flags
        metrics = $mergedMetrics
    }
'@
  $record = $record.Insert($pos2, $telemetryBlock + "`r`n")
}

Set-Content -LiteralPath $RecordPath -Value $record -Encoding utf8
Write-Output "patched: $RecordPath"

# ---------------------------------------------------------------------------
# render-agent-ledger.ps1
# ---------------------------------------------------------------------------

$render = Get-Content -Raw -LiteralPath $RenderPath -Encoding utf8

if ($render -notmatch 'Telemetry flags') {
  # Markdown insert after agentHeader block closing.
  $mdInsertAfter = "            `$lines.Add('  ```')`r`n        }"
  if ($render -notlike "*$mdInsertAfter*") { throw "Markdown insertion anchor not found in render-agent-ledger.ps1" }
  $mdTelemetry = @'
        if ($event.telemetry) {
            if ($event.telemetry.flags) {
                $lines.Add("- Telemetry flags: ``$(( $event.telemetry.flags | ConvertTo-Json -Compress ))``")
            }
            if ($event.telemetry.metrics) {
                $lines.Add("- Telemetry metrics: ``$(( $event.telemetry.metrics | ConvertTo-Json -Compress ))``")
            }
        }
'@
  $render = $render.Replace($mdInsertAfter, $mdInsertAfter + "`r`n" + $mdTelemetry.TrimEnd())

  # HTML insert after the agentHeader pre/code line.
  $htmlInsertAfter = '            $htmlLines.Add("      <pre><code>$(ConvertTo-HtmlText $event.agentHeader)</code></pre>")'
  if ($render -notlike "*$htmlInsertAfter*") { throw "HTML insertion anchor not found in render-agent-ledger.ps1" }
  $htmlTelemetry = @'
        if ($event.telemetry) {
            if ($event.telemetry.flags) {
                $htmlLines.Add("      <p><strong>Telemetry flags:</strong> <code>$(ConvertTo-HtmlText (($event.telemetry.flags | ConvertTo-Json -Compress)))</code></p>")
            }
            if ($event.telemetry.metrics) {
                $htmlLines.Add("      <p><strong>Telemetry metrics:</strong> <code>$(ConvertTo-HtmlText (($event.telemetry.metrics | ConvertTo-Json -Compress)))</code></p>")
            }
        }
'@
  $render = $render.Replace($htmlInsertAfter, $htmlInsertAfter + "`r`n" + $htmlTelemetry.TrimEnd())
}

Set-Content -LiteralPath $RenderPath -Value $render -Encoding utf8
Write-Output "patched: $RenderPath"

Write-Output "done"
