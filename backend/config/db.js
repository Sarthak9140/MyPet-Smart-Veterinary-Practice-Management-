const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mypet';
    console.log(`[Database] Attempting connection to ${mongoUri}...`);
    
    // Try connecting with a short timeout to fall back to memory server if local MongoDB service is not running
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[Database] Connected to MongoDB Host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB (${err.message}). Launching MongoDB Memory Server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to MongoMemoryServer: ${memoryUri}`);
      
      // Auto-seed memory database for immediate demo experience
      const { seedDemoData } = require('../utils/seedData');
      await seedDemoData();
      
      return conn;
    } catch (memErr) {
      console.error('[Database] Failed to start MongoDB Memory Server:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
