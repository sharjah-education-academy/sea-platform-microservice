import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountProviders } from 'src/models/account/account.provider';
import { AccountService } from 'src/models/account/account.service';
import { RoleModule } from './role.module';
import { OrganizationModule } from './organization.module';
import { DepartmentModule } from './department.module';
import { ApplicationModule } from './application.module';
import { AccountAlertSettingModule } from './account-alert-setting.module';
import { StudentModule } from './student.module';
import { FacultyModule } from './faculty.module';
import { EmployeeModule } from './employee.module';

@Module({
  imports: [
    DatabaseModule,
    RoleModule,
    OrganizationModule,
    DepartmentModule,
    ApplicationModule,
    AccountAlertSettingModule,
    StudentModule,
    FacultyModule,
    EmployeeModule,
  ],
  providers: [AccountService, ...accountProviders],
  exports: [AccountService],
})
export class AccountModule {}
