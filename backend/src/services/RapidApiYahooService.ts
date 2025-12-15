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
    console.info('[RapidApiYahooService.getQuote] Request', { url });
    try {
      const resp = await http.get(url);
      console.info('[RapidApiYahooService.getQuote] Response', { status: resp.status, statusText: resp.statusText });
      const data = resp.data || {};
      const result = data.quoteResponse?.result || [];
      const first = result[0];
      if (!first) return null;

      // Map to mock-style shape for frontend compatibility
      const mapped = {
        symbol: first.symbol,
        price: {
          shortName: first.shortName,
          longName: first.longName,
          regularMarketPrice: { raw: first.regularMarketPrice, fmt: String(first.regularMarketPrice) },
          regularMarketChange: { raw: first.regularMarketChange, fmt: String(first.regularMarketChange) },
          regularMarketChangePercent: { raw: first.regularMarketChangePercent, fmt: `${(first.regularMarketChangePercent ?? 0).toFixed(2)}%` },
          marketTime: first.regularMarketTime
        },
        summaryDetail: {
          previousClose: first.regularMarketPreviousClose,
          open: first.regularMarketOpen,
          dayLow: first.regularMarketDayLow,
          dayHigh: first.regularMarketDayHigh,
          regularMarketPreviousClose: first.regularMarketPreviousClose,
          regularMarketOpen: first.regularMarketOpen,
          regularMarketDayLow: first.regularMarketDayLow,
          regularMarketDayHigh: first.regularMarketDayHigh,
          volume: first.regularMarketVolume,
          regularMarketVolume: first.regularMarketVolume,
          averageDailyVolume10Day: first.averageDailyVolume10Day,
          averageDailyVolume3Month: first.averageDailyVolume3Month,
          marketCap: first.marketCap,
          fiftyTwoWeekLow: first.fiftyTwoWeekLow,
          fiftyTwoWeekHigh: first.fiftyTwoWeekHigh,
          currency: first.currency,
          bid: first.bid,
          ask: first.ask,
          bidSize: first.bidSize,
          askSize: first.askSize,
          tradeable: first.tradeable
        }
      };
      return mapped;
    } catch (err: any) {
      console.error('[RapidApiYahooService.getQuote] Error', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
      });
      throw err;
    }
  }

  /**
   * Get fundamental data for a stock (assetProfile, summaryProfile)
   * Uses: /stock/get-fundamentals endpoint
   */
  static async getHistorical(symbol: string, period = '1mo', interval = '1d') {
    // Note: yh-finance doesn't have direct historical data via this endpoint
    // Using fundamentals as fallback; consider adding a separate historical endpoint if available
    const url = `/stock/get-fundamentals?symbol=${encodeURIComponent(symbol)}&region=US&lang=en-US&modules=assetProfile,summaryProfile`;
    console.info('[RapidApiYahooService.getHistorical] Request', { url });
    try {
      const resp = await http.get(url);
      console.info('[RapidApiYahooService.getHistorical] Response', { status: resp.status, statusText: resp.statusText });
      return resp.data;
    } catch (err: any) {
      console.error('[RapidApiYahooService.getHistorical] Error', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
      });
      throw err;
    }
  }

  /**
   * Search for stocks using auto-complete, fallback to quotes
   */
  static async search(query: string) {
    // Primary: use get-quotes and map to our expected shape
    try {
      const quotesUrl = `/market/v2/get-quotes?region=US&symbols=${encodeURIComponent(query.toUpperCase())}`;
      console.info('[RapidApiYahooService.search] Request', { url: quotesUrl });
      const quotesResp = await http.get(quotesUrl);
      console.info('[RapidApiYahooService.search] Response', { status: quotesResp.status, statusText: quotesResp.statusText });
      const data = quotesResp?.data || {};
      console.debug('[RapidApiYahooService.search] Body keys', { keys: Object.keys(data || {}) });
      const results = data.quoteResponse?.result || [];
      console.info('[RapidApiYahooService.search] Quote count', { count: results.length });
      return {
        quotes: results,
        news: [],
        research: []
      };
    } catch (e) {
      console.error('[RapidApiYahooService.search] Error', e);
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
    console.info('[RapidApiYahooService.getConversations] Request', { url });
    try {
      const resp = await http.get(url);
      console.info('[RapidApiYahooService.getConversations] Response', { status: resp.status, statusText: resp.statusText });
      return resp.data;
    } catch (err: any) {
      console.error('[RapidApiYahooService.getConversations] Error', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
      });
      throw err;
    }
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
    console.info('[MockYahooService.getQuote] Using mock path', { symbols });
    const symbolsArr = Array.isArray(symbols) ? symbols : [symbols];
    if (symbolsArr.length === 1) {
      const s = symbolsArr[0].toUpperCase();
      const result = this.mockData.quotes[s as keyof typeof this.mockData.quotes] || { symbol: s, price: null };
      console.debug('[MockYahooService.getQuote] Result (single)', { symbol: s, hasPrice: !!(result as any).price });
      return result;
    }
    const results = symbolsArr.map(s => this.mockData.quotes[s.toUpperCase() as keyof typeof this.mockData.quotes] || { symbol: s.toUpperCase() });
    console.debug('[MockYahooService.getQuote] Result (multi)', { count: results.length });
    return results;
  }

  static async getHistorical(symbol: string, period = '1mo', interval = '1d') {
    console.info('[MockYahooService.getHistorical] Using mock path', { symbol, period, interval });
    const payload = { ...this.mockData.historical, meta: { symbol: symbol.toUpperCase() } };
    console.debug('[MockYahooService.getHistorical] Payload keys', { keys: Object.keys(payload || {}) });
    return payload;
  }

  static async search(query: string) {
    console.info('[MockYahooService.search] Using mock path', { query });
    const q = query.toLowerCase();
    const matches = this.mockData.search.filter(item =>
      (item.symbol + ' ' + (item.shortname || '') + ' ' + (item.name || '')).toLowerCase().includes(q)
    );
    console.debug('[MockYahooService.search] Match count', { count: matches.length });
    return { quotes: matches };
  }
}
