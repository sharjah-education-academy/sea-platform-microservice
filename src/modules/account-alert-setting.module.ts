import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountAlertSettingProviders } from 'src/models/account-alert-setting/account-alert-setting.provider';
import { AccountAlertSettingService } from 'src/models/account-alert-setting/account-alert-setting.service';

@Module({
  imports: [DatabaseModule],
  providers: [AccountAlertSettingService, ...accountAlertSettingProviders],
  exports: [AccountAlertSettingService],
})
export class AccountAlertSettingModule {}
