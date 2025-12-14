FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci || npm install

# Copy frontend source files
COPY frontend/src ./src
COPY frontend/angular.json ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.app.json ./

# Build frontend
RUN npm run build

# Backend build stage
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/jest.config.js ./

# Install all dependencies (including dev for build)
RUN npm ci || npm install

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built backend from backend-builder
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/dist/rock-stock ./public

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "dist/server.js"]
RUN npm prune --omit=dev

# Start the application
CMD ["node", "dist/server.js"]
