#!/usr/bin/env node

/**
 * Database Synchronization Script
 * Syncs data between local and team databases
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const LOCAL_ENV = 'env.local';
const TEAM_ENV = 'env.team';

function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function switchToDatabase(envFile) {
  const envPath = path.join(process.cwd(), 'backend', '.env');
  const sourcePath = path.join(process.cwd(), envFile);
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`Environment file ${envFile} not found!`);
    process.exit(1);
  }
  
  fs.copyFileSync(sourcePath, envPath);
  console.log(`Switched to ${envFile} configuration`);
}

function syncFromLocalToTeam() {
  console.log('🔄 Syncing from Local to Team Database...');

  // Switch to local database
  switchToDatabase(LOCAL_ENV);

  // Export data from local
  console.log('📤 Exporting data from local database...');
  runCommand('npx prisma generate --no-engine', './backend');

  // Switch to team database
  switchToDatabase(TEAM_ENV);

  // Import data to team
  console.log('📥 Importing data to team database...');
  runCommand('npm run prisma:push', './backend');

  console.log('✅ Sync completed: Local → Team');
}

function syncFromTeamToLocal() {
  console.log('🔄 Syncing from Team to Local Database...');

  // Switch to team database
  switchToDatabase(TEAM_ENV);

  // Export data from team
  console.log('📤 Exporting data from team database...');
  runCommand('npx prisma generate --no-engine', './backend');

  // Switch to local database
  switchToDatabase(LOCAL_ENV);

  // Import data to local
  console.log('📥 Importing data to local database...');
  runCommand('npm run prisma:push', './backend');

  console.log('✅ Sync completed: Team → Local');
}

function showHelp() {
  console.log(`
Database Sync Tool

Usage:
  node scripts/sync-databases.js [command]

Commands:
  local-to-team    Sync data from local database to team database
  team-to-local    Sync data from team database to local database
  help            Show this help message

Examples:
  node scripts/sync-databases.js local-to-team
  node scripts/sync-databases.js team-to-local
  `);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'local-to-team':
    syncFromLocalToTeam();
    break;
  case 'team-to-local':
    syncFromTeamToLocal();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error('❌ Unknown command. Use "help" to see available commands.');
    showHelp();
    process.exit(1);
}

