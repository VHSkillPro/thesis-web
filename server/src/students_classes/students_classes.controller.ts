import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  ShowResponseDto,
} from 'src/dto/response.dto';
import StudentsClassesMessage from './students_classes.message';
import AuthMessage from 'src/auth/auth.message';

@Controller('classes/:id/students')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsClassesController {
  constructor(private studentsClassesService: StudentsClassesService) {}

  private selfCheck(req, studentId: string) {
    const user = req.user;
    if (user.roleId === Role.Student && user.username !== studentId) {
      throw new ForbiddenException({
        message: AuthMessage.ERROR.FORBIDDEN,
      });
    }
  }

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
      StudentsClassesMessage.SUCCESS.FIND_ALL,
      students,
      new PaginationMetaDto(
        total,
        studentsFilterDto.page,
        studentsFilterDto.limit,
      ),
    );
  }

  @Get(':studentId')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async findOne(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
    @Req() req,
  ) {
    this.selfCheck(req, studentId);

    const student = await this.studentsClassesService.findOne(
      classId,
      studentId,
    );
    if (!student) {
      throw new NotFoundException({
        message: StudentsClassesMessage.ERROR.NOT_FOUND,
      });
    }

    return new ShowResponseDto(
      StudentsClassesMessage.SUCCESS.FIND_ONE,
      student,
    );
  }

  @Post(':studentId')
  @Roles(Role.Admin)
  async create(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    await this.studentsClassesService.create(classId, studentId);
    return new BaseResponseDto(StudentsClassesMessage.SUCCESS.CREATE);
  }

  @Delete(':studentId')
  @Roles(Role.Admin)
  async delete(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    const student = await this.studentsClassesService.delete(
      classId,
      studentId,
    );
    if (!student) {
      throw new NotFoundException({
        message: StudentsClassesMessage.ERROR.NOT_FOUND,
      });
    }
    return new BaseResponseDto(StudentsClassesMessage.SUCCESS.DELETE);
  }
}
