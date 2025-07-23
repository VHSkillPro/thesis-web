import {
  Controller,
  Delete,
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
import StudentsMessage from 'src/students/students.message';
import {
  BaseResponseDto,
  PaginationMetaDto,
  PaginationResponseDto,
  ShowResponseDto,
} from 'src/dto/response.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { AuthMessageError } from 'src/auth/auth.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import FacesMessage from './faces.message';

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
        message: StudentsMessage.ERROR.NOT_FOUND,
      });
    }

    const faces = await this.facesService.findAll(username);
    return new PaginationResponseDto(
      FacesMessage.SUCCESS.FIND_ALL,
      faces,
      new PaginationMetaDto(faces.length, 1, faces.length),
    );
  }

  @Get(':username/faces/:id')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async findOne(
    @Param('username') username: string,
    @Param('id') id: number,
    @Request() req,
  ) {
    this.selfCheck(req, username);

    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessage.ERROR.NOT_FOUND,
      });
    }

    const face = await this.facesService.findOne(username, id);
    if (!face) {
      throw new NotFoundException({
        message: FacesMessage.ERROR.NOT_FOUND,
      });
    }

    return new ShowResponseDto(FacesMessage.SUCCESS.FIND_ONE, face);
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
    return new BaseResponseDto(FacesMessage.SUCCESS.CREATE);
  }

  @Delete(':username/faces/:id')
  @Roles(Role.Admin, Role.Lecturer, Role.Student)
  async delete(
    @Param('username') username: string,
    @Param('id') id: number,
    @Request() req,
  ) {
    this.selfCheck(req, username);
    await this.facesService.delete(username, id);
    return new BaseResponseDto(FacesMessage.SUCCESS.DELETE);
  }
}
