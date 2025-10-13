@echo off
TITLE Student Management App
COLOR 0A

echo ========================================
echo   SCHOOL STUDENT MANAGEMENT APP
echo ========================================
echo.
echo Starting the application server...
echo.
echo Please wait while the server starts...
echo.
echo Once started, the application will be available at:
echo    http://localhost:5175
echo.
echo To stop the server, close this window or press Ctrl+C
echo.

cd /d "c:\Users\ADMIN\Desktop\APP CREATION\STUDENT MANAGEMENT\student-management-app"
npm run dev

pause