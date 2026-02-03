import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.model';
import { PermissionResponseForRole } from '../permission/permission.dto';
import { ApplicationResponse } from '../application/application.dto';
import { ArrayDataResponse } from 'src/common/global.dto';

export class RoleResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  color: string;
  @ApiProperty({ type: Boolean })
  isStudentDefault: boolean;
  @ApiProperty({ type: Boolean })
  isFacultyDefault: boolean;
  @ApiProperty({ type: Boolean })
  isEmployeeDefault: boolean;
  @ApiProperty({ type: Boolean })
  isDeletable: boolean;
  @ApiProperty({ type: ApplicationResponse, nullable: true })
  application?: ApplicationResponse;

  @ApiProperty({
    type: PermissionResponseForRole,
    isArray: true,
    nullable: true,
  })
  permissions?: PermissionResponseForRole[];

  constructor(
    role: Role,
    application?: ApplicationResponse,
    permissions?: PermissionResponseForRole[],
  ) {
    this.id = role.id;
    this.name = role.name;
    this.description = role.description;
    this.color = role.color;
    this.isStudentDefault = role.isStudentDefault;
    this.isFacultyDefault = role.isFacultyDefault;
    this.isEmployeeDefault = role.isEmployeeDefault;
    this.isDeletable = role.isDeletable;
    this.application = application;
    this.permissions = permissions;
  }
}

export class RoleArrayDataResponse extends ArrayDataResponse<RoleResponse> {
  @ApiProperty({ type: RoleResponse, isArray: true })
  data: RoleResponse[];
  constructor(
    totalCount: number,
    data: Array<RoleResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}
