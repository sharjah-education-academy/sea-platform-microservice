import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { AccountModuleDependencies } from 'src/modules/account.module';

@Module({
  controllers: [AccountController],
  providers: [
    ...AccountModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class AccountControllerModule {}
