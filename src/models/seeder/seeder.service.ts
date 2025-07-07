import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS } from 'sea-platform-helpers';
import { ServerConfigService } from '../server-config/server-config.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly applicationService: ApplicationService,
    private readonly serverConfigService: ServerConfigService,
  ) {}

  private async seedApplications() {
    for (const app of CONSTANTS.Application.Applications) {
      const data = {
        name: app.name,
        key: app.key,
        status: app.status,
        description: app.description,
        URL: 'https://example.com',
      };
      const existingApp = await this.applicationService.findOne({
        where: { key: app.key },
      });
      if (!existingApp) {
        const newApp = await this.applicationService.create(data, undefined);
        await newApp.save();
      } else {
        await existingApp.update(data);
      }
    }

    return 'Applications seeded successfully';
  }

  private async seedSuperAdminRole() {
    const permissionKeys = await this.permissionService.getLeafKeys(
      CONSTANTS.Permission.PermissionKeys.PlatformAdministration,
    );

    const data = {
      name: 'Super Admin Role',
      description: 'Super Admin Role',
      color: '#F2B3A0',
      isDefault: false,
      isDeletable: false,
    };

    let role = await this.roleService.findOne({
      where: {
        name: data.name,
        isDefault: data.isDefault,
        isDeletable: data.isDeletable,
      },
    });

    if (role) {
      role = await this.roleService.update(role, data, permissionKeys);
    } else {
      role = await this.roleService.create(
        data,
        permissionKeys,

        CONSTANTS.Application.ApplicationKeys.PlatformAdministrationApplication,
      );
    }

    return await role.save();
  }

  async seedSuperAdminAccount() {
    const superAdminRole = await this.seedSuperAdminRole();
    const data = {
      name: 'Platform Super Admin',
      email:
        this.serverConfigService.get('SUPER_ADMIN_EMAIL') ||
        'super-admin@example.com',
      password:
        this.serverConfigService.get('SUPER_ADMIN_PASSWORD') || '123456789',
    };
    let account = await this.accountService.findOne({
      where: { email: data.email },
    });

    if (account) {
      account = await this.accountService.update(account, data, [
        superAdminRole.id,
      ]);
    } else {
      account = await this.accountService.create(data, [superAdminRole.id]);
    }

    return await account.save();
  }
  async seedInitRoles() {
    const DEFAULTS = [
      {
        name: 'Public Calendar | End user',
        description:
          'The default role of the end user for the public calendar app',
        color: '#F4A610',
        applicationKey:
          CONSTANTS.Application.ApplicationKeys.PublicCalendarApplication,
        permissionKeys: [
          CONSTANTS.Permission.PermissionKeys.ViewPublicCalendar,
        ],
        isDefault: true,
      },
      {
        name: 'Public Calendar | Super admin',
        description:
          'The default role of the super admin for the public calendar app',
        color: '#F4A6A2',
        applicationKey:
          CONSTANTS.Application.ApplicationKeys.PublicCalendarApplication,
        permissionKeys: await this.permissionService.getLeafKeys(
          CONSTANTS.Permission.PermissionKeys.PublicCalendarApp,
        ),
        isDefault: false,
      },
    ];

    for (const roleData of DEFAULTS) {
      const data = {
        name: roleData.name,
        description: roleData.description,
        color: roleData.color,
        isDefault: roleData.isDefault,
        isDeletable: false,
      };

      let role = await this.roleService.findOne({
        where: {
          name: data.name,
          isDefault: data.isDefault,
          isDeletable: data.isDeletable,
        },
      });

      if (role) {
        role = await this.roleService.update(
          role,
          data,
          roleData.permissionKeys,
        );
      } else {
        role = await this.roleService.create(
          data,
          roleData.permissionKeys,

          roleData.applicationKey,
        );
      }
    }

    return true;
  }

  async seedInitData() {
    await this.seedApplications();
    await this.seedSuperAdminAccount();
    await this.seedInitRoles();
    return true;
  }
}
