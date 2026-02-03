// sequelize-health.indicator.ts
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SequelizeHealthIndicator extends HealthIndicator {
  constructor(private readonly sequelize: Sequelize) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple query to check DB connectivity
      await this.sequelize.authenticate();

      return this.getStatus(key, true);
    } catch (err) {
      const result = this.getStatus(key, false, { message: err.message });
      throw new HealthCheckError('Database check failed', result);
    }
  }
}
