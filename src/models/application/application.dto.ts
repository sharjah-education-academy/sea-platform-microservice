import { ApiProperty } from '@nestjs/swagger';
import { Application } from './application.model';
import { FileResponse } from '../file/file.dto';
import { CONSTANTS } from 'sea-platform-helpers';

export class ApplicationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: CONSTANTS.Application.ApplicationKeys })
  key: CONSTANTS.Application.ApplicationKeys;
  @ApiProperty({ required: false })
  description: string | undefined;
  @ApiProperty({ type: FileResponse, nullable: true })
  iconFile: FileResponse | undefined;
  @ApiProperty({
    enum: CONSTANTS.Application.ApplicationStatuses,
  })
  status: CONSTANTS.Application.ApplicationStatuses;
  @ApiProperty()
  URL: string;

  constructor(application: Application, iconFile: FileResponse | undefined) {
    this.id = application.id;
    this.name = application.name;
    this.key = application.key;
    this.description = application.description;
    this.iconFile = iconFile;
    this.status = application.status;
    this.URL = application.URL;
  }
}
