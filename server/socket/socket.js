const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Stock price simulation
const SUPPORTED_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];

// Initial prices (simulated)
const stockPrices = {
  GOOG: 142.50,
  TSLA: 238.75,
  AMZN: 151.30,
  META: 352.20,
  NVDA: 495.80
};

// Generate random price change
const generatePriceChange = (currentPrice) => {
  const changePercent = (Math.random() - 0.5) * 0.02; // ±1% max change
  const change = currentPrice * changePercent;
  return +(currentPrice + change).toFixed(2);
};

// Socket.IO authentication middleware
const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.userEmail = user.email;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

const initializeSocket = (io) => {
  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userEmail} (${socket.id})`);

    // Get user's subscriptions from database
    try {
      const user = await User.findById(socket.userId);
      const subscriptions = user.subscriptions || [];

      // Join rooms for each subscribed stock
      subscriptions.forEach(ticker => {
        socket.join(ticker);
        console.log(`${socket.userEmail} joined room: ${ticker}`);
      });

      // Send initial prices for subscribed stocks
      const initialPrices = {};
      subscriptions.forEach(ticker => {
        initialPrices[ticker] = stockPrices[ticker];
      });
      socket.emit('initial-prices', initialPrices);

    } catch (error) {
      console.error('Error loading user subscriptions:', error);
    }

    // Handle subscribe event
    socket.on('subscribe', async (ticker) => {
      try {
        if (!SUPPORTED_STOCKS.includes(ticker)) {
          socket.emit('error', { message: 'Invalid ticker' });
          return;
        }

        // Update database
        const user = await User.findById(socket.userId);
        if (!user.subscriptions.includes(ticker)) {
          user.subscriptions.push(ticker);
          await user.save();
        }

        // Join room
        socket.join(ticker);
        console.log(`${socket.userEmail} subscribed to ${ticker}`);

        // Send current price
        socket.emit('price-update', { 
          ticker, 
          price: stockPrices[ticker],
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Subscribe error:', error);
        socket.emit('error', { message: 'Failed to subscribe' });
      }
    });

    // Handle unsubscribe event
    socket.on('unsubscribe', async (ticker) => {
      try {
        if (!SUPPORTED_STOCKS.includes(ticker)) {
          socket.emit('error', { message: 'Invalid ticker' });
          return;
        }

        // Update database
        const user = await User.findById(socket.userId);
        user.subscriptions = user.subscriptions.filter(s => s !== ticker);
        await user.save();

        // Leave room
        socket.leave(ticker);
        console.log(`${socket.userEmail} unsubscribed from ${ticker}`);

      } catch (error) {
        console.error('Unsubscribe error:', error);
        socket.emit('error', { message: 'Failed to unsubscribe' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userEmail} (${socket.id})`);
    });
  });

  // Price update broadcast every second
  setInterval(() => {
    SUPPORTED_STOCKS.forEach(ticker => {
      // Update price
      stockPrices[ticker] = generatePriceChange(stockPrices[ticker]);

      // Broadcast to all users in the ticker room
      io.to(ticker).emit('price-update', {
        ticker,
        price: stockPrices[ticker],
        timestamp: new Date().toISOString()
      });
    });
  }, 1000);
};

module.exports = initializeSocket;
