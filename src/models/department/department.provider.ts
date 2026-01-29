import { Constants } from 'src/config';
import { Department } from './department.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const departmentProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.DepartmentRepository,
    useFactory: (sequelize) => sequelize.getRepository(Department),
    inject: [DatabaseConnections.Main],
  },
];
