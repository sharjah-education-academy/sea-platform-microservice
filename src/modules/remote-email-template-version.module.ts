import { Module } from '@nestjs/common';
import { Modules } from 'sea-backend-helpers';
import { ConfigService } from '@nestjs/config';
import { Cache } from '@nestjs/cache-manager';
import { RemoteEmailTemplateVersionService } from 'src/models/remote-email-template/remote-email-template-version.service';

@Module({
  imports: [
    Modules.Remote.RemoteModule.forFeatureAsync(
      'Remote-Email-Template-Version',
      {
        inject: [ConfigService, Cache],
        useFactory: (config: ConfigService, cache: Cache) => ({
          baseURL: config.get<string>('EMAIL_TEMPLATE_BASE_URL'),
          auth: {
            username: config.get<string>('CALL_EMAIL_TEMPLATE_CLIENT_ID'),
            password: config.get<string>('CALL_EMAIL_TEMPLATE_CLIENT_SECRET'),
          },
          path: '/api/email-templates',
          model: 'Email-Template-Version',
          cache: {
            get: (key) => cache.get(key),
            set: (key, value, ttl) => cache.set(key, value, ttl),
          },
        }),
      },
    ),
  ],
  providers: [RemoteEmailTemplateVersionService],
  exports: [Modules.Remote.RemoteModule, RemoteEmailTemplateVersionService],
})
export class RemoteEmailTemplateVersionModule {}
