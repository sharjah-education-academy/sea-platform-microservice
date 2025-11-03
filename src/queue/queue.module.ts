import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ServerConfigModule } from 'src/modules/server-config.module';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { Constants, Services } from 'sea-backend-helpers';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: Constants.Queue.Name,
      imports: [ServerConfigModule],
      inject: [ServerConfigService],
      useFactory: (serverConfigService: ServerConfigService) => ({
        connection: {
          host: serverConfigService.get<string>('REDIS_HOST'),
          port: serverConfigService.get<number>('REDIS_PORT'),
          password: serverConfigService.get<string>('REDIS_PASSWORD') || '',
        },
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3, // retry up to 3 times
          backoff: {
            type: 'exponential', // or 'fixed'
            delay: 1000, // in ms, for fixed or as base delay for exponential
          },
        },
      }),
    }),
  ],
  providers: [Services.QueueService],
  exports: [Services.QueueService],
})
export class QueueModule {}
