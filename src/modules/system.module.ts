import { Module } from '@nestjs/common';

import { SystemService } from 'src/models/system/system.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
