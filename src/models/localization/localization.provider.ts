import { Constants } from 'src/config';
import { Localization } from './localization.model';

export const localizationProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.LocalizationRepository,
    useValue: Localization,
  },
];
