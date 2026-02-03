import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  async isHealthy(key: string, client: Redis): Promise<HealthIndicatorResult> {
    try {
      await client.ping(); // simple ping to Redis
      return this.getStatus(key, true);
    } catch (err) {
      const result = this.getStatus(key, false, { message: err.message });
      throw new HealthCheckError('Redis check failed', result);
    }
  }
}
