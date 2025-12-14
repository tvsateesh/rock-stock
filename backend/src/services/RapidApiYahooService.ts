import http from '../utils/httpClient';
import { config } from '../config';

/**
 * RapidApiYahooService - wraps a small subset of Yahoo Finance endpoints available via RapidAPI.
 * Methods return raw API shapes mapped into a predictable shape for the frontend.
 */
export class RapidApiYahooService {
  static async getQuote(symbols: string | string[]) {
    const symbolParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const url = `/stock/v2/get-summary?symbol=${encodeURIComponent(symbolParam)}`;
    const resp = await http.get(url);
    // rapidapi endpoint returns different shapes; pass through main parts
    return resp.data;
  }

  static async getHistorical(symbol: string, period = '1mo', interval = '1d') {
    const url = `/stock/v3/get-chart?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&range=${encodeURIComponent(period)}`;
    const resp = await http.get(url);
    return resp.data;
  }

  static async search(query: string) {
    const url = `/auto-complete?q=${encodeURIComponent(query)}&region=US`;
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
