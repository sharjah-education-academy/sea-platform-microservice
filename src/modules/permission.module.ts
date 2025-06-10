import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { permissionProviders } from 'src/models/permission/permission.provider';
import { PermissionService } from 'src/models/permission/permission.service';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionService, ...permissionProviders],
  exports: [PermissionService],
})
export class PermissionModule {}
