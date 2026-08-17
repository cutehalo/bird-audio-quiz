$audioDir = Join-Path $PSScriptRoot "..\audio"

$cuckooUrl = "https://xeno-canto.org/sounds/uploaded/FIONAJTAYLOR/XC729227-Cuckoo%20call%20220516.mp3"
$cuckooTarget = Join-Path $audioDir "cuculus_canorus.mp3"
curl.exe -s -L -o $cuckooTarget $cuckooUrl
$sz = (Get-Item $cuckooTarget).Length
Write-Host "Cuckoo size: $([math]::Round($sz/1KB, 1)) KB"

$owlUrl = "https://xeno-canto.org/sounds/uploaded/TNVYDUCODD/XC786801-Little%20Owl%20call.mp3"
$owlTarget = Join-Path $audioDir "athene_noctua.mp3"
curl.exe -s -L -o $owlTarget $owlUrl
$sz = (Get-Item $owlTarget).Length
Write-Host "Little Owl size: $([math]::Round($sz/1KB, 1)) KB"
