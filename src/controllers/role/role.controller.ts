import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { RoleService } from 'src/models/role/role.service';
import { CreateRoleDto, FindAllRolesDto, UpdateRoleDto } from './role.dto';
import { RolePermission } from 'src/models/role-permission/role-permission.model';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { Account } from 'src/models/account/account.model';
import { CONSTANTS } from 'sea-platform-helpers';
import { RoleResponse } from 'src/models/role/role.dto';
import { ApplicationService } from 'src/models/application/application.service';

@Controller('roles')
@ApiTags('Internal', 'Role')
@UseGuards(JWTAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Post()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageRolesCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({
    description: 'The role has been successfully created.',
    type: RoleResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateRoleDto) {
    const { permissionKeys, applicationKey, ...data } = body;

    const application = await this.applicationService.checkIsFound({
      where: { key: applicationKey },
    });

    const role = await this.roleService._create(
      { ...data, applicationId: application.id },
      permissionKeys,
    );
    return await this.roleService.makeResponse(role, 'all');
  }

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageRolesRead,
    ]),
  )
  @ApiOperation({ summary: 'fetch roles' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of roles',
    type: RoleResponse,
  })
  async findAll(@Query() query: FindAllRolesDto) {
    const response = await this.roleService.makeRoleArrayDataResponse(
      query.page,
      query.limit,
      query.q,
      query.applicationId,
      query.include,
    );

    return response;
  }

  @Get('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageRolesRead,
    ]),
  )
  @ApiOperation({ summary: 'get role details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Role fetched successfully',
    type: RoleResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async fetchRoleDetails(@Param('id') id: string) {
    const role = await this.roleService.checkIsFound({
      where: { id },
      include: [RolePermission],
    });
    const roleResponse = await this.roleService.makeResponse(role, 'all');
    return roleResponse;
  }

  @Put('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageRolesUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update role details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Role updated successfully',
    type: RoleResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async updateRoleDetails(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ) {
    const { permissionKeys, ...data } = body;
    let role = await this.roleService.checkIsFound({
      where: { id },
    });
    role = await this.roleService._update(role, data, permissionKeys);

    const roleResponse = await this.roleService.makeResponse(role, 'all');
    return roleResponse;
  }

  @Delete('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageRolesDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete role (force delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the role to delete',
  })
  @ApiNoContentResponse({
    description: 'Role successfully force deleted',
    type: RoleResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async delete(@Param('id') id: string) {
    const role = await this.roleService.checkIsFound({
      where: { id },
      include: [RolePermission, Account],
    });
    await this.roleService.delete(role);
    const roleResponse = await this.roleService.makeResponse(role);
    return roleResponse;
  }
}
