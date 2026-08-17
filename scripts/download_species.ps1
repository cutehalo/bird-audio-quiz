$audioDir = Join-Path $PSScriptRoot "..\audio"
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

$slugs = @(
    "Chloris-sinica",
    "Anas-platyrhynchos",
    "Aix-galericulata",
    "Ardea-cinerea",
    "Egretta-garzetta",
    "Cuculus-canorus",
    "Alcedo-atthis",
    "Falco-tinnunculus",
    "Athene-noctua",
    "Otus-lettia",
    "Alauda-arvensis",
    "Troglodytes-troglodytes",
    "Phasianus-colchicus",
    "Lanius-schach",
    "Acridotheres-cristatellus",
    "Garrulax-canorus",
    "Sinosuthora-webbiana",
    "Motacilla-alba",
    "Phoenicurus-auroreus",
    "Copsychus-saularis",
    "Monticola-solitarius",
    "Phylloscopus-inornatus",
    "Acrocephalus-orientalis",
    "Dicrurus-macrocercus",
    "Bombycilla-garrulus",
    "Sitta-europaea",
    "Dendrocopos-major",
    "Podiceps-cristatus",
    "Tachybaptus-ruficollis",
    "Phalacrocorax-carbo",
    "Grus-japonensis",
    "Gallinula-chloropus",
    "Hydrophasianus-chirurgus",
    "Himantopus-himantopus",
    "Recurvirostra-avosetta",
    "Vanellus-vanellus",
    "Chroicocephalus-ridibundus",
    "Falco-peregrinus",
    "Aquila-chrysaetos",
    "Bubo-bubo",
    "Streptopelia-orientalis"
)

Write-Host "============================================================"
Write-Host "  Downloading Authentic Wild MP3s from Xeno-canto"
Write-Host "  Audio Directory: $audioDir"
Write-Host "============================================================`n"

$count = 0
$success = 0

foreach ($slug in $slugs) {
    $count++
    $id = $slug.ToLower().Replace("-", "_")
    $target = Join-Path $audioDir ($id + ".mp3")
    
    if (Test-Path $target) {
        $size = (Get-Item $target).Length
        if ($size -gt 20000) {
            Write-Host "[$count/$($slugs.Count)] [$slug] Already exists ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor DarkGray
            $success++
            continue
        }
    }

    Write-Host "[$count/$($slugs.Count)] [$slug] Scraping..." -NoNewline
    try {
        $pageUrl = "https://xeno-canto.org/species/" + $slug
        $lines = curl.exe -s -L $pageUrl
        $text = $lines -join "`n"
        
        $downloadUrl = $null
        if ($text -match 'https://xeno-canto\.org/sounds/uploaded/[^\s''"]+\.mp3') {
            $downloadUrl = $matches[0]
        } elseif ($text -match 'xeno-canto\.org/(\d+)/download') {
            $downloadUrl = "https://xeno-canto.org/$($matches[1])/download"
        }

        if ($downloadUrl) {
            Write-Host " Downloading..." -NoNewline
            curl.exe -s -L -o $target $downloadUrl
            
            if (Test-Path $target) {
                $size = (Get-Item $target).Length
                if ($size -gt 20000) {
                    Write-Host " Done ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green
                    $success++
                } else {
                    Write-Host " Download incomplete ($size bytes)" -ForegroundColor Red
                    Remove-Item $target -Force -ErrorAction SilentlyContinue
                }
            }
        } else {
            Write-Host " No MP3 link on species page" -ForegroundColor Red
        }
    } catch {
        Write-Host " Failed: $_" -ForegroundColor Red
    }

    Start-Sleep -Milliseconds 400
}

Write-Host "`n============================================================"
Write-Host "Finished! Downloaded $success / $($slugs.Count) species recordings."
Write-Host "============================================================"
