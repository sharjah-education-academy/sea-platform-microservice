import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';
import { FindAllDto } from 'src/common/global.dto';

export class FindAttendanceStudentsDto extends FindAllDto {
  @ApiProperty({
    required: false,
    description: 'Return all students without pagination slicing',
  })
  @IsOptional()
  @IsBooleanString()
  all?: boolean;

  @ApiProperty({
    required: false,
    description: 'Optional list of student account IDs to constrain the query',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }

    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  studentAccountIds?: string[];
}
