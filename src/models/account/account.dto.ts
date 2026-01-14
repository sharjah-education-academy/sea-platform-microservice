import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.model';
import { Utils } from 'sea-platform-helpers';
import { RoleShortResponse } from '../role/role.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { OrganizationResponse } from '../organization/organization.dto';
import { DepartmentResponse } from '../department/department.dto';
import { AccountAlertSettingsResponse } from '../account-alert-setting/account-alert-setting.dto';
import { StudentResponse } from '../student/student.dto';
import { FacultyResponse } from '../faculty/faculty.dto';

export class AccountResponse {
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
  @ApiProperty()
  preferredLanguage: string;
  @ApiProperty({ enum: CONSTANTS.Permission.PermissionKeys, isArray: true })
  permissionKeys: CONSTANTS.Permission.PermissionKeys[];
  @ApiProperty({ enum: CONSTANTS.Application.ApplicationKeys, isArray: true })
  applicationKeys: CONSTANTS.Application.ApplicationKeys[];

  @ApiProperty({ type: AccountAlertSettingsResponse, nullable: true })
  alertSettings: AccountAlertSettingsResponse;

  @ApiProperty({ type: StudentResponse, nullable: true })
  student?: StudentResponse;
  @ApiProperty({ type: FacultyResponse, nullable: true })
  faculty?: FacultyResponse;

  constructor(
    account: Account,
    roles?: RoleShortResponse[],
    organization?: OrganizationResponse | undefined,
    department?: DepartmentResponse | undefined,
    permissionKeys?: CONSTANTS.Permission.PermissionKeys[],
    applicationKeys?: CONSTANTS.Application.ApplicationKeys[],
    alertSettings?: AccountAlertSettingsResponse,
    student?: StudentResponse,
    faculty?: FacultyResponse,
  ) {
    this.id = account.id;
    this.name = account.name;
    this.email = account.email;
    this.phoneNumber = account.phoneNumber;
    this.preferredLanguage = account.preferredLanguage;
    this.birthDate = null;
    if (account.birthDate) {
      this.birthDate = Utils.Moment.formatDate(account.birthDate, 'YYYY-MM-DD');
    }
    this.isLocked = account.isLocked;
    this.roles = roles;
    this.organization = organization;
    this.department = department;
    this.permissionKeys = permissionKeys;
    this.applicationKeys = applicationKeys;
    this.alertSettings = alertSettings;
    this.student = student;
    this.faculty = faculty;
  }
}
