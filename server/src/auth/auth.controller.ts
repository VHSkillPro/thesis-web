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
import AuthMessage from './auth.message';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() signInDto: SignInDto) {
    const tokens = await this.authService.signIn(signInDto);
    return new ShowResponseDto(AuthMessage.SUCCESS.LOGIN, tokens);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() request) {
    return new ShowResponseDto(AuthMessage.SUCCESS.ME, request.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    const tokens = await this.authService.refresh(refreshDto.refreshToken);
    return new ShowResponseDto(AuthMessage.SUCCESS.REFRESH, tokens);
  }
}
