@echo off
echo Starting Databases (Local + Virtual)...
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

echo Docker is available. Starting databases...
echo.

REM Start both databases
docker compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ✅ Virtual database started successfully!
    echo.
    echo 📊 Your Local Database (Already Running):
    echo    Host: localhost
    echo    Port: 3307
    echo    Database: assets_app_db
    echo    Username: root
    echo    Password: password123
    echo    Status: Using your existing MySQL installation
    echo.
    echo 📊 Virtual Database (Team Shared - Docker):
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
    echo    1. Copy env.local to backend\.env (for your laptop)
    echo    2. Run: cd backend ^&^& npm run prisma:generate
    echo    3. Run: cd backend ^&^& npm run dev
    echo.
) else (
    echo ❌ Failed to start databases!
    echo Check the error messages above.
)

pause
