import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { CONSTANTS } from 'sea-platform-helpers';
import { FindAllDto } from 'src/common/global.dto';

export class FindAllLocalizationsDto extends FindAllDto<CONSTANTS.Localization.LocalizationIncludes> {
  @ApiProperty({
    description: 'application key',
    required: true,
  })
  @IsString()
  applicationKey: CONSTANTS.Application.ApplicationKeys;
}

export class GetAllLocalizationsDto {
  @ApiProperty({
    description: 'application key',
    required: true,
  })
  @IsString()
  applicationKey: CONSTANTS.Application.ApplicationKeys;
}

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

  @ApiProperty({
    description: 'application key',
    required: true,
  })
  @IsString()
  applicationKey: CONSTANTS.Application.ApplicationKeys;
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
