import { Module } from '@nestjs/common';
import { StudentsClassesService } from './students_classes.service';
import { StudentsClassesController } from './students_classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsClasses } from './students_classes.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ClassesModule } from 'src/classes/classes.module';
import { StudentsModule } from 'src/students/students.module';
import { Student } from 'src/students/students.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentsClasses, Student]),
    AuthModule,
    JwtModule,
    ClassesModule,
    StudentsModule,
  ],
  providers: [StudentsClassesService],
  controllers: [StudentsClassesController],
  exports: [StudentsClassesService],
})
export class StudentsClassesModule {}
