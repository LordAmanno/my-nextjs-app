# 🚀 Quick Start - Admin Dashboard

## 3-Step Setup

### Step 1: Install MongoDB

**Option A - Local (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Option B - Local (macOS):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Option C - Cloud (Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env.local`

### Step 2: Initialize Admin User

```bash
curl -X POST http://localhost:3000/api/admin/init
```

Expected response:
```json
{"message":"Admin user created successfully"}
```

### Step 3: Login to Dashboard

1. Open: **http://localhost:3000/admin/login**
2. Enter credentials:
   - Email: `admin@aromacoffee.com`
   - Password: `admin123`
3. Click "Sign In"

## 🎨 Using the Dashboard

### Page Builder

1. **Choose Layout** → Select from 5 templates
2. **Edit Content** → Click section tabs and modify text/images
3. **Preview** → See changes in real-time
4. **Save** → Click "Save Changes" button

### Analytics

1. **View Stats** → Total views, visitors, today's traffic
2. **Check Trends** → Daily views for last 7 days
3. **Device Types** → Desktop/Mobile/Tablet breakdown
4. **Top Pages** → Most visited pages

## 📝 Default Credentials

```
Email: admin@aromacoffee.com
Password: admin123
```

**⚠️ Change these in production!**

## 🔧 Configuration File

All settings in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/coffee-shop-cms
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@aromacoffee.com
ADMIN_PASSWORD=admin123
```

## 🎯 Key URLs

- **Main Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 🆘 Troubleshooting

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list  # macOS
```

**Admin Login Not Working:**
```bash
# Re-initialize admin user
curl -X POST http://localhost:3000/api/admin/init
```

**Port Already in Use:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
# Restart dev server
npm run dev
```

## ✅ You're Ready!

Your admin dashboard is now set up and ready to use! 🎉

For detailed documentation, see:
- `ADMIN_SETUP.md` - Complete setup guide
- `ADMIN_DASHBOARD_COMPLETE.md` - Full feature documentation

