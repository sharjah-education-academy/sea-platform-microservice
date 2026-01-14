import { Constants } from 'src/config';
import { DatabaseConnections } from 'src/database/database.provider';
import { CreatrixStudent } from './student.model';

export const creatrixStudentProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.CreatrixStudentRepository,
    useFactory: (sequelize) => sequelize.getRepository(CreatrixStudent),
    inject: [DatabaseConnections.Creatrix],
  },
];
