import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLivePrices } from '../hooks/useLivePrices';
import { subscriptionAPI } from '../api/api';
import './StockSelector.css';

const SUPPORTED_STOCKS = [
  { ticker: 'GOOG', name: 'Google (Alphabet)', logo: '/google.png' },
  { ticker: 'TSLA', name: 'Tesla', logo: '/brand.png' },
  { ticker: 'AMZN', name: 'Amazon', logo: '/social.png' },
  { ticker: 'META', name: 'Meta (Facebook)', logo: '/meta.png' },
  { ticker: 'NVDA', name: 'NVIDIA', logo: '/nvidia.svg' },
];

const StockSelector = () => {
  const { subscriptions, updateSubscriptions } = useUser();
  const { subscribe: socketSubscribe, unsubscribe: socketUnsubscribe } = useLivePrices(subscriptions);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');

  const handleSubscribe = async (ticker) => {
    // Set loading state for this specific ticker
    setLoading(prev => ({ ...prev, [ticker]: true }));
    setError('');

    try {
      // Call API to subscribe
      const response = await subscriptionAPI.subscribe(ticker);
      
      // CRITICAL: Update React state immediately - this triggers re-render
      updateSubscriptions(response.data.subscriptions);
      
      // Start receiving Socket.IO updates for this ticker
      socketSubscribe(ticker);
      
      // Clear loading state immediately after success
      setLoading(prev => ({ ...prev, [ticker]: false }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe');
      setLoading(prev => ({ ...prev, [ticker]: false }));
    }
  };

  const handleUnsubscribe = async (ticker) => {
    // Set loading state for this specific ticker
    setLoading(prev => ({ ...prev, [ticker]: true }));
    setError('');

    try {
      // Call API to unsubscribe
      const response = await subscriptionAPI.unsubscribe(ticker);
      
      // CRITICAL: Update React state immediately - removes stock from UI
      updateSubscriptions(response.data.subscriptions);
      
      // Stop receiving Socket.IO updates for this ticker
      socketUnsubscribe(ticker);
      
      // Clear loading state immediately after success
      setLoading(prev => ({ ...prev, [ticker]: false }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unsubscribe');
      setLoading(prev => ({ ...prev, [ticker]: false }));
    }
  };

  return (
    <div className="stock-selector">
      <h2>Available Stocks</h2>
      {error && <div className="selector-error">{error}</div>}
      
      <div className="stocks-list">
        {SUPPORTED_STOCKS.map(stock => {
          const isSubscribed = subscriptions.includes(stock.ticker);
          const isLoading = loading[stock.ticker];

          return (
            <div key={stock.ticker} className="stock-item">
              <div className="stock-info">
                {stock.logo && <img src={stock.logo} alt={stock.ticker} className="stock-selector-logo" />}
                <div className="stock-details">
                  <div className="stock-ticker">{stock.ticker}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
              </div>
              <button
                className={`btn-subscribe ${isSubscribed ? 'subscribed' : ''}`}
                onClick={() => isSubscribed ? handleUnsubscribe(stock.ticker) : handleSubscribe(stock.ticker)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockSelector;
