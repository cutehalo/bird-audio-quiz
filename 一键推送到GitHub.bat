@echo off
chcp 65001 >nul
title 听音识鸟 · 推送到 GitHub 远程仓库



set "GIT_EXE=C:\Users\cuteh\.gemini\antigravity\mingit\cmd\git.exe"
cd /d "C:\Users\cuteh\.gemini\antigravity\scratch\bird-audio-quiz"

echo [1/2] 正在连接 GitHub 仓库 https://github.com/cutehalo/bird-audio-quiz.git ...
echo.
echo * 提示：如果弹出 GitHub 登录窗口，请点击 [Sign in with your browser] 授权即可！
echo.

"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   ?? 推送成功！
    echo ========================================================
    echo.
    echo 接下来请按以下步骤开启 GitHub Pages 在线访问：
    echo 1. 打开仓库设置：https://github.com/cutehalo/bird-audio-quiz/settings/pages
    echo 2. 在 Branch 下拉框选择 [main]，目录保持 [/ (root)]，点击 Save 保存
    echo 3. 等待 30 秒，即可在 https://cutehalo.github.io/bird-audio-quiz/ 在线游玩！
    echo.
) else (
    echo.
    echo ? 推送失败，请检查网络连接或 GitHub 账号权限。
)

echo.
pause
