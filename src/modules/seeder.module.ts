import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { SeederService } from 'src/models/seeder/seeder.service';
import { AccountModule } from './account.module';
import { ApplicationModule } from './application.module';
import { RoleModule } from './role.module';
import { PermissionService } from 'src/models/permission/permission.service';
import { RemoteEmailTemplateModule } from './remote-email-template.module';
import { RemoteEmailTemplateVersionModule } from './remote-email-template-version.module';

@Module({
  imports: [
    DatabaseModule,
    AccountModule,
    ApplicationModule,
    RoleModule,
    RemoteEmailTemplateModule,
    RemoteEmailTemplateVersionModule,
  ],
  providers: [SeederService, PermissionService],
  exports: [SeederService],
})
export class SeederModule {}
