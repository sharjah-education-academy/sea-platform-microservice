import { ApiProperty } from '@nestjs/swagger';
import { CONSTANTS } from 'sea-platform-helpers';
import { AccountAlertSetting } from './account-alert-setting.model';

export class AlertSettingResponse {
  @ApiProperty({ type: Boolean })
  emailEnabled: boolean;
  @ApiProperty({ type: Boolean })
  notificationEnabled: boolean;

  constructor(emailEnabled: boolean, notificationEnabled: boolean) {
    this.emailEnabled = emailEnabled;
    this.notificationEnabled = notificationEnabled;
  }
}

export class AccountAlertSettingsResponse {
  constructor(alertSettings: AccountAlertSetting[]) {
    Object.values(CONSTANTS.AccountAlertSetting.AlertActions).forEach(
      (value) => {
        const found = alertSettings.find((a) => a.action === value);
        this[value] = found
          ? new AlertSettingResponse(
              found.emailEnabled,
              found.notificationEnabled,
            )
          : new AlertSettingResponse(false, false);
      },
    );
  }
}
