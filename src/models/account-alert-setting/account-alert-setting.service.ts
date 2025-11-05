import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { AccountAlertSetting } from './account-alert-setting.model';
import { AccountAlertSettingsResponse } from './account-alert-setting.dto';
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

  async makeAccountAlertsSettingsResponse(account: Account) {
    const alertSettings = await this.getAlertSettings(account);

    return new AccountAlertSettingsResponse(alertSettings);
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
