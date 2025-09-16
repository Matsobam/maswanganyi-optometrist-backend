const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const { Patient, Doctor, Appointment, Service, MedicalAid } = require('./models');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MySQL (XAMPP)
const connectDB = async () => {
  try {
    await testConnection();
    
    // Sync database (creates tables if they don't exist)
    // Use force: false and alter: false for production to avoid index issues
    await sequelize.sync({ force: false, alter: false });
    console.log('📋 Database tables synchronized');
    
    // Start reminder service (temporarily disabled)
    // const reminderService = require('./services/reminderService');
    // reminderService.start();
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
  }
};

connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

// Services route (simple implementation)
app.get('/api/services', async (req, res) => {
  try {
    const { Service } = require('./models');
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Maswanganyi Optometrist API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`👁️ Maswanganyi Optometrist API running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
