import { Constants } from 'src/config';
import { Employee } from './employee.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const employeeProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.EmployeeRepository,
    useFactory: (sequelize) => sequelize.getRepository(Employee),
    inject: [DatabaseConnections.Main],
  },
];
