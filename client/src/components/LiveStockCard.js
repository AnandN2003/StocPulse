import React, { useState, useEffect, useRef } from 'react';
import './LiveStockCard.css';

const STOCK_INFO = {
  GOOG: { name: 'Google', icon: '🔍', color: '#4285F4' },
  TSLA: { name: 'Tesla', icon: '⚡', color: '#E82127' },
  AMZN: { name: 'Amazon', icon: '📦', color: '#FF9900' },
  META: { name: 'Meta', icon: '👥', color: '#0668E1' },
  NVDA: { name: 'NVIDIA', icon: '🎮', color: '#76B900' },
};

const LiveStockCard = ({ ticker, price, connected }) => {
  const [priceChange, setPriceChange] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPriceRef = useRef(price);
  const [hasReceivedPrice, setHasReceivedPrice] = useState(false);

  const stockInfo = STOCK_INFO[ticker] || { name: ticker, icon: '📊', color: '#888' };

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
    <div className={`stock-card ${isAnimating ? (priceChange > 0 ? 'price-up' : 'price-down') : ''}`}>
      <div className="stock-card-header">
        <div className="stock-title">
          <span className="stock-card-icon">{stockInfo.icon}</span>
          <div>
            <div className="stock-card-ticker">{ticker}</div>
            <div className="stock-card-name">{stockInfo.name}</div>
          </div>
        </div>
        {!connected && (
          <div className="disconnected-badge">⚠️</div>
        )}
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
