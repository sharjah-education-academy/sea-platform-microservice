import { Injectable } from '@nestjs/common';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS } from 'sea-platform-helpers';

import { RemoteEmailTemplateService } from '../remote-email-template/remote-email-template.service';
import { RemoteEmailTemplateVersionService } from '../remote-email-template/remote-email-template-version.service';
import { CreatrixService } from '../creatrix/creatrix.service';
import { ERPService } from '../erp/erp.service';
import { Constants } from 'src/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SyncService {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly applicationService: ApplicationService,
    private readonly emailTemplateRemote: RemoteEmailTemplateService,
    private readonly emailTemplateVersionRemote: RemoteEmailTemplateVersionService,
    private readonly creatrixService: CreatrixService,
    private readonly ERPService: ERPService,
  ) {}

  async syncDefaultApplications() {
    for (const app of CONSTANTS.Application.Applications) {
      await this.applicationService.createOrUpdate({
        name: app.name,
        key: app.key,
        description: app.description,
        status: app.status,
        URL: 'https://platform.sea.ac.ae/auth/login',
      });
    }

    return true;
  }

  async syncDefaultRoles() {
    const DEFAULTS = await Promise.all(
      Constants.Role.DEFAULT_ROLES.map(async (r) => {
        const permissionKeyArrays = await Promise.all(
          r.parentPermissionKeys.map((key) =>
            this.permissionService.getLeafKeys(key),
          ),
        );
        const permissionKeys = permissionKeyArrays.flat();
        return {
          name: r.name,
          description: r.description,
          color: r.color,
          applicationKey: r.applicationKey,
          permissionKeys,
          isStudentDefault: r.isStudentDefault,
          isFacultyDefault: r.isFacultyDefault,
          isEmployeeDefault: r.isEmployeeDefault,
          isDeletable: r.isDeletable,
        };
      }),
    );

    for (const roleData of DEFAULTS) {
      const application = await this.applicationService.findOne({
        where: { key: roleData.applicationKey },
      });
      if (!application) continue;
      const data = {
        name: roleData.name,
        description: roleData.description,
        color: roleData.color,
        isStudentDefault: roleData.isStudentDefault,
        isFacultyDefault: roleData.isFacultyDefault,
        isEmployeeDefault: roleData.isEmployeeDefault,
        isDeletable: roleData.isDeletable,
        applicationId: application.id,
      };

      await this.roleService._createOrUpdate(data, roleData.permissionKeys);
    }

    return true;
  }

  async syncDefaultEmailTemplates() {
    console.log('seedEmailTemplates: ', CONSTANTS.Email.EmailTemplates.length);
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

      console.log('versions: ', versions);

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

    return true;
  }

  async syncStudentsAccounts() {
    await this.creatrixService.syncStudents();
    return true;
  }
  async syncFacultiesAccounts() {
    await this.creatrixService.syncFaculties();
    return true;
  }
  async syncEmployeesAccounts() {
    await this.ERPService.syncEmployees();
    return true;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async syncAll() {
    console.log('Running daily sync tasks...');
    await this.syncStudentsAccounts();
    await this.syncFacultiesAccounts();
    await this.syncEmployeesAccounts();
  }
}
