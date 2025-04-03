import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LecturersService } from './lecturers.service';
import { LecturersFilterDto } from './dto/lecturers-filter.dto';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
} from 'src/dto/response.dto';
import { LecturersMessage } from './lecturers.message';
import { CreateLecturerDto } from './dto/create-lecturer.dto';

@UseGuards(AuthGuard)
@Controller('lecturers')
export class LecturersController {
  constructor(private lecturersService: LecturersService) {}

  @Get()
  async findAll(@Query() lecturersFilterDto: LecturersFilterDto) {
    const lecturers = await this.lecturersService.findAll(lecturersFilterDto);
    const count = await this.lecturersService.count(lecturersFilterDto);

    return new PaginationResponseDto(
      LecturersMessage.FIND_ALL_SUCCESS,
      lecturers,
      new PaginationMetaDto(
        count,
        lecturersFilterDto.page,
        lecturersFilterDto.limit,
      ),
    );
  }

  @Post()
  async create(@Body() createLecturerDto: CreateLecturerDto) {
    await this.lecturersService.create(createLecturerDto);
    return new BaseResponseDto(LecturersMessage.CREATE_SUCCESS);
  }
}
