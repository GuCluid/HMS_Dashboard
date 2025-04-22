# Dockerfile for Dynamics 365 Monitor
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json files
COPY src/backend/package*.json ./backend/
COPY src/frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install --production --legacy-peer-deps
RUN cd frontend && npm install --legacy-peer-deps

# Copy source code
COPY src/backend ./backend
COPY src/frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "backend/server.js"]
