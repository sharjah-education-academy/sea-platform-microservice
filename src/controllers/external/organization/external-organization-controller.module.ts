import { Module } from '@nestjs/common';

import { ExternalOrganizationController } from './external-organization.controller';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { OrganizationModuleDependencies } from 'src/modules/organization.module';

@Module({
  controllers: [ExternalOrganizationController],
  providers: [...OrganizationModuleDependencies.providers, ServerConfigService],
})
export class ExternalOrganizationControllerModule {}
