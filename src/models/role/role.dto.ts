import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.model';
import { PermissionResponseForRole } from '../permission/permission.dto';
import { ApplicationResponse } from '../application/application.dto';

export class RoleShortResponse {
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

  @ApiProperty({ type: ApplicationResponse })
  application: ApplicationResponse;

  constructor(role: Role, application: ApplicationResponse) {
    this.id = role.id;
    this.name = role.name;
    this.description = role.description;
    this.color = role.color;
    this.isStudentDefault = role.isStudentDefault;
    this.isFacultyDefault = role.isFacultyDefault;
    this.isEmployeeDefault = role.isEmployeeDefault;
    this.isDeletable = role.isDeletable;
    this.application = application;
  }
}

export class RoleFullResponse extends RoleShortResponse {
  @ApiProperty({ type: PermissionResponseForRole, isArray: true })
  permissions: PermissionResponseForRole[];

  constructor(
    role: Role,
    application: ApplicationResponse,
    permissions: PermissionResponseForRole[],
  ) {
    super(role, application);
    this.permissions = permissions;
  }
}
