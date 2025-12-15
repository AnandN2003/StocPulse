import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import './StockDetailView.css';

const STOCK_PROFILES = {
  GOOG: {
    name: 'Alphabet Inc.',
    logo: '/google.png',
    description: 'Technology company specializing in Internet-related services and products, including online advertising technologies, search engine, cloud computing, and software.',
    stats: {
      'Market Cap': '$1.8T',
      'P/E Ratio': '25.3',
      '52 Week High': '$175.42',
      '52 Week Low': '$121.35',
      'Volume': '28.5M',
      'Avg Volume': '31.2M'
    }
  },
  TSLA: {
    name: 'Tesla Inc.',
    logo: '/brand.png',
    description: 'Electric vehicle and clean energy company that designs, manufactures, and sells electric cars, battery energy storage, solar panels, and related products.',
    stats: {
      'Market Cap': '$780B',
      'P/E Ratio': '68.4',
      '52 Week High': '$299.29',
      '52 Week Low': '$152.37',
      'Volume': '125.3M',
      'Avg Volume': '118.7M'
    }
  },
  AMZN: {
    name: 'Amazon.com Inc.',
    logo: '/social.png',
    description: 'Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    stats: {
      'Market Cap': '$1.5T',
      'P/E Ratio': '52.1',
      '52 Week High': '$178.50',
      '52 Week Low': '$118.35',
      'Volume': '42.8M',
      'Avg Volume': '45.3M'
    }
  },
  META: {
    name: 'Meta Platforms Inc.',
    logo: '/meta.png',
    description: 'Social technology company that builds products to help people connect, find communities, and grow businesses through Facebook, Instagram, and WhatsApp.',
    stats: {
      'Market Cap': '$920B',
      'P/E Ratio': '28.7',
      '52 Week High': '$398.57',
      '52 Week Low': '$279.44',
      'Volume': '18.2M',
      'Avg Volume': '19.8M'
    }
  },
  NVDA: {
    name: 'NVIDIA Corporation',
    logo: '/nvidia.svg',
    description: 'Technology company that designs graphics processing units (GPUs) for gaming, professional visualization, data centers, and automotive markets.',
    stats: {
      'Market Cap': '$1.2T',
      'P/E Ratio': '72.8',
      '52 Week High': '$505.48',
      '52 Week Low': '$392.10',
      'Volume': '52.3M',
      'Avg Volume': '48.9M'
    }
  }
};

const StockDetailView = ({ ticker, currentPrice, priceHistory, connected, onUnsubscribe }) => {
  const profile = STOCK_PROFILES[ticker] || {};
  
  // Debug logging
  console.log(`[StockDetailView ${ticker}] Rendering with:`, {
    ticker,
    currentPrice,
    priceHistoryLength: priceHistory?.length || 0,
    priceHistory,
    connected
  });
  
  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) {
      console.log(`[StockDetailView ${ticker}] No price history available`);
      return [];
    }
    const data = priceHistory.map((item, index) => ({
      index,
      price: item.price
    }));
    console.log(`[StockDetailView ${ticker}] Chart data generated:`, data);
    return data;
  }, [priceHistory, ticker]);

  const priceChange = useMemo(() => {
    if (!priceHistory || priceHistory.length < 2) {
      console.log(`[StockDetailView ${ticker}] Not enough price history for change calculation`);
      return null;
    }
    const firstPrice = priceHistory[0].price;
    const lastPrice = priceHistory[priceHistory.length - 1].price;
    const change = lastPrice - firstPrice;
    const changePercent = ((change / firstPrice) * 100).toFixed(2);
    const result = { change, changePercent, isPositive: change >= 0 };
    console.log(`[StockDetailView ${ticker}] Price change calculated:`, result);
    return result;
  }, [priceHistory, ticker]);

  const chartColor = priceChange?.isPositive ? '#00ff88' : '#ff4466';

  // Calculate Y-axis domain for better visibility
  const yAxisDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) return ['auto', 'auto'];
    
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    
    // If range is very small, create a fixed window around the average
    if (range < 1) {
      const avgPrice = (minPrice + maxPrice) / 2;
      const padding = Math.max(2, avgPrice * 0.02); // 2% padding or minimum $2
      return [avgPrice - padding, avgPrice + padding];
    }
    
    // Add 20% padding to top and bottom
    const padding = range * 0.2;
    return [minPrice - padding, maxPrice + padding];
  }, [chartData]);

  return (
    <div className="stock-detail-view">
      {/* Header */}
      <div className="stock-detail-header">
        <div className="stock-detail-title">
          {profile.logo && <img src={profile.logo} alt={ticker} className="stock-detail-logo" />}
          <div>
            <h3>{ticker}</h3>
            <p>{profile.name}</p>
          </div>
        </div>
        <button className="btn-unsubscribe-mini" onClick={() => onUnsubscribe(ticker)}>
          Unsubscribe
        </button>
      </div>

      {/* Main Content: Chart + Profile */}
      <div className="stock-detail-main">
        {/* Chart Section */}
        <div className="stock-chart-section">
          <div className="current-price-display">
            <div className="price-large">${currentPrice?.toFixed(2) || '---'}</div>
            {priceChange && (
              <div className={`price-change-display ${priceChange.isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{priceChange.isPositive ? '▲' : '▼'}</span>
                <span>${Math.abs(priceChange.change).toFixed(2)}</span>
                <span>({priceChange.isPositive ? '+' : ''}{priceChange.changePercent}%)</span>
              </div>
            )}
          </div>

          <div className="sparkline-container">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <YAxis 
                    domain={yAxisDomain} 
                    hide={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-loading">Loading chart data...</div>
            )}
          </div>

          <div className="live-indicator-detail">
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            <span>Live Updates</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="stock-profile-section">
          <h4>Profile</h4>
          <p>{profile.description}</p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="stock-stats-section">
        <h4>Key Stats</h4>
        <div className="stats-grid">
          {Object.entries(profile.stats || {}).map(([key, value]) => (
            <div key={key} className="stat-item">
              <span className="stat-label">{key}</span>
              <span className="stat-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockDetailView;
