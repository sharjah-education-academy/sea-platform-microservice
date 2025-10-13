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
import { AccountFullResponse } from '../account/account.dto';
import { Op } from 'sequelize';
import { MicrosoftAuthService } from '../microsoft-auth/microsoft-auth.service';
import { Utils as BackendUtils } from 'sea-backend-helpers';
import * as fs from 'fs';
import * as path from 'path';
import { RoleService } from '../role/role.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as ms from 'ms';
import { Role } from '../role/role.model';
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
  ) {}

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

  private async signToken(account: AccountFullResponse, deviceId: string) {
    const privateKey = fs.readFileSync(
      path.join(__dirname, '..', '..', 'keys/private.pem'),
    );

    const token = this.jwtService.sign(
      {
        id: account.id,
        permissionKeys: account.permissionKeys,
        applicationKeys: account.applicationKeys,
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

  async login(data: LoginDto, deviceId: string) {
    const { email, phoneNumber, password } = data;

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
    const accountResponse =
      await this.accountService.makeAccountFullResponse(account);

    const token = await this.signToken(accountResponse, deviceId);

    return this.makeLoginResponse(token, accountResponse);
  }

  async microsoftLogin(data: MicrosoftLoginDto, deviceId: string) {
    const { idToken } = data;

    const { email, name } =
      await this.microsoftAuthService.verifyIdToken(idToken);

    const { roles } = await this.roleService.findAll({
      where: { isDefault: true },
    });

    // create account if not exist
    let account = await this.accountService.findOne({
      where: { email },
    });

    if (!account) {
      // The account type will be User by default when login by microsoft

      account = await this.accountService.create(
        {
          name,
          email,
        },
        roles.map((r) => r.id),
      );
    }

    if (account.isLocked)
      throw new UnauthorizedException('The account has been locked!');

    const accountResponse =
      await this.accountService.makeAccountFullResponse(account);

    const token = await this.signToken(accountResponse, deviceId);

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

  makeLoginResponse(accessToken: string, account: AccountFullResponse) {
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
