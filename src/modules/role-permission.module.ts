import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { rolePermissionProviders } from 'src/models/role-permission/role-permission.provider';
import { RolePermissionService } from 'src/models/role-permission/role-permission.service';
import { PermissionModule } from './permission.module';

@Module({
  imports: [DatabaseModule, PermissionModule],
  providers: [RolePermissionService, ...rolePermissionProviders],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
