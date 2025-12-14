FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (clean install if lock file exists, otherwise install)
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/server.js"]
