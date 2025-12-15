import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const ALL_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];

export const useLivePrices = () => {
  const [prices, setPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [connected, setConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const socketRef = useRef(null);

  const HISTORY_LENGTH = 20; // Keep last 20 price points

  // EFFECT 1: Establish Socket.IO connection (runs once or when token changes)
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // No token - disconnect if there's an existing socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
        setPrices({});
        setSubscriptions([]);
      }
      return;
    }

    // Disconnect existing socket if any (for token change scenario)
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    // Receive initial prices for ALL stocks
    socket.on('initial-prices', (initialPrices) => {
      console.log('📊 Initial prices received for all stocks:', initialPrices);
      setPrices(initialPrices);
      
      // Initialize price history for all stocks
      const initialHistory = {};
      Object.keys(initialPrices).forEach(ticker => {
        initialHistory[ticker] = [{ time: Date.now(), price: initialPrices[ticker] }];
      });
      console.log('📈 Price history initialized:', initialHistory);
      setPriceHistory(initialHistory);
    });

    // Receive user's subscriptions from server
    socket.on('user-subscriptions', (userSubscriptions) => {
      console.log('📋 User subscriptions:', userSubscriptions);
      setSubscriptions(userSubscriptions);
    });

    // Listen for subscription updates
    socket.on('subscription-updated', ({ subscriptions: newSubscriptions, action, ticker }) => {
      console.log(`✓ Subscription ${action}: ${ticker}`);
      setSubscriptions(newSubscriptions);
    });

    // CRITICAL: This updates the UI in real-time every second for ALL stocks
    socket.on('price-update', ({ ticker, price, timestamp }) => {
      console.log(`💹 Price update for ${ticker}:`, price);
      
      setPrices(prev => ({
        ...prev,
        [ticker]: price
      }));

      // Update price history with rolling window
      setPriceHistory(prev => {
        const currentHistory = prev[ticker] || [];
        const newHistory = [...currentHistory, { time: Date.now(), price }];
        
        // Keep only last HISTORY_LENGTH points
        if (newHistory.length > HISTORY_LENGTH) {
          newHistory.shift();
        }
        
        console.log(`📊 Updated history for ${ticker}:`, {
          length: newHistory.length,
          latest: newHistory[newHistory.length - 1]
        });
        
        return {
          ...prev,
          [ticker]: newHistory
        };
      });
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' && e.newValue !== token) {
        // Token changed - disconnect and let the effect re-run
        socket.disconnect();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      socket.disconnect();
    };
  }, []); // Keep empty deps - we handle token changes via storage event

  const subscribe = useCallback((ticker) => {
    // Subscribe via socket
    if (socketRef.current && socketRef.current.connected) {
      console.log('🔔 Subscribing to:', ticker);
      socketRef.current.emit('subscribe', ticker);
      return Promise.resolve();
    } else {
      console.warn('⚠️ Cannot subscribe - socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
  }, []);

  const unsubscribe = useCallback((ticker) => {
    // Unsubscribe via socket
    if (socketRef.current && socketRef.current.connected) {
      console.log('🔕 Unsubscribing from:', ticker);
      socketRef.current.emit('unsubscribe', ticker);
      return Promise.resolve();
    } else {
      console.warn('⚠️ Cannot unsubscribe - socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
  }, []);

  console.log('[useLivePrices] Returning state:', {
    pricesKeys: Object.keys(prices),
    priceHistoryKeys: Object.keys(priceHistory),
    subscriptions
  });

  return {
    prices,
    priceHistory,
    connected,
    subscriptions,
    subscribe,
    unsubscribe,
  };
};
