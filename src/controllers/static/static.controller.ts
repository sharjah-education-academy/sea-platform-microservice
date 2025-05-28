import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PermissionResponse } from 'src/models/permission/permission.dto';
import { PermissionService } from 'src/models/permission/permission.service';

@Controller('static')
export class StaticController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('/permissions')
  @ApiOperation({ summary: 'fetch account types' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve permissions',
    type: PermissionResponse,
    isArray: true,
  })
  async getPermissions() {
    return await this.permissionService.fetchAllPermissions();
  }
}
