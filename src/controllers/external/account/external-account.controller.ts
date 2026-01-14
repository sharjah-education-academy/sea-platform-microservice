import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from 'src/models/account/account.service';

import { AccountFullResponse } from 'src/models/account/account.dto';
import { CheckCallMe } from 'src/guards/check-call-me.guard';
import { CONSTANTS } from 'sea-platform-helpers';
import { FindAllAccountsByIdsDto } from './external-account.dto';
import { Op } from 'sequelize';

@Controller('external/accounts')
@ApiTags('External', 'Account')
@UseGuards(CheckCallMe)
export class ExternalAccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/get-all-by-ids')
  @ApiOperation({ summary: 'get accounts by ids' })
  @ApiParam({
    name: 'ids',
    type: [String],
    description: 'Array of IDs',
  })
  @ApiOkResponse({
    description: 'Accounts fetched successfully',
    type: AccountFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Accounts not found' })
  async fetchAccountsByIds(@Body() body: FindAllAccountsByIdsDto) {
    const { ids } = body;

    const accounts = await this.accountService.find({
      where: {
        id: { [Op.in]: ids },
      },
    });
    return await this.accountService.makeAccountsFullResponse(accounts);
  }

  @Get('/:id')
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

  @Get(
    `/${CONSTANTS.Application.ApplicationKeys.FacultyOperationApplication}/thesis/possible-reviewers`,
  )
  @ApiOperation({ summary: 'get possible reviewers for a thesis' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Accounts fetched successfully',
    type: AccountFullResponse,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async fetchThesisPossibleReviewers() {
    const accounts = await this.accountService.getAccountsInPermissionKeys([
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisFaculty,
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisChair,
    ]);
    return await this.accountService.makeAccountsFullResponse(accounts);
  }
}
