@echo off
setlocal

cd /d F:\MyDesign\Website
if errorlevel 1 goto error

echo.
echo [1/7] Updating WeChat video previews...
call npm run encode-wechat-video-previews
if errorlevel 1 goto error

echo.
echo [2/7] Updating media dimensions...
call npm run update-media-dimensions
if errorlevel 1 goto error

echo.
echo [3/7] Building portfolio...
call npm run build
if errorlevel 1 goto error

echo.
echo [4/7] Checking git status...
git status
if errorlevel 1 goto error

echo.
echo [5/7] Staging changes...
git add -A
if errorlevel 1 goto error

echo.
echo [6/7] Creating commit...
git commit -m "Update portfolio"
if errorlevel 1 (
  echo.
  echo No new staged changes to commit. Continuing to push any existing local commits...
)

echo.
echo [7/7] Pushing to remote...
set "HTTP_PROXY="
set "HTTPS_PROXY="
set "ALL_PROXY="
git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 -c http.lowSpeedLimit=0 -c http.lowSpeedTime=999999 push
if errorlevel 1 goto push_check

echo.
echo Deploy finished successfully.
echo Your latest commit has been pushed to the remote repository.
pause
exit /b 0

:error
echo.
echo Deploy failed. Check the message above.
pause
exit /b 1

:push_check
echo.
echo Push did not complete. Checking whether there is anything to deploy...
git status -sb
git status -sb | findstr /C:"ahead" >nul
if errorlevel 1 (
  echo.
  echo Nothing to deploy. Your branch does not appear to be ahead of the remote.
  pause
  exit /b 0
)
echo.
echo Deploy failed during git push. Check the message above.
pause
exit /b 1
