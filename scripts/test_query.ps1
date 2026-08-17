$url1 = "https://xeno-canto.org/api/v2/recordings?query=Passer+montanus"
$url2 = "https://www.xeno-canto.org/api/2/recordings?query=Passer+montanus"
$url3 = "https://xeno-canto.org/api/2/recordings?query=Passer+montanus"

try {
    $r = Invoke-RestMethod -Uri $url2 -Method Get
    Write-Host "URL2 Success! Count:" $r.recordings.Count
} catch {
    Write-Host "URL2 Failed: $_"
}

try {
    $r = Invoke-RestMethod -Uri $url1 -Method Get
    Write-Host "URL1 Success! Count:" $r.recordings.Count
} catch {
    Write-Host "URL1 Failed: $_"
}
