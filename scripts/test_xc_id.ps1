$testId = "979271" # Tree sparrow
$url = "https://xeno-canto.org/$testId/download"
$out = Join-Path $PSScriptRoot "..\audio\test_download.mp3"

try {
    Invoke-WebRequest -Uri $url -OutFile $out -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -TimeoutSec 15
    $size = (Get-Item $out).Length
    Write-Host "Success! File size: $([math]::Round($size/1KB, 1)) KB"
} catch {
    Write-Host "Failed: $_"
}
