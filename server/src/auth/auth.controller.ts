import { ShowResponseDto } from 'src/dto/response.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthMessageSuccess } from './auth.message';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const tokens = await this.authService.signIn(signInDto);
    return new ShowResponseDto(AuthMessageSuccess.LOGIN_SUCCESS, tokens);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() request) {
    return new ShowResponseDto(AuthMessageSuccess.ME_SUCCESS, request.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    const tokens = await this.authService.refresh(refreshDto.refreshToken);
    return new ShowResponseDto(AuthMessageSuccess.REFRESH_SUCCESS, tokens);
  }
}
