import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleService } from 'src/models/role/role.service';
import { roleProviders } from 'src/models/role/role.provider';
import { PermissionModule } from './permission.module';
import { RolePermissionModule } from './role-permission.module';
import { ApplicationModule } from './application.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    DatabaseModule,
    PermissionModule,
    RolePermissionModule,
    ApplicationModule,
    forwardRef(() => AuthModule),
  ],
  providers: [RoleService, ...roleProviders],
  exports: [RoleService],
})
export class RoleModule {}
