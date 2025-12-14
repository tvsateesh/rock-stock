import axios from 'axios';
import { RapidApiYahooService } from '../src/services/RapidApiYahooService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RapidApiYahooService', () => {
  afterEach(() => jest.resetAllMocks());

  test('getQuote returns data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { symbol: 'AAPL', price: 150 } });
    const data = await RapidApiYahooService.getQuote('AAPL');
    expect(data).toEqual({ symbol: 'AAPL', price: 150 });
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  test('getHistorical returns data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { chart: { result: [] } } });
    const data = await RapidApiYahooService.getHistorical('AAPL', '1mo', '1d');
    expect(data).toHaveProperty('chart');
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  test('search returns matches', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { quotes: [] } });
    const data = await RapidApiYahooService.search('appl');
    expect(data).toHaveProperty('quotes');
    expect(mockedAxios.get).toHaveBeenCalled();
  });
});
