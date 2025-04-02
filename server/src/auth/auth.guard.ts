import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMessage } from './auth.message';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determines whether a request is authorized to proceed by validating the JWT token
   * from the request's authorization header.
   *
   * @param context - The execution context that provides details about the current request.
   * @returns A promise that resolves to `true` if the request is authorized, otherwise throws an `UnauthorizedException`.
   *
   * @throws {UnauthorizedException} If the token is missing or invalid.
   *
   * The method performs the following steps:
   * 1. Extracts the token from the request's authorization header.
   * 2. Throws an `UnauthorizedException` if the token is not present.
   * 3. Verifies the token using the `jwtService` with the secret key from environment variables.
   * 4. Attaches the decoded payload to the request object under the `user` property.
   * 5. Throws an `UnauthorizedException` if the token verification fails.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: AuthMessage.UNAUTHORIZED,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_SECRET_KEY,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        message: AuthMessage.UNAUTHORIZED,
      });
    }

    return true;
  }

  /**
   * Extracts the token from the `Authorization` header of the incoming request.
   *
   * The method expects the `Authorization` header to follow the format: `Bearer <token>`.
   * If the header is present and correctly formatted, it returns the token.
   * Otherwise, it returns `undefined`.
   *
   * @param request - The incoming HTTP request object.
   * @returns The extracted token if the `Authorization` header is valid, otherwise `undefined`.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
