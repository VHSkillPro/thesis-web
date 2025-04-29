import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractUser, User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Student } from 'src/students/students.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AbstractUser, User, Student]),
    forwardRef(() => AuthModule),
    JwtModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
