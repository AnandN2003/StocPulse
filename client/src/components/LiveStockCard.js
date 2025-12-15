import React, { useState, useEffect, useRef } from 'react';
import './LiveStockCard.css';

const STOCK_INFO = {
  GOOG: { name: 'Google', logo: '/google.png', color: '#4285F4' },
  TSLA: { name: 'Tesla', logo: '/brand.png', color: '#E82127' },
  AMZN: { name: 'Amazon', logo: '/social.png', color: '#FF9900' },
  META: { name: 'Meta', logo: '/meta.png', color: '#0668E1' },
  NVDA: { name: 'NVIDIA', logo: '/nvidia.svg', color: '#76B900' },
};

const LiveStockCard = ({ ticker, price, connected, onClick, isSubscribed }) => {
  const [priceChange, setPriceChange] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPriceRef = useRef(price);
  const [hasReceivedPrice, setHasReceivedPrice] = useState(false);

  const stockInfo = STOCK_INFO[ticker] || { name: ticker, logo: '/default.png', color: '#888' };

  useEffect(() => {
    if (price !== undefined && prevPriceRef.current !== undefined && price !== prevPriceRef.current) {
      const change = price - prevPriceRef.current;
      setPriceChange(change);
      setIsAnimating(true);
      setHasReceivedPrice(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      prevPriceRef.current = price;

      return () => clearTimeout(timer);
    } else if (price !== undefined) {
      prevPriceRef.current = price;
      setHasReceivedPrice(true);
    }
  }, [price]);

  const changePercent = priceChange && prevPriceRef.current 
    ? ((priceChange / (prevPriceRef.current - priceChange)) * 100).toFixed(2)
    : 0;

  return (
    <div 
      className={`stock-card ${isAnimating ? (priceChange > 0 ? 'price-up' : 'price-down') : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
    >
      <div className="stock-card-header">
        <div className="stock-title">
          <img src={stockInfo.logo} alt={ticker} className="stock-card-logo" />
          <div>
            <div className="stock-card-ticker">{ticker}</div>
            <div className="stock-card-name">{stockInfo.name}</div>
          </div>
        </div>
        <div className="stock-card-badges">
          {isSubscribed && (
            <div className="subscribed-indicator" title="Subscribed">
              ✓
            </div>
          )}
          {!connected && (
            <div className="disconnected-badge">⚠️</div>
          )}
        </div>
      </div>

      <div className="stock-price-section">
        {price !== undefined ? (
          <>
            <div className="current-price">
              ${price.toFixed(2)}
            </div>
            {priceChange !== null && priceChange !== 0 && (
              <div className={`price-change ${priceChange > 0 ? 'positive' : 'negative'}`}>
                <span className="change-arrow">
                  {priceChange > 0 ? '▲' : '▼'}
                </span>
                <span className="change-amount">
                  ${Math.abs(priceChange).toFixed(2)}
                </span>
                <span className="change-percent">
                  ({changePercent > 0 ? '+' : ''}{changePercent}%)
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="loading-price">
            <div className="loading-spinner"></div>
            <span>Connecting...</span>
          </div>
        )}
      </div>

      <div className="stock-card-footer">
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span>Live Updates</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStockCard;
