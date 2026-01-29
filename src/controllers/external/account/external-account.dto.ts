import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
export class FindAllAccountsByIdsDto {
  @ApiProperty({
    description: 'Array of account IDs',
    type: [String],
    required: true,
  })
  @IsArray()
  @IsString({ each: true, message: 'Each ID must be a string' })
  ids: string[];
}
