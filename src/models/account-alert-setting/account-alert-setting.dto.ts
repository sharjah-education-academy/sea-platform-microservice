import { ApiProperty } from '@nestjs/swagger';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import { AccountAlertSetting } from './account-alert-setting.model';

export class AccountAlertSettingResponse {
  @ApiProperty()
  name: string;
  @ApiProperty({ nullable: true })
  description?: string;
  @ApiProperty({ enum: CONSTANTS.AccountAlertSetting.AlertActions })
  action: CONSTANTS.AccountAlertSetting.AlertActions;
  @ApiProperty({ type: Boolean })
  emailEnabled: boolean;
  @ApiProperty({ type: Boolean })
  notificationEnabled: boolean;

  constructor(
    alertSetting: AccountAlertSetting | undefined,
    alert: DTO.AccountAlertSetting.IAlert,
  ) {
    this.name = alert.name;
    this.description = alert.description;
    this.action = alert.action;
    this.emailEnabled = alertSetting?.emailEnabled ?? false;
    this.notificationEnabled = alertSetting?.notificationEnabled ?? false;
  }
}

export class AccountAlertGroupSettingGroup {
  @ApiProperty()
  key: DTO.AccountAlertSetting.AlertGroupKeys;
  @ApiProperty()
  name: string;
  @ApiProperty({ nullable: true })
  description?: string;
  @ApiProperty({
    nullable: true,
    type: AccountAlertGroupSettingGroup,
    isArray: true,
  })
  children?: AccountAlertGroupSettingGroup[];
  @ApiProperty({
    nullable: true,
    type: AccountAlertSettingResponse,
    isArray: true,
  })
  settings?: AccountAlertSettingResponse[];

  constructor(
    group: DTO.AccountAlertSetting.IAlertGroup,
    children?: AccountAlertGroupSettingGroup[],
    settings?: AccountAlertSettingResponse[],
  ) {
    this.key = group.key;
    this.name = group.name;
    this.description = group.description;
    this.children = children;
    this.settings = settings;
  }
}
