import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { EmployeeService } from 'src/models/employee/employee.service';
import { employeeProviders } from 'src/models/employee/employee.provider';

@Module({
  imports: [DatabaseModule],
  providers: [EmployeeService, ...employeeProviders],
  exports: [EmployeeService],
})
export class EmployeeModule {}
