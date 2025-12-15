import React, { useState } from 'react';
import './StockModal.css';

const STOCK_INFO = {
  GOOG: { name: 'Google (Alphabet)', logo: '/google.png', color: '#4285F4', fullName: 'Alphabet Inc.' },
  TSLA: { name: 'Tesla', logo: '/brand.png', color: '#E82127', fullName: 'Tesla Inc.' },
  AMZN: { name: 'Amazon', logo: '/social.png', color: '#FF9900', fullName: 'Amazon.com Inc.' },
  META: { name: 'Meta (Facebook)', logo: '/meta.png', color: '#0668E1', fullName: 'Meta Platforms Inc.' },
  NVDA: { name: 'NVIDIA', logo: '/nvidia.svg', color: '#76B900', fullName: 'NVIDIA Corporation' },
};

const StockModal = ({ isOpen, onClose, ticker, price, isSubscribed, onSubscribe, onUnsubscribe }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !ticker) return null;

  const stockInfo = STOCK_INFO[ticker] || { name: ticker, logo: '/default.png', color: '#888', fullName: ticker };

  const handleAction = async () => {
    setLoading(true);
    setError('');

    try {
      if (isSubscribed) {
        await onUnsubscribe(ticker);
      } else {
        await onSubscribe(ticker);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-modal-overlay" onClick={onClose}>
      <div className="stock-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="stock-modal-close" onClick={onClose}>×</button>
        
        <div className="stock-modal-header">
          <img src={stockInfo.logo} alt={ticker} className="stock-modal-logo" />
          <div className="stock-modal-title">
            <h2>{ticker}</h2>
            <p>{stockInfo.fullName}</p>
          </div>
        </div>

        <div className="stock-modal-price">
          <div className="price-label">Current Price</div>
          <div className="price-value">
            {price !== undefined ? `$${price.toFixed(2)}` : 'Loading...'}
          </div>
          <div className="live-badge">
            <span className="live-dot-pulse"></span>
            Live Updates
          </div>
        </div>

        <div className="stock-modal-status">
          <div className={`subscription-badge ${isSubscribed ? 'subscribed' : 'not-subscribed'}`}>
            {isSubscribed ? '✓ Subscribed' : 'Not Subscribed'}
          </div>
        </div>

        {error && <div className="stock-modal-error">{error}</div>}

        <div className="stock-modal-actions">
          {isSubscribed ? (
            <button
              className="btn-modal-unsubscribe"
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Unsubscribe'}
            </button>
          ) : (
            <button
              className="btn-modal-subscribe"
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          )}
          <button
            className="btn-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        <div className="stock-modal-info">
          <p>
            {isSubscribed 
              ? `You're receiving real-time updates for ${ticker}. Unsubscribe to remove this stock from your subscriptions.`
              : `Subscribe to ${ticker} to add it to your personalized watchlist and track it easily.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockModal;
