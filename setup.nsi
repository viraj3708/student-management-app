; Student Management App Installer
; This script creates an installer for the Student Management App

!define APP_NAME "Student Management App"
!define APP_VERSION "1.0"
!define APP_PUBLISHER "Santosh Bansode"
!define APP_WEB_SITE "https://github.com"
!define APP_DIR "StudentManagementApp"

; The name of the installer
Name "${APP_NAME} ${APP_VERSION}"

; The file to write
OutFile "${APP_NAME} Setup.exe"

; The default installation directory
InstallDir "$PROGRAMFILES\${APP_DIR}"

; Request application privileges for Windows Vista
RequestExecutionLevel admin

;--------------------------------
; Interface Settings
;--------------------------------

!include "MUI2.nsh"

; Show details
!define MUI_ABORTWARNING

;--------------------------------
; Pages
;--------------------------------

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

;--------------------------------
; Languages
;--------------------------------

!insertmacro MUI_LANGUAGE "English"

;--------------------------------
; Installer Sections
;--------------------------------

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  
  ; Add files
  File /r "*.*"
  
  ; Exclude development files
  Delete "$INSTDIR\setup.nsi"
  Delete "$INSTDIR\package-lock.json"
  RMDir /r "$INSTDIR\node_modules"
  
  ; Create start menu shortcut
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\START-APP.bat"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\START-APP.bat"
SectionEnd

Section -AdditionalIcons
  WriteIniStr "$INSTDIR\${APP_NAME}.url" "InternetShortcut" "URL" "http://localhost:5175"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\Website.lnk" "$INSTDIR\${APP_NAME}.url"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\${APP_PUBLISHER}\${APP_NAME}" "" $INSTDIR
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
SectionEnd

;--------------------------------
; Uninstaller Section
;--------------------------------

Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
  DeleteRegKey HKCU "Software\${APP_PUBLISHER}\${APP_NAME}"

  ; Remove files and uninstaller
  Delete "$INSTDIR\Uninstall.exe"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\${APP_NAME}\*.*"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  
  ; Remove directories
  RMDir "$SMPROGRAMS\${APP_NAME}"
  RMDir /r "$INSTDIR"

SectionEnd