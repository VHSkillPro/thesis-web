import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import { UsersService } from './users.service';
import { UsersMessage } from './users.message';
import { UsersFilterDto } from './dto/user-filter.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query() usersFilter: UsersFilterDto) {
    const users = await this.usersService.findAll(usersFilter);
    const count = await this.usersService.count(usersFilter);

    return new PaginationResponseDto(
      UsersMessage.FIND_ALL_SUCCESS,
      users,
      new PaginationMetaDto(count, usersFilter.page, usersFilter.limit),
    );
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException(UsersMessage.USER_NOT_FOUND);
    }

    return new ShowResponseDto(UsersMessage.FIND_ONE_SUCCESS, user);
  }
}
