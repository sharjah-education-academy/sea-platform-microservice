import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { RoleController } from './role.controller';
import { RoleModuleDependencies } from 'src/modules/role.module';

@Module({
  controllers: [RoleController],
  providers: [
    ...RoleModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class RoleControllerModule {}
