# Sync downloaded audio files with birds_data.js
$audioDir = Join-Path $PSScriptRoot "..\audio"
$jsPath = Join-Path $PSScriptRoot "..\js\birds_data.js"

$files = Get-ChildItem (Join-Path $audioDir "*.mp3") | Where-Object { $_.Length -gt 20000 }
Write-Host "Found $($files.Count) valid downloaded audio files (>20KB)."
