import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleService } from 'src/models/role/role.service';
import { roleProviders } from 'src/models/role/role.provider';
import { PermissionModuleDependencies } from './permission.module';
import { RolePermissionModuleDependencies } from './role-permission.module';
import { AccountPermissionModuleDependencies } from './account-permission.module';
import { ApplicationModuleDependencies } from './application.module';

export const RoleModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    RoleService,
    ...roleProviders,
    ...PermissionModuleDependencies.providers,
    ...RolePermissionModuleDependencies.providers,
    ...AccountPermissionModuleDependencies.providers,
    ...ApplicationModuleDependencies.providers,
  ],
};

@Module({
  imports: [...RoleModuleDependencies.imports],
  providers: [...RoleModuleDependencies.providers],
})
export class RoleModule {}
