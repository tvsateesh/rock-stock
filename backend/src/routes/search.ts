import { Router, Request, Response, NextFunction } from 'express';
import { getYahooService } from '../services/RapidApiYahooService';
import { cacheService } from '../services/cache/CacheService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q || '');
    if (!q) return res.status(400).json({ error: 'Missing q parameter' });

    const cacheKeyParams = { q, type: 'search' };
    const cached = await cacheService.get('search', cacheKeyParams);
    if (cached) return res.json(cached);

    const YahooService = getYahooService();
    const data = await YahooService.search(q);
    await cacheService.set('search', cacheKeyParams, data);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
