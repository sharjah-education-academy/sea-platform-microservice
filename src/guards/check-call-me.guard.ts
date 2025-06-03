import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { DTO } from 'sea-platform-helpers';

import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Injectable()
export class CheckCallMe implements CanActivate {
  constructor(private readonly serverConfigService: ServerConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: DTO.Request.AuthorizedRequest & Request = context
      .switchToHttp()
      .getRequest();

    const authorization = (request.headers as any).authorization;

    if (!authorization)
      throw new UnauthorizedException(
        'the token is not provided in the authorization request headers',
      );

    let base64Credentials = authorization;

    if (authorization.startsWith('Basic '))
      base64Credentials = authorization.substring(6);

    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );

    const [clientId, clientSecret] = credentials.split(':');

    const CALL_ME_CLIENT_ID =
      this.serverConfigService.get<string>('CALL_ME_CLIENT_ID');
    const CALL_ME_CLIENT_SECRET = this.serverConfigService.get<string>(
      'CALL_ME_CLIENT_SECRET',
    );

    if (
      CALL_ME_CLIENT_ID !== clientId ||
      CALL_ME_CLIENT_SECRET !== clientSecret
    )
      throw new UnauthorizedException(`invalid credentials!`);

    return true;
  }
}
