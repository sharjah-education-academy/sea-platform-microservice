import { Module } from '@nestjs/common';
import { Modules } from 'sea-backend-helpers';
import { ConfigService } from '@nestjs/config';
import { Cache } from '@nestjs/cache-manager';

@Module({
  imports: [
    Modules.Remote.RemoteModule.forFeatureAsync('Remote-File', {
      inject: [ConfigService, Cache],
      useFactory: (config: ConfigService, cache: Cache) => ({
        baseURL: config.get<string>('FILE_MANAGER_BASE_URL'),
        auth: {
          username: config.get<string>('CALL_FILE_MANAGER_CLIENT_ID'),
          password: config.get<string>('CALL_FILE_MANAGER_CLIENT_SECRET'),
        },
        path: '/api/external/file-manager',
        model: 'File',
        cache: {
          get: (key) => cache.get(key),
          set: (key, value, ttl) => cache.set(key, value, ttl),
        },
      }),
    }),
  ],
  exports: [Modules.Remote.RemoteModule],
})
export class RemoteFileManagerModule {}
