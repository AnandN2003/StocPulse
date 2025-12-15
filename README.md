# Stock Broker Client Web Dashboard

A real-time stock market dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for asynchronous operations and live price streaming.

##  Project Overview

This is a **real-time subscription dashboard** designed to demonstrate:
-  Live data streaming with Socket.IO
-  Asynchronous multi-user behavior
-  Clean, scalable architecture
-  Product-quality frontend UX

##  Features

- **Real-Time Updates**: Stock prices update every second without page refresh
- **User Authentication**: Email-based signup/login with JWT tokens
- **Stock Subscriptions**: Subscribe/unsubscribe to 5 major stocks (GOOG, TSLA, AMZN, META, NVDA)
- **Multi-User Support**: Each user maintains independent subscriptions
- **Live Price Streaming**: Socket.IO rooms for efficient, targeted updates
- **Beautiful UI**: Modern fintech-style landing page with animated background
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

##  Tech Stack

### Client
- **React 18** - UI library with functional components
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **Axios** - HTTP client for REST APIs
- **Context API** - State management

### Server
- **Node.js + Express** - Server framework
- **Socket.IO** - WebSocket server for real-time updates
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
stock broker/
├── docker-compose.yml         # 🐳 Container orchestration
├── .env                       # Environment variables
├── .env.example               # Environment template
├── DOCKER.md                  # Docker documentation
├── server/
│   ├── Dockerfile             # 🐳 Backend container
│   ├── .dockerignore
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
└── client/
    ├── Dockerfile             # 🐳 Frontend container
    ├── nginx.conf             # 🐳 Nginx reverse proxy config
    ├── .dockerignore
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
    ├── .env                   # Client environment variables
    └── package.json
```

##  Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or MongoDB Compass)
- **npm** or **yarn**
- **recharts**

### Installation

#### 1. Clone or Navigate to the Project

```bash
cd "d:\anand\stock broker"
```

#### 2. Server Setup

```bash
# Navigate to server directory
cd server

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

#### 3. Client Setup

```bash
# Navigate to client directory
cd ../client

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

##  Running the Application

### Option 1: Docker (Recommended) 🐳

Run the entire application with a single command using Docker:

```bash
# Navigate to project root
cd "d:\anand\stock broker"

# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

**Access the app at:** http://localhost:3000

**Stop the application:**
```bash
docker-compose down

# To also remove database data:
docker-compose down -v
```

This starts three containers:
- **Frontend** (Nginx) - Serves React app and proxies API requests
- **Backend** (Node.js) - REST API + Socket.IO server
- **MongoDB** - Database

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

---

### Option 2: Manual Setup (Development)

#### Start Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Start Client Development Server

```bash
cd client
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

## Architecture & Design Decisions

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

### Socket.IO Events

**Client → Server:**
- `subscribe` - Join a stock room
- `unsubscribe` - Leave a stock room

**Server → Client:**
- `initial-prices` - Send all subscribed stock prices on connect
- `price-update` - Broadcast new price to room members
- `error` - Send error messages

## Acknowledgments

- FloatingLines component adapted from React Bits
- Stock simulation for educational purposes only
- No real financial data is used

---
