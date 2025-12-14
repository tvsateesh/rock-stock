import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// Ensure axios.create() returns the mocked axios instance used in httpClient
(mockedAxios.create as unknown as jest.Mock) = jest.fn().mockReturnValue(mockedAxios);
// Import the service after mocking axios so httpClient picks up the mocked instance
const { RapidApiYahooService } = require('../src/services/RapidApiYahooService');

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
