import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { ArrayDataResponse } from 'src/common/global.dto';

export class OrganizationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  @ApiProperty({ type: Number })
  accountsCount: number;

  constructor(organization: Organization, accountsCount: number) {
    this.id = organization.id;
    this.name = organization.name;
    this.accountsCount = accountsCount;
  }
}

export class OrganizationArrayDataResponse extends ArrayDataResponse<OrganizationResponse> {
  @ApiProperty({ type: OrganizationResponse, isArray: true })
  data: OrganizationResponse[];
  constructor(
    totalCount: number,
    data: Array<OrganizationResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}
