# PowerShell 500 Birds Batch Downloader
param([int]$Limit = 500)

$audioDir = Join-Path $PSScriptRoot "..\audio"
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Bird Audio Batch Downloader (500 Chinese Birds)" -ForegroundColor Green
Write-Host "  Audio Directory: $audioDir" -ForegroundColor Yellow
Write-Host "============================================================`n" -ForegroundColor Cyan

$urls = @(
    "https://xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC1147853-LS_53644-Chinese-Blackbird-call-A.mp3",
    "https://xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC1147659-LS_53607-Asian-Tit-call-A.mp3",
    "https://xeno-canto.org/sounds/uploaded/LELYWQKUZX/XC1138461-Urocissa-erythroryncha-erythroryncha-260501_002%2C-2.05.2026%2C-%D0%9A%D1%82%D0%B0%D0%B9%2C-%D0%BF.1%2C-04-50%2C-AA-call.mp3",
    "https://xeno-canto.org/sounds/uploaded/YNOAMCSSHX/XC1101780-Azure-winged-Magpie-%E7%81%B0%E5%96%9C%E9%B9%8A-call-%E5%B0%8F%E7%BE%A4-X8-CICADA-%E6%A4%8D%E7%89%A9%E5%9B%AD-2505170619_1361---A.mp3",
    "https://xeno-canto.org/sounds/uploaded/OGOFDWTGHM/XC1164666-260402-02a-Hoopoe-Phobjika.mp3",
    "https://xeno-canto.org/sounds/uploaded/POVKNQVSGU/XC1166650-Hirundo-rustica_social-call-and-song_Naharros-de-Valdunciel_150826_0821.mp3",
    "https://xeno-canto.org/sounds/uploaded/UEOSCKZCBH/XC979271-Badia301.mp3",
    "https://xeno-canto.org/sounds/uploaded/OCOATNCMSP/XC1156235-Oriental-magpie-Daan-forest-park-4_36.mp3",
    "https://xeno-canto.org/sounds/uploaded/LELYWQKUZX/XC1138609-Streptopelia-chinensis-2.05.2026%2C-%D0%9A%D1%82%D0%B0%D0%B9%2C-%D0%BF.1%2C06-50%2CA.mp3",
    "https://xeno-canto.org/sounds/uploaded/NXHTMHMNSS/XC1148195-260418_3250-Light-vented-Bulbul-20260418-5.33am-%E6%B5%99%E6%B1%9F%E5%AF%BA%E5%9D%9E%E5%B2%AD%E7%BE%A4%E5%B1%B1-xeno.mp3"
)

$index = 11
$success = 0
$skipped = 0

foreach ($u in $urls) {
    $numStr = $index.ToString("000")
    $id = "bird_" + $numStr
    $target = Join-Path $audioDir ($id + ".mp3")
    $index++

    if (Test-Path $target) {
        $size = (Get-Item $target).Length
        if ($size -gt 20000) {
            Write-Host "[$id] Already exists" -ForegroundColor DarkGray
            $skipped++
            continue
        }
    }

    Write-Host "[$id] Downloading..." -ForegroundColor Yellow -NoNewline
    try {
        Invoke-WebRequest -Uri $u -OutFile $target -TimeoutSec 30 -ErrorAction Stop
        Write-Host " Done!" -ForegroundColor Green
        $success++
    } catch {
        Write-Host " Error: $_" -ForegroundColor Red
    }
}

Write-Host "`nFinished! Downloaded: $success, Skipped: $skipped" -ForegroundColor Green
