import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

@Controller('external/accounts')
@ApiTags('External', 'Account')
@UseGuards(CheckCallMe)
export class ExternalAccountController {
  constructor(private readonly accountService: AccountService) {}

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
