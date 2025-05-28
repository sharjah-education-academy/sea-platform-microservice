import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS } from 'sea-platform-helpers';

@Injectable()
export class SeederService {
  constructor(
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly applicationService: ApplicationService,
  ) {}

  async seedApplications() {
    CONSTANTS.Application.Applications.forEach(async (app) => {
      const existingApp = await this.applicationService.findOne({
        where: { key: app.key },
      });
      if (!existingApp) {
        const newApp = await this.applicationService.create(
          {
            name: app.name,
            key: app.key,
            status: app.status,
            description: app.description,
            URL: 'https://example.com', // Default URL, can be updated later
          },
          undefined,
        );
        await newApp.save();
      } else {
        await existingApp.update({
          name: app.name,
          key: app.key,
          status: app.status,
          description: app.description,
          URL: 'https://example.com',
        });
      }
    });
    return 'Applications seeded successfully';
  }

  async seedSuperAdminRole() {
    const permissionKeys = await this.permissionService.getLeafKeys(
      CONSTANTS.Permission.PermissionKeys.PlatformAdministration,
    );

    console.log('permissionKeys: ', permissionKeys);
    const role = await this.roleService.create(
      {
        name: 'Super Admin Role',
        description: 'Super Admin Role',
        color: '#F2B3A0',
      },
      permissionKeys,

      CONSTANTS.Application.ApplicationKeys.PlatformAdministrationApplication,
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
      },
      [superAdminRole.id],
    );

    return await superAdminAccount.save();
  }
}
