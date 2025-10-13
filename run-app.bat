@echo off
echo Building and starting the Student Management Application...
echo.

REM Navigate to the project directory
cd /d "c:\Users\ADMIN\Desktop\APP CREATION\STUDENT MANAGEMENT\student-management-app"

REM Kill any existing processes on port 8080
echo Killing any existing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /PID %%a /F >nul 2>&1

REM Build the project
echo Building the project...
npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build the project
    pause
    exit /b %errorlevel%
)

REM Install serve globally if not already installed
echo Installing serve globally...
npm install -g serve >nul 2>&1

REM Serve the built files
echo Starting the server on http://localhost:8080
echo.
echo **********************************************************
echo *                                                        *
echo *  The application is now running on:                    *
echo *  http://localhost:8080                                 *
echo *                                                        *
echo *  Press Ctrl+C to stop the server                       *
echo *                                                        *
echo **********************************************************
echo.
serve -s dist -p 8080