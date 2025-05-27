import { Module } from '@nestjs/common';

import { ExternalAccountController } from './external-account.controller';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { AccountModuleDependencies } from 'src/modules/account.module';

@Module({
  controllers: [ExternalAccountController],
  providers: [...AccountModuleDependencies.providers, ServerConfigService],
})
export class ExternalAccountControllerModule {}
