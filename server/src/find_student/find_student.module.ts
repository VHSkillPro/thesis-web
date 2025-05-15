import { Module } from '@nestjs/common';
import { FindStudentController } from './find_student.controller';
import { FindStudentService } from './find_student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Face } from 'src/faces/faces.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Face])],
  controllers: [FindStudentController],
  providers: [FindStudentService],
})
export class FindStudentModule {}
