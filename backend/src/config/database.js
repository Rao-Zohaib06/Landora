import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in environment variables');
      console.error('Please set MONGODB_URI in your .env file');
      process.exit(1);
    }

    const connectionOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      
      // Provide helpful error messages
      if (err.message.includes('IP')) {
        console.error('\n💡 IP Whitelist Error:');
        console.error('   Your IP address is not whitelisted in MongoDB Atlas.');
        console.error('   Steps to fix:');
        console.error('   1. Go to https://cloud.mongodb.com/');
        console.error('   2. Select your cluster → Network Access');
        console.error('   3. Click "Add IP Address"');
        console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
        console.error('      OR add your current IP address\n');
      } else if (err.message.includes('authentication')) {
        console.error('\n💡 Authentication Error:');
        console.error('   Check your MongoDB username and password in MONGODB_URI\n');
      } else if (err.message.includes('ENOTFOUND')) {
        console.error('\n💡 DNS Error:');
        console.error('   Check your MongoDB connection string format\n');
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide helpful error messages based on error type
    if (error.message.includes('IP')) {
      console.error('\n💡 IP Whitelist Error:');
      console.error('   Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('   Steps to fix:');
      console.error('   1. Go to https://cloud.mongodb.com/');
      console.error('   2. Select your cluster → Network Access');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
      console.error('      OR add your current IP address');
      console.error('   5. Wait a few minutes for changes to take effect\n');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication Error:');
      console.error('   Check your MongoDB username and password in MONGODB_URI');
      console.error('   Make sure your connection string includes correct credentials\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 DNS/Connection Error:');
      console.error('   Check your MongoDB connection string format');
      console.error('   Format: mongodb+srv://username:password@cluster.mongodb.net/database\n');
    } else if (!process.env.MONGODB_URI) {
      console.error('\n💡 Missing Environment Variable:');
      console.error('   MONGODB_URI is not set. Please add it to your .env file\n');
    }
    
    console.error('❌ Cannot start server without database connection');
    process.exit(1);
  }
};

