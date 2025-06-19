import { Module } from '@nestjs/common';

import { StaticController } from './static.controller';
import { PermissionModule } from 'src/modules/permission.module';

@Module({
  imports: [PermissionModule],
  controllers: [StaticController],
})
export class StaticControllerModule {}
