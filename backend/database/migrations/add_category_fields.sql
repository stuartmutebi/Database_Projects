-- Add new fields to categories table
ALTER TABLE categories 
ADD COLUMN category_type VARCHAR(255) DEFAULT 'General' AFTER description,
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP AFTER category_type,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
