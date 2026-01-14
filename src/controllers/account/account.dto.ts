import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsArray,
  IsBoolean,
} from 'class-validator';

import { CONSTANTS, Utils } from 'sea-platform-helpers';
import { ArrayDataResponse, FindAllDto } from 'src/common/global.dto';
import { AccountResponse } from 'src/models/account/account.dto';

export class FindAllAccountsDto extends FindAllDto<CONSTANTS.Account.AccountIncludes> {
  @ApiProperty({
    required: true,
    type: String,
    description: "the role id or 'all'",
  })
  @IsString()
  roleId: string | CONSTANTS.Global.AllType;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: 'Whether the account is deleted',
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true') // Convert the query parameter to a boolean
  isDeleted: boolean;
}

export class CreateAccountDto {
  @ApiProperty({
    description: 'The name of the account',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description:
      'The email of the account, must be unique and case-insensitive',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => Utils.String.normalizeString(value))
  email: string;

  @ApiProperty({
    description: 'The phone number of the account in a valid format',
    example: '+1234567890',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Password for the account account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The birth date of the account in ISO format',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional({})
  @IsDateString()
  @Transform(({ value }) => (value === '' ? null : value))
  birthDate?: Date;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'The role ids',
    required: true,
  })
  @IsArray()
  roleIds: string[];

  @ApiProperty({
    description: 'The organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional({})
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  organizationId?: string;

  @ApiProperty({
    description: 'The department ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional({})
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  departmentId?: string;
}

export class AccountArrayDataResponse extends ArrayDataResponse<AccountResponse> {
  @ApiProperty({ type: AccountResponse, isArray: true })
  data: AccountResponse[];
  constructor(
    totalCount: number,
    data: Array<AccountResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Password for the account account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class UpdateAccountDto {
  @ApiProperty({
    description: 'The name of the account',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description:
      'The email of the account, must be unique and case-insensitive',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => Utils.String.normalizeString(value))
  email: string;

  @ApiProperty({
    description: 'The phone number of the account in a valid format',
    example: '+1234567890',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The birth date of the account in ISO format',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional({})
  @IsDateString()
  @Transform(({ value }) => (value === '' ? null : value))
  birthDate?: Date;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'The role ids',
    required: true,
  })
  @IsArray()
  // @ArrayNotEmpty()
  roleIds: string[];

  @ApiProperty({
    description: 'The organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional({})
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  organizationId?: string;

  @ApiProperty({
    description: 'The department ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional({})
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  departmentId?: string;
}
