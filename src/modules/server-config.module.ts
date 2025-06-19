import { Module } from '@nestjs/common';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  imports: [],
  providers: [ServerConfigService],
  exports: [ServerConfigService],
})
export class ServerConfigModule {}
