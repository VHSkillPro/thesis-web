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
import { UsersService } from 'src/users/users.service';
import { AuthMessageError } from 'src/auth/auth.message';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

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
        message: AuthMessageError.UNAUTHORIZED,
      });
    }

    const userInDB = await this.usersService.findOne(user.username);
    if (!userInDB) {
      throw new UnauthorizedException({
        message: AuthMessageError.UNAUTHORIZED,
      });
    }

    const result = requiredRoles.some((role) => userInDB?.roleId === role);
    if (!result) {
      throw new ForbiddenException({
        message: AuthMessageError.FORBIDDEN,
      });
    }

    return true;
  }
}
