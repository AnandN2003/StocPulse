import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import DotGrid from '../components/DotGrid';
import AuthModal from '../components/AuthModal';
import './LandingPage.css';

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="background-animation">
        <DotGrid
          dotSize={3}
          gap={25}
          baseColor="#5227FF"
          activeColor="#E947F5"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <span className="logo-text">StockFlow</span>
          </div>
          <div className="nav-links">
            <button onClick={() => scrollToSection('features')} className="nav-link">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-link">
              Learn More
            </button>
            <button onClick={() => openAuthModal('login')} className="btn-nav-login">
              Login
            </button>
            <button onClick={() => openAuthModal('signup')} className="btn-nav-signup">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Real-Time Stock Market
            <span className="gradient-text"> Dashboard</span>
          </h1>
          <p className="hero-subtitle">
            Experience live stock price updates with our cutting-edge real-time streaming platform.
            Subscribe to your favorite stocks and watch the market move in real-time.
          </p>
          <div className="hero-buttons">
            <button onClick={() => openAuthModal('signup')} className="btn-hero-primary">
              Get Started Free
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="btn-hero-secondary">
              See How It Works
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">5</div>
              <div className="stat-label">Top Stocks</div>
            </div>
            <div className="stat">
              <div className="stat-number">1s</div>
              <div className="stat-label">Update Interval</div>
            </div>
            <div className="stat">
              <div className="stat-number">∞</div>
              <div className="stat-label">Concurrent Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <h2 className="section-title">Premium Features</h2>
          <p className="section-subtitle">
            Built with modern technology for the best user experience
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Updates</h3>
              <p>Get stock price updates every second without refreshing your browser</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Custom Subscriptions</h3>
              <p>Subscribe only to stocks you care about: GOOG, TSLA, AMZN, META, NVDA</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Multi-User Support</h3>
              <p>Each user gets their own personalized dashboard with independent subscriptions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Authentication</h3>
              <p>Your data is protected with industry-standard JWT authentication</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Lightning Fast</h3>
              <p>Built with Socket.IO for instant, bidirectional communication</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Beautiful interface that works perfectly on desktop, tablet, and mobile</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started in three simple steps
          </p>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Account</h3>
              <p>Sign up with your email address in seconds. No credit card required.</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Choose Your Stocks</h3>
              <p>Subscribe to any combination of our supported stocks: GOOG, TSLA, AMZN, META, NVDA.</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Watch Live Updates</h3>
              <p>Sit back and watch real-time price updates flow into your personalized dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Experience Real-Time Trading?</h2>
          <p>Join thousands of users tracking their favorite stocks in real-time</p>
          <div className="cta-buttons">
            <button onClick={() => openAuthModal('signup')} className="btn-cta-primary">
              Start Free Today
            </button>
            <button onClick={() => openAuthModal('login')} className="btn-cta-secondary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">📈</span>
              <span className="logo-text">StockFlow</span>
            </div>
            <p>Real-time stock market dashboard built with MERN stack</p>
          </div>
          <div className="footer-info">
            <p>© 2025 StockFlow. Demo project for educational purposes.</p>
            <p className="footer-note">Stock prices are simulated for demonstration purposes only.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;
