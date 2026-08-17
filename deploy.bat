@echo off
chcp 65001 >nul
set "GIT_EXE=C:\Users\cuteh\.gemini\antigravity\mingit\cmd\git.exe"

cd /d "C:\Users\cuteh\.gemini\antigravity\scratch\bird-audio-quiz"

echo [1/5] Configuring Git user...
"%GIT_EXE%" config user.name "cutehalo"
"%GIT_EXE%" config user.email "cutehalo@users.noreply.github.com"
"%GIT_EXE%" config http.sslVerify false

echo [2/5] Initializing repository...
"%GIT_EXE%" init
"%GIT_EXE%" branch -M main

echo [3/5] Adding all files to stage...
"%GIT_EXE%" add .

echo [4/5] Creating initial commit...
"%GIT_EXE%" commit -m "feat: 听音识鸟 500 种中国鸟类全实装与宝可梦羁绊模式上线"

echo [5/5] Setting remote origin...
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin https://github.com/cutehalo/bird-audio-quiz.git

echo Repository ready!
"%GIT_EXE%" status
