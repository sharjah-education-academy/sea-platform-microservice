import { Constants } from 'src/config';
import { AccountAlertSetting } from './account-alert-setting.model';

export const accountAlertSettingProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories.AccountAlertSettingRepository,
    useValue: AccountAlertSetting,
  },
];
