import { ApiProperty } from '@nestjs/swagger';
import { Faculty } from './faculty.model';

export class FacultyResponse {
  @ApiProperty()
  id: string;

  constructor(Faculty: Faculty) {
    this.id = Faculty.id;
  }
}
