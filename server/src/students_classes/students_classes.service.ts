import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentsClasses } from './students_classes.entity';
import { Repository } from 'typeorm';
import { ClassesService } from 'src/classes/classes.service';
import { StudentsService } from 'src/students/students.service';
import { ClassesMessageError } from 'src/classes/classes.message';
import { StudentsFilterDto } from '../students/dto/students-filter.dto';

@Injectable()
export class StudentsClassesService {
  constructor(
    @InjectRepository(StudentsClasses)
    private studentsClassesRepository: Repository<StudentsClasses>,
    private classesService: ClassesService,
    private studentsService: StudentsService,
  ) {}

  /**
   * Constructs a query builder to retrieve students associated with a specific class,
   * applying optional filters based on the provided StudentsFilterDto.
   *
   * @param classId - The ID of the class to filter students by.
   * @param studentsFilterDto - An object containing optional filters such as username,
   * fullname, course, className, and isActive status.
   * @returns A query builder instance with the applied filters.
   */
  private findAllQueryBuilder(
    classId: string,
    studentsFilterDto: StudentsFilterDto,
  ) {
    const query =
      this.studentsClassesRepository.createQueryBuilder('students_classes');
    query.innerJoin(
      'user',
      'student',
      'students_classes.studentId = student.username',
    );
    query.andWhere('students_classes.classId = :classId', { classId });

    if (studentsFilterDto?.username) {
      query.andWhere('student.username = :username', {
        username: studentsFilterDto.username,
      });
    }

    if (studentsFilterDto?.fullname) {
      query.andWhere('student.fullname ILIKE :fullname', {
        fullname: `%${studentsFilterDto.fullname}%`,
      });
    }

    if (studentsFilterDto?.course) {
      query.andWhere('student.course ILIKE :course', {
        course: `%${studentsFilterDto.course}%`,
      });
    }

    if (studentsFilterDto?.className) {
      query.andWhere('student.className ILIKE :className', {
        className: `%${studentsFilterDto.className}%`,
      });
    }

    if (studentsFilterDto?.isActive !== undefined) {
      query.andWhere('student.isActive = :isActive', {
        isActive: studentsFilterDto.isActive,
      });
    }

    return query;
  }

  /**
   * Counts the number of students associated with a specific class based on the provided filter criteria.
   *
   * @param classId - The unique identifier of the class.
   * @param studentsFilterDto - The filter criteria to apply when counting students.
   * @returns A promise that resolves to the count of students matching the criteria.
   * @throws {NotFoundException} If the class with the given ID does not exist.
   */
  async count(classId: string, studentsFilterDto: StudentsFilterDto) {
    const classEntity = await this.classesService.findOne(classId);
    if (!classEntity) {
      throw new NotFoundException({
        message: ClassesMessageError.NOT_FOUND,
      });
    }

    const query = this.findAllQueryBuilder(classId, studentsFilterDto);
    return await query.getCount();
  }

  /**
   * Retrieves a list of students associated with a specific class, applying optional filters and pagination.
   *
   * @param classId - The unique identifier of the class to retrieve students for.
   * @param studentsFilterDto - An object containing filter and pagination options:
   *   - `limit`: The maximum number of students to retrieve.
   *   - `page`: The page number for pagination (1-based index).
   *
   * @returns A promise that resolves to an array of students matching the specified class and filters.
   *
   * @throws {NotFoundException} If the class with the given `classId` is not found.
   */
  async findAll(classId: string, studentsFilterDto: StudentsFilterDto) {
    const classEntity = await this.classesService.findOne(classId);
    if (!classEntity) {
      throw new NotFoundException({
        message: ClassesMessageError.NOT_FOUND,
      });
    }

    const query = this.findAllQueryBuilder(classId, studentsFilterDto);
    const { limit, page } = studentsFilterDto;
    query.limit(limit);
    query.offset((page - 1) * limit);

    return await query.getMany();
  }
}
