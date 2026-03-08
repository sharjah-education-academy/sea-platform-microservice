import { ApiProperty } from '@nestjs/swagger';
import { Faculty } from './faculty.model';

export class FacultyResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

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
    this.id = faculty.id;
    this.accountId = faculty.accountId;
    this.name = faculty.name;
    this.email = faculty.email;
    this.address = faculty.address;
    this.designation = faculty.designation;
    this.contactNumber = faculty.contactNumber;
  }
}
