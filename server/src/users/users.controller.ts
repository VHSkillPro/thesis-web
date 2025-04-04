import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import { UsersService } from './users.service';
import { UsersMessageError, UsersMessageSuccess } from './users.message';
import { UsersFilterDto } from './dto/user-filter.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query() usersFilter: UsersFilterDto) {
    const users = await this.usersService.findAll(usersFilter);
    const count = await this.usersService.count(usersFilter);

    return new PaginationResponseDto(
      UsersMessageSuccess.FIND_ALL_SUCCESS,
      users,
      new PaginationMetaDto(count, usersFilter.page, usersFilter.limit),
    );
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException({
        message: UsersMessageError.USER_NOT_FOUND,
      });
    }

    return new ShowResponseDto(UsersMessageSuccess.FIND_ONE_SUCCESS, user);
  }
}
