const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const SUPPORTED_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];

// Get user subscriptions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('subscriptions');
    res.json({ subscriptions: user.subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to a stock
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { ticker } = req.body;

    if (!ticker || !SUPPORTED_STOCKS.includes(ticker)) {
      return res.status(400).json({ 
        message: 'Invalid ticker. Supported: ' + SUPPORTED_STOCKS.join(', ') 
      });
    }

    const user = await User.findById(req.userId);

    if (user.subscriptions.includes(ticker)) {
      return res.status(400).json({ message: 'Already subscribed to ' + ticker });
    }

    user.subscriptions.push(ticker);
    await user.save();

    res.json({ 
      message: 'Subscribed successfully',
      subscriptions: user.subscriptions 
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe from a stock
router.post('/unsubscribe', authMiddleware, async (req, res) => {
  try {
    const { ticker } = req.body;

    if (!ticker || !SUPPORTED_STOCKS.includes(ticker)) {
      return res.status(400).json({ 
        message: 'Invalid ticker. Supported: ' + SUPPORTED_STOCKS.join(', ') 
      });
    }

    const user = await User.findById(req.userId);

    if (!user.subscriptions.includes(ticker)) {
      return res.status(400).json({ message: 'Not subscribed to ' + ticker });
    }

    user.subscriptions = user.subscriptions.filter(s => s !== ticker);
    await user.save();

    res.json({ 
      message: 'Unsubscribed successfully',
      subscriptions: user.subscriptions 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
