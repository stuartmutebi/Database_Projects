# Docker Setup for Team Database

## 🐳 Installing Docker Desktop

### Windows Installation:

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Download Docker Desktop for Windows

2. **Install Docker Desktop:**
   - Run the installer as Administrator
   - Follow the installation wizard
   - Restart your computer when prompted

3. **Start Docker Desktop:**
   - Launch Docker Desktop from Start Menu
   - Wait for Docker to start (you'll see a whale icon in system tray)

4. **Verify Installation:**
   ```bash
   docker --version
   docker compose version
   ```

## 🚀 Starting the Team Database

Once Docker is installed:

```bash
# Start the team database
docker compose up -d

# Check if it's running
docker compose ps

# View logs if needed
docker compose logs db
```

## 🔧 Alternative: Manual MySQL Setup

If you prefer not to use Docker, you can set up MySQL manually:

### Option 1: XAMPP/WAMP
1. Install XAMPP or WAMP
2. Start MySQL service
3. Create database `asset_mgr_team`
4. Update connection details in `env.team`

### Option 2: MySQL Workbench
1. Install MySQL Server
2. Create database `asset_mgr_team`
3. Create user `asset_user` with password `asset_pass`
4. Grant permissions to the user

## 📊 Database Connection Details

| Setting | Value |
|---------|-------|
| Host | localhost |
| Port | 3307 (Docker) / 3306 (Manual) |
| Database | asset_mgr_team |
| Username | asset_user |
| Password | asset_pass |

## 🛠️ Troubleshooting

### Docker Issues:
- **Docker not starting:** Check Windows features (WSL2, Hyper-V)
- **Port conflicts:** Change port in docker-compose.yml
- **Permission issues:** Run as Administrator

### Connection Issues:
- **Can't connect:** Check if MySQL is running
- **Wrong credentials:** Verify username/password
- **Port blocked:** Check firewall settings

## 📞 Getting Help

If you encounter issues:
1. Check Docker Desktop is running
2. Verify no port conflicts (3307)
3. Check Windows features are enabled
4. Restart Docker Desktop
5. Check the logs: `docker compose logs db`

