import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { organizationProviders } from 'src/models/organization/organization.provider';
import { OrganizationService } from 'src/models/organization/organization.service';
import {
  DepartmentModule,
  DepartmentModuleDependencies,
} from './department.module';

export const OrganizationModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    OrganizationService,
    ...organizationProviders,
    ...DepartmentModuleDependencies.providers,
  ],
};

@Module({
  imports: [
    forwardRef(() => DepartmentModule),
    ...OrganizationModuleDependencies.imports,
  ],
  providers: [...OrganizationModuleDependencies.providers],
  exports: [...OrganizationModuleDependencies.providers],
})
export class OrganizationModule {}
