import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './role.decorator';
import AuthMessage from 'src/auth/auth.message';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new UnauthorizedException({
        message: AuthMessage.ERROR.UNAUTHORIZED,
      });
    }

    const result = requiredRoles.some((role) => user.roleId === role);
    if (!result) {
      throw new ForbiddenException({
        message: AuthMessage.ERROR.FORBIDDEN,
      });
    }

    return true;
  }
}
