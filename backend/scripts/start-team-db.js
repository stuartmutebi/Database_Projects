#!/usr/bin/env node

/**
 * Start Team Database Script
 * Starts the virtual MySQL database for team collaboration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      shell: true 
    });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'pipe' });
    console.log('✅ Docker is installed');
  } catch (error) {
    console.error('❌ Docker is not installed or not running');
    console.error('Please install Docker Desktop and start it before running this script');
    process.exit(1);
  }
}

function startTeamDatabase() {
  console.log('🚀 Starting Team Virtual Database...');
  
  // Check if Docker is available
  checkDocker();
  
  // Start the database
  console.log('📦 Starting MySQL container...');
  runCommand('docker-compose up -d db');
  
  // Wait a moment for the database to initialize
  console.log('⏳ Waiting for database to initialize...');
  setTimeout(() => {
    console.log('✅ Team database is ready!');
    console.log('');
    console.log('📊 Database Information:');
    console.log('   Host: localhost');
    console.log('   Port: 3308');
    console.log('   Database: asset_mgr_team');
    console.log('   Username: asset_user');
    console.log('   Password: asset_pass');
    console.log('');
    console.log('🌐 Web Interface:');
    console.log('   phpMyAdmin: http://localhost:8080');
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('   1. Copy env.team to backend/.env');
    console.log('   2. Run: cd backend && npm run prisma:push');
    console.log('   3. Your team can now connect to the database!');
  }, 5000);
}

function stopTeamDatabase() {
  console.log('🛑 Stopping Team Virtual Database...');
  runCommand('docker-compose down');
  console.log('✅ Team database stopped');
}

function showStatus() {
  try {
    console.log('📊 Checking database status...');
    execSync('docker-compose ps', { stdio: 'inherit' });
  } catch (error) {
    console.log('❌ No containers running');
  }
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'start':
    startTeamDatabase();
    break;
  case 'stop':
    stopTeamDatabase();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log(`
Team Database Manager

Usage:
  node scripts/start-team-db.js [command]

Commands:
  start    Start the team virtual database
  stop     Stop the team virtual database
  status   Show database status

Examples:
  node scripts/start-team-db.js start
  node scripts/start-team-db.js stop
  node scripts/start-team-db.js status
  `);
}
