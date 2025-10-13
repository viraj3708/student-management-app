@echo off
TITLE Check Student Management App
COLOR 0E

echo ========================================
echo   CHECKING STUDENT MANAGEMENT APP
echo ========================================
echo.

echo Testing if the application is running...
echo.

powershell -Command "& {try {Invoke-WebRequest -Uri 'http://localhost:5175' -UseBasicParsing | Out-Null; Write-Host '✅ Application is running!' -ForegroundColor Green} catch {Write-Host '❌ Application is not running.' -ForegroundColor Red}}"

echo.
echo If the application is running, you can access it at:
echo    http://localhost:5175
echo.
echo To start the application, double-click on START-APP.bat
echo.

pause