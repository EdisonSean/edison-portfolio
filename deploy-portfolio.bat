@echo off
setlocal

cd /d F:\MyDesign\Website
if errorlevel 1 goto error

echo.
echo [1/5] Building portfolio...
call npm run build
if errorlevel 1 goto error

echo.
echo [2/5] Checking git status...
git status
if errorlevel 1 goto error

echo.
echo [3/5] Staging changes...
git add -A
if errorlevel 1 goto error

echo.
echo [4/5] Creating commit...
git commit -m "Update portfolio"
if errorlevel 1 goto error

echo.
echo [5/5] Pushing to remote...
git push
if errorlevel 1 goto error

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
