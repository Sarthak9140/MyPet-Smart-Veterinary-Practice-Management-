const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log(`[Database] Connecting to MongoDB...`);
      cachedConnection = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[Database] Connected to MongoDB Host: ${cachedConnection.connection.host}`);
      return cachedConnection;
    } catch (err) {
      console.error(`[Database] MongoDB Connection Error: ${err.message}`);
      if (process.env.VERCEL) {
        throw err;
      }
    }
  }

  // Fallback to MongoMemoryServer for local development only if NOT on Vercel
  if (!process.env.VERCEL) {
    try {
      console.warn(`[Database] MONGO_URI not found or primary connection failed. Launching MongoMemoryServer for local dev...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      cachedConnection = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to MongoMemoryServer: ${memoryUri}`);

      // Auto-seed memory database for immediate demo experience
      const { seedDemoData } = require('../utils/seedData');
      await seedDemoData();

      return cachedConnection;
    } catch (memErr) {
      console.error('[Database] Failed to start MongoDB Memory Server:', memErr.message);
      throw memErr;
    }
  } else {
    throw new Error('MONGO_URI environment variable is missing on Vercel deployment.');
  }
};

module.exports = connectDB;
