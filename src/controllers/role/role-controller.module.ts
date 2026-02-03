import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { RoleController } from './role.controller';
import { RoleModule } from 'src/modules/role.module';
import { ApplicationModule } from 'src/modules/application.module';

@Module({
  imports: [RoleModule, ApplicationModule],
  controllers: [RoleController],
  providers: [JwtService, ServerConfigService],
})
export class RoleControllerModule {}
