import { Constants } from 'src/config';
import { Faculty } from './faculty.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const facultyProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.FacultyRepository,
    useFactory: (sequelize) => sequelize.getRepository(Faculty),
    inject: [DatabaseConnections.Main],
  },
];
