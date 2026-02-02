import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { SyncService } from 'src/models/sync/sync.service';
import { AccountModule } from './account.module';
import { ApplicationModule } from './application.module';
import { RoleModule } from './role.module';
import { RemoteEmailTemplateModule } from './remote-email-template.module';
import { RemoteEmailTemplateVersionModule } from './remote-email-template-version.module';
import { CreatrixModule } from './creatrix.module';
import { ERPModule } from './erp.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [
    DatabaseModule,
    AccountModule,
    ApplicationModule,
    RoleModule,
    RemoteEmailTemplateModule,
    RemoteEmailTemplateVersionModule,
    CreatrixModule,
    ERPModule,
    PermissionModule,
  ],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
