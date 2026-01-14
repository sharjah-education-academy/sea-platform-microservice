import { Module } from '@nestjs/common';
import { CreatrixService } from 'src/models/creatrix/creatrix.service';
import { DatabaseModule } from 'src/database/database.module';
import { CreatrixStudentModule } from './creatrix-student.module';
import { StudentModule } from './student.module';
import { CreatrixFacultyModule } from './creatrix-faculty.module';
import { FacultyModule } from './faculty.module';
import { AccountModule } from './account.module';

@Module({
  imports: [
    DatabaseModule,
    CreatrixStudentModule,
    CreatrixFacultyModule,
    StudentModule,
    FacultyModule,
    AccountModule,
  ],
  providers: [CreatrixService],
  exports: [CreatrixService],
})
export class CreatrixModule {}
