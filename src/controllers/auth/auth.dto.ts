import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
  IsEmail,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { Utils } from 'sea-platform-helpers';
import { Decorators } from 'sea-backend-helpers';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'The email of the account',
    example: 'platform-super-admin@sea.ac.ae',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.String.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the account in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.PhoneNumber.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Decorators.IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;

  @ApiProperty({
    description: 'The password of the account',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ChangeMyPasswordDto {
  @ApiProperty({
    description: 'Password for the account account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({
    description: 'Password for the account account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Decorators.NotSameAs('oldPassword', {
    message: 'New password must not be the same as old password',
  })
  newPassword: string;
}

export class RequestOTPDto {
  @ApiPropertyOptional({
    description: 'The email of the account',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.String.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the account in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.PhoneNumber.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Decorators.IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;
}

export class CheckOTPValidityDto {
  @ApiPropertyOptional({
    description: 'The email of the account',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.String.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the account in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.PhoneNumber.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Decorators.IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;

  @ApiProperty()
  @IsString()
  OTPCode: string;
}

export class ResetPasswordDto {
  @ApiPropertyOptional({
    description: 'The email of the account',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.String.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the account in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => Utils.PhoneNumber.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Decorators.IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;

  @ApiProperty()
  @IsString()
  OTPCode: string;

  @ApiProperty({
    description: 'The password of the account',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class UpdateMyAccountDto {
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
    description: 'The birth date of the account in ISO format',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;
}

export class MicrosoftLoginDto {
  @ApiProperty({
    description:
      'The Id Token the you receive after login to your Microsoft account',
  })
  @IsString()
  idToken: string;
}
