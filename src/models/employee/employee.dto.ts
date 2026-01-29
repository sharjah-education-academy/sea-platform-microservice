import { ApiProperty } from '@nestjs/swagger';
import { Employee } from './employee.model';

export class EmployeeResponse {
  @ApiProperty({ nullable: true })
  salutation?: string;
  @ApiProperty()
  personNumber: string;
  @ApiProperty({ type: Number })
  personId: number;
  @ApiProperty()
  firstName: string;
  @ApiProperty({ nullable: true })
  middleName?: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  workEmail: string;
  @ApiProperty()
  username: string;
  @ApiProperty({ nullable: true })
  gender?: string;
  @ApiProperty({ type: String, format: 'date' })
  hireDate: Date;

  constructor(employee: Employee) {
    this.salutation = employee.salutation;
    this.personNumber = employee.personNumber;
    this.personId = employee.personId;
    this.firstName = employee.firstName;
    this.middleName = employee.middleName;
    this.lastName = employee.lastName;
    this.displayName = employee.displayName;
    this.workEmail = employee.workEmail;
    this.username = employee.username;
    this.gender = employee.gender;
    this.hireDate = employee.hireDate;
  }
}
