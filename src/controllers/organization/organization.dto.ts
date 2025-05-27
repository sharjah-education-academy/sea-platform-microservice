import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/global.dto';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'The name of the organization',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}

export class UpdateOrganizationDto {
  @ApiProperty({
    description: 'The name of the organization',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'The name of the department',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The ID of the organization to which the department belongs',
    example: '1234567890abcdef12345678',
  })
  @IsString()
  organizationId: string;
}

export class UpdateDepartmentDto {
  @ApiProperty({
    description: 'The name of the department',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The ID of the organization to which the department belongs',
    example: '1234567890abcdef12345678',
  })
  @IsString()
  organizationId: string;
}

export class FindAllOrganizationsDto extends FindAllDto {}

export class FindAllDepartmentsDto extends FindAllDto {
  @ApiProperty({
    description: 'The ID of the organization to filter departments by',
    example: '1234567890abcdef12345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  organizationId?: string;
}
