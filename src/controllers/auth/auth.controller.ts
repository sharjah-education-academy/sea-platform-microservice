import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
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
  UpdateAlertSettingsDto,
} from './auth.dto';
import { AuthService } from 'src/models/auth/auth.service';
import { LoginResponse } from 'src/models/auth/auth.dto';
import { AccountResponse } from 'src/models/account/account.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { AccountService } from 'src/models/account/account.service';
import { OTPService } from 'src/models/otp/otp.service';
import { Op } from 'sequelize';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import { Role } from 'src/models/role/role.model';
import { ApplicationService } from 'src/models/application/application.service';
import { Response } from 'express';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { JWTConfig } from 'src/config';
import * as ms from 'ms';
import { AccountAlertSettingService } from 'src/models/account-alert-setting/account-alert-setting.service';

@Controller('auth')
@ApiTags('Internal', 'Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly OTPService: OTPService,
    private readonly applicationService: ApplicationService,
    private readonly serverConfigService: ServerConfigService,
    private readonly accountAlertSettingService: AccountAlertSettingService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Account login with email or phone number' })
  @ApiHeader({
    name: CONSTANTS.Server.DEVICE_ID_HEADER_KEY,
    description: 'Unique device identifier',
    required: true,
  })
  @ApiOkResponse({
    description: 'The account has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Headers(CONSTANTS.Server.DEVICE_ID_HEADER_KEY)
    deviceId: string = CONSTANTS.Server.DEFAULT_DEVICE_ID,
    @Headers(CONSTANTS.Server.USER_AGENT_HEADER_KEY)
    userAgent: string = CONSTANTS.Server.DEFAULT_USER_AGENT,
  ) {
    const { clientIp } = req as any;

    const sharedCookieDomain =
      this.serverConfigService.get<string>('SHARED_COOKIE_DOMAIN') ||
      '.platform.sea.ac.ae';

    const loginResponse = await this.authService.login(
      body,
      deviceId,
      userAgent,
      clientIp,
    );

    console.log('login success:\n', loginResponse.accessToken);

    const expiresIn = JWTConfig.JWT_OPTIONS.expiresIn;
    // let ttlSeconds: number;

    // if (typeof expiresIn === 'string') {
    //   ttlSeconds = Math.floor(ms(expiresIn));
    // } else {
    //   ttlSeconds = expiresIn * 1000;
    // }

    let maxAgeMs: number;

    if (typeof expiresIn === 'string') {
      maxAgeMs = ms(expiresIn); // already ms
    } else {
      maxAgeMs = expiresIn * 1000;
    }

    // res.cookie(CONSTANTS.JWT.JWTCookieKey, loginResponse.accessToken, {
    //   httpOnly: false,
    //   secure: true,
    //   sameSite: 'none',
    //   domain: sharedCookieDomain, // Share across subdomains
    //   path: '/',
    //   maxAge: ttlSeconds,
    // });

    res.cookie(CONSTANTS.JWT.JWTCookieKey, loginResponse.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: sharedCookieDomain,
      path: '/',
      maxAge: maxAgeMs,
    });
    return loginResponse;
  }

  @Post('/microsoft/login')
  @ApiOperation({ summary: 'Account login with microsoft account' })
  @ApiHeader({
    name: CONSTANTS.Server.DEVICE_ID_HEADER_KEY,
    description: 'Unique device identifier',
    required: true,
  })
  @ApiOkResponse({
    description: 'The account has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'The Id Token is invalid' })
  async microsoftLoginAccount(
    @Body() body: MicrosoftLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers(CONSTANTS.Server.DEVICE_ID_HEADER_KEY)
    deviceId: string = CONSTANTS.Server.DEFAULT_DEVICE_ID,
    @Headers(CONSTANTS.Server.USER_AGENT_HEADER_KEY)
    userAgent: string = CONSTANTS.Server.DEFAULT_USER_AGENT,
  ) {
    const { clientIp } = req as any;
    const sharedCookieDomain =
      this.serverConfigService.get<string>('SHARED_COOKIE_DOMAIN') ||
      '.platform.sea.ac.ae';
    const LoginResponse = await this.authService.microsoftLogin(
      body,
      deviceId,
      userAgent,
      clientIp,
    );

    const expiresIn = JWTConfig.JWT_OPTIONS.expiresIn;
    let ttlSeconds: number;

    if (typeof expiresIn === 'string') {
      ttlSeconds = Math.floor(ms(expiresIn));
    } else {
      ttlSeconds = expiresIn * 1000;
    }

    res.cookie(CONSTANTS.JWT.JWTCookieKey, LoginResponse.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      domain: sharedCookieDomain, // Share across subdomains
      path: '/',
      maxAge: ttlSeconds,
    });
    return LoginResponse;
  }

  @Post('logout')
  @UseGuards(JWTAuthGuard)
  @ApiHeader({
    name: CONSTANTS.Server.DEVICE_ID_HEADER_KEY,
    description: 'Unique device identifier',
    required: true,
  })
  logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: DTO.Request.AuthorizedRequest,
    @Headers(CONSTANTS.Server.DEVICE_ID_HEADER_KEY)
    deviceId: string = CONSTANTS.Server.DEFAULT_DEVICE_ID,
  ) {
    const { id: accountId } = req.context;
    const sharedCookieDomain =
      this.serverConfigService.get<string>('SHARED_COOKIE_DOMAIN') ||
      '.platform.sea.ac.ae';

    this.authService.logout(accountId, deviceId);

    res.cookie(CONSTANTS.JWT.JWTCookieKey, '', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      domain: sharedCookieDomain,
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return true;
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'fetch logged account details' })
  @ApiOkResponse({
    description: 'the logged account details has been fetched',
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async fetchLoggedAccountDetails(@Req() req: DTO.Request.AuthorizedRequest) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });
    return this.accountService.makeResponse(account, 'all');
  }

  @Put('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'update my account details' })
  @ApiOkResponse({
    description: 'my account details has been updated',
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async updateLoggedAccountDetails(
    @Req() req: DTO.Request.AuthorizedRequest,
    @Body() body: UpdateMyAccountDto,
  ) {
    const accountId = req.context.id;
    let account = await this.accountService.checkIsFound({
      where: { id: accountId },
      include: [Role],
    });
    account = await this.accountService.updateMe(account, body);
    return this.accountService.makeResponse(account, 'all');
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
    @Req() req: DTO.Request.AuthorizedRequest,
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
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async fetchAllowedApplications(@Req() req: DTO.Request.AuthorizedRequest) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
      include: [Role],
    });

    const applications =
      await this.accountService.getAccountApplications(account);

    const applicationResponses =
      await this.applicationService.makeApplicationsResponse(applications);

    return applicationResponses;
  }

  @Put('update-alert-settings')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Update alert settings' })
  @ApiOkResponse({
    description: 'The account alert settings get updated successfully.',
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async updateAlertSettings(
    @Req() req: DTO.Request.AuthorizedRequest,
    @Body() body: UpdateAlertSettingsDto,
  ) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });

    await this.accountAlertSettingService.updateAlertSettings(
      account,
      body.settings,
    );

    return this.accountService.makeResponse(account, 'all');
  }
}
