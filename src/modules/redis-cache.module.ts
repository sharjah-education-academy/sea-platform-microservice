import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { ServerConfigModule } from './server-config.module';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ServerConfigModule],
      inject: [ServerConfigService],
      isGlobal: true,
      useFactory: async (serverConfigService: ServerConfigService) => {
        return {
          stores: [
            new KeyvRedis({
              socket: {
                host: serverConfigService.get<string>('REDIS_HOST'),
                port: serverConfigService.get<number>('REDIS_PORT'),
              },
              username: serverConfigService.get<string>('REDIS_USERNAME') || '',
              password: serverConfigService.get<string>('REDIS_PASSWORD') || '',
            }),
          ],
          ttl: 1000 * 3600,
        };
      },
    }),
  ],
  exports: [CacheModule],
  providers: [],
})
export class RedisCacheModule {}
