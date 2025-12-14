import { Router, Request, Response, NextFunction } from 'express';
import { getYahooService } from '../services/RapidApiYahooService';
import { cacheService } from '../services/cache/CacheService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const symbol = String(req.query.symbol || '');
    if (!symbol) return res.status(400).json({ error: 'Missing symbol parameter' });

    const symbols = symbol.split(',').map(s => s.trim()).filter(Boolean);
    const cacheKeyParams = { symbols, type: 'quote' };
    const cached = await cacheService.get('quote', cacheKeyParams);
    if (cached) return res.json(cached);

    const YahooService = getYahooService();
    // If multiple, map to promises
    if (symbols.length > 1) {
      const results = await Promise.all(symbols.map(s => YahooService.getQuote(s)));
      await cacheService.set('quote', cacheKeyParams, results);
      return res.json(results);
    }

    const data = await YahooService.getQuote(symbols[0]);
    await cacheService.set('quote', cacheKeyParams, data);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
