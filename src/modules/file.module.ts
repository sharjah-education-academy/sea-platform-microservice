import { Module } from '@nestjs/common';
import { FileService } from 'src/models/file/file.service';
import { HttpProvidersModule } from './http-providers.module';

@Module({
  imports: [HttpProvidersModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
