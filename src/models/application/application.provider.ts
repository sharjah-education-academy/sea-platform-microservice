import { Constants } from 'src/config';
import { Application } from './application.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const applicationProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.ApplicationRepository,
    useFactory: (sequelize) => sequelize.getRepository(Application),
    inject: [DatabaseConnections.Main],
  },
];
