import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { creatrixFacultyProviders } from 'src/models/creatrix/faculty/faculty.provider';
import { CreatrixFacultyService } from 'src/models/creatrix/faculty/faculty.service';

@Module({
  imports: [DatabaseModule],
  providers: [CreatrixFacultyService, ...creatrixFacultyProviders],
  exports: [CreatrixFacultyService],
})
export class CreatrixFacultyModule {}
