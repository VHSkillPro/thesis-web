import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './classes.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LecturersModule } from 'src/lecturers/lecturers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    AuthModule,
    JwtModule,
    LecturersModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
