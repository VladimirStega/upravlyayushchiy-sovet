@echo off
cd /d "%~dp0"
title Governing Council Website
set "NODE_EXE=C:\Users\79042\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if exist "%NODE_EXE%" goto run_bundled
where node >nul 2>nul
if not errorlevel 1 goto run_system

echo Node.js was not found.
echo Install Node.js from https://nodejs.org/ and try again.
pause
goto end

:run_bundled
"%NODE_EXE%" "%~dp0preview-server.mjs"
goto end

:run_system
node "%~dp0preview-server.mjs"

:end
