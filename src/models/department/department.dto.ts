import { ApiProperty } from '@nestjs/swagger';
import { Department } from './department.model';
import { ArrayDataResponse } from 'src/common/global.dto';
import { OrganizationResponse } from '../organization/organization.dto';

export class DepartmentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: OrganizationResponse, nullable: true })
  organization: OrganizationResponse | undefined;

  @ApiProperty({ type: Number })
  accountsCount: number;

  constructor(
    department: Department,
    organization: OrganizationResponse | undefined,
    accountsCount: number,
  ) {
    this.id = department.id;
    this.name = department.name;
    this.organization = organization;
    this.accountsCount = accountsCount;
  }
}

export class DepartmentArrayDataResponse extends ArrayDataResponse<DepartmentResponse> {
  @ApiProperty({ type: DepartmentResponse, isArray: true })
  data: DepartmentResponse[];
  constructor(
    totalCount: number,
    data: Array<DepartmentResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}
