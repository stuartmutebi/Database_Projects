-- Run this SQL in phpMyAdmin for BOTH databases
-- 1. Go to http://localhost:8080 (phpMyAdmin)
-- 2. Select the database (assets_app_db for local, asset_mgr_team for virtual)
-- 3. Click "SQL" tab
-- 4. Paste this code and click "Go"

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS category_type VARCHAR(255) DEFAULT 'General' AFTER description,
ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP AFTER category_type,
ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
