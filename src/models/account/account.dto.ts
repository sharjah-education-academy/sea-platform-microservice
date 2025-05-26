import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.model';
import { Utils } from 'sea-platform-helpers';
import { RoleShortResponse } from '../role/role.dto';
import { CONSTANTS } from 'sea-platform-helpers';

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
  type: CONSTANTS.Account.AccountTypes;
  @ApiProperty()
  birthDate: string;
  @ApiProperty({ type: Boolean })
  isLocked: boolean;
  @ApiProperty({ type: RoleShortResponse, isArray: true })
  roles: RoleShortResponse[];

  constructor(account: Account, roles: RoleShortResponse[]) {
    this.id = account.id;
    this.name = account.name;
    this.email = account.email;
    this.phoneNumber = account.phoneNumber;
    this.type = account.type;
    this.birthDate = null;
    if (account.birthDate) {
      this.birthDate = Utils.Moment.formatDate(account.birthDate, 'YYYY-MM-DD');
    }
    this.isLocked = account.isLocked;
    this.roles = roles;
  }
}

export class AccountFullResponse extends AccountShortResponse {
  @ApiProperty({ enum: CONSTANTS.Permission.PermissionKeys, isArray: true })
  permissionKeys: CONSTANTS.Permission.PermissionKeys[];

  constructor(
    account: Account,
    roles: RoleShortResponse[],
    permissionKeys: CONSTANTS.Permission.PermissionKeys[],
  ) {
    super(account, roles);

    this.permissionKeys = permissionKeys;
  }
}
