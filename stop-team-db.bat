@echo off
echo Stopping Team Virtual Database...
echo.

REM Stop the database
docker compose down

if %errorlevel% equ 0 (
    echo ✅ Team database stopped successfully!
) else (
    echo ❌ Failed to stop database!
    echo Check the error messages above.
)

pause

