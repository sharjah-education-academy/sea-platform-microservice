import {
  BadRequestException,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from 'src/models/account/account.service';
import {
  ChangePasswordDto,
  CreateAccountDto,
  UpdateAccountDto,
  AccountArrayDataResponse,
  FindAllAccountsDto,
} from './account.dto';
import { AccountResponse } from 'src/models/account/account.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { Role } from 'src/models/role/role.model';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { Op } from 'sequelize';
import { CONSTANTS } from 'sea-platform-helpers';

@Controller('accounts')
@ApiTags('Internal', 'Account')
@UseGuards(JWTAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({
    description: 'The account has been successfully created.',
    type: AccountResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateAccountDto) {
    const { roleIds, ...data } = body;
    const account = await this.accountService._create(data, roleIds);
    const AccountResponse = await this.accountService.makeResponse(
      account,
      'all',
    );
    return AccountResponse;
  }

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard(
      [
        CONSTANTS.Permission.PermissionKeys.ManageAccountsRead,
        CONSTANTS.Permission.PermissionKeys.ManageGoalsCreate,
        CONSTANTS.Permission.PermissionKeys.ManageGoalsUpdateDetails,
      ],
      'one',
    ),
  )
  @ApiOperation({ summary: 'fetch accounts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of accounts',
    type: AccountArrayDataResponse,
  })
  async findAll(@Query() query: FindAllAccountsDto) {
    return await this.accountService.makeAccountArrayDataResponse(
      query.page,
      query.limit,
      query.q,
      query.roleId,
      query.isDeleted,
      ['roles', 'department', 'organization'], // TODO: query.include to be passed from the frontend
    );
  }

  @Get('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsRead,
    ]),
  )
  @ApiOperation({ summary: 'get account details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Account fetched successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async fetchAccountDetails(@Param('id') id: string) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    const AccountResponse = await this.accountService.makeResponse(
      account,
      'all',
    );
    return AccountResponse;
  }

  @Put('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update account details' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Account updated successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async updateAccountDetails(
    @Param('id') id: string,
    @Body() body: UpdateAccountDto,
  ) {
    const { roleIds, ...data } = body;
    let account = await this.accountService.checkIsFound({
      where: { id },
      include: [Role],
    });
    await this.accountService._update(account, data, roleIds);
    account = await this.accountService.checkIsFound({
      where: { id },
      include: [Role],
    });
    const AccountResponse = await this.accountService.makeResponse(
      account,
      'all',
    );
    return AccountResponse;
  }

  @Put('/:id/change-password')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsChangePassword,
    ]),
  )
  @ApiOperation({ summary: 'change account password' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Account password has been changed successfully',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async changeAccountPassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
  ) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    return await this.accountService.changePassword(account, body.newPassword);
  }

  @Put('/:id/toggle-lock')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'toggle lock account' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'the lock status has been changed successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async toggleLock(@Param('id') id: string) {
    let account = await this.accountService.checkIsFound({ where: { id } });
    account = await this.accountService.toggleLockStatus(account);
    return await this.accountService.makeResponse(account, 'all');
  }

  @Put('/:id/restore')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsRestore,
    ]),
  )
  @ApiOperation({ summary: 'restore account' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'the account has been restored successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async restore(@Param('id') id: string) {
    let account = await this.accountService.checkIsFound({
      where: { id, deletedAt: { [Op.ne]: null } },
      paranoid: false,
    });
    account = await this.accountService.restore(account);
    return await this.accountService.makeResponse(account, 'all');
  }

  @Delete('/:id/soft-delete')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsSoftDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete account (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the account to delete',
  })
  @ApiNoContentResponse({
    description: 'Account successfully soft deleted',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async softDelete(@Param('id') id: string) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    await this.accountService.delete(account);
    const AccountResponse = await this.accountService.makeResponse(
      account,
      'all',
    );
    return AccountResponse;
  }

  @Delete('/:id/force-delete')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsForceDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete account (force delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the account to delete',
  })
  @ApiNoContentResponse({
    description: 'Account successfully force deleted',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forceDelete(@Param('id') id: string) {
    throw new BadRequestException('Force delete is not implemented yet!');
  }
}
