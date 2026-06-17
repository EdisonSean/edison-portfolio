@echo off
setlocal

cd /d F:\MyDesign\Website
if errorlevel 1 goto error

if "%~1"=="" (
  echo Drag one or more video files or folders onto this BAT file.
  echo Encoded files will be written into a web folder next to each source file.
  pause
  exit /b 1
)

call node scripts\encode-video-preview.mjs %*
if errorlevel 1 goto error

echo.
echo Encoding finished.
pause
exit /b 0

:error
echo.
echo Encoding failed. Check the message above.
pause
exit /b 1
