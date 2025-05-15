import { Module } from '@nestjs/common';
import { FindStudentController } from './find_student.controller';
import { FindStudentService } from './find_student.service';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [ClassesModule],
  controllers: [FindStudentController],
  providers: [FindStudentService],
})
export class FindStudentModule {}
