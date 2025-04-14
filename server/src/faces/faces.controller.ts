import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { FacesService } from './faces.service';
import { StudentsService } from 'src/students/students.service';
import { StudentsMessageError } from 'src/students/students.message';
import { PaginationMetaDto, PaginationResponseDto } from 'src/dto/response.dto';
import { FacesMessageSuccess } from './faces.message';

@Controller('/students')
export class FacesController {
  constructor(
    private facesService: FacesService,
    private studentsService: StudentsService,
  ) {}

  @Get(':username/faces')
  async findAll(@Param('username') username: string) {
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
}
