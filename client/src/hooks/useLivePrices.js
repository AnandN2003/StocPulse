import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useLivePrices = (subscriptions) => {
  const [prices, setPrices] = useState({});
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const prevSubscriptionsRef = useRef([]);

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

    socket.on('initial-prices', (initialPrices) => {
      console.log('📊 Initial prices received:', initialPrices);
      setPrices(initialPrices);
    });

    // CRITICAL: This updates the UI in real-time every second
    socket.on('price-update', ({ ticker, price, timestamp }) => {
      setPrices(prev => ({
        ...prev,
        [ticker]: price
      }));
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

  // EFFECT 2: Auto-subscribe to new stocks when subscriptions change
  useEffect(() => {
    if (!socketRef.current || !connected) return;

    // Find newly added subscriptions
    const newSubscriptions = subscriptions.filter(
      ticker => !prevSubscriptionsRef.current.includes(ticker)
    );

    // Find removed subscriptions
    const removedSubscriptions = prevSubscriptionsRef.current.filter(
      ticker => !subscriptions.includes(ticker)
    );

    // Auto-subscribe to new stocks
    newSubscriptions.forEach(ticker => {
      console.log('🔔 Auto-subscribing to:', ticker);
      socketRef.current.emit('subscribe', ticker);
    });

    // Clean up prices for removed stocks
    if (removedSubscriptions.length > 0) {
      setPrices(prev => {
        const newPrices = { ...prev };
        removedSubscriptions.forEach(ticker => {
          delete newPrices[ticker];
        });
        return newPrices;
      });
    }

    // Update reference to current subscriptions
    prevSubscriptionsRef.current = subscriptions;
  }, [subscriptions, connected]);

  const subscribe = useCallback((ticker) => {
    // Manual subscription (called from StockSelector)
    if (socketRef.current && socketRef.current.connected) {
      console.log('🔔 Manually subscribing to:', ticker);
      socketRef.current.emit('subscribe', ticker);
    } else {
      console.warn('⚠️ Cannot subscribe - socket not connected');
    }
  }, []);

  const unsubscribe = useCallback((ticker) => {
    // Manual unsubscription (called from StockSelector)
    if (socketRef.current && socketRef.current.connected) {
      console.log('🔕 Manually unsubscribing from:', ticker);
      socketRef.current.emit('unsubscribe', ticker);
      
      // Immediately remove price from state
      setPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[ticker];
        return newPrices;
      });
    }
  }, []);

  return {
    prices,
    connected,
    subscribe,
    unsubscribe,
  };
};
