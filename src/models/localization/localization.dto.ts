import { ApiProperty } from '@nestjs/swagger';
import { DTO } from 'sea-platform-helpers';
import { ArrayDataResponse } from 'src/common/global.dto';
import { Localization } from './localization.model';

export class LocalizationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  applicationId: string;

  constructor(localization: Localization) {
    this.id = localization.id;
    this.applicationId = localization.applicationId;
    this.code = localization.code;
    this.enabled = localization.enabled;
  }
}

export class LocalizationArrayDataResponse extends ArrayDataResponse<LocalizationResponse> {
  @ApiProperty({ type: LocalizationResponse, isArray: true })
  data: LocalizationResponse[];
  constructor(
    totalCount: number,
    data: Array<LocalizationResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}
