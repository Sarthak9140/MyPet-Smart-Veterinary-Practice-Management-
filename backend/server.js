require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { startReminderCron } = require('./jobs/reminderCron');
const { seedDemoData } = require('./utils/seedData');

// Route imports
const authRoutes = require('./routes/authRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes = require('./routes/petRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const productRoutes = require('./routes/productRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Enable CORS for all origins in serverless / production
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Database connection middleware for serverless requests
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database Connection Error: ' + err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Database seed endpoint
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDemoData();
    res.json({ success: true, message: 'Demo data seeded successfully' });
  } catch (err) {
    next(err);
  }
});

// Root API status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MyPet Backend API',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use(errorHandler);

// Standalone server mode (Local development)
if (!process.env.VERCEL && require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] MyPet Backend API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      startReminderCron();
    });
  }).catch(err => {
    console.error('[Server] Failed to initialize server:', err);
  });
}

module.exports = app;
