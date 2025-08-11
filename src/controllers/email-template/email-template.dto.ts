import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Utils } from 'sea-platform-helpers';
import { FindAllDto } from 'src/common/global.dto';

export class FindAllEmailTemplatesDto extends FindAllDto {}

export class CreateEmailTemplateDto {
  @ApiProperty({
    description: 'The title of the email template',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The description of the email template',
    required: false,
    minLength: 3,
    maxLength: 1000,
  })
  @ValidateIf((_, value) => value !== '')
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'The array of the parameters of the email template',
    required: true,
    type: String,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Utils.String.normalizeString(v))
      : value,
  )
  parameters: string[];
}

export class UpdateEmailTemplateDto {
  @ApiProperty({
    description: 'The title of the email template',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The description of the email template',
    required: false,
    minLength: 3,
    maxLength: 1000,
  })
  @ValidateIf((_, value) => value !== '')
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'The array of the parameters of the email template',
    required: true,
    type: String,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Utils.String.normalizeString(v))
      : value,
  )
  parameters: string[];
}

export class CreateEmailTemplateVersionDto {
  @ApiProperty({
    description: 'The template id of the version',
    example: '6891b2d9b0594815819523eb',
  })
  @IsString()
  templateId: string;

  @ApiProperty({
    description: 'The language code of the email template',
    example: 'en',
  })
  @IsString()
  @IsIn(Utils.Language.getLanguageCodes())
  languageCode: string;

  @ApiProperty({
    description: 'The subject of the email template',
    example: 'en',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'The content of the email template',
    format: 'html',
    example: '<html>Content</html>',
  })
  @IsString()
  html: string;

  @ApiProperty({
    description: 'The design object of the email template',
    format: 'json',
    example: '{}',
  })
  @IsObject()
  design: object;
}

export class UpdateEmailTemplateVersionDto {
  @ApiProperty({
    description: 'The subject of the email template',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'The content of the email template',
    format: 'html',
    example: '<html>Content</html>',
  })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiProperty({
    description: 'The design object of the email template',
    format: 'json',
    example: '{}',
  })
  @IsOptional()
  @IsObject()
  design?: object;
}
