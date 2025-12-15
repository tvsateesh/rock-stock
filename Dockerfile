# Frontend build stage
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci || npm install

COPY frontend/src ./src
COPY frontend/angular.json ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.app.json ./

RUN npm run build 

# Backend build stage
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci || npm install

COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/jest.config.js ./

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies and build
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package*.json ./

# Prune dev dependencies
RUN npm prune --omit=dev

# Copy frontend build to public folder
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 4000

CMD ["node", "dist/server.js"]
