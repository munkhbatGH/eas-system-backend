import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async getValue(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async setValue(key: string, value: string) {
    await this.redisClient.set(key, value, 'EX', 3600); // expires in 1 hour
  }
}
