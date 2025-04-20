import { Module } from '@nestjs/common';
import { FacesService } from './faces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Face } from './faces.entity';
import { FacesController } from './faces.controller';
import { StudentsModule } from 'src/students/students.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Face]),
    StudentsModule,
    JwtModule,
    AuthModule,
    UsersModule,
    HttpModule.register({
      timeout: 5000,
      timeoutErrorMessage: 'Service hỗ trợ các thao tác về khuôn mặt đang bận',
      maxRedirects: 5,
    }),
  ],
  providers: [FacesService],
  controllers: [FacesController],
  exports: [FacesService],
})
export class FacesModule {}
