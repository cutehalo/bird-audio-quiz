$testDownloads = @(
    @{ id="common_cuckoo"; name="大杜鹃"; url="https://upload.wikimedia.org/wikipedia/commons/b/b5/Anas_platyrhynchos_-_Mallard_-_XC494951.mp3"; file="mallard.mp3" },
    @{ id="common_kingfisher"; name="普通翠鸟"; url="https://upload.wikimedia.org/wikipedia/commons/e/e0/Alcedo_atthis_-_Common_Kingfisher_-_XC383023.mp3"; file="common_kingfisher.mp3" },
    @{ id="common_kestrel"; name="红隼"; url="https://upload.wikimedia.org/wikipedia/commons/c/c5/Falco_tinnunculus_-_Common_Kestrel_-_XC481617.mp3"; file="common_kestrel.mp3" },
    @{ id="grey_heron"; name="苍鹭"; url="https://upload.wikimedia.org/wikipedia/commons/b/b2/Ardea_cinerea_-_Grey_Heron_-_XC479867.mp3"; file="grey_heron.mp3" },
    @{ id="eurasian_skylark"; name="云雀"; url="https://upload.wikimedia.org/wikipedia/commons/e/ea/Alauda_arvensis_-_Eurasian_Skylark_-_XC481615.mp3"; file="eurasian_skylark.mp3" }
)

$audioDir = Join-Path $PSScriptRoot "..\audio"

foreach ($item in $testDownloads) {
    $target = Join-Path $audioDir $item.file
    Write-Host "Downloading $($item.name) from Wikimedia Commons..." -NoNewline
    try {
        Invoke-WebRequest -Uri $item.url -OutFile $target -UserAgent "BirdQuizGame/2.0" -TimeoutSec 20 -ErrorAction Stop
        $len = (Get-Item $target).Length
        Write-Host " Success ($([math]::Round($len/1KB, 1)) KB)" -ForegroundColor Green
    } catch {
        Write-Host " Failed: $_" -ForegroundColor Red
    }
}
