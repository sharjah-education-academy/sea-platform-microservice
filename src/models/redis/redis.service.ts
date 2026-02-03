import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Constants } from 'src/config';

@Injectable()
export class RedisService {
  constructor(
    @Inject(Constants.Redis.RedisProvider)
    private readonly redisClient: Redis,
  ) {}

  /**
   * Get all Redis keys, optionally filtered by prefix or multiple prefixes.
   * @param prefix Optional string or array of strings to filter keys
   */
  async getAllKeys(prefix?: string | string[]): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    // Normalize prefix to array for easier iteration
    const prefixes: string[] = !prefix
      ? ['*']
      : Array.isArray(prefix)
        ? prefix
        : [prefix];

    do {
      // SCAN returns [nextCursor, keysBatch]
      const [nextCursor, batch] = await this.redisClient.scan(
        cursor,
        'MATCH',
        '*', // We'll filter manually for multiple prefixes
        'COUNT',
        100,
      );

      cursor = nextCursor;

      // Filter batch for prefixes if needed
      const filtered = batch.filter((key) =>
        prefixes.some((p) => p === '*' || key.startsWith(p)),
      );

      keys.push(...filtered);
    } while (cursor !== '0');

    return keys;
  }

  async deleteKeys(keys: string[]): Promise<number> {
    if (!keys.length) return 0;

    // DEL can take multiple keys at once
    const deletedCount = await this.redisClient.del(...keys);
    return deletedCount;
  }
}
