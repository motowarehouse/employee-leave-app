@echo off
cd /d "%~dp0"
echo ============================================
echo  Pushing Motowarehouse Staff Leave to GitHub
echo ============================================
echo.

if not exist ".git" (
  echo Initializing git repository...
  git init
  if errorlevel 1 goto :error
)

git config user.email "info@motowarehouse.com.cy"
git config user.name "Motowarehouse"

echo.
echo Staging files (node_modules, .next, and .env are excluded automatically)...
git add .

git commit -m "Initial commit - Motowarehouse Staff Leave"
if errorlevel 1 (
  echo (Nothing new to commit, or already committed - continuing...)
)

git branch -M main

git remote add origin https://github.com/motowarehouse/employee-leave-app.git 2>nul
git remote set-url origin https://github.com/motowarehouse/employee-leave-app.git

echo.
echo Pushing to GitHub... A browser window or credential prompt may appear -
echo sign in with your GitHub account if asked.
git push -u origin main
if errorlevel 1 goto :error

echo.
echo ============================================
echo  Done! Your code is now on GitHub at:
echo  https://github.com/motowarehouse/employee-leave-app
echo ============================================
pause
goto :eof

:error
echo.
echo ============================================
echo  Something went wrong. Scroll up to see the error above.
echo  Common issue: you need to sign in to GitHub when prompted,
echo  or Git isn't installed (you have Git Bash, so it should be).
echo ============================================
pause
