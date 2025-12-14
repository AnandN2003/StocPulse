# =============================================================================
# Frontend Dockerfile - React with Nginx
# Multi-stage build: Build React app, then serve with Nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# Install dependencies and build the React application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev deps for build)
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
# These are passed at build time via docker-compose
ARG REACT_APP_API_URL
ARG REACT_APP_SOCKET_URL

# Set environment variables for the build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL

# Build the React application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production
# Serve the built files with Nginx (lightweight, production-grade server)
# Nginx Alpine is only ~25MB vs ~1GB for node with dependencies
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for HTTP
EXPOSE 80

# Nginx runs as daemon by default, this keeps container running
CMD ["nginx", "-g", "daemon off;"]
