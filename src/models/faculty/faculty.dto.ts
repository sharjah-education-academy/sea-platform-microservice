import { ApiProperty } from '@nestjs/swagger';
import { Faculty } from './faculty.model';

export class FacultyResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ nullable: true })
  address?: string;
  @ApiProperty({ nullable: true })
  designation?: string;
  @ApiProperty({ nullable: true })
  contactNumber?: string;
  constructor(faculty: Faculty) {
    this.name = faculty.name;
    this.email = faculty.email;
    this.address = faculty.address;
    this.designation = faculty.designation;
    this.contactNumber = faculty.contactNumber;
  }
}
