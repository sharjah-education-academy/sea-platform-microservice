import { Constants } from 'src/config';
import { Account } from './account.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const accountProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.AccountRepository,
    useFactory: (sequelize) => sequelize.getRepository(Account),
    inject: [DatabaseConnections.Main],
  },
];
