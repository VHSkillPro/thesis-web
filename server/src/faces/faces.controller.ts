import {
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FacesService } from './faces.service';
import { StudentsService } from 'src/students/students.service';
import { StudentsMessageError } from 'src/students/students.message';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
} from 'src/dto/response.dto';
import { FacesMessageSuccess } from './faces.message';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { AuthMessageError } from 'src/auth/auth.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller('/students')
@UseGuards(AuthGuard, RolesGuard)
export class FacesController {
  constructor(
    private facesService: FacesService,
    private studentsService: StudentsService,
  ) {}

  private selfCheck(req, username: string) {
    const user = req.user;
    if (user.roleId === Role.Student && user.username !== username) {
      throw new ForbiddenException({
        message: AuthMessageError.FORBIDDEN,
      });
    }
  }

  @Get(':username/faces')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async findAll(@Param('username') username: string, @Request() req) {
    this.selfCheck(req, username);

    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    const faces = await this.facesService.findAll(username);
    return new PaginationResponseDto(
      FacesMessageSuccess.FIND_ALL_SUCCESS,
      faces,
      new PaginationMetaDto(faces.length, 1, faces.length),
    );
  }

  @Post(':username/faces')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  @UseInterceptors(
    FileInterceptor('selfie', {
      storage: diskStorage({
        destination: './uploads/selfies',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Param('username') username: string,
    @Request() req,
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
    selfie: Express.Multer.File,
  ) {
    this.selfCheck(req, username);
    await this.facesService.create(username, selfie);
    return new BaseResponseDto(FacesMessageSuccess.CREATE_SUCCESS);
  }
}
