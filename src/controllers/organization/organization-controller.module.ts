import { Module } from '@nestjs/common';

import { OrganizationController } from './organization.controller';
import { OrganizationModuleDependencies } from 'src/modules/organization.module';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  controllers: [OrganizationController],
  providers: [
    ...OrganizationModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class OrganizationControllerModule {}
