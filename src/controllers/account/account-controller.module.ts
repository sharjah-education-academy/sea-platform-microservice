import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { AccountModule } from 'src/modules/account.module';

@Module({
  imports: [AccountModule],
  controllers: [AccountController],
  providers: [JwtService, ServerConfigService],
})
export class AccountControllerModule {}
