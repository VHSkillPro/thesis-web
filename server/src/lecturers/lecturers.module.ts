import { Module } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecturer } from './lecturers.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecturer]),
    JwtModule,
    AuthModule,
    UsersModule,
  ],
  providers: [LecturersService],
  controllers: [LecturersController],
  exports: [LecturersService],
})
export class LecturersModule {}
