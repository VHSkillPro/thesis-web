import { Module } from '@nestjs/common';
import { FacesService } from './faces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Face } from './faces.entity';
import { FacesController } from './faces.controller';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [TypeOrmModule.forFeature([Face]), StudentsModule],
  providers: [FacesService],
  controllers: [FacesController],
  exports: [FacesService],
})
export class FacesModule {}
