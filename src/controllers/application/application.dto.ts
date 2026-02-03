import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsIn,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ArrayDataResponse, FindAllDto } from 'src/common/global.dto';
import { ApplicationResponse } from 'src/models/application/application.dto';
import { CONSTANTS } from 'sea-platform-helpers';

export class UpdateApplicationDto {
  @ApiProperty({
    description: 'The name of the application',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    nullable: true,
  })
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    required: true,
    description: 'The icon file id of the application',
  })
  @IsString()
  iconFileId: string;

  @ApiProperty({
    required: true,
    description: 'The URL of the application',
  })
  @IsString()
  URL: string;

  @ApiProperty({
    required: true,
    enum: CONSTANTS.Application.ApplicationStatuses,
  })
  @IsIn([...Object.values(CONSTANTS.Application.ApplicationStatuses)])
  status: CONSTANTS.Application.ApplicationStatuses;
}

export class FindAllApplicationsDto extends FindAllDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'the application status',
    enum: CONSTANTS.Application.ApplicationStatuses,
  })
  @IsIn([...Object.values(CONSTANTS.Application.ApplicationStatuses), 'all'])
  @IsOptional()
  status: CONSTANTS.Application.ApplicationStatuses | 'all';
}

export class ApplicationArrayDataResponse extends ArrayDataResponse<ApplicationResponse> {
  @ApiProperty({ type: ApplicationResponse, isArray: true })
  data: ApplicationResponse[];
  constructor(
    totalCount: number,
    data: Array<ApplicationResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}
