# =============================================================================
# Backend Dockerfile - Node.js + Express + Socket.IO
# Multi-stage build for optimized production image
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# Using a separate stage for dependencies enables better layer caching
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first (leverages Docker cache)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# -----------------------------------------------------------------------------
# Stage 2: Production
# Using Alpine for minimal image size (~5x smaller than standard node image)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
# Running as root in containers is a security risk
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose the backend port
EXPOSE 5000

# Health check to verify container is running properly
# Docker will mark container as unhealthy if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
