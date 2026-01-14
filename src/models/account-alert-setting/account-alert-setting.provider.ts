import { Constants } from 'src/config';
import { AccountAlertSetting } from './account-alert-setting.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const accountAlertSettingProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories.AccountAlertSettingRepository,
    useFactory: (sequelize) => sequelize.getRepository(AccountAlertSetting),
    inject: [DatabaseConnections.Main],
  },
];
