import { ApiProperty } from '@nestjs/swagger';
import { Application } from './application.model';
import { CONSTANTS, DTO } from 'sea-platform-helpers';

export class ApplicationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: CONSTANTS.Application.ApplicationKeys })
  key: CONSTANTS.Application.ApplicationKeys;
  @ApiProperty({ required: false })
  description: string | undefined;
  // TODO
  @ApiProperty({ type: Object, nullable: true })
  iconFile: DTO.File.IFile | undefined;
  @ApiProperty({
    enum: CONSTANTS.Application.ApplicationStatuses,
  })
  status: CONSTANTS.Application.ApplicationStatuses;
  @ApiProperty()
  URL: string;

  constructor(application: Application, iconFile: DTO.File.IFile | undefined) {
    this.id = application.id;
    this.name = application.name;
    this.key = application.key;
    this.description = application.description;
    this.iconFile = iconFile;
    this.status = application.status;
    this.URL = application.URL;
  }
}
