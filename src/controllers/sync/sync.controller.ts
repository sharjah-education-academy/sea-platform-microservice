import { Controller, Post, UseGuards } from '@nestjs/common';
import { CONSTANTS } from 'sea-platform-helpers';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { SyncService } from 'src/models/sync/sync.service';

@Controller('syncs')
@UseGuards(
  JWTAuthGuard,
  new JWTAuthorizationGuard([
    CONSTANTS.Permission.PermissionKeys.DeveloperCenter,
  ]),
)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}
  @Post('/default-applications')
  async syncDefaultApplications() {
    return await this.syncService.syncDefaultApplications();
  }

  @Post('/default-roles')
  async syncDefaultRoles() {
    return await this.syncService.syncDefaultRoles();
  }

  @Post('/default-email-templates')
  async syncDefaultEmailTemplates() {
    return await this.syncService.syncDefaultEmailTemplates();
  }

  @Post('/students')
  async syncStudentsAccounts() {
    return await this.syncService.syncStudentsAccounts();
  }

  @Post('/faculties')
  async syncFacultiesAccounts() {
    return await this.syncService.syncFacultiesAccounts();
  }

  @Post('/employees')
  async syncEmployeesAccounts() {
    return await this.syncService.syncEmployeesAccounts();
  }
}
