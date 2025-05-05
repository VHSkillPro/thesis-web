import { forwardRef, Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { FacesModule } from 'src/faces/faces.module';
import { Student } from './students.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    JwtModule,
    AuthModule,
    UsersModule,
    forwardRef(() => FacesModule),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
