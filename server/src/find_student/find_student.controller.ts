import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FindStudentService } from './find_student.service';
import { FindStudentDto } from './dto/find-student.dto';
import { FindStudentMessage } from './find_student.mesage';
import { ShowResponseDto } from 'src/dto/response.dto';
import { ApiKeyAuthGuard } from 'src/auth/auth.guard';

@Controller('find-student')
@UseGuards(ApiKeyAuthGuard)
export class FindStudentController {
  constructor(private findStudentService: FindStudentService) {}

  @Post()
  async findStudent(@Body() findStudentDto: FindStudentDto) {
    const student = await this.findStudentService.findStudent(findStudentDto);
    if (!student) {
      throw new NotFoundException({
        message: FindStudentMessage.ERROR.NOTFOUND,
      });
    }

    return new ShowResponseDto(FindStudentMessage.SUCCESS.FOUND, {
      student,
    });
  }
}
