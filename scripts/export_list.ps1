$audioDir = Join-Path $PSScriptRoot "..\audio"
$outFile = Join-Path $PSScriptRoot "audio_list.json"

$files = Get-ChildItem -Path $audioDir -Filter "*.mp3" | Where-Object { $_.Length -gt 20000 } | Select-Object -ExpandProperty BaseName
$files | ConvertTo-Json | Out-File $outFile -Encoding ASCII
Write-Host "Exported $($files.Count) audio filenames to $outFile"
