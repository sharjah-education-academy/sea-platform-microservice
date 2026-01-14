import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.model';

export class StudentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  SSNNo: string;

  constructor(student: Student) {
    this.id = student.id;
    this.SSNNo = student.SSNNo;
  }
}
