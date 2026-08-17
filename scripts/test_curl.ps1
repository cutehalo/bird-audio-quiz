$lines = curl.exe -s -L "https://xeno-canto.org/species/Chloris-sinica"
$text = $lines -join "`n"
Write-Host "Total length: $($text.Length) characters across $($lines.Count) lines"

if ($text -match 'https://xeno-canto\.org/sounds/uploaded/[^\s''"]+\.mp3') {
    Write-Host "Matched direct MP3: $($matches[0])"
}
if ($text -match 'xeno-canto\.org/(\d+)/download') {
    Write-Host "Matched download link: https://xeno-canto.org/$($matches[1])/download"
}
