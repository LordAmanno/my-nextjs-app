# Admin Dashboard Setup Guide

## Overview

This coffee shop website now includes a powerful admin dashboard with:
- **Page Builder**: Live preview with real-time editing
- **5 Layout Templates**: Classic, Modern, Minimal, Elegant, Bold
- **Content Management**: Edit all text, images, and settings
- **Analytics Dashboard**: Track visitors, page views, and device types
- **Secure Authentication**: MongoDB-backed admin login

## Prerequisites

1. **MongoDB** - You need a MongoDB instance running
   - Local: Install MongoDB Community Edition
   - Cloud: Use MongoDB Atlas (free tier available)

## Setup Instructions

### 1. Install MongoDB (if not already installed)

**Option A: Local MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env.local` with your connection string

### 2. Configure Environment Variables

The `.env.local` file has been created with default values:

```env
MONGODB_URI=mongodb://localhost:27017/coffee-shop-cms
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@aromacoffee.com
ADMIN_PASSWORD=admin123
```

**Important**: Change `NEXTAUTH_SECRET` to a random string in production!

### 3. Initialize the Admin User

After starting the development server, initialize the admin user:

```bash
curl -X POST http://localhost:3000/api/admin/init
```

This creates the admin account with credentials from `.env.local`.

### 4. Access the Admin Dashboard

1. Navigate to: http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@aromacoffee.com`
   - Password: `admin123`

## Admin Dashboard Features

### Page Builder Section

1. **Layout Selector**
   - Choose from 5 pre-designed templates
   - Each template has a unique style and feel
   - Changes apply instantly to the preview

2. **Content Editor**
   - Edit Hero section (title, subtitle, description, images)
   - Modify About section
   - Update Contact information
   - Manage Menu items
   - Edit Gallery images
   - Update Testimonials

3. **Live Preview**
   - Real-time preview of your changes
   - Zoom controls (50%, 75%, 100%)
   - Open in new tab to see full site

4. **Save Changes**
   - Click "Save Changes" button in header
   - All changes are stored in MongoDB
   - Changes reflect immediately on the live website

### Analytics Section

Track your website performance:

- **Total Views**: Last 30 days
- **Unique Visitors**: Distinct sessions
- **Today's Views**: Current day statistics
- **Daily Views Chart**: Last 7 days trend
- **Device Types**: Desktop, Mobile, Tablet breakdown
- **Top Pages**: Most visited pages

## Database Collections

The system uses 4 MongoDB collections:

1. **admin_users**: Admin authentication
2. **website_content**: All website content and settings
3. **page_visits**: Individual page view records
4. **analytics**: Aggregated analytics data

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Protected API routes
- ✅ Session expiration (24 hours)
- ✅ Secure authentication flow

## Changing Admin Password

To change the admin password:

1. Update `ADMIN_PASSWORD` in `.env.local`
2. Delete the existing admin user from MongoDB:
   ```bash
   mongosh coffee-shop-cms
   db.admin_users.deleteMany({})
   exit
   ```
3. Re-initialize the admin user:
   ```bash
   curl -X POST http://localhost:3000/api/admin/init
   ```

## Troubleshooting

### MongoDB Connection Issues

If you see "Failed to connect to MongoDB":
1. Ensure MongoDB is running: `sudo systemctl status mongodb`
2. Check the connection string in `.env.local`
3. Verify MongoDB is accessible on port 27017

### Admin Login Not Working

1. Verify admin user exists in database
2. Check browser console for errors
3. Ensure `.env.local` is loaded correctly
4. Try re-initializing the admin user

### Changes Not Saving

1. Check browser console for API errors
2. Verify MongoDB connection
3. Ensure you're logged in (session not expired)
4. Check server logs for errors

## Production Deployment

Before deploying to production:

1. ✅ Change `NEXTAUTH_SECRET` to a strong random string
2. ✅ Update `ADMIN_PASSWORD` to a secure password
3. ✅ Use a production MongoDB instance (MongoDB Atlas recommended)
4. ✅ Enable HTTPS
5. ✅ Set proper CORS policies
6. ✅ Configure environment variables on your hosting platform

## API Endpoints

- `POST /api/admin/init` - Initialize admin user
- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/content` - Fetch website content
- `POST /api/content` - Update website content (auth required)
- `POST /api/analytics/track` - Track page view
- `GET /api/analytics/stats` - Get analytics data (auth required)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs: `npm run dev`
3. Check MongoDB logs
4. Verify all environment variables are set correctly

