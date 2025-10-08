import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { applicationProviders } from 'src/models/application/application.provider';
import { ApplicationService } from 'src/models/application/application.service';
import { RemoteFileManagerModule } from './remote-file-manager.module';

@Module({
  imports: [DatabaseModule, RemoteFileManagerModule],
  providers: [ApplicationService, ...applicationProviders],
  exports: [ApplicationService],
})
export class ApplicationModule {}
