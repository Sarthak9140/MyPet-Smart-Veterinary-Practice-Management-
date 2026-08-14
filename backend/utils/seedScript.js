require('dotenv').config();
const mongoose = require('mongoose');
const { seedDemoData } = require('./seedData');

const run = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mypet';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for seeding...');
  await seedDemoData();
  console.log('Seed completed!');
  process.exit(0);
};

run().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
