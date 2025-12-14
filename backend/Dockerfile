FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci || npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --omit=dev

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/server.js"]
