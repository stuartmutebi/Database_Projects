# PowerShell script to add missing columns to categories table
Write-Host "Adding columns to categories table..." -ForegroundColor Cyan

# SQL to run
$sql = "ALTER TABLE categories ADD COLUMN category_type VARCHAR(255) DEFAULT 'General', ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP, ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"

# Update VIRTUAL database (3308)
Write-Host "`nUpdating VIRTUAL database (port 3308)..." -ForegroundColor Yellow
try {
    docker exec asset_mysql_team mysql -u asset_user -passet_pass asset_mgr_team -e $sql
    Write-Host "✓ Virtual database updated successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not update virtual database" -ForegroundColor Yellow
}

# Update LOCAL database (3307) 
Write-Host "`nUpdating LOCAL database (port 3307)..." -ForegroundColor Yellow
try {
    docker exec asset_mysql_local mysql -u root -p0778576369Ms/ assets_app_db -e $sql 2>$null
    Write-Host "✓ Local database updated successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not update local database" -ForegroundColor Yellow
}

Write-Host "`nDone! Now restart your backend server." -ForegroundColor Cyan
