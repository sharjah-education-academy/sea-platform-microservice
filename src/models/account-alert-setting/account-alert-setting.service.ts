import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { AccountAlertSetting } from './account-alert-setting.model';
import { AccountAlertSettingsResponse } from './account-alert-setting.dto';
import { Account } from '../account/account.model';
import { UpdateAlertSettingDTO } from 'src/controllers/auth/auth.dto';
import { Attributes, FindOptions, Op } from 'sequelize';
import { CONSTANTS } from 'sea-platform-helpers';

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

  /**
   * Ensures every account has a row for every alert action, and forces
   * both `emailEnabled` and `notificationEnabled` to true.
   *
   * Idempotent: safe to run multiple times.
   */
  async activateAlertsForAccounts(
    accountIds: string[],
    batchSize = 500,
  ): Promise<{ accountsProcessed: number; created: number; updated: number }> {
    const actions = Object.values(
      CONSTANTS.AccountAlertSetting.AlertActions,
    ) as CONSTANTS.AccountAlertSetting.AlertActions[];

    let created = 0;
    let updated = 0;

    for (let i = 0; i < accountIds.length; i += batchSize) {
      const batchAccountIds = accountIds.slice(i, i + batchSize);

      const existing = await this.accountAlertSettingRepository.findAll({
        where: {
          accountId: { [Op.in]: batchAccountIds },
          action: { [Op.in]: actions },
        },
        attributes: [
          'id',
          'accountId',
          'action',
          'emailEnabled',
          'notificationEnabled',
        ],
      });

      const existingKeySet = new Set(
        existing.map((s) => `${s.accountId}:${s.action}`),
      );

      const toUpdateIds = existing
        .filter(
          (s) => s.emailEnabled !== true || s.notificationEnabled !== true,
        )
        .map((s) => s.id);

      if (toUpdateIds.length > 0) {
        await this.accountAlertSettingRepository.update(
          { emailEnabled: true, notificationEnabled: true },
          { where: { id: { [Op.in]: toUpdateIds } } },
        );
        updated += toUpdateIds.length;
      }

      const toCreate: Array<
        Pick<
          AccountAlertSetting,
          'accountId' | 'action' | 'emailEnabled' | 'notificationEnabled'
        >
      > = [];

      for (const accountId of batchAccountIds) {
        for (const action of actions) {
          const key = `${accountId}:${action}`;
          if (!existingKeySet.has(key)) {
            toCreate.push({
              accountId,
              action,
              emailEnabled: true,
              notificationEnabled: true,
            });
          }
        }
      }

      if (toCreate.length > 0) {
        await this.accountAlertSettingRepository.bulkCreate(toCreate as any[]);
        created += toCreate.length;
      }
    }

    console.log(
      `Activated alert settings for ${accountIds.length} accounts: ${created} created, ${updated} updated.`,
    );
    return { accountsProcessed: accountIds.length, created, updated };
  }
}
