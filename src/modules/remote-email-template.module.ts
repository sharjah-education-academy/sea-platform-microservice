import { Module } from '@nestjs/common';
import { Modules } from 'sea-backend-helpers';
import { ConfigService } from '@nestjs/config';
import { Cache } from '@nestjs/cache-manager';
import { RemoteEmailTemplateService } from 'src/models/remote-email-template/remote-email-template.service';

@Module({
  imports: [
    Modules.Remote.RemoteModule.forFeatureAsync('Remote-Email-Template', {
      inject: [ConfigService, Cache],
      useFactory: (config: ConfigService, cache: Cache) => ({
        baseURL: config.get<string>('EMAIL_TEMPLATE_BASE_URL'),
        auth: {
          username: config.get<string>('CALL_EMAIL_TEMPLATE_CLIENT_ID'),
          password: config.get<string>('CALL_EMAIL_TEMPLATE_CLIENT_SECRET'),
        },
        path: '/api/email-templates',
        model: 'Email-Template',
        cache: {
          get: (key) => cache.get(key),
          set: (key, value, ttl) => cache.set(key, value, ttl),
        },
      }),
    }),
  ],
  providers: [RemoteEmailTemplateService],
  exports: [Modules.Remote.RemoteModule, RemoteEmailTemplateService],
})
export class RemoteEmailTemplateModule {}
