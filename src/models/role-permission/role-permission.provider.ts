import { Constants } from 'src/config';
import { RolePermission } from './role-permission.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const rolePermissionProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.RolePermissionRepository,
    useFactory: (sequelize) => sequelize.getRepository(RolePermission),
    inject: [DatabaseConnections.Main],
  },
];
