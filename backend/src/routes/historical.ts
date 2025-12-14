import { Router, Request, Response, NextFunction } from 'express';
import { getYahooService } from '../services/RapidApiYahooService';
import { cacheService } from '../services/cache/CacheService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const symbol = String(req.query.symbol || '');
    const period = String(req.query.period || '1mo');
    const interval = String(req.query.interval || '1d');
    if (!symbol) return res.status(400).json({ error: 'Missing symbol parameter' });

    const cacheKeyParams = { symbol, period, interval, type: 'historical' };
    const cached = await cacheService.get('historical', cacheKeyParams);
    if (cached) return res.json(cached);

    const YahooService = getYahooService();
    const data = await YahooService.getHistorical(symbol, period, interval);
    await cacheService.set('historical', cacheKeyParams, data);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
