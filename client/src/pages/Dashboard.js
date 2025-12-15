import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLivePrices } from '../hooks/useLivePrices';
import LiveStockCard from '../components/LiveStockCard';
import StockModal from '../components/StockModal';
import StockDetailView from '../components/StockDetailView';
import './Dashboard.css';

const ALL_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];

const Dashboard = () => {
  const { user, logout } = useUser();
  const { prices, priceHistory, connected, subscriptions, subscribe, unsubscribe } = useLivePrices();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Debug logging
  console.log('[Dashboard] Received from useLivePrices:', {
    pricesKeys: Object.keys(prices || {}),
    priceHistoryKeys: Object.keys(priceHistory || {}),
    priceHistory,
    subscriptions,
    connected
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCardClick = (ticker) => {
    setSelectedStock(ticker);
    setModalOpen(true);
  };

  const handleSubscribe = async (ticker) => {
    await subscribe(ticker);
  };

  const handleUnsubscribe = async (ticker) => {
    await unsubscribe(ticker);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStock(null);
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
          {/* Navigation Tabs */}
          <nav className="dashboard-nav">
            <button
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button
              className={`nav-tab ${activeTab === 'mystocks' ? 'active' : ''}`}
              onClick={() => setActiveTab('mystocks')}
            >
              <span className="nav-icon">⭐</span>
              My Stocks
              {subscriptions.length > 0 && (
                <span className="nav-badge">{subscriptions.length}</span>
              )}
            </button>
          </nav>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="tab-pane active">
                <div className="welcome-section">
                  <h1>Real-Time Stock Dashboard</h1>
                  <p>Click on any stock card to subscribe or unsubscribe</p>
                </div>

                <div className="stocks-section">
                  <h2>Available Stocks</h2>
                  <div className="stocks-grid">
                    {ALL_STOCKS.map(ticker => (
                      <LiveStockCard
                        key={ticker}
                        ticker={ticker}
                        price={prices[ticker]}
                        connected={connected}
                        onClick={() => handleCardClick(ticker)}
                        isSubscribed={subscriptions.includes(ticker)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* My Stocks Tab */}
            {activeTab === 'mystocks' && (
              <div className="tab-pane active">
                <div className="welcome-section">
                  <h1>My Subscribed Stocks</h1>
                  <p>Your personalized watchlist with real-time updates and detailed analytics</p>
                </div>

                <div className="stocks-section">
                  {subscriptions.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📊</div>
                      <h3>No stocks subscribed yet</h3>
                      <p>Go to Dashboard to subscribe to stocks and start tracking</p>
                      <button className="btn-goto-dashboard" onClick={() => setActiveTab('dashboard')}>
                        Browse Stocks
                      </button>
                    </div>
                  ) : (
                    <div className="stock-details-list">
                      {subscriptions.map(ticker => {
                        const tickerHistory = (priceHistory && priceHistory[ticker]) || [];
                        console.log(`[Dashboard] Passing to ${ticker}:`, {
                          ticker,
                          currentPrice: prices[ticker],
                          historyLength: tickerHistory.length,
                          tickerHistory
                        });
                        return (
                          <StockDetailView
                            key={ticker}
                            ticker={ticker}
                            currentPrice={prices[ticker]}
                            priceHistory={tickerHistory}
                            connected={connected}
                            onUnsubscribe={handleUnsubscribe}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Stock Modal */}
      <StockModal
        isOpen={modalOpen}
        onClose={closeModal}
        ticker={selectedStock}
        price={prices[selectedStock]}
        isSubscribed={subscriptions.includes(selectedStock)}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
      />
    </div>
  );
};

export default Dashboard;
