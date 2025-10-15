// Quick script to verify your .env configuration
import 'dotenv/config';

console.log('\n🔍 Environment Configuration Check\n');
console.log('═══════════════════════════════════════════════════\n');

const config = {
  'DATABASE_URL': process.env.DATABASE_URL,
  'VIRTUAL_DB_URL': process.env.VIRTUAL_DB_URL,
  'PRIMARY_LAPTOP': process.env.PRIMARY_LAPTOP,
  'PORT': process.env.PORT
};

let hasErrors = false;

// Check each configuration
console.log('📋 Current Configuration:\n');
for (const [key, value] of Object.entries(config)) {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`❌ ${key}: NOT SET`);
    hasErrors = true;
  }
}

console.log('\n═══════════════════════════════════════════════════\n');

// Validate configuration
if (hasErrors) {
  console.log('❌ Configuration has errors!\n');
  console.log('Your backend/.env should contain:\n');
  console.log('DATABASE_URL="mysql://root:password123@localhost:3307/assets_app_db"');
  console.log('VIRTUAL_DB_URL="mysql://asset_user:asset_pass@localhost:3308/asset_mgr_team"');
  console.log('PRIMARY_LAPTOP="true"');
  console.log('PORT=4000\n');
} else {
  console.log('✅ Configuration looks good!\n');
  
  // Check if PRIMARY_LAPTOP is set correctly
  if (process.env.PRIMARY_LAPTOP === 'true') {
    console.log('✅ PRIMARY_LAPTOP is set to "true"');
    console.log('   → Dual write enabled (local + virtual)');
    console.log('   → Sync enabled (every 30 seconds)');
    console.log('   → Dashboard shows merged data\n');
  } else if (process.env.PRIMARY_LAPTOP === 'false') {
    console.log('⚠️  PRIMARY_LAPTOP is set to "false"');
    console.log('   → This is for TEAM MEMBERS only');
    console.log('   → If this is YOUR laptop, change to "true"\n');
  } else {
    console.log('⚠️  PRIMARY_LAPTOP value is unexpected:', process.env.PRIMARY_LAPTOP);
    console.log('   → Should be "true" for your laptop');
    console.log('   → Should be "false" for team laptops\n');
  }
  
  // Check database URLs
  if (config.DATABASE_URL?.includes('3307') && config.VIRTUAL_DB_URL?.includes('3308')) {
    console.log('✅ Database ports are correct');
    console.log('   → Local DB: Port 3307');
    console.log('   → Virtual DB: Port 3308\n');
  } else {
    console.log('⚠️  Database ports might be incorrect');
    console.log('   → Local should be 3307');
    console.log('   → Virtual should be 3308\n');
  }
}

console.log('═══════════════════════════════════════════════════\n');
console.log('🔄 How Bidirectional Sync Works:\n');
console.log('1. YOU add data → Goes to BOTH databases');
console.log('   → Team sees it IMMEDIATELY (from virtual DB)\n');
console.log('2. TEAM adds data → Goes to virtual database');
console.log('   → Syncs to your local DB every 30 seconds');
console.log('   → You see it within 30 seconds\n');
console.log('3. Result: Everyone sees everything! 🎉\n');
console.log('═══════════════════════════════════════════════════\n');
