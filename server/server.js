require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const initializeSocket = require('./socket/socket');

const app = express();
const server = http.createServer(app);

// CORS configuration
// In Docker, nginx proxies requests so we allow the configured origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
console.log(`CORS Origin configured: ${corsOrigin}`);
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    credentials: true
  }
});

initializeSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
