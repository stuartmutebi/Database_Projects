@echo off
echo Starting Team Virtual Database...
echo.

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop first.
    echo See DOCKER_SETUP.md for instructions.
    pause
    exit /b 1
)

echo Docker is available. Starting database...
echo.

REM Start the database
docker compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ✅ Team database started successfully!
    echo.
    echo 📊 Database Information:
    echo    Host: localhost
    echo    Port: 3308
    echo    Database: asset_mgr_team
    echo    Username: asset_user
    echo    Password: asset_pass
    echo.
    echo 🌐 Web Interface:
    echo    phpMyAdmin: http://localhost:8080
    echo.
    echo 🔧 Next Steps:
    echo    1. Copy env.team to backend\.env
    echo    2. Run: cd backend ^&^& npm run prisma:push
    echo    3. Your team can now connect to the database!
    echo.
) else (
    echo ❌ Failed to start database!
    echo Check the error messages above.
)

pause
