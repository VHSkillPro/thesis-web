import typeorm from './config/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { StudentsModule } from './students/students.module';
import { FacesModule } from './faces/faces.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options = configService.get('typeorm');
        if (!options) {
          throw new Error('TypeORM configuration is not defined');
        }
        return options;
      },
    }),
    UsersModule,
    AuthModule,
    LecturersModule,
    StudentsModule,
    FacesModule,
    ClassesModule,
  ],
  providers: [],
})
export class AppModule {}
