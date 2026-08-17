$jsPath = Join-Path $PSScriptRoot "..\js\birds_data.js"
$audioDir = Join-Path $PSScriptRoot "..\audio"

$jsContent = Get-Content $jsPath -Encoding UTF8 -Raw

# Count matches
$nameMatches = [regex]::Matches($jsContent, 'name:\s*"([^"]+)"')
$audioMatches = [regex]::Matches($jsContent, 'audioUrls:\s*\["([^"]+)"\]')

Write-Host "Found $($nameMatches.Count) bird names in birds_data.js"
Write-Host "Found $($audioMatches.Count) audio URLs in birds_data.js"

$nonChinese = @()
$missingAudio = @()

for ($i = 0; $i -lt $nameMatches.Count; $i++) {
    $name = $nameMatches[$i].Groups[1].Value
    $audio = $audioMatches[$i].Groups[1].Value
    
    # Check if name contains Chinese characters
    if ($name -notmatch "[\u4e00-\u9fa5]") {
        $nonChinese += $name
    }

    $fullAudio = Join-Path (Join-Path $PSScriptRoot "..") $audio
    if (-not (Test-Path $fullAudio)) {
        $missingAudio += $audio
    }
}

if ($nonChinese.Count -gt 0) {
    Write-Host "WARNING: Found $($nonChinese.Count) non-Chinese names: $($nonChinese -join ', ')"
} else {
    Write-Host "SUCCESS: 100% of all $($nameMatches.Count) bird names are standard Chinese characters (中文学名)!"
}

if ($missingAudio.Count -gt 0) {
    Write-Host "WARNING: Found $($missingAudio.Count) missing audio files: $($missingAudio -join ', ')"
} else {
    Write-Host "SUCCESS: 100% of all $($audioMatches.Count) audio files exist locally!"
}
