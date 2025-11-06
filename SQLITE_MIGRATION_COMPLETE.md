# ✅ SQLite Migration Complete!

## What Changed

The database has been successfully migrated from **MongoDB** to **SQLite**!

### Why SQLite?

- ✅ **No installation required** - Just works out of the box
- ✅ **File-based** - Database stored in `/data/database.sqlite`
- ✅ **Zero configuration** - No connection strings or servers needed
- ✅ **Perfect for single-admin systems** - Ideal for this use case
- ✅ **Fast and reliable** - Production-ready database

## Changes Made

### 1. New Database Layer (`lib/database.ts`)
- Created SQLite database utility with better-sqlite3
- Automatic table creation on first run
- Query functions for all operations:
  - `adminUserQueries` - Admin authentication
  - `contentQueries` - Website content management
  - `visitQueries` - Analytics tracking

### 2. Updated API Routes
All API routes now use SQLite instead of MongoDB:
- ✅ `app/api/admin/init/route.ts` - Admin initialization
- ✅ `app/api/auth/[...nextauth]/route.ts` - Authentication
- ✅ `app/api/content/route.ts` - Content management
- ✅ `app/api/analytics/track/route.ts` - Visit tracking
- ✅ `app/api/analytics/stats/route.ts` - Analytics stats

### 3. Database Schema

**admin_users table:**
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**website_content table:**
```sql
CREATE TABLE website_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  layout_type TEXT NOT NULL DEFAULT 'classic',
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**page_visits table:**
```sql
CREATE TABLE page_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Environment Variables
Updated `.env.local`:
- ❌ Removed `MONGODB_URI`
- ✅ SQLite database auto-created in `/data/database.sqlite`

### 5. Dependencies
- ✅ Installed `better-sqlite3` - Fast, synchronous SQLite3 library
- ✅ Installed `@types/better-sqlite3` - TypeScript types

## How to Use

### 1. Admin User Already Created! ✅

The admin user has been initialized automatically:
- **Email**: `admin@aromacoffee.com`
- **Password**: `admin123`

### 2. Login to Dashboard

1. Go to: **http://localhost:3000/admin/login**
2. Enter credentials:
   - Email: `admin@aromacoffee.com`
   - Password: `admin123`
3. Click "Sign In"

### 3. Database Location

The SQLite database is stored at:
```
/home/cosmin/Desktop/website biserica/website-biserica/data/database.sqlite
```

This file is automatically created on first run and contains:
- Admin user credentials
- Website content
- Analytics data

## Advantages Over MongoDB

| Feature | MongoDB | SQLite |
|---------|---------|--------|
| Installation | Required | None |
| Configuration | Connection string | None |
| Server | Must be running | File-based |
| Setup Time | 10-15 minutes | Instant |
| Dependencies | Multiple packages | One package |
| Complexity | High | Low |
| Perfect for | Large scale | Single admin |

## Database Operations

### View Database Contents

You can inspect the database using any SQLite browser or command line:

```bash
# Install sqlite3 (if not installed)
sudo apt-get install sqlite3

# Open database
sqlite3 data/database.sqlite

# View tables
.tables

# View admin users
SELECT * FROM admin_users;

# View content
SELECT * FROM website_content;

# View recent visits
SELECT * FROM page_visits ORDER BY timestamp DESC LIMIT 10;

# Exit
.quit
```

### Backup Database

Simply copy the file:
```bash
cp data/database.sqlite data/database-backup-$(date +%Y%m%d).sqlite
```

### Reset Database

Delete the file and restart the server:
```bash
rm data/database.sqlite
# Server will recreate it automatically
```

## What Works Now

✅ **Admin Login** - Working with SQLite
✅ **Page Builder** - Save/load content from SQLite
✅ **Analytics** - Track visits in SQLite
✅ **Content Management** - All CRUD operations
✅ **Session Management** - JWT sessions with NextAuth
✅ **Password Security** - bcrypt hashing

## Testing

Try logging in now:

1. **Open**: http://localhost:3000/admin/login
2. **Login with**:
   - Email: `admin@aromacoffee.com`
   - Password: `admin123`
3. **You should see**: Admin Dashboard with Page Builder and Analytics tabs

## Files Modified

- `lib/database.ts` - NEW: SQLite database layer
- `app/api/admin/init/route.ts` - Updated to use SQLite
- `app/api/auth/[...nextauth]/route.ts` - Updated to use SQLite
- `app/api/content/route.ts` - Updated to use SQLite
- `app/api/analytics/track/route.ts` - Updated to use SQLite
- `app/api/analytics/stats/route.ts` - Updated to use SQLite
- `.env.local` - Removed MongoDB URI
- `.gitignore` - Added `/data` and `*.sqlite` files

## Old MongoDB Files (Can be deleted)

These files are no longer used:
- `lib/mongodb.ts` - Old MongoDB connection
- `lib/models.ts` - Old MongoDB models

You can keep them for reference or delete them.

## Production Deployment

For production, just deploy the entire project including the `/data` folder:

1. ✅ Database file will be included
2. ✅ No external database service needed
3. ✅ Automatic backups recommended (copy the .sqlite file)
4. ✅ Consider read-only replicas for high traffic

## Troubleshooting

### "Database is locked" error
- SQLite is single-writer
- Usually resolves automatically
- Restart server if persistent

### Database file not found
- Server creates it automatically on first run
- Check `/data` directory exists
- Check file permissions

### Admin login not working
- Verify admin user exists: `sqlite3 data/database.sqlite "SELECT * FROM admin_users;"`
- Re-initialize if needed: `curl -X POST http://localhost:3000/api/admin/init`

## Success! 🎉

Your coffee shop website now uses **SQLite** - a simple, fast, file-based database with zero configuration!

**Next steps:**
1. Login to the admin dashboard
2. Start customizing your website
3. All changes are automatically saved to SQLite

No MongoDB installation needed! 🚀

