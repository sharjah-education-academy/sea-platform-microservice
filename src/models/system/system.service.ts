import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Constants } from 'sea-backend-helpers';

@Injectable()
export class SystemService {
  constructor(private readonly redisService: RedisService) {}

  async freeCache(): Promise<boolean> {
    const cacheableKeys = Object.keys(Constants.Cache.CacheableModules);
    const keys = await this.redisService.getAllKeys(cacheableKeys);

    await this.redisService.deleteKeys(keys);

    return true;
  }

  async logoutAllAccounts() {
    const keys = await this.redisService.getAllKeys('Token');
    await this.redisService.deleteKeys(keys);

    return true;
  }
}
