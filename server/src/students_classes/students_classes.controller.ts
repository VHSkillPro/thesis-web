import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StudentsClassesService } from './students_classes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { StudentsFilterDto } from 'src/students/dto/students-filter.dto';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
} from 'src/dto/response.dto';
import { StudentsClassesMessageSuccess } from './students_classes.message';

@Controller('classes/:id/students')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsClassesController {
  constructor(private studentsClassesService: StudentsClassesService) {}

  @Get()
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async findAll(
    @Param('id') classId: string,
    @Query() studentsFilterDto: StudentsFilterDto,
  ) {
    const students = await this.studentsClassesService.findAll(
      classId,
      studentsFilterDto,
    );
    const total = await this.studentsClassesService.count(
      classId,
      studentsFilterDto,
    );

    return new PaginationResponseDto(
      StudentsClassesMessageSuccess.FIND_ALL,
      students,
      new PaginationMetaDto(
        total,
        studentsFilterDto.page,
        studentsFilterDto.limit,
      ),
    );
  }

  @Post(':studentId')
  @Roles(Role.Admin)
  async create(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    await this.studentsClassesService.create(classId, studentId);
    return new BaseResponseDto(StudentsClassesMessageSuccess.CREATE);
  }
}
