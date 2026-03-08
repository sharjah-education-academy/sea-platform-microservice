import { Module } from '@nestjs/common';
import { FacultyModule } from 'src/modules/faculty.module';
import { ExternalFacultyController } from './external-faculty.controller';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  imports: [FacultyModule],
  controllers: [ExternalFacultyController],
  providers: [ServerConfigService],
})
export class ExternalFacultyControllerModule {}
