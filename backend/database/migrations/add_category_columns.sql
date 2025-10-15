-- Add missing columns to categories table in virtual database
-- Run this in phpMyAdmin or MySQL client connected to virtual database (port 3308)

USE asset_mgr_team;

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS category_type VARCHAR(255) DEFAULT 'General',
ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
