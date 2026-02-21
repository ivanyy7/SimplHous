@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if errorlevel 1 ( echo npm install failed. & pause & exit /b 1 )
echo.
echo Seeding database...
call npm run db:seed
if errorlevel 1 ( echo Seed failed. & pause & exit /b 1 )
echo.
echo Done. You can run "npm run dev" or start-dev.bat to start the app.
pause
