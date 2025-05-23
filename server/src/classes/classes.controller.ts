import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { ClassesService } from './classes.service';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/role.decorator';
import { ClassesFilterDto } from './dto/classes-filter.dto';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import ClassesMessage from './classes.message';
import { CreateClassDto } from './dto/create-class.dto';
import { LecturersService } from 'src/lecturers/lecturers.service';
import LecturersMessage from 'src/lecturers/lecturers.message';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
@UseGuards(AuthGuard, RolesGuard)
export class ClassesController {
  constructor(
    private classesService: ClassesService,
    private lecturersService: LecturersService,
  ) {}

  @Get()
  @Roles(Role.Admin, Role.Lecturer)
  async findAll(@Query() classesFilter: ClassesFilterDto) {
    const classes = await this.classesService.findAll(classesFilter);
    const count = await this.classesService.count(classesFilter);

    return new PaginationResponseDto(
      ClassesMessage.SUCCESS.FIND_ALL,
      classes,
      new PaginationMetaDto(count, classesFilter.page, classesFilter.limit),
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Lecturer)
  async findOne(@Param('id') id: string) {
    const classData = await this.classesService.findOne(id);
    if (!classData) {
      throw new NotFoundException({
        message: ClassesMessage.ERROR.NOT_FOUND,
      });
    }

    return new ShowResponseDto(ClassesMessage.SUCCESS.FIND_ONE, classData);
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createClassDto: CreateClassDto) {
    const existingClass = await this.classesService.findOne(createClassDto.id);

    if (existingClass) {
      throw new BadRequestException({
        message: ClassesMessage.ERROR.ALREADY_EXISTS,
      });
    }

    const lecturer = await this.lecturersService.findOne(
      createClassDto.lecturerId,
    );
    if (!lecturer) {
      throw new NotFoundException({
        message: LecturersMessage.ERROR.NOT_FOUND,
      });
    }

    const newClass = await this.classesService.create(createClassDto);
    return new BaseResponseDto(ClassesMessage.SUCCESS.CREATE);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    await this.classesService.update(id, updateClassDto);
    return new BaseResponseDto(ClassesMessage.SUCCESS.UPDATE);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string) {
    await this.classesService.delete(id);
    return new BaseResponseDto(ClassesMessage.SUCCESS.DELETE);
  }
}
