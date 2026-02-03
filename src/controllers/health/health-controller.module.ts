import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from 'src/database/database.module';
import { RedisHealthIndicator } from 'src/indicators/redis-health.indicator';

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthControllerModule {}
