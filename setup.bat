@echo off
cd /d "%~dp0"
echo ============================================
echo  Motowarehouse Staff Leave - First-time setup
echo ============================================
echo.
echo This will install dependencies, create the database tables,
echo and set up your two login accounts. It only needs to run once.
echo.
echo Make sure you have pasted your Railway DATABASE_URL into the .env file
echo before continuing!
echo.
pause

echo.
echo [1/3] Installing dependencies (this can take a few minutes)...
call npm install
if errorlevel 1 goto :error

echo.
echo [2/3] Creating database tables...
call npx prisma db push
if errorlevel 1 goto :error

echo.
echo [3/3] Creating login accounts and loading public holidays...
call npm run db:seed
if errorlevel 1 goto :error

echo.
echo ============================================
echo  Setup complete! Run start.bat to launch the app.
echo ============================================
pause
goto :eof

:error
echo.
echo ============================================
echo  Something went wrong. Scroll up to see the error above.
echo  Common issue: DATABASE_URL in .env is still the placeholder text.
echo ============================================
pause
