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
import {
  CreateRoleDto,
  FindAllRolesDto,
  RoleShortArrayDataResponse,
  UpdateRoleDto,
} from './role.dto';
import { RoleFullResponse, RoleShortResponse } from 'src/models/role/role.dto';
import { RolePermission } from 'src/models/role-permission/role-permission.model';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { Account } from 'src/models/account/account.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Controller('roles')
@ApiTags('Internal', 'Role')
@UseGuards(JWTAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageRolesCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({
    description: 'The role has been successfully created.',
    type: RoleShortResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateRoleDto) {
    const { permissionKeys, applicationKey, ...data } = body;
    const role = await this.roleService.create(
      data,
      permissionKeys,
      applicationKey,
    );
    return await this.roleService.makeRoleShortResponse(role);
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
    type: RoleShortArrayDataResponse,
  })
  async findAll(@Query() query: FindAllRolesDto) {
    const response = await this.roleService.makeRoleShortArrayDataResponse(
      query.page,
      query.limit,
      query.q,
      query.applicationId,
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
    type: RoleFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async fetchRoleDetails(@Param('id') id: string) {
    const role = await this.roleService.checkIsFound({
      where: { id },
      include: [RolePermission],
    });
    const roleResponse = await this.roleService.makeRoleFullResponse(role);
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
    type: RoleFullResponse,
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
    role = await this.roleService.update(role, data, permissionKeys);

    const roleResponse = await this.roleService.makeRoleFullResponse(role);
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
    type: RoleFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async delete(@Param('id') id: string) {
    const role = await this.roleService.checkIsFound({
      where: { id },
      include: [RolePermission, Account],
    });
    await this.roleService.delete(role);
    const roleResponse = await this.roleService.makeRoleFullResponse(role);
    return roleResponse;
  }
}
