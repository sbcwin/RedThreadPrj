@echo off
setlocal
rem Bypass PowerShell blocking npm.ps1: always use npm.cmd (Windows).
set "ROOT=%~dp0.."
cd /d "%ROOT%" || exit /b 1

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm.cmd not found. Install Node.js LTS and reopen the terminal.
  exit /b 1
)

call npm.cmd run dev:web
