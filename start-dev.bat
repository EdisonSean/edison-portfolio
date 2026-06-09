@echo off
setlocal

cd /d "%~dp0"

set PORT=%~1
if "%PORT%"=="" set PORT=3000

echo Starting Next.js dev server on http://localhost:%PORT%
echo.

npm run dev -- --hostname 127.0.0.1 --port %PORT%

endlocal
