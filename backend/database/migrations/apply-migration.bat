@echo off
echo ========================================
echo Adding category columns to databases
echo ========================================
echo.

echo Updating VIRTUAL database (port 3308)...
docker exec -i asset_mysql_team mysql -u asset_user -passet_pass asset_mgr_team < add_category_columns.sql
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Virtual database updated
) else (
    echo [WARNING] Virtual database update failed or columns already exist
)

echo.
echo Updating LOCAL database (port 3307)...
docker exec -i asset_mysql_local mysql -u root -p0778576369Ms/ assets_app_db < add_category_columns.sql 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Local database updated
) else (
    echo [WARNING] Local database update failed or columns already exist
)

echo.
echo ========================================
echo Migration complete!
echo Now regenerate Prisma client:
echo   cd backend
echo   npx prisma generate
echo ========================================
pause
