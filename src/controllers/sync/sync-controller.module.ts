import { Module } from '@nestjs/common';

import { SyncController } from './sync.controller';
import { SyncModule } from 'src/modules/sync.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SyncModule, JwtModule],
  controllers: [SyncController],
  providers: [],
})
export class SyncControllerModule {}
