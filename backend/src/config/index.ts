import dotenv from 'dotenv';
dotenv.config();

export const config = {
  rapidapiKey: process.env.RAPIDAPI_KEY || '',
  rapidapiHost: process.env.RAPIDAPI_HOST || 'yahoo-finance15.p.rapidapi.com',
  port: Number(process.env.PORT || 4000),
  cacheTTL: Number(process.env.CACHE_TTL_SECONDS || 60),
  nodeEnv: process.env.NODE_ENV || 'development',
  redisUrl: process.env.REDIS_URL || '',
  useMock: process.env.USE_MOCK === 'true'
};
