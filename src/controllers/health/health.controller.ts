import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { Sequelize } from 'sequelize-typescript';
import * as os from 'os';
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
  async check() {
    // ---------- App Info ----------
    const appInfo = {
      serviceName: process.env.SERVICE_NAME || 'sea-platform-microservice',
      env: process.env.NODE_ENV || 'development',
      uptime: process.uptime(), // seconds
      pid: process.pid,
    };

    // ---------- System Metrics ----------
    const systemInfo = {
      cpuPercent: ((os.loadavg()[0] / os.cpus().length) * 100).toFixed(2),
      memoryMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
      loadAverage: os.loadavg().map((x) => x.toFixed(2)),
    };

    // ---------- Database Metrics ----------
    const getDbStats = async (key: string, db: Sequelize) => {
      const start = Date.now();
      try {
        await db.authenticate();
        const latency = Date.now() - start;

        return {
          status: 'up',
          latencyMs: latency,
          // Optional: configured pool info
          pool: db.options.pool
            ? {
                max: db.options.pool.max,
                min: db.options.pool.min,
                idle: db.options.pool.idle,
              }
            : null,
        };
      } catch (err) {
        return {
          status: 'down',
          message: err.message,
        };
      }
    };

    const mainDBStats = await getDbStats('mainDB', this.mainDB);
    const creatrixDBStats = await getDbStats('creatrixDB', this.creatrixDB);

    // ---------- Redis Metrics ----------
    const getRedisStats = async (key: string, client: Redis) => {
      const start = Date.now();
      try {
        await client.ping();
        const pingLatency = Date.now() - start;

        const info = await client.info();
        const usedMemoryMatch = info.match(/used_memory:(\d+)/);
        const usedMemoryMB = usedMemoryMatch
          ? parseInt(usedMemoryMatch[1], 10) / 1024 / 1024
          : 0;

        const totalKeys = await client.dbsize();

        return {
          status: 'up',
          pingLatencyMs: pingLatency,
          usedMemoryMB: usedMemoryMB.toFixed(2),
          totalKeys,
        };
      } catch (err) {
        return {
          status: 'down',
          message: err.message,
        };
      }
    };

    const redisStats = await getRedisStats(
      Constants.Redis.RedisProvider,
      this.redisClient,
    );

    // ---------- Assemble Full Response ----------
    const overallStatus =
      mainDBStats.status === 'up' &&
      creatrixDBStats.status === 'up' &&
      redisStats.status === 'up'
        ? 'ok'
        : 'error';

    return {
      status: overallStatus,
      app: appInfo,
      system: systemInfo,
      databases: {
        mainDB: mainDBStats,
        creatrixDB: creatrixDBStats,
      },
      caches: {
        [Constants.Redis.RedisProvider]: redisStats,
      },
    };
  }
}
