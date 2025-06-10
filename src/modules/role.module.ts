import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleService } from 'src/models/role/role.service';
import { roleProviders } from 'src/models/role/role.provider';
import { PermissionModule } from './permission.module';
import { RolePermissionModule } from './role-permission.module';
import { AccountPermissionModule } from './account-permission.module';
import { ApplicationModule } from './application.module';

@Module({
  imports: [
    DatabaseModule,
    PermissionModule,
    RolePermissionModule,
    AccountPermissionModule,
    ApplicationModule,
  ],
  providers: [RoleService, ...roleProviders],
  exports: [RoleService],
})
export class RoleModule {}
