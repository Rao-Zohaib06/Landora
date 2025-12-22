# MongoDB Atlas Setup Guide

## Quick Fix for IP Whitelist Error

If you're getting the error: "Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."

### Solution 1: Allow Access from Anywhere (Quick - For Development Only)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster (or create one if you don't have one)
4. Click on **"Network Access"** in the left sidebar
5. Click **"Add IP Address"**
6. Click **"Allow Access from Anywhere"** (this sets IP to `0.0.0.0/0`)
7. Click **"Confirm"**
8. **Wait 2-3 minutes** for the changes to propagate

⚠️ **Security Note:** This allows access from any IP address. Only use this for development/testing. For production, add specific IP addresses.

### Solution 2: Add Your Current IP Address (More Secure)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster → **"Network Access"**
3. Click **"Add IP Address"**
4. Click **"Add Current IP Address"** (or manually enter your IP)
5. Add a comment (optional, e.g., "Home Network")
6. Click **"Confirm"**
7. **Wait 2-3 minutes** for changes to take effect

### Solution 3: Check Your Connection String

Make sure your `.env` file has the correct MongoDB URI format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/landora?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your MongoDB username
- Replace `password` with your MongoDB password (URL-encoded if it contains special characters)
- Replace `cluster` with your cluster name
- The database name (`landora`) is optional - MongoDB will create it if it doesn't exist

### Getting Your Connection String from Atlas

1. Go to MongoDB Atlas → Your Cluster
2. Click **"Connect"**
3. Select **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `landora` (or your preferred database name)
7. Paste it into your `.env` file as `MONGODB_URI`

## Creating a MongoDB Atlas Account (If You Don't Have One)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a free **M0** cluster (Free tier)
4. Create a database user:
   - Go to **"Database Access"**
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication
   - Enter username and password
   - Set privileges to **"Atlas admin"** (or read/write for specific database)
   - Click **"Add User"**
5. Configure Network Access (see Solution 1 or 2 above)
6. Get your connection string (see "Getting Your Connection String" above)

## Local MongoDB (Alternative)

If you prefer to use local MongoDB instead of Atlas:

1. Install MongoDB locally: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/landora
   ```
3. Start MongoDB service
4. Run `npm start` in the backend directory

## Testing Your Connection

After updating your IP whitelist:

1. Wait 2-3 minutes for changes to propagate
2. Run `npm start` in the backend directory
3. You should see: `✅ MongoDB Connected: ...`
4. If errors persist, check:
   - Connection string format
   - Username/password are correct
   - IP whitelist is updated
   - Network connectivity

## Common Issues

### Issue: "Authentication failed"
- **Solution:** Check your database username and password in the connection string

### Issue: "ENOTFOUND" or "getaddrinfo"
- **Solution:** Check your cluster URL in the connection string

### Issue: "Invalid connection string"
- **Solution:** Make sure the connection string starts with `mongodb://` or `mongodb+srv://`

### Issue: "Timeout"
- **Solution:** Check your internet connection and firewall settings

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Connection String Guide: https://docs.mongodb.com/manual/reference/connection-string/

