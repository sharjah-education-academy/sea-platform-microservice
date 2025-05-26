import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { CONSTANTS } from 'sea-platform-helpers';

@Injectable()
export class SeederService {
  constructor(
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  async seedSuperAdminRole() {
    const permissionKeys = await this.permissionService.getAllLeafKeys();
    const role = await this.roleService.create(
      {
        name: 'Super Admin Role',
        description: 'Super Admin Role',
        color: '#F2B3A0',
        type: CONSTANTS.Account.AccountTypes.Admin,
      },
      permissionKeys,
    );

    return await role.save();
  }

  async seedSuperAdminAccount() {
    const superAdminRole = await this.seedSuperAdminRole();
    const superAdminAccount = await this.accountService.create(
      {
        name: 'Super Admin',
        email: 'super-admin@example.com',
        phoneNumber: '+9715500000000',
        password: '123456789',
        type: CONSTANTS.Account.AccountTypes.Admin,
      },
      [superAdminRole.id],
    );

    return await superAdminAccount.save();
  }
}
