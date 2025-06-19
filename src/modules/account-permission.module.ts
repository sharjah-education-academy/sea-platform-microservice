import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountPermissionProviders } from 'src/models/account-permission/account-permission.provider';
import { AccountPermissionService } from 'src/models/account-permission/account-permission.service';
import { PermissionModule } from './permission.module';

@Module({
  imports: [DatabaseModule, PermissionModule],
  providers: [AccountPermissionService, ...accountPermissionProviders],
  exports: [AccountPermissionService],
})
export class AccountPermissionModule {}
