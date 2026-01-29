import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { creatrixStudentProviders } from 'src/models/creatrix/student/student.provider';
import { CreatrixStudentService } from 'src/models/creatrix/student/student.service';

@Module({
  imports: [DatabaseModule],
  providers: [CreatrixStudentService, ...creatrixStudentProviders],
  exports: [CreatrixStudentService],
})
export class CreatrixStudentModule {}
