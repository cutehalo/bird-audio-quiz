$git = "C:\Users\cuteh\.gemini\antigravity\mingit\cmd\git.exe"

Set-Location "C:\Users\cuteh\.gemini\antigravity\scratch\bird-audio-quiz"

Write-Host "[1/5] Configuring Git user..."
& $git config user.name "cutehalo"
& $git config user.email "cutehalo@users.noreply.github.com"
& $git config http.sslVerify false

Write-Host "[2/5] Initializing repository..."
& $git init
& $git branch -M main

Write-Host "[3/5] Adding all files to stage..."
& $git add .

Write-Host "[4/5] Creating commit..."
& $git commit -m "feat: 听音识鸟 500 种中国鸟类全实装与宝可梦羁绊模式上线"

Write-Host "[5/5] Setting remote origin..."
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/cutehalo/bird-audio-quiz.git

Write-Host "Repository ready! Current status:"
& $git status
& $git log -n 1
