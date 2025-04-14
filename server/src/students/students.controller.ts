import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
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

  @Get(':username/card/')
  @Roles(Role.Admin, Role.Lecturer)
  async getCard(@Param('username') username: string, @Res() res: Response) {
    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    const card = student.cardPath;
    if (!card) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_CARD_NOT_FOUND,
      });
    }

    const cardPath = join(__dirname, '..', '..', card);
    const cardStream = createReadStream(cardPath);
    res.set({
      'Content-Type': 'image/jpeg',
    });
    cardStream.pipe(res);
  }

  @Get(':username/card/base64')
  @Roles(Role.Admin, Role.Lecturer)
  async getCardBase64(@Param('username') username: string) {
    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    const card = student.cardPath;
    if (!card) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_CARD_NOT_FOUND,
      });
    }

    const cardPath = join(__dirname, '..', '..', card);
    const cardBuffer = readFileSync(cardPath);
    const base64 = cardBuffer.toString('base64');

    return new ShowResponseDto(StudentsMessageSuccess.FIND_ONE_CARD_SUCCESS, {
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
    return new BaseResponseDto(StudentsMessageSuccess.CREATE_SUCCESS);
  }

  @Patch(':username')
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
    @Param('username') username: string,
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
    await this.studentsService.update(username, updateStudentDto, card);
    return new BaseResponseDto(StudentsMessageSuccess.UPDATE_SUCCESS);
  }

  @Delete(':username')
  @Roles(Role.Admin)
  async delete(@Param('username') username: string) {
    await this.studentsService.delete(username);
    return new BaseResponseDto(StudentsMessageSuccess.DELETE_SUCCESS);
  }
}
