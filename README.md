# Rock Stock - Full-Stack Stock Data Application

A modern full-stack web application for tracking and analyzing stock market data in real-time. Built with Node.js/Express backend and Angular frontend, featuring live data from Yahoo Finance via RapidAPI with local mock data support for development.

## Features

- **Real-time Stock Data**: Fetch live stock quotes and historical data from Yahoo Finance
- **Multi-symbol Tracking**: Track multiple stocks simultaneously with a responsive grid layout
- **Search Functionality**: Debounced search with dropdown suggestions for stock symbols
- **Historical Charts**: Interactive candlestick and line charts for price history analysis
- **Caching Layer**: Dual-layer caching (in-memory + optional Redis) for performance optimization
- **Rate Limiting**: Built-in rate limiting (60 requests/minute per IP)
- **Mock Mode**: Toggle between live API and mock data for development/testing
- **Material Design UI**: Clean, responsive interface with Angular Material components
- **Error Handling**: Comprehensive error handling with detailed logging
- **Docker Support**: Containerized setup for both frontend and backend
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing and linting

## Tech Stack

### Backend
- **Node.js 18+** with **Express 4.18**
- **TypeScript 5.6** for type safety
- **Axios 1.5** for HTTP client
- **node-cache 5.1.2** for in-memory caching
- **ioredis 5.3.2** for optional Redis persistence
- **express-rate-limit 6.8.0** for API rate limiting
- **Winston** for structured logging
- **Jest 29.6.1** for unit testing

### Frontend
- **Angular 16.2** with **RxJS 7.8**
- **Angular Material 16** for UI components
- **Chart.js 4.4** for data visualization
- **TypeScript 5.6** for type safety
- **Karma/Jasmine** for testing

### Infrastructure
- **Docker & docker-compose** for containerization
- **GitHub Actions** for CI/CD pipeline

## Project Structure

```
rock-stock/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Express app entry point
│   │   ├── config/
│   │   │   └── index.ts              # Environment configuration
│   │   ├── utils/
│   │   │   └── httpClient.ts         # Axios HTTP client with RapidAPI headers
│   │   ├── services/
│   │   │   ├── RapidApiYahooService.ts  # Yahoo Finance service + mock service
│   │   │   └── cache/
│   │   │       └── CacheService.ts   # Dual-layer cache (memory + Redis)
│   │   ├── routes/
│   │   │   ├── quote.ts              # /api/quote endpoint
│   │   │   ├── historical.ts         # /api/historical endpoint
│   │   │   └── search.ts             # /api/search endpoint
│   │   └── middleware/
│   │       ├── rateLimiter.ts        # Rate limiting middleware
│   │       ├── errorHandler.ts       # Global error handler
│   │       └── logger.ts             # Request logging
│   ├── tests/
│   │   └── rapidapi.service.test.ts  # Jest unit tests
│   ├── mock-server/
│   │   ├── index.js                  # Standalone mock server
│   │   └── data/
│   │       ├── quotes.json
│   │       ├── historical.json
│   │       └── search.json
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── main.ts                   # Angular bootstrap
│   │   ├── index.html                # HTML entry point
│   │   ├── polyfills.ts              # Browser polyfills
│   │   ├── environments/
│   │   │   ├── environment.ts        # Development config
│   │   │   └── environment.prod.ts   # Production config
│   │   ├── app/
│   │   │   ├── app.module.ts         # Root module with Material imports
│   │   │   ├── app.component.ts      # Root component
│   │   │   ├── services/
│   │   │   │   └── stock-api.service.ts  # HTTP service for API calls
│   │   │   └── components/
│   │   │       ├── dashboard/        # Main dashboard component
│   │   │       ├── search-bar/       # Search & toolbar component
│   │   │       ├── quote-card/       # Stock quote display component
│   │   │       └── chart/            # Historical chart component
│   │   └── styles.css                # Global styles
│   ├── Dockerfile
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **RapidAPI Key**: For live data (optional if using mock mode)
- **Docker**: For containerized setup (optional)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/rock-stock.git
cd rock-stock
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your RapidAPI credentials (if using live mode)
# RAPIDAPI_KEY=your_key_here
# RAPIDAPI_HOST=your_host_here
# USE_MOCK=false  # Set to true for mock mode
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend (with mock data)**

```bash
cd backend
echo "USE_MOCK=true" >> .env
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend**

```bash
cd frontend
npm start
# App runs on http://localhost:4200
```

### Production Build

**Backend**

```bash
cd backend
npm run build
npm start
```

**Frontend**

```bash
cd frontend
npm run build
# Output in dist/rock-stock
```

## Environment Configuration

### Backend (.env)

```env
# API Configuration
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=real-time-finance-data.p.rapidapi.com
PORT=4000

# Features
USE_MOCK=true              # Toggle mock mode (true=mock, false=live)
NODE_ENV=development       # development, production

# Caching
CACHE_TTL_SECONDS=600      # Cache time-to-live in seconds
REDIS_URL=                 # Optional: Redis connection URL

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000 # 1 minute
RATE_LIMIT_MAX_REQUESTS=60 # 60 requests per window
```

### Frontend (environment.ts)

```typescript
export const environment = {
  apiBaseUrl: 'http://localhost:4000/api',
  pollingIntervalMs: 15000  // Refresh quotes every 15 seconds
};
```

## API Endpoints

### Quote Data

```bash
GET /api/quote?symbol=AAPL
```

Returns current stock price and market data.

### Historical Data

```bash
GET /api/historical?symbol=AAPL&range=1mo&interval=1d
```

Parameters:
- `symbol`: Stock symbol (e.g., AAPL)
- `range`: Time range (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y)
- `interval`: Data interval (1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)

### Search Symbols

```bash
GET /api/search?q=apple
```

Returns matching stock symbols and company names.

## Using Mock Mode

Mock mode allows development without RapidAPI credentials. It returns realistic sample data for AAPL, MSFT, GOOGL, TSLA, and AMZN.

### Enable Mock Mode

```bash
cd backend
echo "USE_MOCK=true" >> .env
npm run dev
```

Or use the npm script:

```bash
npm run mock
```

## Docker Setup

### Run with Docker Compose

```bash
# Build and run both services
docker-compose up

# Backend: http://localhost:4000
# Frontend: http://localhost:4200
```

### Individual Docker Images

```bash
# Backend
cd backend
docker build -t rock-stock-backend .
docker run -p 4000:4000 -e USE_MOCK=true rock-stock-backend

# Frontend
cd frontend
docker build -t rock-stock-frontend .
docker run -p 4200:4200 rock-stock-frontend
```

## Testing

### Backend Unit Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Frontend Unit Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test -- --code-coverage

# Run in watch mode (default)
ng test
```

### Linting

```bash
cd backend
npm run lint

cd ../frontend
npm run lint
```

## Debugging

### Backend Logging

The backend includes comprehensive logging. Enable debug output:

```bash
DEBUG=* npm run dev
```

### Frontend Console Logging

All HTTP requests and responses are logged to the browser console:

```javascript
// View network logs in browser DevTools (F12 -> Console)
[StockApiService] GET /api/quote?symbol=AAPL
[StockApiService] Response: {price: {...}}
[DashboardComponent] Quote received for AAPL
```

## Features in Development

- ⏳ Polling implementation for live quote updates
- ⏳ Advanced charting with timeframe selector (1d, 1w, 1m, 1y)
- ⏳ OHLC candlestick chart rendering
- ⏳ Integration tests (supertest)
- ⏳ Component unit tests (Karma/Jasmine)
- ⏳ Production deployment guide

## Caching Architecture

### In-Memory Cache (LRU)

- Stores frequently accessed data in-memory
- Configurable TTL (default: 600 seconds)
- Automatic eviction of old entries

### Redis Cache (Optional)

- Enable by setting `REDIS_URL` in `.env`
- Provides persistent, distributed caching
- Falls back to in-memory if Redis unavailable

## Rate Limiting

- **Default**: 60 requests per minute per IP
- Applies to all API endpoints
- Returns `429 Too Many Requests` when exceeded

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### API Calls Not Working

1. Check backend is running: `curl http://localhost:4000/api/quote?symbol=AAPL`
2. Enable mock mode if RapidAPI key missing
3. Check console logs for errors
4. Verify CORS is enabled in backend

### Styling Issues

- Clear browser cache: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Rebuild Angular: `ng build`
- Check Material imports in `app.module.ts`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open a GitHub Issue.

## Author

Created with ❤️ for stock market enthusiasts

---

**Happy Trading! 📈**
