import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { AccountAlertSetting } from './account-alert-setting.model';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import {
  AccountAlertGroupSettingGroup,
  AccountAlertSettingResponse,
} from './account-alert-setting.dto';
import { Account } from '../account/account.model';
import { UpdateAlertSettingDTO } from 'src/controllers/auth/auth.dto';
import { Attributes, FindOptions } from 'sequelize';

@Injectable()
export class AccountAlertSettingService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories.AccountAlertSettingRepository,
    )
    private accountAlertSettingRepository: typeof AccountAlertSetting,
  ) {}

  async findOne(options?: FindOptions<Attributes<AccountAlertSetting>>) {
    return await this.accountAlertSettingRepository.findOne(options);
  }

  private async getAlertSettings(account: Account) {
    return account.accountAlertSettings
      ? account.accountAlertSettings
      : account.$get('accountAlertSettings');
  }

  private async makeAccountAlertSettingResponse(
    alertSettings: AccountAlertSetting[],
    alert: DTO.AccountAlertSetting.IAlert,
  ) {
    const alertSetting = alertSettings.find((a) => a.action === alert.action);
    return new AccountAlertSettingResponse(alertSetting, alert);
  }

  private async makeAccountAlertSettingsResponse(
    alertSettings: AccountAlertSetting[],
    alerts: DTO.AccountAlertSetting.IAlert[],
  ) {
    return await Promise.all(
      alerts.map((a) => this.makeAccountAlertSettingResponse(alertSettings, a)),
    );
  }

  private async makeAccountAlertGroupSettingsResponse(
    alertSettings: AccountAlertSetting[],
    group: DTO.AccountAlertSetting.IAlertGroup,
  ) {
    const settings = group.alerts
      ? await this.makeAccountAlertSettingsResponse(alertSettings, group.alerts)
      : null;

    const children = group.children
      ? await this.makeAccountAlertGroupsSettingsResponse(
          alertSettings,
          group.children,
        )
      : null;

    return new AccountAlertGroupSettingGroup(group, children, settings);
  }

  private async makeAccountAlertGroupsSettingsResponse(
    alertSettings: AccountAlertSetting[],
    groups: DTO.AccountAlertSetting.IAlertGroup[],
  ) {
    return await Promise.all(
      groups.map((g) =>
        this.makeAccountAlertGroupSettingsResponse(alertSettings, g),
      ),
    );
  }

  async makeAccountAlertsSettingsResponse(account: Account) {
    const alertSettings = await this.getAlertSettings(account);

    return await this.makeAccountAlertGroupsSettingsResponse(
      alertSettings,
      CONSTANTS.AccountAlertSetting.ALERTS,
    );
  }

  async create(data: Partial<AccountAlertSetting>) {
    return await this.accountAlertSettingRepository.create(data);
  }
  async update(
    setting: AccountAlertSetting,
    data: Partial<AccountAlertSetting>,
  ) {
    return await setting.update(data);
  }

  async updateAlertSetting(account: Account, data: UpdateAlertSettingDTO) {
    let setting = await this.findOne({
      where: {
        accountId: account.id,
        action: data.action,
      },
    });

    if (setting)
      setting = await this.update(setting, {
        emailEnabled: data.emailEnabled,
        notificationEnabled: data.notificationEnabled,
      });
    else
      setting = await this.create({
        accountId: account.id,
        action: data.action,
        emailEnabled: data.emailEnabled,
        notificationEnabled: data.notificationEnabled,
      });

    return setting;
  }

  async updateAlertSettings(
    account: Account,
    settings: UpdateAlertSettingDTO[],
  ) {
    return await Promise.all(
      settings.map((s) => this.updateAlertSetting(account, s)),
    );
  }
}
