import { Module } from '@nestjs/common';
import { AccountModule } from 'src/modules/account.module';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { ExternalStudentsController } from './external-students.controller';

@Module({
  imports: [AccountModule],
  controllers: [ExternalStudentsController],
  providers: [ServerConfigService],
})
export class ExternalStudentsControllerModule {}
