import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
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
  @HttpCode(200)
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

  @Post('/:classId')
  @HttpCode(200)
  async findStudentByClassId(
    @Param('classId') classId: string,
    @Body() findStudentDto: FindStudentDto,
  ) {
    const student = await this.findStudentService.findStudentByClassId(
      classId,
      findStudentDto,
    );
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
