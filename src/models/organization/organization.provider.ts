import { Constants } from 'src/config';
import { Organization } from './organization.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const organizationProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.OrganizationRepository,
    useFactory: (sequelize) => sequelize.getRepository(Organization),
    inject: [DatabaseConnections.Main],
  },
];
