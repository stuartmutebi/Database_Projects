@echo off
echo ========================================
echo Testing Backend API Endpoints
echo ========================================
echo.

echo Testing if backend is running...
curl -s http://localhost:4000/api/assets >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on port 4000
) else (
    echo ❌ Backend is NOT running!
    echo Please start it: cd backend ^&^& npm run dev
    pause
    exit /b 1
)

echo.
echo Testing API endpoints...
echo.

echo 1. Testing /api/assets
curl -s http://localhost:4000/api/assets | findstr /C:"[" >nul
if %errorlevel% equ 0 (
    echo    ✅ Assets API working
) else (
    echo    ❌ Assets API failed
)

echo 2. Testing /api/users
curl -s http://localhost:4000/api/users | findstr /C:"[" >nul
if %errorlevel% equ 0 (
    echo    ✅ Users API working
) else (
    echo    ❌ Users API failed
)

echo 3. Testing /api/categories
curl -s http://localhost:4000/api/categories | findstr /C:"[" >nul
if %errorlevel% equ 0 (
    echo    ✅ Categories API working
) else (
    echo    ❌ Categories API failed
)

echo 4. Testing /api/suppliers
curl -s http://localhost:4000/api/suppliers | findstr /C:"[" >nul
if %errorlevel% equ 0 (
    echo    ✅ Suppliers API working
) else (
    echo    ❌ Suppliers API failed
)

echo 5. Testing /api/buyers
curl -s http://localhost:4000/api/buyers | findstr /C:"[" >nul
if %errorlevel% equ 0 (
    echo    ✅ Buyers API working
) else (
    echo    ❌ Buyers API failed
)

echo 6. Testing /api/reports/dashboard
curl -s http://localhost:4000/api/reports/dashboard | findstr /C:"summary" >nul
if %errorlevel% equ 0 (
    echo    ✅ Reports API working
) else (
    echo    ❌ Reports API failed
)

echo.
echo ========================================
echo Test Complete
echo ========================================
echo.
echo If all tests passed, your backend is working correctly!
echo If any failed, check backend terminal for errors.
echo.

pause
