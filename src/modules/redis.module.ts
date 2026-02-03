import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { Constants } from 'src/config';
import { RedisService } from 'src/models/redis/redis.service';

@Global()
@Module({
  providers: [
    {
      provide: Constants.Redis.RedisProvider,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
          username: process.env.REDIS_USERNAME || undefined,
          password: process.env.REDIS_PASSWORD || undefined,
        });
      },
    },
    RedisService,
  ],
  exports: [Constants.Redis.RedisProvider, RedisService],
})
export class RedisModule {}
