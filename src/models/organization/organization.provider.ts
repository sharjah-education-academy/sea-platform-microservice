import { Constants } from 'src/config';
import { Organization } from './organization.model';

export const organizationProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.OrganizationRepository,
    useValue: Organization,
  },
];
