import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LecturersService } from './lecturers.service';
import { LecturersFilterDto } from './dto/lecturers-filter.dto';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import {
  LecturersMessageError,
  LecturersMessageSuccess,
} from './lecturers.message';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';

@UseGuards(AuthGuard)
@Controller('lecturers')
export class LecturersController {
  constructor(private lecturersService: LecturersService) {}

  @Get()
  async findAll(@Query() lecturersFilterDto: LecturersFilterDto) {
    const lecturers = await this.lecturersService.findAll(lecturersFilterDto);
    const count = await this.lecturersService.count(lecturersFilterDto);

    return new PaginationResponseDto(
      LecturersMessageSuccess.FIND_ALL_SUCCESS,
      lecturers,
      new PaginationMetaDto(
        count,
        lecturersFilterDto.page,
        lecturersFilterDto.limit,
      ),
    );
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const lecturer = await this.lecturersService.findOne(username);
    if (!lecturer) {
      throw new BadRequestException({
        message: LecturersMessageError.LECTURER_NOT_FOUND,
      });
    }

    return new ShowResponseDto(
      LecturersMessageSuccess.FIND_ONE_SUCCESS,
      lecturer,
    );
  }

  @Post()
  async create(@Body() createLecturerDto: CreateLecturerDto) {
    await this.lecturersService.create(createLecturerDto);
    return new BaseResponseDto(LecturersMessageSuccess.CREATE_SUCCESS);
  }

  @Patch(':username')
  async update(
    @Param('username') username: string,
    @Body() updateLecturerDto: UpdateLecturerDto,
  ) {
    await this.lecturersService.update(username, updateLecturerDto);
    return new BaseResponseDto(LecturersMessageSuccess.UPDATE_SUCCESS);
  }

  @Delete(':username')
  async delete(@Param('username') username: string) {
    await this.lecturersService.delete(username);
    return new BaseResponseDto(LecturersMessageSuccess.DELETE_SUCCESS);
  }
}
