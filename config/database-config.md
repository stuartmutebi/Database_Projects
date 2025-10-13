# Database Configuration Guide

## Overview
This project supports two database configurations:
1. **Local Database** (Port 3307) - For lecturer requirements
2. **Team Virtual Database** (Port 3308) - For team collaboration

## Setup Instructions

### For Team Members

1. **Start the virtual database:**
   ```bash
   docker-compose up -d
   ```

2. **Set environment for team database:**
   ```bash
   # Copy the team environment file
   cp .env.team .env
   ```

3. **Initialize the database schema:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:push
   ```

4. **Access the database:**
   - **MySQL Connection:** `localhost:3308`
   - **phpMyAdmin:** http://localhost:8080
   - **Username:** `asset_user`
   - **Password:** `asset_pass`

### For Local Development (Lecturer Requirements)

1. **Use your local MySQL:**
   ```bash
   # Copy the local environment file
   cp .env.local .env
   ```

2. **Run Prisma commands:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:push
   ```

## Database URLs

- **Local:** `mysql://root:your_password@localhost:3307/asset_mgr_local`
- **Team:** `mysql://asset_user:asset_pass@localhost:3308/asset_mgr_team`

## Switching Between Databases

To switch between local and team databases, simply copy the appropriate `.env` file:

```bash
# Switch to team database
cp .env.team .env

# Switch to local database  
cp .env.local .env
```

## Data Synchronization

Use the provided scripts to sync data between databases:

```bash
# Sync from local to team
npm run sync:local-to-team

# Sync from team to local
npm run sync:team-to-local
```
