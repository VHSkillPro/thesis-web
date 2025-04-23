import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { ClassesMessageError, ClassesMessageSuccess } from './classes.message';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('classes')
@UseGuards(AuthGuard, RolesGuard)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  @Roles(Role.Admin, Role.Lecturer)
  async findAll(@Query() classesFilter: ClassesFilterDto) {
    const classes = await this.classesService.findAll(classesFilter);
    const count = await this.classesService.count(classesFilter);

    return new PaginationResponseDto(
      ClassesMessageSuccess.FIND_ALL,
      classes,
      new PaginationMetaDto(count, classesFilter.page, classesFilter.limit),
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Lecturer)
  async findOne(@Query('id') id: string) {
    const classData = await this.classesService.findOne(id);
    if (!classData) {
      throw new NotFoundException({
        message: ClassesMessageError.NOT_FOUND,
      });
    }

    return new ShowResponseDto(ClassesMessageSuccess.FIND_ONE, classData);
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createClassDto: CreateClassDto) {
    const existingClass = await this.classesService.findOne(createClassDto.id);

    if (existingClass) {
      throw new BadRequestException({
        message: ClassesMessageError.ALREADY_EXISTS,
      });
    }

    const newClass = await this.classesService.create(createClassDto);
    return new BaseResponseDto(ClassesMessageSuccess.CREATE);
  }
}
