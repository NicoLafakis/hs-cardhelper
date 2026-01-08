# CardHelper Diagnostics Guide

> **Run these checks at the START of every work session to ensure a healthy development environment.**

---

## 🚦 Quick Health Check (2 minutes)

Run these commands in order:

```bash
# 1. Check Node/npm versions
node --version    # Should be 18.x or 20.x
npm --version     # Should be 9.x or 10.x

# 2. Verify dependencies are installed
npm ls --depth=0 2>&1 | head -20

# 3. Test database connection
node server/test-db-connection.js

# 4. Check migration status
npm run migrate:status

# 5. Start backend (watch for errors)
npm run server
# In another terminal:
npm run dev
```

---

## 🔍 Environment Validation

### Required Environment Variables
Check `.env` file contains all required variables:

```bash
# Required (server will fail without these)
JWT_SECRET=<at least 32 characters>
ENCRYPTION_KEY=<at least 32 characters>
DB_HOST=localhost
DB_USER=<your_mysql_user>
DB_PASS=<your_mysql_password>
DB_NAME=cardhelper

# Optional (for AI features)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Validation Script
```javascript
// Quick validation (run in Node REPL or create temp file)
const required = ['JWT_SECRET', 'ENCRYPTION_KEY', 'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
require('dotenv').config();
required.forEach(key => {
  console.log(`${key}: ${process.env[key] ? '✓ Set' : '✗ MISSING'}`);
});
```

---

## 🗄️ Database Diagnostics

### Check Connection
```bash
node server/test-db-connection.js
```

### Verify Tables Exist
```sql
-- Connect to MySQL and run:
USE cardhelper;
SHOW TABLES;

-- Expected tables (7 core + feature tables):
-- users, templates, api_keys, refresh_tokens,
-- feature_flags, analytics_*, data_bindings, etc.
```

### Check Migration Status
```bash
npm run migrate:status
# Should show all migrations as "executed"
```

### Force Re-run Migrations (if needed)
```bash
# Only if migrations are stuck/corrupted
mysql -u root -p -e "DELETE FROM cardhelper.migrations WHERE name LIKE '007%';"
npm run migrate
```

---

## 🌐 API Health Checks

### Backend Health Endpoint
```bash
curl http://localhost:3020/api/health
# Expected: {"status":"ok","message":"CardHelper API is running"}
```

### Frontend Proxy Test
```bash
# With both servers running, frontend should proxy to backend
curl http://localhost:5173/api/health
# Should return same response as above
```

### WebSocket Connection Test
Open browser console on running app:
```javascript
// Check if Socket.IO is connected
console.log('Socket connected:', window.__SOCKET__?.connected || 'Not initialized');
```

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot connect to database"
```bash
# 1. Check MySQL is running
# Windows:
Get-Service mysql*
# Or check MySQL Workbench / XAMPP

# 2. Verify credentials
mysql -u cardhelper_user -p -e "SELECT 1"

# 3. Check DB exists
mysql -u root -p -e "SHOW DATABASES LIKE 'cardhelper'"
```

### Issue: "EADDRINUSE port 3020"
```bash
# Find and kill process on port
# Windows PowerShell:
netstat -ano | findstr :3020
taskkill /PID <PID> /F

# Or change port in .env:
PORT=3021
```

### Issue: "Migration failed"
```bash
# Check which migration failed
npm run migrate:status

# View migration error details
npm run migrate 2>&1 | tail -50

# Manual fix: mark migration as run (if you fixed DB manually)
mysql -u root -p cardhelper -e "INSERT INTO migrations (name) VALUES ('007_bulk_operations.js')"
```

### Issue: "JWT/Auth errors"
```bash
# Clear browser localStorage
# Or run in browser console:
localStorage.clear()
location.reload()
```

### Issue: "Vite proxy not working"
```bash
# Ensure backend is running FIRST
npm run server
# THEN start frontend
npm run dev

# Check vite.config.js proxy settings point to correct port
```

---

## 📊 Performance Baseline

### Expected Startup Times
| Component | Cold Start | Warm Start |
|-----------|------------|------------|
| Backend (server.js) | 2-4 sec | 1-2 sec |
| Frontend (Vite) | 3-5 sec | <1 sec |
| Database connection | <500ms | <100ms |

### Memory Usage (Normal)
| Process | Expected RAM |
|---------|-------------|
| Node (backend) | 80-150 MB |
| Vite dev server | 100-200 MB |
| Browser tab | 150-300 MB |

---

## 🧪 Quick Functional Tests

### Test Auth Flow
1. Open `http://localhost:5173`
2. Should redirect to `/login`
3. Create account or login
4. Should redirect to `/dashboard`

### Test Builder
1. Navigate to `/dashboard`
2. Create new card or open existing
3. Drag component from palette
4. Verify component appears on canvas
5. Select component, check PropertyPanel updates

### Test Preview
1. In builder, switch to Preview mode
2. Mock data should populate
3. Switch between device sizes

---

## 📝 Diagnostic Log Template

Use this template to document issues:

```markdown
## Diagnostic Report - [DATE]

### Environment
- Node: [version]
- npm: [version]  
- OS: [Windows/Mac/Linux]
- Branch: [git branch]

### Checks Performed
- [ ] Node/npm versions verified
- [ ] .env variables present
- [ ] Database connection successful
- [ ] Migrations up to date
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] API health check passes

### Issues Found
1. [Issue description]
   - Error message: `...`
   - Resolution: [what fixed it]

### Notes
[Any observations or warnings]
```

---

*Run diagnostics at the start of every session. Report persistent issues in the project issue tracker.*
