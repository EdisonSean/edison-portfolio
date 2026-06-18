@echo off
setlocal

cd /d F:\MyDesign\Website
if errorlevel 1 goto error

if "%~1"=="" (
  echo Drag one or more video files or folders onto this BAT file.
  echo Encoded MP4 files will replace the source videos in place.
  echo Non-MP4 sources will be deleted after the MP4 replacement succeeds.
  pause
  exit /b 1
)

call node scripts\encode-video-preview.mjs %*
if errorlevel 1 goto error

echo.
echo Encoding and replacement finished.
pause
exit /b 0

:error
echo.
echo Encoding failed. Check the message above.
pause
exit /b 1
