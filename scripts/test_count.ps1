# Build complete 500 birds data js with authentic audio files
$audioDir = Join-Path $PSScriptRoot "..\audio"
$outputJs = Join-Path $PSScriptRoot "..\js\birds_data.js"

# Get all valid MP3 files (>20KB)
$allMp3s = @{}
Get-ChildItem -Path $audioDir -Filter "*.mp3" | ForEach-Object {
    if ($_.Length -gt 20000) {
        $allMp3s[$_.BaseName] = "audio/" + $_.Name
    }
}

Write-Host "Total verified MP3 files on disk: $($allMp3s.Count)"
