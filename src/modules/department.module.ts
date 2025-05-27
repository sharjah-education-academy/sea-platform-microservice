import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { departmentProviders } from 'src/models/department/department.provider';
import { DepartmentService } from 'src/models/department/department.service';
import { OrganizationModule } from './organization.module';

export const DepartmentModuleDependencies = {
  imports: [DatabaseModule],
  providers: [DepartmentService, ...departmentProviders],
};

@Module({
  imports: [
    forwardRef(() => OrganizationModule),
    ...DepartmentModuleDependencies.imports,
  ],
  providers: [...DepartmentModuleDependencies.providers],
  exports: [...DepartmentModuleDependencies.providers],
})
export class DepartmentModule {}
