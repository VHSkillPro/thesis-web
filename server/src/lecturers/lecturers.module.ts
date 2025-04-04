import { Module } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    JwtModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [LecturersService],
  controllers: [LecturersController],
  exports: [LecturersService],
})
export class LecturersModule {}
