import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS } from 'sea-platform-helpers';
import { ServerConfigService } from '../server-config/server-config.service';
import { Constants } from 'src/config';

import ThesisData from '../../migration/thesis/data';
import { Op } from 'sequelize';
import { DEFAULT_ROLE_NAMES } from 'src/config/constants/seeder';
import { RemoteEmailTemplateService } from '../remote-email-template/remote-email-template.service';
import { RemoteEmailTemplateVersionService } from '../remote-email-template/remote-email-template-version.service';
import { CreatrixService } from '../creatrix/creatrix.service';
import { ERPService } from '../erp/erp.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly applicationService: ApplicationService,
    private readonly emailTemplateRemote: RemoteEmailTemplateService,
    private readonly emailTemplateVersionRemote: RemoteEmailTemplateVersionService,
    private readonly serverConfigService: ServerConfigService,
    private readonly creatrixService: CreatrixService,
    private readonly ERPService: ERPService,
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

  async seedEmailTemplates() {
    console.log('seedEmailTemplates');
    for (const email of CONSTANTS.Email.EmailTemplates) {
      let existingEmail = await this.emailTemplateRemote.findByCode(email.code);
      console.log('existingEmail: ', existingEmail);
      const data = {
        name: email.name,
        description: email.description,
        code: email.code,
        parameters: email.parameters,
      };

      if (!existingEmail) {
        existingEmail = await this.emailTemplateRemote.create(data);
      } else {
        existingEmail = await this.emailTemplateRemote.update(
          existingEmail.id,
          data,
        );
      }

      const versions = await this.emailTemplateVersionRemote.findAllForTemplate(
        existingEmail.id,
      );

      for (const version of email.versions) {
        const existingVersion = versions.find(
          (v) => v.languageCode === version.languageCode,
        );

        if (!existingVersion) {
          await this.emailTemplateVersionRemote.create({
            templateId: existingEmail.id,
            subject: version.subject,
            languageCode: version.languageCode,
            design: version.design,
            html: version.html,
          });
        } else {
          await this.emailTemplateVersionRemote.update(existingVersion.id, {
            subject: version.subject,
            design: version.design,
            html: version.html,
          });
        }
      }
    }

    return 'Email Templates seeded successfully';
  }

  async seedSuperAdminAccount() {
    const { roles } = await this.roleService.findAll(
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
        'super-admin@example.com',
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

          isStudentDefault: r.isStudentDefault,
          isFacultyDefault: r.isFacultyDefault,
          isEmployeeDefault: r.isEmployeeDefault,
          isDeletable: r.isDeletable,
        };
      }),
    );

    for (const roleData of DEFAULTS) {
      const data = {
        name: roleData.name,
        description: roleData.description,
        color: roleData.color,
        isStudentDefault: roleData.isStudentDefault,
        isFacultyDefault: roleData.isFacultyDefault,
        isEmployeeDefault: roleData.isEmployeeDefault,
        isDeletable: roleData.isDeletable,
      };

      let role = await this.roleService.findOne({
        where: {
          name: data.name,
          isStudentDefault: data.isStudentDefault,
          isFacultyDefault: data.isFacultyDefault,
          isEmployeeDefault: data.isEmployeeDefault,
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

  async seedInitData(
    {
      seedEmailTemplates,
    }: {
      seedEmailTemplates: boolean;
    } = { seedEmailTemplates: false },
  ) {
    await this.seedApplications();
    await this.seedInitRoles();
    await this.seedSuperAdminAccount();
    if (seedEmailTemplates) await this.seedEmailTemplates();
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

  async syncStudents() {
    return await this.creatrixService.syncStudents();
  }
  async syncFaculties() {
    return await this.creatrixService.syncFaculties();
  }
  async syncEmployees() {
    return await this.ERPService.syncEmployees();
  }
}
