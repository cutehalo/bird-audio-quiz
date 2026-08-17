$jsPath = Join-Path $PSScriptRoot "..\js\birds_data.js"
$jsContent = Get-Content $jsPath -Encoding UTF8 -Raw

$orderMatches = [regex]::Matches($jsContent, 'orderFamily:\s*"([^"]+)"')
Write-Host "Total orderFamily entries: $($orderMatches.Count)"

$families = @{}
foreach ($m in $orderMatches) {
    $f = $m.Groups[1].Value
    if (-not $families.ContainsKey($f)) {
        $families[$f] = 0
    }
    $families[$f]++
}

Write-Host "Total unique families: $($families.Count)"
$qualifyingFamilies = 0
foreach ($k in $families.Keys) {
    if ($families[$k] -ge 5) {
        $qualifyingFamilies++
        Write-Host "  $k -> $($families[$k]) species (Can unlock bond!)"
    }
}

Write-Host "Families with >= 5 birds: $qualifyingFamilies"
