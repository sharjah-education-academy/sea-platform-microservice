import { Constants } from 'src/config';
import { Localization } from './localization.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const localizationProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.LocalizationRepository,
    useFactory: (sequelize) => sequelize.getRepository(Localization),
    inject: [DatabaseConnections.Main],
  },
];
