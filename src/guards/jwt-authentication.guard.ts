import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Utils } from 'sea-backend-helpers';
import { DTO } from 'sea-platform-helpers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: DTO.Request.AuthorizedRequest & Request = context
      .switchToHttp()
      .getRequest();

    const authorization = (request.headers as any).authorization;

    const publicKey = fs.readFileSync(
      path.join(__dirname, '..', '..', 'keys/public.pem'),
    );

    const { message, success, payload } = Utils.JWT.verifyJWTRequest(
      authorization,
      publicKey,
      this.jwtService.verify.bind(this.jwtService),
    );

    if (!success) throw new UnauthorizedException(message);

    request.context = {
      id: payload.id,
      account: undefined,
      permissionKeys: payload.permissionKeys,
      applicationKeys: payload.applicationKeys,
    };

    return true;
  }
}
