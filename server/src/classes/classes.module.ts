import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './classes.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LecturersModule } from 'src/lecturers/lecturers.module';
import { StudentsClasses } from 'src/students_classes/students_classes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, StudentsClasses]),
    AuthModule,
    JwtModule,
    LecturersModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
