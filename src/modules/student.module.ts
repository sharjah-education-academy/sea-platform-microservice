import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { StudentService } from 'src/models/student/student.service';
import { studentProviders } from 'src/models/student/student.provider';

@Module({
  imports: [DatabaseModule],
  providers: [StudentService, ...studentProviders],
  exports: [StudentService],
})
export class StudentModule {}
