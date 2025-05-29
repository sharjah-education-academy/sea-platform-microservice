import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import { Utils } from 'sea-backend-helpers';

@Injectable()
export class JWTAuthorizationGuard implements CanActivate {
  constructor(
    private readonly acceptedPermissionKeys: CONSTANTS.Permission.PermissionKeys[],
    private readonly validationStrategy: CONSTANTS.Permission.ValidationStrategy = 'all',
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: DTO.Request.AuthorizedRequest & Request = context
      .switchToHttp()
      .getRequest();

    const { permissionKeys } = request.context;

    const authorized = Utils.JWT.validatePermissions(
      this.acceptedPermissionKeys,
      permissionKeys as CONSTANTS.Permission.PermissionKeys[],
      this.validationStrategy,
    );

    if (!authorized)
      throw new UnauthorizedException(
        `You are not authorized to do this action!`,
        {
          description: `you must have ${this.validationStrategy} of these permissions [${this.acceptedPermissionKeys}]`,
        },
      );

    return true;
  }
}
