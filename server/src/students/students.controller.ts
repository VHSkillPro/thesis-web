import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { StudentsFilterDto } from './dto/students-filter.dto';
import { StudentsService } from './students.service';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import {
  StudentsMessageError,
  StudentsMessageSuccess,
} from './students.message';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('students')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  @Roles(Role.Admin, Role.Lecturer)
  async findAll(@Query() studentsFilterDto: StudentsFilterDto) {
    const students = await this.studentsService.findAll(studentsFilterDto);
    const count = await this.studentsService.count(studentsFilterDto);

    return new PaginationResponseDto(
      StudentsMessageSuccess.FIND_ALL_SUCCESS,
      students,
      new PaginationMetaDto(
        count,
        studentsFilterDto.page,
        studentsFilterDto.limit,
      ),
    );
  }

  @Get(':username')
  @Roles(Role.Admin, Role.Lecturer)
  async findOne(@Param('username') username: string) {
    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    return new ShowResponseDto(
      StudentsMessageSuccess.FIND_ONE_SUCCESS,
      student,
    );
  }

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(
    FileInterceptor('card', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/jpg|image\/png)/,
          }),
        ],
      }),
    )
    card: Express.Multer.File,
  ) {
    await this.studentsService.create(createStudentDto, card);
    return new BaseResponseDto(StudentsMessageSuccess.CREATE_SUCCESS);
  }
}
