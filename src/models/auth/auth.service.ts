import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
    private readonly microsoftAuthService: MicrosoftAuthService,
    private readonly roleService: RoleService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private whitelistToken = (
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

    BackendUtils.Cache.set(
      `${accountId}:${deviceId}`,
      'Token',
      token,
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
    BackendUtils.Cache.deleteIfExist(
      `${accountId}:${deviceId}`,
      'Token',
      this.cache as any,
    );
  }

  makeLoginResponse(accessToken: string, account: AccountFullResponse) {
    return new LoginResponse(accessToken, account);
  }
}
