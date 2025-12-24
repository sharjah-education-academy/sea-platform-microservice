import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateLocalizationDto {
  @ApiProperty({
    description: 'name of language like Arabic,English, Spanish etc',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'application id',
    required: true,
  })
  @IsString()
  applicationId: string;

  @ApiProperty({
    description: 'is enabled language or not',
    required: true,
  })
  @IsBoolean()
  enabled: boolean;
}

export class GenerateJsonLocalizationsDto {
  @ApiProperty({
    description: 'application id',
    required: true,
  })
  @IsString()
  applicationId: string;

  @ApiProperty({
    description: 'localization values',
    required: true,
    type: Array,
  })
  @IsArray()
  values: Array<{
    code: string;
    translations: Array<{ key: string; value: string }>;
  }>;
}
