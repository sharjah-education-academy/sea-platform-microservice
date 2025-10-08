import { Module } from '@nestjs/common';
import { Modules, Constants as BConstants } from 'sea-backend-helpers';
import { ConfigService } from '@nestjs/config';
import { Cache } from '@nestjs/cache-manager';

@Module({
  imports: [
    Modules.Remote.RemoteModule.forFeatureAsync(
      BConstants.Cache.getCacheModuleName(
        BConstants.Cache.CacheableModules.File,
      ),
      {
        inject: [ConfigService, Cache],
        useFactory: (config: ConfigService, cache: Cache) => ({
          baseURL: config.get<string>('FILE_MANAGER_BASE_URL'),
          auth: {
            username: config.get<string>('CALL_FILE_MANAGER_CLIENT_ID'),
            password: config.get<string>('CALL_FILE_MANAGER_CLIENT_SECRET'),
          },
          path: '/api/external/file-manager',
          model: BConstants.Cache.CacheableModules.File,
          cache: {
            get: (key) => cache.get(key),
            set: (key, value, ttl) => cache.set(key, value, ttl),
          },
        }),
      },
    ),
  ],
  exports: [Modules.Remote.RemoteModule],
})
export class RemoteFileManagerModule {}
