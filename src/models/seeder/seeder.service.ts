import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS } from 'sea-platform-helpers';
import { ServerConfigService } from '../server-config/server-config.service';
import { Constants } from 'src/config';

import ThesisData from '../../migration/thesis/data';

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
    const DEFAULTS = await Promise.all(
      Constants.Seeder.DEFAULT_ROLES.map(async (r) => {
        return {
          name: r.name,
          description: r.description,
          color: r.color,
          applicationKey: r.applicationKey,
          permissionKeys: await this.permissionService.getLeafKeys(
            r.parentPermissionKey,
          ),
          isDefault: r.isDefault,
        };
      }),
    );

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

  async seedThesisUsers() {
    const studentRole = await this.roleService.findOne({
      where: {
        name: Constants.Seeder.DEFAULT_ROLE_NAMES.FacultyOperationStudent,
      },
    });
    const facultyRole = await this.roleService.findOne({
      where: {
        name: Constants.Seeder.DEFAULT_ROLE_NAMES.FacultyOperationFaculty,
      },
    });

    if (!studentRole || !facultyRole)
      throw new BadRequestException(
        'there is no student role or faculty role in the system, Seed them first and try again...',
      );

    for (let index = 0; index < ThesisData.length; index++) {
      const data = ThesisData[index];

      // create student
      await this.accountService.createOrUpdate(
        {
          id: data.student.id,
          name: data.student.name,
          email: data.student.email,
        },
        [studentRole.id],
      );

      // create faculty from supervisor data
      await this.accountService.createOrUpdate(
        {
          id: data.supervisor.id,
          name: data.supervisor.name,
          email: data.supervisor.email,
        },
        [facultyRole.id],
      );

      // create faculty from assigning data
      for (let j = 0; j < data.thesisAssignings.length; j++) {
        const assigningData = data.thesisAssignings[j];

        await this.accountService.createOrUpdate(
          {
            id: assigningData.account.id,
            name: assigningData.account.name,
            email: assigningData.account.email,
          },
          [facultyRole.id],
        );
      }
    }
  }
}
