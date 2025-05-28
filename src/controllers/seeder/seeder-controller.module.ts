import { Module } from '@nestjs/common';

import { SeederController } from './seeder.controller';
import { SeederModuleDependencies } from 'src/modules/seeder.module';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  controllers: [SeederController],
  providers: [ServerConfigService, ...SeederModuleDependencies.providers],
})
export class SeederControllerModule {}
