import { Module } from '@nestjs/common';
import { EmployeeService } from 'src/models/erp/employee/employee.service';
import { RemoteERPService } from 'src/models/erp/remote-erp.service';
import { ServerConfigModule } from './server-config.module';
import { ERPService } from 'src/models/erp/erp.service';
import { RoleModule } from './role.module';
import { AccountModule } from './account.module';

@Module({
  imports: [ServerConfigModule, RoleModule, AccountModule],
  providers: [ERPService, RemoteERPService, EmployeeService],
  exports: [ERPService, RemoteERPService, EmployeeService],
})
export class ERPModule {}
