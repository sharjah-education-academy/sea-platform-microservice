import { Constants } from "src/config";
import { Student } from "./student.model";
import { DatabaseConnections } from "src/database/database.provider";

export const studentProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.StudentRepository,
    useFactory: (sequelize) => sequelize.getRepository(Student),
    inject: [DatabaseConnections.Main],
  },
];
