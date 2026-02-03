import { Injectable } from '@nestjs/common';
import { SyncService } from '../sync/sync.service';
import { ServerConfigService } from '../server-config/server-config.service';
import { RoleService } from '../role/role.service';
import { DEFAULT_ROLE_NAMES } from 'src/config/constants/role';
import { Op } from 'sequelize';
import { AccountService } from '../account/account.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly syncService: SyncService,
    private readonly serverConfigService: ServerConfigService,
    private readonly roleService: RoleService,
    private readonly accountService: AccountService,
  ) {}

  private async seedSuperAdminAccount() {
    const { rows: roles } = await this.roleService.findAll(
      {
        where: {
          name: {
            [Op.in]: [
              DEFAULT_ROLE_NAMES.PlatformAdministration,
              DEFAULT_ROLE_NAMES.PublicCalendarSuperAdmin,
              DEFAULT_ROLE_NAMES.FacultyOperationChair,
              DEFAULT_ROLE_NAMES.StrategySuperAdmin,
              DEFAULT_ROLE_NAMES.StudentAttendanceAdmin,
            ],
          },
        },
      },
      0,
      0,
      true,
    );
    const data = {
      name: 'Platform Super Admin',
      email:
        this.serverConfigService.get('SUPER_ADMIN_EMAIL') ||
        'platform@sea.ac.ae',
      password:
        this.serverConfigService.get('SUPER_ADMIN_PASSWORD') || '123456789',
    };
    let account = await this.accountService.findOne({
      where: { email: data.email },
    });
    const roleIds = roles.map((r) => r.id);
    if (account) {
      account = await this.accountService._update(account, data, roleIds);
    } else {
      account = await this.accountService._create(data, roleIds);
    }
    return await account.save();
  }

  async initPlatformData() {
    await this.syncService.syncDefaultApplications();
    await this.syncService.syncDefaultRoles();
    await this.seedSuperAdminAccount();
  }
}
