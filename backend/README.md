# Rock Stock — Backend

This is a lightweight Node.js + TypeScript backend that proxies Yahoo Finance endpoints via RapidAPI. It provides caching and rate-limiting to protect your RapidAPI quota.

You can also run in **mock mode** for testing without requiring a RapidAPI key.

## Quick start

1. Copy environment:

```bash
cp .env.example .env
# edit .env and set RAPIDAPI_KEY (or leave empty for mock mode)
```

2. Install dependencies & run dev server:

```bash
npm install
npm run dev
```

3. Example curl requests:

```bash
curl "http://localhost:4000/api/quote?symbol=AAPL"
curl "http://localhost:4000/api/historical?symbol=AAPL&period=1mo&interval=1d"
curl "http://localhost:4000/api/search?q=apple"
```

## Mock mode (testing without RapidAPI)

To use mock data instead of real RapidAPI calls, set `USE_MOCK=true` in `.env`:

```bash
# .env
USE_MOCK=true
RAPIDAPI_KEY=  # Can be empty
```

Then run:

```bash
npm run dev
```

The backend will respond with sample data for AAPL, MSFT, GOOGL, AMZN, TSLA.

## Docker

```bash
docker-compose up --build
```

By default, docker-compose runs with live RapidAPI. To enable mock mode, edit `docker-compose.yml` and add:

```yaml
environment:
  - USE_MOCK=true
```

## Testing

```bash
npm test
```

## Switching between live and mock

1. **Live mode (default):** Set `USE_MOCK=false` in `.env` and provide a valid `RAPIDAPI_KEY`.
2. **Mock mode:** Set `USE_MOCK=true` in `.env` (no RapidAPI key needed).

The backend automatically routes requests to the real RapidAPI service or mock service based on the `USE_MOCK` setting.
