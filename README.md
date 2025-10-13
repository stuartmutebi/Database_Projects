# Asset Management System - Team Database Setup

## 🎯 Project Overview
This asset management system supports both local and team database configurations, allowing you to maintain your local database for lecturer requirements while collaborating with your team on a shared virtual database.

## 🚀 Quick Start

### Prerequisites
- Node.js and npm installed
- Docker Desktop (for team database)
- MySQL (for local database)

### 1. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Choose Your Database Setup

#### Option A: Team Collaboration (Virtual Database)
```bash
# Start virtual database (requires Docker)
npm run team:start

# Configure for team database
cd backend
npm run db:team
npm run prisma:push
```

#### Option B: Local Development (Lecturer Requirements)
```bash
# Configure for local database
cd backend
npm run db:local
npm run prisma:push
```

### 3. Start Development
```bash
# Backend server
npm run dev:backend

# Frontend server (in new terminal)
npm run dev:frontend
```

## 📊 Database Configurations

| Database | Port | Purpose | Environment |
|----------|------|---------|-------------|
| **Local** | 3307 | Lecturer requirements | `env.local` |
| **Team** | 3308 | Team collaboration | `env.team` |

## 🔄 Database Management

### Switching Between Databases
```bash
# Switch to team database
cd backend && npm run db:team

# Switch to local database
cd backend && npm run db:local
```

### Data Synchronization
```bash
# Sync from local to team
npm run sync:local-to-team

# Sync from team to local
npm run sync:team-to-local
```

### Team Database Management
```bash
# Start team database
npm run team:start

# Stop team database
npm run team:stop

# Check database status
npm run team:status
```

## 🌐 Web Interfaces

- **phpMyAdmin:** http://localhost:8080 (Team database only)
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 📁 Project Structure

```
Database Design/
├── backend/                 # Backend API
│   ├── prisma/             # Database schema
│   └── src/                # Source code
├── frontend/               # Next.js frontend
├── database/               # Database initialization
├── scripts/                # Utility scripts
├── docker-compose.yml      # Team database setup
├── env.local              # Local database config
├── env.team               # Team database config
└── TEAM_SETUP.md          # Detailed setup guide
```

## 🛠️ Available Commands

### Database Management
- `npm run team:start` - Start team virtual database
- `npm run team:stop` - Stop team virtual database
- `npm run team:status` - Check database status
- `npm run setup:team` - Setup team database
- `npm run setup:local` - Setup local database

### Data Synchronization
- `npm run sync:local-to-team` - Sync local → team
- `npm run sync:team-to-local` - Sync team → local

### Development
- `npm run dev:backend` - Start backend server
- `npm run dev:frontend` - Start frontend server

## 📚 Documentation

- **[TEAM_SETUP.md](TEAM_SETUP.md)** - Detailed team setup guide
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Docker installation guide
- **[config/database-config.md](config/database-config.md)** - Database configuration details

## 🔧 Troubleshooting

### Docker Issues
1. Install Docker Desktop
2. Ensure Docker is running
3. Check port 3307 is available

### Database Connection Issues
1. Verify environment files are correct
2. Check database is running
3. Verify credentials

### Port Conflicts
- Team database uses port 3308
- Local database uses port 3307
- Change ports in docker-compose.yml if needed

## 👥 Team Collaboration

### For Team Members:
1. Clone the repository
2. Install dependencies
3. Start team database: `npm run team:start`
4. Configure for team: `cd backend && npm run db:team`
5. Start development: `npm run dev:backend`

### Data Sharing:
- Use `npm run sync:local-to-team` to share your local data
- Use `npm run sync:team-to-local` to get team updates
- Always backup before syncing

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify Docker is running
3. Check database logs: `docker compose logs db`
4. Ensure no port conflicts
