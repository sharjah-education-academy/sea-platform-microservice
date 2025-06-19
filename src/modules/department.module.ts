import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { departmentProviders } from 'src/models/department/department.provider';
import { DepartmentService } from 'src/models/department/department.service';
import { OrganizationModule } from './organization.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => OrganizationModule)],
  providers: [DepartmentService, ...departmentProviders],
  exports: [DepartmentService],
})
export class DepartmentModule {}
