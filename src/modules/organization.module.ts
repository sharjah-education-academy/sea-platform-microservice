import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { organizationProviders } from 'src/models/organization/organization.provider';
import { OrganizationService } from 'src/models/organization/organization.service';
import { DepartmentModule } from './department.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => DepartmentModule)],
  providers: [OrganizationService, ...organizationProviders],
  exports: [OrganizationService], // ...DepartmentModuleDependencies.providers,
})
export class OrganizationModule {}
