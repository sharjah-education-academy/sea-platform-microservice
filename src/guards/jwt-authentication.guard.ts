import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Types, Utils } from 'sea-backend-helpers';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import * as fs from 'fs';
import * as path from 'path';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: DTO.Request.AuthorizedRequest & Request = context
      .switchToHttp()
      .getRequest();

    const authorization = (request.headers as any).authorization;
    const deviceId =
      (request.headers as any)[CONSTANTS.Server.DEVICE_ID_HEADER_KEY] ||
      CONSTANTS.Server.DEFAULT_DEVICE_ID;

    const publicKey = fs.readFileSync(
      path.join(__dirname, '..', '..', 'keys/public.pem'),
    );

    const { message, success, payload, token } = Utils.JWT.verifyJWTRequest(
      authorization,
      publicKey,
      this.jwtService.verify.bind(this.jwtService),
    );

    if (!success) throw new UnauthorizedException(message);

    const deviceTokens = await Utils.Cache.get<Record<string, string>>(
      payload.id,
      'Token',
      this.cache as any,
    );
    if (
      !deviceTokens ||
      !deviceTokens[deviceId] ||
      deviceTokens[deviceId] !== token
    ) {
      throw new UnauthorizedException(
        CONSTANTS.Server.ERROR_MESSAGES.REVOKED_TOKEN,
      );
    }
    request.context = {
      id: payload.id,
      account: undefined,
      permissionKeys: payload.permissionKeys,
      applicationKeys: payload.applicationKeys,
    };

    return true;
  }
}
