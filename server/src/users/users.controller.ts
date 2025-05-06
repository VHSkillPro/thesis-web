import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/role.decorator';
import AuthMessage from 'src/auth/auth.message';
import UsersMessage from './users.message';
import { BaseResponseDto, ShowResponseDto } from 'src/dto/response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  private selfCheck(req, username: string) {
    const user = req.user;
    if (user.username !== username) {
      throw new ForbiddenException({
        message: AuthMessage.ERROR.FORBIDDEN,
      });
    }
  }

  @Get('/:username')
  @Roles(Role.Admin, Role.Lecturer)
  async getProfile(@Request() req, @Param('username') username: string) {
    this.selfCheck(req, username);
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException({
        message: UsersMessage.ERROR.NOT_FOUND,
      });
    }
    return new ShowResponseDto(UsersMessage.SUCCESS.FIND_ONE, user);
  }

  @Post('/:username/change-password')
  @Roles(Role.Admin, Role.Lecturer)
  async changePassword(
    @Request() req,
    @Param('username') username: string,
    @Body() formData: ChangePasswordDto,
  ) {
    this.selfCheck(req, username);
    await this.usersService.changePassword(username, formData);
    return new BaseResponseDto(UsersMessage.SUCCESS.CHANGE_PASSWORD);
  }
}
