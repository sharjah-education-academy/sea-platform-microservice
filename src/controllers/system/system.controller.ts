import { Controller, Post, UseGuards } from '@nestjs/common';
import { CONSTANTS } from 'sea-platform-helpers';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { SystemService } from 'src/models/system/system.service';

@Controller('system')
@UseGuards(
  JWTAuthGuard,
  new JWTAuthorizationGuard([
    CONSTANTS.Permission.PermissionKeys.DeveloperCenter,
  ]),
)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('/free-cache')
  async freeCache() {
    await this.systemService.freeCache();
    return true;
  }
  @Post('/logout-all-accounts')
  async logoutAllAccounts() {
    await this.systemService.logoutAllAccounts();
    return true;
  }
}
