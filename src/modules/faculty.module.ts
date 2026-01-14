import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { FacultyService } from 'src/models/faculty/faculty.service';
import { facultyProviders } from 'src/models/faculty/faculty.provider';

@Module({
  imports: [DatabaseModule],
  providers: [FacultyService, ...facultyProviders],
  exports: [FacultyService],
})
export class FacultyModule {}
