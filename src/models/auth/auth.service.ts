import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../account/account.service';
import { LoginDto, MicrosoftLoginDto } from 'src/controllers/auth/auth.dto';
import { JWTConfig } from 'src/config';
import { LoginResponse } from './auth.dto';
import { AccountResponse } from '../account/account.dto';
import { Op } from 'sequelize';
import { MicrosoftAuthService } from '../microsoft-auth/microsoft-auth.service';
import {
  Utils as BackendUtils,
  Services,
  Constants as BConstants,
} from 'sea-backend-helpers';
import * as fs from 'fs';
import * as path from 'path';
import { RoleService } from '../role/role.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as ms from 'ms';
import { Role } from '../role/role.model';
import { CONSTANTS, Utils } from 'sea-platform-helpers';
import { IPService } from '../ip/ip.service';
import { CaptchaService } from '../captcha/captcha.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly microsoftAuthService: MicrosoftAuthService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly queueService: Services.QueueService,
    private readonly IPService: IPService,
    private readonly captchaService: CaptchaService,
  ) {}

  private async notifyLogin(
    accountId: string,
    userAgent: string = CONSTANTS.Server.DEFAULT_USER_AGENT,
    ip_address: string = '127.0.0.1',
  ) {
    const info = await this.IPService.getIPInfo(ip_address);

    this.queueService.addJob(BConstants.Queue.Messages.Email, 'Login', {
      accountId,
      device: userAgent,
      ip_address,
      location: `${info.country}, ${info.city}, ${info.region}`,
      time: Utils.Moment.default().toLocaleString(),
    });
  }

  private whitelistToken = async (
    accountId: string,
    deviceId: string,
    token: string,
  ) => {
    const expiresIn = JWTConfig.JWT_OPTIONS.expiresIn;
    let ttlSeconds: number;

    if (typeof expiresIn === 'string') {
      ttlSeconds = Math.floor(ms(expiresIn)); // convert ms → seconds
    } else {
      ttlSeconds = expiresIn * 1000;
    }

    const deviceTokens =
      (await BackendUtils.Cache.get<Record<string, string>>(
        accountId,
        'Token',
        this.cache as any,
      )) ?? {};

    deviceTokens[deviceId] = token;

    BackendUtils.Cache.set(
      accountId,
      'Token',
      deviceTokens,
      this.cache as any,
      ttlSeconds,
    );
  };

  private async signToken(account: AccountResponse, deviceId: string) {
    const privateKey = fs.readFileSync(
      path.join(__dirname, '..', '..', 'keys/private.pem'),
    );

    const token = this.jwtService.sign(
      {
        id: account.id,
        permissionKeys: account.permissionKeys,
        applicationKeys: account.applicationKeys,
        isStudent: Boolean(account.student),
        isFaculty: Boolean(account.faculty),
        isEmployee: Boolean(account.employee),
      },
      {
        privateKey,
        algorithm: 'RS256',
        ...JWTConfig.JWT_OPTIONS,
      },
    );

    this.whitelistToken(account.id, deviceId, token);

    return token;
  }

  async login(
    data: LoginDto,
    deviceId: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const { email, phoneNumber, password, captchaToken } = data;

    await this.captchaService.verify(captchaToken);

    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const account = await this.accountService.findOne({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    if (!account || !account?.password)
      throw new UnauthorizedException('Invalid credentials');

    const isCorrect = await BackendUtils.Bcrypt.comparePassword(
      password,
      account.password,
    );

    if (!isCorrect) throw new UnauthorizedException('Invalid credentials');

    if (account.isLocked)
      throw new UnauthorizedException('The account has been locked!');
    const accountResponse = await this.accountService.makeResponse(
      account,
      'all',
    );

    const token = await this.signToken(accountResponse, deviceId);

    this.notifyLogin(account.id, userAgent, ipAddress);

    return this.makeLoginResponse(token, accountResponse);
  }

  async microsoftLogin(
    data: MicrosoftLoginDto,
    deviceId: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const { idToken } = data;

    const { email } = await this.microsoftAuthService.verifyIdToken(idToken);

    // create account if not exist
    const account = await this.accountService.findByEmail(email);
    if (!account)
      throw new UnauthorizedException(
        `there is no account registered with this email id ${email}`,
      );

    if (account.isLocked)
      throw new UnauthorizedException('The account has been locked!');

    const accountResponse = await this.accountService.makeResponse(
      account,
      'all',
    );

    const token = await this.signToken(accountResponse, deviceId);

    this.notifyLogin(account.id, userAgent, ipAddress);

    return this.makeLoginResponse(token, accountResponse);
  }

  async logout(accountId: string, deviceId: string) {
    const deviceTokens =
      (await BackendUtils.Cache.get<Record<string, string>>(
        accountId,
        'Token',
        this.cache as any,
      )) ?? {};

    delete deviceTokens[deviceId];

    if (Object.keys(deviceTokens).length === 0) {
      BackendUtils.Cache.deleteIfExist(accountId, 'Token', this.cache as any);
    } else {
      BackendUtils.Cache.set(
        accountId,
        'Token',
        deviceTokens,
        this.cache as any,
      );
    }
  }

  makeLoginResponse(accessToken: string, account: AccountResponse) {
    return new LoginResponse(accessToken, account);
  }

  async invalidateTokensForRole(role: Role) {
    const accounts = await this.roleService.getAccounts(role);
    const accountIds = accounts.map((a) => a.id);

    accountIds.map((id) =>
      BackendUtils.Cache.deleteIfExist(id, 'Token', this.cache as any),
    );
  }
}
