import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err?.stack || err?.message || String(err));
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}
