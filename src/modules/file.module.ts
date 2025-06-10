import { Module } from '@nestjs/common';
import { HttpClientConfigService } from 'src/common/global.service';
import { FileService } from 'src/models/file/file.service';
import { ServerConfigModule } from './server-config.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ServerConfigModule],
  providers: [FileService, HttpClientConfigService],
  exports: [FileService],
})
export class FileModule {}
