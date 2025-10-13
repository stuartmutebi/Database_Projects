# Team Database Setup Guide

## 🎯 Overview
This setup allows your team to collaborate on a shared virtual MySQL database while keeping your local database intact for lecturer requirements.

## 🚀 Quick Start

### 1. Start the Team Database
```bash
# Start the virtual MySQL database
npm run team:start

# Or manually with Docker
docker-compose up -d
```

### 2. Configure Your Environment
```bash
# Switch to team database
cd backend
npm run db:team
npm run prisma:push
```

### 3. Access the Database
- **MySQL Connection:** `localhost:3307`
- **phpMyAdmin Web Interface:** http://localhost:8080
- **Credentials:** `asset_user` / `asset_pass`

## 📊 Database Configurations

| Database | Port | Purpose | Environment File |
|----------|------|---------|------------------|
| Local | 3306 | Lecturer requirements | `env.local` |
| Team | 3307 | Team collaboration | `env.team` |

## 🔄 Switching Between Databases

### Switch to Team Database
```bash
cd backend
npm run db:team
```

### Switch to Local Database
```bash
cd backend
npm run db:local
```

## 📤📥 Data Synchronization

### Sync from Local to Team
```bash
npm run sync:local-to-team
```

### Sync from Team to Local
```bash
npm run sync:team-to-local
```

## 🛠️ Available Commands

### Team Database Management
```bash
npm run team:start      # Start team database
npm run team:stop       # Stop team database
npm run team:status     # Check database status
```

### Database Switching
```bash
npm run setup:team      # Setup team database
npm run setup:local     # Setup local database
```

### Development
```bash
npm run dev:backend     # Start backend server
npm run dev:frontend    # Start frontend server
```

## 🔧 Team Member Setup

### For New Team Members:

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start the team database:**
   ```bash
   npm run team:start
   ```

4. **Configure for team database:**
   ```bash
   cd backend
   npm run db:team
   npm run prisma:push
   ```

5. **Start development:**
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

## 🌐 Web Interfaces

- **phpMyAdmin:** http://localhost:8080
  - Username: `asset_user`
  - Password: `asset_pass`

## 📝 Important Notes

1. **Port Conflicts:** The team database uses port 3307 to avoid conflicts with your local MySQL (port 3306)

2. **Data Persistence:** Team database data is stored in Docker volumes and persists between restarts

3. **Backup:** Always backup your local database before syncing from team database

4. **Environment Files:** Never commit `.env` files to version control

## 🚨 Troubleshooting

### Database Won't Start
```bash
# Check Docker status
docker ps

# Restart Docker Desktop
# Then try again
npm run team:start
```

### Port Already in Use
```bash
# Check what's using port 3307
netstat -ano | findstr :3307

# Stop the team database
npm run team:stop
```

### Connection Issues
```bash
# Check database status
npm run team:status

# Restart the database
npm run team:stop
npm run team:start
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Docker is running
3. Ensure no port conflicts
4. Check the database logs: `docker-compose logs db`

