# 📈 Stock Broker Client Web Dashboard

A real-time stock market dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for live price streaming.

## 🎯 Project Overview

This is a **real-time subscription dashboard** designed to demonstrate:
- ✨ Live data streaming with Socket.IO
- 🔄 Asynchronous multi-user behavior
- 🏗️ Clean, scalable architecture
- 🎨 Product-quality frontend UX

**Important:** This is NOT a trading platform. It's a demonstration of real-time WebSocket communication with simulated stock prices.

## ⚡ Features

- **Real-Time Updates**: Stock prices update every second without page refresh
- **User Authentication**: Email-based signup/login with JWT tokens
- **Stock Subscriptions**: Subscribe/unsubscribe to 5 major stocks (GOOG, TSLA, AMZN, META, NVDA)
- **Multi-User Support**: Each user maintains independent subscriptions
- **Live Price Streaming**: Socket.IO rooms for efficient, targeted updates
- **Beautiful UI**: Modern fintech-style landing page with animated background
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with functional components
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **Three.js** - 3D animated background (FloatingLines component)
- **Axios** - HTTP client for REST APIs
- **Context API** - State management

### Backend
- **Node.js + Express** - Server framework
- **Socket.IO** - WebSocket server for real-time updates
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
stock broker/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   └── User.js            # User schema with subscriptions
│   ├── routes/
│   │   ├── auth.js            # Signup/login endpoints
│   │   └── subscriptions.js   # Subscribe/unsubscribe endpoints
│   ├── socket/
│   │   └── socket.js          # Socket.IO logic and price simulation
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Main server file
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── api.js         # Axios instance and API calls
    │   ├── components/
    │   │   ├── FloatingLines.js      # Animated background
    │   │   ├── FloatingLines.css
    │   │   ├── AuthModal.js          # Login/signup modal
    │   │   ├── AuthModal.css
    │   │   ├── StockSelector.js      # Stock subscription UI
    │   │   ├── StockSelector.css
    │   │   ├── LiveStockCard.js      # Individual stock card
    │   │   ├── LiveStockCard.css
    │   │   └── ProtectedRoute.js     # Route guard
    │   ├── context/
    │   │   └── UserContext.js        # User state management
    │   ├── hooks/
    │   │   └── useLivePrices.js      # Custom Socket.IO hook
    │   ├── pages/
    │   │   ├── LandingPage.js        # Home page
    │   │   ├── LandingPage.css
    │   │   ├── Dashboard.js          # Main dashboard
    │   │   └── Dashboard.css
    │   ├── App.js             # Root component with routing
    │   ├── index.js           # React entry point
    │   └── index.css          # Global styles
    ├── .env                   # Frontend environment variables
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or MongoDB Compass)
- **npm** or **yarn**

### Installation

#### 1. Clone or Navigate to the Project

```bash
cd "d:\anand\stock broker"
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env

# Edit .env file with your settings
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/stock-broker
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# NODE_ENV=development
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

#### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Compass to connect to localhost:27017
```

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The React app will start on `http://localhost:3000`

## 📖 How to Use

1. **Visit Landing Page**: Navigate to `http://localhost:3000`
2. **Sign Up**: Click "Sign Up" and create an account with your email
3. **Login**: Sign in with your credentials
4. **Dashboard**: You'll be redirected to the dashboard
5. **Subscribe**: Click "Subscribe" on any stock (GOOG, TSLA, AMZN, META, NVDA)
6. **Watch Live**: See real-time price updates every second
7. **Unsubscribe**: Click "Unsubscribe" to stop tracking a stock

## 🏗️ Architecture & Design Decisions

### Real-Time Communication

- **Socket.IO Rooms**: Each stock ticker has its own room
- **Targeted Broadcasting**: Only users subscribed to a stock receive its updates
- **Persistent Subscriptions**: Stored in MongoDB, restored on reconnect
- **Price Simulation**: Random ±1% price changes every second

### Authentication Flow

1. User signs up/logs in → Server generates JWT
2. JWT stored in localStorage
3. JWT sent in Authorization header for REST API calls
4. JWT sent in Socket.IO handshake for WebSocket authentication
5. Server validates JWT for all protected routes and socket connections

### State Management

- **UserContext**: Global user state, subscriptions, auth functions
- **useLivePrices Hook**: Manages Socket.IO connection and price state
- **Local Component State**: Form inputs, UI toggles

### API Endpoints

#### REST API

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/subscriptions` - Get user's subscriptions (protected)
- `POST /api/subscriptions/subscribe` - Subscribe to stock (protected)
- `POST /api/subscriptions/unsubscribe` - Unsubscribe from stock (protected)

#### Socket.IO Events

**Client → Server:**
- `subscribe` - Join a stock room
- `unsubscribe` - Leave a stock room

**Server → Client:**
- `initial-prices` - Send all subscribed stock prices on connect
- `price-update` - Broadcast new price to room members
- `error` - Send error messages

## 🎨 UI Components

### Landing Page
- Animated FloatingLines background (Three.js shader)
- Premium fintech-style hero section
- Features showcase
- How it works section
- Call-to-action sections

### Dashboard
- Connection status indicator
- User info and logout
- Stock selector with subscribe/unsubscribe
- Live stock cards with:
  - Real-time price updates
  - Price change indicators (↑/↓)
  - Percentage change
  - Visual feedback on price changes

## 🔒 Security Considerations

- Passwords hashed with bcryptjs
- JWT tokens expire after 7 days
- Socket.IO connections authenticated via JWT
- CORS configured for localhost (update for production)
- Environment variables for sensitive data

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
net start MongoDB

# Check connection string in backend/.env
MONGODB_URI=mongodb://localhost:27017/stock-broker
```

### Socket.IO Connection Failed
```bash
# Ensure backend server is running on port 5000
# Check REACT_APP_SOCKET_URL in frontend/.env
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Port Already in Use
```bash
# Backend: Change PORT in backend/.env
# Frontend: Set PORT=3001 in frontend/.env
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-broker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚢 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas connection string
4. Update CORS origins
5. Use HTTPS
6. Deploy to Heroku, DigitalOcean, AWS, etc.

### Frontend
1. Update API URLs to production backend
2. Build: `npm run build`
3. Deploy build folder to Netlify, Vercel, or S3

## 🎓 Learning Outcomes

This project demonstrates:
- WebSocket communication with Socket.IO
- JWT authentication flow
- React Context API for state management
- Custom React hooks
- MongoDB schema design
- RESTful API design
- Real-time multi-user systems
- Modern React patterns (functional components, hooks)
- Professional UI/UX design

## 📄 License

MIT - This is a demonstration/educational project.

## 🙏 Acknowledgments

- FloatingLines component adapted from React Bits
- Stock simulation for educational purposes only
- No real financial data is used

---

**Built with ❤️ using the MERN stack**
