import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLivePrices } from '../hooks/useLivePrices';
import StockSelector from '../components/StockSelector';
import LiveStockCard from '../components/LiveStockCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, subscriptions } = useUser();
  const { prices, connected } = useLivePrices(subscriptions);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <span className="logo-text">StockFlow</span>
          </div>
          <div className="header-right">
            <div className="connection-status">
              <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></div>
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1>Welcome to Your Dashboard</h1>
            <p>Subscribe to stocks and watch live price updates in real-time</p>
          </div>

          {/* Stock Selector */}
          <StockSelector />

          {/* Live Stocks */}
          <div className="stocks-section">
            <h2>Your Subscribed Stocks</h2>
            {subscriptions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No stocks subscribed yet</h3>
                <p>Subscribe to stocks above to start tracking live prices</p>
              </div>
            ) : (
              <div className="stocks-grid">
                {subscriptions.map(ticker => (
                  <LiveStockCard
                    key={ticker}
                    ticker={ticker}
                    price={prices[ticker]}
                    connected={connected}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
