import { Constants } from 'src/config';
import { Department } from './department.model';

export const departmentProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.DepartmentRepository,
    useValue: Department,
  },
];
