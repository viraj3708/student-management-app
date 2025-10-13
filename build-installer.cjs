import fs from 'fs';
import path from 'path';

// Create a simple installer script for Windows
const installerContent = `
@echo off
title Student Management App Installer
color 0A

echo ==================================================
echo    School Student Management App Installer
echo ==================================================
echo.

echo Checking system requirements...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed on this system.
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed on this system.
    echo Please download and install Node.js (which includes npm) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js and npm found. Proceeding with installation...
echo.

:: Create installation directory
set INSTALL_DIR="%USERPROFILE%\\StudentManagementApp"
echo Creating installation directory at %INSTALL_DIR%
mkdir %INSTALL_DIR% 2>nul

:: Copy application files
echo Copying application files...
xcopy /E /I /Y ".\\*" %INSTALL_DIR% >nul

:: Navigate to installation directory
cd /d %INSTALL_DIR%

:: Install dependencies
echo Installing application dependencies...
npm install > install.log 2>&1
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies. Check install.log for details.
    echo.
    pause
    exit /b 1
)

:: Create desktop shortcut
echo Creating desktop shortcut...
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\\\\Student Management App.lnk" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%USERPROFILE%\\\\StudentManagementApp\\\\start-app.bat" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%USERPROFILE%\\\\StudentManagementApp" >> CreateShortcut.vbs
echo oLink.Description = "School Student Management Application" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs
cscript CreateShortcut.vbs >nul
del CreateShortcut.vbs

echo.
echo ==================================================
echo    Installation completed successfully!
echo ==================================================
echo.
echo You can now run the application by:
echo 1. Double-clicking the "Student Management App" shortcut on your desktop
echo 2. Or running the start-app.bat file in the installation folder
echo.
echo The application will be available at: http://localhost:5175
echo.
echo Note: The first time you run the application, it may take a moment to start.
echo.
pause
`;

// Write the installer script
fs.writeFileSync(
  path.join(
    'c:\\Users\\ADMIN\\Desktop\\APP CREATION\\STUDENT MANAGEMENT\\student-management-app',
    'install-app.bat'
  ),
  installerContent
);

console.log('Installer script created successfully!');
console.log('To create an EXE installer, you can use a tool like NSIS or Inno Setup');
console.log('with the files in this directory.');