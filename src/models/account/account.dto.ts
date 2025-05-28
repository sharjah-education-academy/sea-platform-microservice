import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.model';
import { Utils } from 'sea-platform-helpers';
import { RoleShortResponse } from '../role/role.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { OrganizationResponse } from '../organization/organization.dto';
import { DepartmentResponse } from '../department/department.dto';

export class AccountShortResponse {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  birthDate: string;
  @ApiProperty({ type: Boolean })
  isLocked: boolean;
  @ApiProperty({ type: RoleShortResponse, isArray: true })
  roles: RoleShortResponse[];
  @ApiProperty({ type: OrganizationResponse, nullable: true })
  organization: OrganizationResponse | undefined;
  @ApiProperty({ type: DepartmentResponse, nullable: true })
  department: DepartmentResponse | undefined;
  constructor(
    account: Account,
    roles: RoleShortResponse[],
    organization: OrganizationResponse | undefined,
    department: DepartmentResponse | undefined,
  ) {
    this.id = account.id;
    this.name = account.name;
    this.email = account.email;
    this.phoneNumber = account.phoneNumber;
    this.birthDate = null;
    if (account.birthDate) {
      this.birthDate = Utils.Moment.formatDate(account.birthDate, 'YYYY-MM-DD');
    }
    this.isLocked = account.isLocked;
    this.roles = roles;
    this.organization = organization;
    this.department = department;
  }
}

export class AccountFullResponse extends AccountShortResponse {
  @ApiProperty({ enum: CONSTANTS.Permission.PermissionKeys, isArray: true })
  permissionKeys: CONSTANTS.Permission.PermissionKeys[];

  constructor(
    account: Account,
    roles: RoleShortResponse[],
    permissionKeys: CONSTANTS.Permission.PermissionKeys[],
    organization: OrganizationResponse | undefined,
    department: DepartmentResponse | undefined,
  ) {
    super(account, roles, organization, department);

    this.permissionKeys = permissionKeys;
  }
}
