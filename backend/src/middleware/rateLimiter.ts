import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Protect endpoints with a simple rate limiter. Tune via environment when needed.
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({ error: 'Too many requests, please slow down.' });
  }
});
