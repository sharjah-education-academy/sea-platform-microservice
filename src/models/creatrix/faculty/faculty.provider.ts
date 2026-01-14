import { Constants } from "src/config";
import { DatabaseConnections } from "src/database/database.provider";
import { CreatrixFaculty } from "./faculty.model";

export const creatrixFacultyProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.CreatrixFacultyRepository,
    useFactory: (sequelize) => sequelize.getRepository(CreatrixFaculty),
    inject: [DatabaseConnections.Creatrix],
  },
];
