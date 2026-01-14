import { Injectable } from '@nestjs/common';

import { CreatrixStudentService } from './student/student.service';
import { CreatrixFacultyService } from './faculty/faculty.service';
import { StudentService } from '../student/student.service';
import { FacultyService } from '../faculty/faculty.service';
import { AccountService } from '../account/account.service';

@Injectable()
export class CreatrixService {
  constructor(
    private readonly creatrixStudentService: CreatrixStudentService,
    private readonly creatrixFacultyService: CreatrixFacultyService,
    private readonly studentService: StudentService,
    private readonly facultyService: FacultyService,
    private readonly accountService: AccountService,
  ) {}

  async syncStudents() {
    const data = await this.creatrixStudentService.repository.findAll();

    // for (const record of data) {
    //   await this.studentService.createOrUpdate({
    //     name: record.name,
    //     email: record.email,
    //     SSNNo: record.ssno,
    //   });
    // }

    return { length: data.length, data };
  }

  async syncFaculties() {
    const data = await this.creatrixFacultyService.repository.findAll();

    // for (const record of data) {
    //   await this.facultyService.createOrUpdate({
    //     name: record.name,
    //     email: record.email,
    //   });
    // }

    return { length: data.length, data };
  }
}
