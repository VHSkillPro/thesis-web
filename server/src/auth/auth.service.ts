import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthMessage } from './auth.message';
import { UsersService } from 'src/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensDto } from './dto/tokens.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user by verifying their username and password, and generates
   * access and refresh tokens upon successful authentication.
   *
   * @param username - The username of the user attempting to sign in.
   * @param password - The password of the user attempting to sign in.
   * @returns A promise that resolves to a `TokensDto` containing the access and refresh tokens.
   * @throws {UnauthorizedException} If the username or password is incorrect.
   */
  async signIn(signInDto: SignInDto): Promise<TokensDto> {
    const { username, password } = signInDto;
    const user = await this.usersService.findOne(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException({
        message: AuthMessage.WRONG_USERNAME_OR_PASSWORD,
      });
    }

    const payload = { username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: Number(process.env.ACCESS_TOKEN_LIFETIME),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET_KEY,
      expiresIn: Number(process.env.REFRESH_TOKEN_LIFETIME),
    });

    return new TokensDto(accessToken, refreshToken);
  }

  /**
   * Refreshes the access and refresh tokens using the provided refresh token.
   *
   * @param refreshToken - The refresh token used to generate new tokens.
   * @returns A promise that resolves to an instance of `TokensDto` containing the new access and refresh tokens.
   * @throws {UnauthorizedException} If the provided refresh token is invalid or cannot be verified.
   *
   * The method verifies the provided refresh token using the `REFRESH_SECRET_KEY`.
   * If the token is valid, it generates a new access token and a new refresh token
   * using the respective secret keys and expiration times defined in the environment variables.
   */
  async refresh(refreshToken: string): Promise<TokensDto> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET_KEY,
    });

    if (!payload) {
      throw new UnauthorizedException({
        message: AuthMessage.UNAUTHORIZED,
      });
    }

    const newPayload = { username: payload.username };

    const accessToken = this.jwtService.sign(newPayload, {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: Number(process.env.ACCESS_TOKEN_LIFETIME),
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: process.env.REFRESH_SECRET_KEY,
      expiresIn: Number(process.env.REFRESH_TOKEN_LIFETIME),
    });

    return new TokensDto(accessToken, newRefreshToken);
  }
}
