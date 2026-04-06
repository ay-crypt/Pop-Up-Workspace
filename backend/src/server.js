const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const membershipRoutes = require('./routes/memberships');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pop-Up Workspace API is running' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/locations', locationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Pop-Up Workspace API listening on port ${PORT}`);
});

module.exports = app;
