import { Module } from '@nestjs/common';

import { ExternalAccountController } from './external-account.controller';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { AccountModule } from 'src/modules/account.module';

@Module({
  imports: [AccountModule],
  controllers: [ExternalAccountController],
  providers: [ServerConfigService],
})
export class ExternalAccountControllerModule {}
