# Database Setup Guide

This guide will help you set up the MySQL database for the hs-cardhelper application.

## Prerequisites

- **MySQL 5.7+** or **MySQL 8.0+** installed and running
- Node.js and npm installed
- Environment variables configured (see below)

---

## Quick Start

### 1. Install MySQL

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows:**
- Download and install from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- Or use [XAMPP](https://www.apachefriends.org/) which includes MySQL

---

### 2. Create Database

Connect to MySQL as root:
```bash
mysql -u root -p
```

Create the database and user:
```sql
-- Create database
CREATE DATABASE cardhelper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_password' with a strong password)
CREATE USER 'cardhelper_user'@'localhost' IDENTIFIED BY 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON cardhelper.* TO 'cardhelper_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=cardhelper_user
DB_PASS=your_password
DB_NAME=cardhelper

# Security (generate strong random values)
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
ENCRYPTION_KEY=your_encryption_key_at_least_32_characters_long

# Server
PORT=3020
FRONTEND_URL=http://localhost:5173

# Optional: HubSpot Integration
# HUBSPOT_CLIENT_ID=your_hubspot_client_id
# HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret

# Optional: Anthropic AI
# ANTHROPIC_API_KEY=your_anthropic_api_key
```

**Generate secure secrets:**
```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 4. Run Database Migrations

The application uses a migration system to create and manage database tables.

**Check migration status:**
```bash
npm run migrate:status
```

**Run all pending migrations:**
```bash
npm run migrate
```

This will create the following tables:
- `migrations` - Tracks executed migrations
- `users` - User accounts
- `templates` - Card templates
- `api_keys` - Encrypted API keys for external services
- `refresh_tokens` - JWT refresh tokens
- `feature_flags` - Feature toggles per user
- `analytics_events` - Event tracking
- `component_usage` - Component usage analytics
- `performance_metrics` - Performance tracking
- `ab_test_results` - A/B test results
- `data_bindings` - Data binding configurations
- `binding_evaluation_cache` - Binding evaluation cache
- `binding_audit_log` - Binding audit log
- `components` - Component library
- `component_instances` - Component usage instances
- `component_usage_analytics` - Component analytics
- `component_marketplace` - Marketplace metadata
- `premium_templates` - Premium template definitions
- `template_instances` - Cloned templates
- `template_versions` - Template versioning
- `template_ratings` - User ratings

---

## Migrations

### Migration Structure

Migrations are stored in `server/migrations/` and follow this naming convention:
```
001_core_tables.js
002_feature_flags.js
003_analytics_tables.js
...
```

### Creating a New Migration

1. Create a new file in `server/migrations/` with the next number:
   ```javascript
   // server/migrations/007_my_new_feature.js

   /**
    * Migration 007: My New Feature
    * Description of what this migration does
    */

   export async function migrate(db) {
     try {
       console.log('    Creating my_new_table...')

       await db.execute(`
         CREATE TABLE IF NOT EXISTS my_new_table (
           id INT AUTO_INCREMENT PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
       `)

       console.log('    My new table created successfully')
     } catch (error) {
       console.error('    Failed to create my_new_table:', error.message)
       throw error
     }
   }

   export async function rollback(db) {
     try {
       console.log('    Rolling back my_new_table...')
       await db.execute('DROP TABLE IF EXISTS my_new_table')
       console.log('    My new table rolled back successfully')
     } catch (error) {
       console.error('    Failed to rollback my_new_table:', error.message)
       throw error
     }
   }
   ```

2. Run the migration:
   ```bash
   npm run migrate
   ```

---

## Starting the Application

Once the database is set up and migrations are run:

```bash
# Start the backend server
npm run server

# In another terminal, start the frontend
npm run dev
```

The application will automatically run migrations on startup if `initializeDatabase()` is called in `server.js`.

---

## Troubleshooting

### "Access denied for user" Error

**Problem:** Cannot connect to MySQL
**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `.env` file
3. Re-create user with proper permissions:
   ```sql
   DROP USER 'cardhelper_user'@'localhost';
   CREATE USER 'cardhelper_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON cardhelper.* TO 'cardhelper_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### "Unknown database 'cardhelper'" Error

**Problem:** Database doesn't exist
**Solution:**
```sql
CREATE DATABASE cardhelper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### "ER_NOT_SUPPORTED_AUTH_MODE" Error

**Problem:** MySQL 8.0 authentication issue
**Solution:**
```sql
ALTER USER 'cardhelper_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

---

### Migration Fails Midway

**Problem:** Migration error leaves database in inconsistent state
**Solution:**
1. Check which migrations have run:
   ```bash
   npm run migrate:status
   ```
2. Manually fix the database or drop tables from failed migration
3. Run migrations again:
   ```bash
   npm run migrate
   ```

---

### Reset Database (Development Only)

**⚠️ WARNING: This will delete all data!**

```sql
-- Connect to MySQL
mysql -u root -p

-- Drop and recreate database
DROP DATABASE IF EXISTS cardhelper;
CREATE DATABASE cardhelper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Exit MySQL
EXIT;
```

Then run migrations:
```bash
npm run migrate
```

---

## Production Deployment

For production deployments:

1. **Use environment-specific credentials**
   - Never commit `.env` to version control
   - Use secure password management

2. **Backup database regularly**
   ```bash
   mysqldump -u cardhelper_user -p cardhelper > backup.sql
   ```

3. **Monitor migrations**
   - Always test migrations in staging first
   - Keep migration logs
   - Have rollback plan ready

4. **Connection pooling**
   - The app uses connection pooling (10 connections by default)
   - Adjust `connectionLimit` in `server/utils/database.js` if needed

5. **Enable MySQL slow query log**
   - Monitor performance
   - Optimize slow queries

---

## Database Schema

To view the full database schema after migrations:

```bash
mysql -u cardhelper_user -p cardhelper -e "SHOW TABLES;"
```

To see table structure:
```bash
mysql -u cardhelper_user -p cardhelper -e "DESCRIBE users;"
```

---

## Support

If you encounter issues:
1. Check logs in terminal for specific error messages
2. Verify MySQL is running: `systemctl status mysql` (Linux) or `brew services list` (macOS)
3. Test database connection: `mysql -u cardhelper_user -p -h localhost cardhelper`
4. Review migration files in `server/migrations/`
5. Check `.env` configuration matches your MySQL setup

For more help, see the main [README.md](../README.md) or open an issue on GitHub.
