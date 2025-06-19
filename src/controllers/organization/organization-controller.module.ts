import { Module } from '@nestjs/common';

import { OrganizationController } from './organization.controller';
import { OrganizationModule } from 'src/modules/organization.module';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { DepartmentModule } from 'src/modules/department.module';

@Module({
  imports: [OrganizationModule, DepartmentModule],
  controllers: [OrganizationController],
  providers: [JwtService, ServerConfigService],
})
export class OrganizationControllerModule {}
