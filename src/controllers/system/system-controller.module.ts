import { Module } from '@nestjs/common';

import { SystemController } from './system.controller';
import { JwtModule } from '@nestjs/jwt';
import { SystemModule } from 'src/modules/system.module';

@Module({
  imports: [SystemModule, JwtModule],
  controllers: [SystemController],
  providers: [],
})
export class SystemControllerModule {}
