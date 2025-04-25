import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
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
import { UpdateStudentDto } from './dto/update-student.dto';
import { Response } from 'express';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { AuthMessageError } from 'src/auth/auth.message';

@Controller('students')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  private selfCheck(req, studentId: string) {
    const user = req.user;
    if (user.roleId === Role.Student && user.username !== studentId) {
      throw new ForbiddenException({
        message: AuthMessageError.FORBIDDEN,
      });
    }
  }

  @Get()
  @Roles(Role.Admin, Role.Lecturer)
  async findAll(@Query() studentsFilterDto: StudentsFilterDto) {
    const students = await this.studentsService.findAll(studentsFilterDto);
    const count = await this.studentsService.count(studentsFilterDto);

    return new PaginationResponseDto(
      StudentsMessageSuccess.FIND_ALL,
      students,
      new PaginationMetaDto(
        count,
        studentsFilterDto.page,
        studentsFilterDto.limit,
      ),
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async findOne(@Param('id') studentId: string, @Request() req) {
    this.selfCheck(req, studentId);

    const student = await this.studentsService.findOne(studentId);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessageError.NOT_FOUND,
      });
    }

    return new ShowResponseDto(StudentsMessageSuccess.FIND_ONE, student);
  }

  @Get(':id/card/')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async getCard(
    @Param('id') studentId: string,
    @Res() res: Response,
    @Request() req,
  ) {
    this.selfCheck(req, studentId);

    const student = await this.studentsService.findOne(studentId);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessageError.NOT_FOUND,
      });
    }

    const card = student.cardPath;
    if (!card) {
      throw new NotFoundException({
        message: StudentsMessageError.CARD_NOT_FOUND,
      });
    }

    const cardPath = join(__dirname, '..', '..', card);
    const cardStream = createReadStream(cardPath);
    res.set({
      'Content-Type': 'image/jpeg',
    });
    cardStream.pipe(res);
  }

  @Get(':id/card/base64')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async getCardBase64(@Param('id') studentId: string, @Request() req) {
    this.selfCheck(req, studentId);

    const student = await this.studentsService.findOne(studentId);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessageError.NOT_FOUND,
      });
    }

    const card = student.cardPath;
    if (!card) {
      throw new NotFoundException({
        message: StudentsMessageError.CARD_NOT_FOUND,
      });
    }

    const cardPath = join(__dirname, '..', '..', card);
    const cardBuffer = readFileSync(cardPath);
    const base64 = cardBuffer.toString('base64');

    return new ShowResponseDto(StudentsMessageSuccess.FIND_ONE_CARD, {
      image: `data:image/jpeg;base64,${base64}`,
    });
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
    return new BaseResponseDto(StudentsMessageSuccess.CREATE);
  }

  @Patch(':id')
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
  async update(
    @Param('id') studentId: string,
    @Body() updateStudentDto?: UpdateStudentDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/jpg|image\/png)/,
          }),
        ],
      }),
    )
    card?: Express.Multer.File,
  ) {
    await this.studentsService.update(studentId, updateStudentDto, card);
    return new BaseResponseDto(StudentsMessageSuccess.UPDATE);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') studentId: string) {
    await this.studentsService.delete(studentId);
    return new BaseResponseDto(StudentsMessageSuccess.DELETE);
  }
}
