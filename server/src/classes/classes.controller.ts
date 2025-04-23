import {
  Controller,
  Get,
  NotFoundException,
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
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import { ClassesMessageError, ClassesMessageSuccess } from './classes.message';

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
}
