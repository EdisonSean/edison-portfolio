@echo off
setlocal

set PORT=%~1
if "%PORT%"=="" set PORT=3000

echo Stopping processes using port %PORT%...
echo.

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  echo Killing PID %%P
  taskkill /PID %%P /F
)

echo.
echo Done.

endlocal
