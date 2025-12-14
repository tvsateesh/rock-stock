FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files from root context
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy frontend source
COPY frontend/src ./src
COPY frontend/angular.json ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.app.json ./

# Build Angular app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist/rock-stock /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
