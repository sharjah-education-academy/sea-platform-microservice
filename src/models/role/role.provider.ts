import { Constants } from 'src/config';
import { Role } from './role.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const roleProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.RoleRepository,
    useFactory: (sequelize) => sequelize.getRepository(Role),
    inject: [DatabaseConnections.Main],
  },
];
