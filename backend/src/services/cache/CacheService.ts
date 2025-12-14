import NodeCache from 'node-cache';
import Redis from 'ioredis';
import { config } from '../../config';

type Nullable<T> = T | null;

class CacheService {
  private memory: NodeCache;
  private redis?: Redis;
  private ttl: number;

  constructor() {
    this.ttl = config.cacheTTL || 60;
    this.memory = new NodeCache({ stdTTL: this.ttl });
    if (config.redisUrl) {
      this.redis = new Redis(config.redisUrl);
    }
  }

  private makeKey(prefix: string, params: any) {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  async get<T>(prefix: string, params: any): Promise<Nullable<T>> {
    const key = this.makeKey(prefix, params);
    // try memory first
    const mem = this.memory.get<T>(key);
    if (mem !== undefined) return mem;
    if (this.redis) {
      const raw = await this.redis.get(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as T;
          // warm memory cache
          this.memory.set(key, parsed);
          return parsed;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  async set<T>(prefix: string, params: any, value: T): Promise<void> {
    const key = this.makeKey(prefix, params);
    this.memory.set(key, value, this.ttl);
    if (this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', this.ttl);
      } catch (e) {
        // ignore redis failures; memory cache still works
      }
    }
  }
}

export const cacheService = new CacheService();
