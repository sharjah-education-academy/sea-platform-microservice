import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { ArrayDataResponse, FindAllDto } from 'src/common/global.dto';
import { RoleShortResponse } from 'src/models/role/role.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { Decorators } from 'sea-backend-helpers';
import { IsIn } from 'class-validator';

const permissionKeys = [...Object.values(CONSTANTS.Permission.PermissionKeys)];

export class FindAllRolesDto extends FindAllDto {
  @ApiProperty({
    description: 'The ID of the application to filter roles by',
    required: true,
  })
  @IsString()
  applicationId: string | 'all';
}

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'IT Support',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The key of the application this role belongs to',
    enum: CONSTANTS.Application.ApplicationKeys,
    required: true,
  })
  @IsIn([...Object.values(CONSTANTS.Application.ApplicationKeys)])
  applicationKey: CONSTANTS.Application.ApplicationKeys;

  @ApiProperty({
    description: 'The description of the role',
    nullable: true,
  })
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    description: 'The hex code color',
    example: '#000000',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'the list of the permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Decorators.IsArrayValuesIn(permissionKeys, {
    message: `Each permission must be one of the valid keys: ${permissionKeys.join(', ')}`,
  })
  permissionKeys: string[];
}

export class RoleShortArrayDataResponse extends ArrayDataResponse<RoleShortResponse> {
  @ApiProperty({ type: RoleShortResponse, isArray: true })
  data: RoleShortResponse[];
  constructor(
    totalCount: number,
    data: Array<RoleShortResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'IT Support',
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
    description: 'The hex code color',
    example: '#000000',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'the list of the permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Decorators.IsArrayValuesIn(permissionKeys, {
    message: `Each permission must be one of the valid keys: ${permissionKeys.join(', ')}`,
  })
  permissionKeys: CONSTANTS.Permission.PermissionKeys[];
}
