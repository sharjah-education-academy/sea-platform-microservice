import { Module } from '@nestjs/common';

import { ExternalOrganizationController } from './external-organization.controller';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { OrganizationModule } from 'src/modules/organization.module';

@Module({
  imports: [OrganizationModule],
  controllers: [ExternalOrganizationController],
  providers: [ServerConfigService],
})
export class ExternalOrganizationControllerModule {}
