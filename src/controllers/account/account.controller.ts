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
import { AccountFullResponse } from 'src/models/account/account.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { Role } from 'src/models/role/role.model';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { WhereOptions } from 'sequelize';
import { Account } from 'src/models/account/account.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
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
    type: AccountFullResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateAccountDto) {
    const { roleIds, ...data } = body;
    const account = await this.accountService.create(data, roleIds);
    const AccountResponse =
      await this.accountService.makeAccountFullResponse(account);
    return AccountResponse;
  }

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageAccountsRead,
    ]),
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
    const { q, roleId, isDeleted } = query;

    const where: WhereOptions<Account> = {};
    const roleWhere: WhereOptions<Role> = {};

    if (q) {
      where[Op.or] = ['id', 'name', 'email', 'phoneNumber'].map((c) =>
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(`Account.${c}`)), {
          [Op.like]: `%${q}%`,
        }),
      );
    }

    if (isDeleted) {
      where['deletedAt'] = { [Op.ne]: null };
    }

    if (roleId !== 'all') {
      roleWhere['id'] = roleId;
    }

    const { totalCount, accounts } = await this.accountService.findAll(
      {
        where,
        include: [{ model: Role, where: roleWhere }],
        paranoid: !isDeleted,
        distinct: true,
      },
      query.page,
      query.limit,
    );

    const accountsResponse =
      await this.accountService.makeAccountsShortResponse(accounts);

    return new AccountArrayDataResponse(
      totalCount,
      accountsResponse,
      query.page,
      query.limit,
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
    type: AccountFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async fetchAccountDetails(@Param('id') id: string) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    const AccountResponse =
      await this.accountService.makeAccountFullResponse(account);
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
    type: AccountFullResponse,
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
    await this.accountService.update(account, data, roleIds);
    account = await this.accountService.checkIsFound({
      where: { id },
      include: [Role],
    });
    const AccountResponse =
      await this.accountService.makeAccountFullResponse(account);
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
    type: AccountFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async toggleLock(@Param('id') id: string) {
    let account = await this.accountService.checkIsFound({ where: { id } });
    account = await this.accountService.toggleLockStatus(account);
    return await this.accountService.makeAccountFullResponse(account);
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
    type: AccountFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async restore(@Param('id') id: string) {
    let account = await this.accountService.checkIsFound({
      where: { id, deletedAt: { [Op.ne]: null } },
      paranoid: false,
    });
    account = await this.accountService.restore(account);
    return await this.accountService.makeAccountFullResponse(account);
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
    type: AccountFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async softDelete(@Param('id') id: string) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    await this.accountService.delete(account);
    const AccountResponse =
      await this.accountService.makeAccountFullResponse(account);
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
    type: AccountFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forceDelete(@Param('id') id: string) {
    throw new BadRequestException('Force delete is not implemented yet!');
  }
}
