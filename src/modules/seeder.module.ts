import { Module } from '@nestjs/common';

import { SeederService } from 'src/models/seeder/seeder.service';
import { SyncModule } from './sync.module';
import { ServerConfigModule } from './server-config.module';
import { RoleModule } from './role.module';
import { AccountModule } from './account.module';
import { AccountAlertSettingModule } from './account-alert-setting.module';

@Module({
  imports: [
    SyncModule,
    ServerConfigModule,
    RoleModule,
    AccountModule,
    AccountAlertSettingModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
