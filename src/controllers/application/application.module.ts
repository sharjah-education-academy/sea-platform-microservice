import { Module } from '@nestjs/common';

import { ApplicationController } from './application.controller';
import { ApplicationModule } from 'src/modules/application.module';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  imports: [ApplicationModule],
  controllers: [ApplicationController],
  providers: [JwtService, ServerConfigService],
})
export class ApplicationControllerModule {}
