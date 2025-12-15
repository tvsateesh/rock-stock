import http from '../utils/httpClient';
import { config } from '../config';

/**
 * RapidApiYahooService - wraps Yahoo Finance endpoints from yh-finance RapidAPI.
 * Methods return raw API shapes mapped into a predictable shape for the frontend.
 */
export class RapidApiYahooService {
  /**
   * Get stock quotes for one or more symbols
   * Uses: /market/v2/get-quotes endpoint
   */
  static async getQuote(symbols: string | string[]) {
    const symbolParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const url = `/market/v2/get-quotes?region=US&symbols=${encodeURIComponent(symbolParam)}`;
    const resp = await http.get(url);
    return resp.data;
  }

  /**
   * Get fundamental data for a stock (assetProfile, summaryProfile)
   * Uses: /stock/get-fundamentals endpoint
   */
  static async getHistorical(symbol: string, period = '1mo', interval = '1d') {
    // Note: yh-finance doesn't have direct historical data via this endpoint
    // Using fundamentals as fallback; consider adding a separate historical endpoint if available
    const url = `/stock/get-fundamentals?symbol=${encodeURIComponent(symbol)}&region=US&lang=en-US&modules=assetProfile,summaryProfile`;
    const resp = await http.get(url);
    return resp.data;
  }

  /**
   * Search for stocks using auto-complete, fallback to quotes
   */
  static async search(query: string) {
    // Primary: use get-quotes and map to our expected shape
    try {
      const quotesUrl = `/market/v2/get-quotes?region=US&symbols=${encodeURIComponent(query.toUpperCase())}`;
      const quotesResp = await http.get(quotesUrl);
      const data = quotesResp?.data || {};
      const results = data.quoteResponse?.result || [];
      return {
        quotes: results,
        news: [],
        research: []
      };
    } catch (e) {
      // Fallback: empty result set
      return { quotes: [], news: [], research: [] };
    }
  }

  /**
   * Get community conversations for a stock
   * Uses: /conversations/list endpoint
   */
  static async getConversations(symbol: string, limit = 10) {
    const url = `/conversations/list?symbol=${encodeURIComponent(symbol)}&region=US&userActivity=true&sortBy=createdAt&off=0`;
    const resp = await http.get(url);
    return resp.data;
  }
}

/**
 * Factory to switch between real and mock services based on config.
 */
export function getYahooService() {
  if (config.useMock) {
    return MockYahooService;
  }
  return RapidApiYahooService;
}

/**
 * MockYahooService - local mock implementation for testing without RapidAPI.
 */
class MockYahooService {
  private static mockData = {
    quotes: {
      AAPL: {
        symbol: 'AAPL',
        price: {
          shortName: 'Apple Inc.',
          regularMarketPrice: { raw: 150.12, fmt: '150.12' },
          regularMarketChange: { raw: 1.23, fmt: '+1.23' },
          regularMarketChangePercent: { raw: 0.825, fmt: '0.82%' },
          marketTime: 1700000000
        }
      },
      MSFT: {
        symbol: 'MSFT',
        price: {
          shortName: 'Microsoft Corporation',
          regularMarketPrice: { raw: 330.45, fmt: '330.45' },
          regularMarketChange: { raw: -0.5, fmt: '-0.50' },
          regularMarketChangePercent: { raw: -0.15, fmt: '-0.15%' },
          marketTime: 1700000000
        }
      },
      GOOGL: {
        symbol: 'GOOGL',
        price: {
          shortName: 'Alphabet Inc.',
          regularMarketPrice: { raw: 125.3, fmt: '125.30' },
          regularMarketChange: { raw: 0.75, fmt: '+0.75' },
          regularMarketChangePercent: { raw: 0.6, fmt: '0.60%' },
          marketTime: 1700000000
        }
      }
    },
    historical: {
      chart: {
        result: [
          {
            timestamp: [1700000000, 1699913600, 1699827200, 1699740800, 1699654400],
            indicators: {
              quote: [
                {
                  open: [148.0, 147.5, 149.0, 150.0, 149.5],
                  high: [151.0, 150.5, 151.0, 152.0, 151.5],
                  low: [147.0, 146.5, 148.0, 149.0, 148.5],
                  close: [150.12, 149.0, 150.5, 151.0, 150.0],
                  volume: [100000, 110000, 90000, 120000, 95000]
                }
              ]
            }
          }
        ]
      }
    },
    search: [
      { symbol: 'AAPL', shortname: 'Apple Inc.', name: 'Apple' },
      { symbol: 'MSFT', shortname: 'Microsoft Corporation', name: 'Microsoft' },
      { symbol: 'GOOGL', shortname: 'Alphabet Inc.', name: 'Alphabet' },
      { symbol: 'AMZN', shortname: 'Amazon.com, Inc.', name: 'Amazon' },
      { symbol: 'TSLA', shortname: 'Tesla, Inc.', name: 'Tesla' }
    ]
  };

  static async getQuote(symbols: string | string[]) {
    const symbolsArr = Array.isArray(symbols) ? symbols : [symbols];
    if (symbolsArr.length === 1) {
      const s = symbolsArr[0].toUpperCase();
      return this.mockData.quotes[s as keyof typeof this.mockData.quotes] || { symbol: s, price: null };
    }
    return symbolsArr.map(s => this.mockData.quotes[s.toUpperCase() as keyof typeof this.mockData.quotes] || { symbol: s.toUpperCase() });
  }

  static async getHistorical(symbol: string, period = '1mo', interval = '1d') {
    return { ...this.mockData.historical, meta: { symbol: symbol.toUpperCase() } };
  }

  static async search(query: string) {
    const q = query.toLowerCase();
    const matches = this.mockData.search.filter(item =>
      (item.symbol + ' ' + (item.shortname || '') + ' ' + (item.name || '')).toLowerCase().includes(q)
    );
    return { quotes: matches };
  }
}
