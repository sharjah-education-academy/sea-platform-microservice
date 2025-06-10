import { Module } from '@nestjs/common';

import { SeederController } from './seeder.controller';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { SeederModule } from 'src/modules/seeder.module';

@Module({
  imports: [SeederModule],
  controllers: [SeederController],
  providers: [ServerConfigService],
})
export class SeederControllerModule {}
