# Quick Start Guide - Dual Database Sync

## Setup Instructions

### For Your Laptop (Primary)

1. **Copy environment file:**
   ```bash
   cd backend
   cp ../env.local .env
   ```

2. **Verify .env contains:**
   ```env
   DATABASE_URL="mysql://root:password123@localhost:3307/assets_app_db"
   VIRTUAL_DB_URL="mysql://asset_user:asset_pass@localhost:3308/asset_mgr_team"
   PRIMARY_LAPTOP="true"
   PORT=4000
   ```

3. **Start both databases:**
   ```bash
   # From root directory
   .\start-team-db.bat
   ```

4. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

5. **Watch for sync messages:**
   ```
   ✅ Backend running on http://localhost:4000
   🔄 Starting sync from virtual to local database...
   ✅ Synced X records
   🎉 Sync complete
   🔄 Periodic sync enabled (every 30 seconds)
   ```

### For Team Members

1. **Copy environment file:**
   ```bash
   cd backend
   cp ../env.team .env
   ```

2. **Verify .env contains:**
   ```env
   DATABASE_URL="mysql://asset_user:asset_pass@localhost:3308/asset_mgr_team"
   VIRTUAL_DB_URL="mysql://asset_user:asset_pass@localhost:3308/asset_mgr_team"
   PRIMARY_LAPTOP="false"
   PORT=4000
   ```

3. **Start virtual database:**
   ```bash
   # From root directory
   .\start-team-db.bat
   ```

4. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

## How It Works

### Your Laptop (PRIMARY_LAPTOP=true)
- ✍️ **Writes**: Go to BOTH databases (local + virtual)
- 📖 **Reads**: Merged from BOTH databases
- 🔄 **Sync**: Every 30 seconds from virtual → local

### Team Laptops (PRIMARY_LAPTOP=false)
- ✍️ **Writes**: Go to virtual database ONLY
- 📖 **Reads**: From virtual database ONLY
- 🔄 **Sync**: Not needed (direct virtual access)

## Testing the Sync

### Test 1: Your Changes
1. Add an asset on your laptop
2. Check virtual database - should have it immediately
3. Check local database - should have it immediately
4. Team members see it immediately

### Test 2: Team Changes
1. Team member adds an asset
2. Goes to virtual database immediately
3. Within 30 seconds, appears in your local database
4. Your dashboard shows it

### Test 3: Sync Verification
1. Stop your backend
2. Have team member add data
3. Start your backend
4. Watch console - initial sync should pull the data
5. Check your dashboard - data should appear

## Troubleshooting

### Problem: Sync not running
**Solution:**
- Check `PRIMARY_LAPTOP="true"` in backend/.env
- Restart backend server
- Check console for error messages

### Problem: Data not showing
**Solution:**
- Wait 30 seconds for sync
- Check if virtual database has the data
- Verify both databases are running

### Problem: Can't connect to database
**Solution:**
- Run `.\start-team-db.bat` to start databases
- Check Docker is running
- Verify ports 3307 and 3308 are not in use

### Problem: Sync errors in console
**Solution:**
- Check database credentials
- Verify Prisma schema is generated: `npm run prisma:generate`
- Check both databases are accessible

## Commands Reference

### Database Management
```bash
# Start databases
.\start-team-db.bat

# Stop databases
.\stop-team-db.bat

# Switch to local database
cd backend
npm run db:local

# Switch to team database
cd backend
npm run db:team
```

### Backend Commands
```bash
cd backend

# Development mode
npm run dev

# Generate Prisma client
npm run prisma:generate

# Pull database schema
npm run prisma:pull

# Push schema changes
npm run prisma:push
```

## Sync Interval

Default: **30 seconds**

To change, edit `backend/src/index.js`:
```javascript
const SYNC_INTERVAL = 30000; // Change to desired milliseconds
```

Recommended intervals:
- **30 seconds**: Good balance (default)
- **60 seconds**: Less frequent, lower load
- **10 seconds**: More frequent, higher load

## Important Notes

1. **Always use correct .env file**
   - Your laptop: env.local → .env
   - Team laptops: env.team → .env

2. **Virtual database is source of truth**
   - Never delete virtual database
   - All team data lives here

3. **Sync only on primary laptop**
   - Team members don't need sync
   - They work directly with virtual database

4. **Monitor console logs**
   - Sync status appears every 30 seconds
   - Check for errors

5. **Database must be running**
   - Both databases for primary laptop
   - Virtual database for team laptops

## Success Indicators

✅ Backend starts without errors
✅ Initial sync completes successfully
✅ Periodic sync message appears every 30 seconds
✅ Dashboard shows data from both databases
✅ Team members can add/edit data
✅ Changes appear within 30 seconds

## Support

If issues persist:
1. Check SYNC_IMPLEMENTATION.md for detailed explanation
2. Review console logs for specific errors
3. Verify database connections
4. Check Prisma client is generated
5. Ensure correct environment variables
