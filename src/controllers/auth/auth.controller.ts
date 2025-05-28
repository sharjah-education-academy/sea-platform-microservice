import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ChangeMyPasswordDto,
  LoginDto,
  RequestOTPDto,
  CheckOTPValidityDto,
  ResetPasswordDto,
  UpdateMyAccountDto,
  MicrosoftLoginDto,
} from './auth.dto';
import { AuthService } from 'src/models/auth/auth.service';
import { LoginResponse } from 'src/models/auth/auth.dto';
import { AccountFullResponse } from 'src/models/account/account.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { AccountService } from 'src/models/account/account.service';
import { OTPService } from 'src/models/otp/otp.service';
import { Op } from 'sequelize';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import { Role } from 'src/models/role/role.model';
import { ApplicationService } from 'src/models/application/application.service';

@Controller('auth')
@ApiTags('Internal', 'Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly OTPService: OTPService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Account login with email or phone number' })
  @ApiOkResponse({
    description: 'The account has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('/microsoft/login')
  @ApiOperation({ summary: 'Account login with microsoft account' })
  @ApiOkResponse({
    description: 'The account has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'The Id Token is invalid' })
  async microsoftLoginAccount(@Body() body: MicrosoftLoginDto) {
    return this.authService.microsoftLogin(body);
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'fetch logged account details' })
  @ApiOkResponse({
    description: 'the logged account details has been fetched',
    type: AccountFullResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async fetchLoggedAccountDetails(
    @Request() req: DTO.Request.AuthorizedRequest,
  ) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });
    return this.accountService.makeAccountFullResponse(account);
  }

  @Put('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'update my account details' })
  @ApiOkResponse({
    description: 'my account details has been updated',
    type: AccountFullResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async updateLoggedAccountDetails(
    @Request() req: DTO.Request.AuthorizedRequest,
    @Body() body: UpdateMyAccountDto,
  ) {
    const accountId = req.context.id;
    let account = await this.accountService.checkIsFound({
      where: { id: accountId },
      include: [Role],
    });
    account = await this.accountService.updateMe(account, body);
    return this.accountService.makeAccountFullResponse(account);
  }

  @Put('change-password')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'change my password' })
  @ApiOkResponse({
    description: 'the password has been changed successfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Old password is incorrect.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async changeMyPassword(
    @Request() req: DTO.Request.AuthorizedRequest,
    @Body() body: ChangeMyPasswordDto,
  ) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });

    return await this.accountService.changePassword(
      account,
      body.newPassword,
      true,
      body.oldPassword,
    );
  }

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for identifier' })
  @ApiOkResponse({ description: 'OTP sent successfully', type: Boolean })
  async requestOTP(@Body() body: RequestOTPDto) {
    const { email, phoneNumber } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const account = await this.accountService.findOne({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    await this.OTPService.createOrUpdate(identifier, account);

    return true;
  }

  @Post('check-otp-validity')
  @ApiOperation({ summary: 'Verify OTP for identifier' })
  @ApiOkResponse({ description: 'OTP verified successfully', type: Boolean })
  @ApiBadRequestResponse({
    description:
      'There is no otp, reach the limit of tries, otp has been expired, or otp is incorrect',
  })
  async checkOTPValidity(@Body() body: CheckOTPValidityDto) {
    const { email, phoneNumber, OTPCode } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    await this.OTPService.checkValidity(identifier, OTPCode);

    return true;
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'password has reset successfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({
    description:
      'There is no otp, reach the limit of tries, otp has been expired, or otp is incorrect',
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, phoneNumber, OTPCode } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const otp = await this.OTPService.checkValidity(identifier, OTPCode);
    otp.destroy();

    const account = await this.accountService.checkIsFound({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    await this.accountService.changePassword(account, body.newPassword);

    return true;
  }

  @Get('/me/applications')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'fetch allowed applications for me' })
  @ApiOkResponse({
    description: 'the allowed applications has been fetched',
    type: AccountFullResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async fetchAllowedApplications(
    @Request() req: DTO.Request.AuthorizedRequest,
  ) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
      include: [Role],
    });

    const applicationIds = account.roles
      .map((role) => role.applicationId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const { applications } = await this.applicationService.findAll(
      {
        where: {
          id: {
            [Op.in]: applicationIds,
          },
          status: {
            [Op.ne]: CONSTANTS.Application.ApplicationStatuses.Unavailable,
          },
        },
      },
      0,
      0,
      true,
    );

    const applicationResponses =
      await this.applicationService.makeApplicationsResponse(applications);

    return applicationResponses;

    // this.applicationService.
  }
}
