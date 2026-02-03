import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { Sequelize } from 'sequelize-typescript';
import { Constants } from 'src/config';
import { DatabaseConnections } from 'src/database/database.provider';
import { RedisHealthIndicator } from 'src/indicators/redis-health.indicator';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private sequelizeIndicator: SequelizeHealthIndicator,
    private redisIndicator: RedisHealthIndicator,

    @Inject(DatabaseConnections.Main) private mainDB: Sequelize,
    @Inject(DatabaseConnections.Creatrix) private creatrixDB: Sequelize,
    @Inject(Constants.Redis.RedisProvider)
    private readonly redisClient: Redis,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.sequelizeIndicator.pingCheck(DatabaseConnections.Main, {
          connection: this.mainDB,
        }),
      async () =>
        this.sequelizeIndicator.pingCheck(DatabaseConnections.Creatrix, {
          connection: this.creatrixDB,
        }),
      async () =>
        this.redisIndicator.isHealthy(
          Constants.Redis.RedisProvider,
          this.redisClient,
        ),
    ]);
  }
}
