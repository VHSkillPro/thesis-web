import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentsClasses } from './students_classes.entity';
import { Repository } from 'typeorm';
import { ClassesService } from 'src/classes/classes.service';
import { StudentsService } from 'src/students/students.service';
import ClassesMessage from 'src/classes/classes.message';
import { StudentsFilterDto } from '../students/dto/students-filter.dto';
import StudentsMessage from 'src/students/students.message';
import { Student } from 'src/students/students.entity';
import { join } from 'path';
import { readFileSync } from 'fs';
import StudentsClassesMessage from './students_classes.message';

@Injectable()
export class StudentsClassesService {
  constructor(
    @InjectRepository(StudentsClasses)
    private studentsClassesRepository: Repository<StudentsClasses>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
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
    const query = this.studentsRepository.createQueryBuilder('student');
    query.innerJoin(
      StudentsClasses,
      'students_classes',
      'student.username = students_classes.studentId',
    );
    query.andWhere('students_classes.classId = :classId', { classId });

    if (studentsFilterDto.username) {
      query.andWhere('student.username ILKIE :username', {
        username: `%${studentsFilterDto.username}%`,
      });
    }

    if (studentsFilterDto.fullname) {
      query.andWhere('student.fullname ILIKE :fullname', {
        fullname: `%${studentsFilterDto.fullname}%`,
      });
    }

    if (studentsFilterDto.course) {
      query.andWhere('student.course ILIKE :course', {
        course: `%${studentsFilterDto.course}%`,
      });
    }

    if (studentsFilterDto.className) {
      query.andWhere('student.className ILIKE :className', {
        className: `%${studentsFilterDto.className}%`,
      });
    }

    if (studentsFilterDto.isActive) {
      query.andWhere('student.isActive = :isActive', {
        isActive: studentsFilterDto.isActive,
      });
    }

    query.orderBy('student.username', 'ASC');
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
        message: ClassesMessage.ERROR.NOT_FOUND,
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
        message: ClassesMessage.ERROR.NOT_FOUND,
      });
    }

    const query = this.findAllQueryBuilder(classId, studentsFilterDto);
    const { limit, page } = studentsFilterDto;
    query.limit(limit);
    query.offset((page - 1) * limit);

    const students = await query.getMany();
    return students.map((student) => {
      const cardPath = join(__dirname, '..', '..', student.cardPath);
      const card = readFileSync(cardPath);
      const base64Card = Buffer.from(card).toString('base64');

      return {
        id: student.id,
        username: student.username,
        fullname: student.fullname,
        course: student.course,
        className: student.className,
        isActive: student.isActive,
        card: base64Card,
      };
    });
  }

  /**
   * Finds a specific student-class association based on the provided class ID and student ID.
   *
   * @param classId - The unique identifier of the class.
   * @param studentId - The unique identifier of the student.
   * @returns A promise that resolves to the student-class association entity if found.
   * @throws {NotFoundException} If the class with the given ID does not exist.
   * @throws {NotFoundException} If the student-class association does not exist.
   */
  async findOne(classId: string, studentId: string) {
    const classEntity = await this.classesService.findOne(classId);
    if (!classEntity) {
      throw new NotFoundException({
        message: ClassesMessage.ERROR.NOT_FOUND,
      });
    }

    const query = this.studentsRepository.createQueryBuilder('student');
    query.innerJoin(
      StudentsClasses,
      'students_classes',
      'students_classes.studentId = student.username',
    );
    query.andWhere('students_classes.classId = :classId', { classId });
    query.andWhere('students_classes.studentId = :studentId', { studentId });

    const studentsClasses = await query.getOne();
    if (!studentsClasses) {
      throw new NotFoundException({
        message: StudentsClassesMessage.ERROR.NOT_FOUND,
      });
    }

    const cardPath = join(__dirname, '..', '..', studentsClasses.cardPath);
    const card = readFileSync(cardPath);
    const base64Card = Buffer.from(card).toString('base64');

    return {
      id: studentsClasses.id,
      username: studentsClasses.username,
      fullname: studentsClasses.fullname,
      course: studentsClasses.course,
      className: studentsClasses.className,
      isActive: studentsClasses.isActive,
      card: base64Card,
    };
  }

  /**
   * Creates a new association between a student and a class.
   *
   * @param classId - The unique identifier of the class.
   * @param studentId - The unique identifier of the student.
   * @returns A promise that resolves to the result of the insertion operation.
   * @throws {NotFoundException} If the class with the given `classId` is not found.
   * @throws {NotFoundException} If the student with the given `studentId` is not found.
   * @throws {NotFoundException} If the association between the student and class already exists.
   */
  async create(classId: string, studentId: string) {
    try {
      const classEntity = await this.classesService.findOne(classId);
      if (!classEntity) {
        throw new NotFoundException({
          message: ClassesMessage.ERROR.NOT_FOUND,
        });
      }

      const studentEntity = await this.studentsService.findOne(studentId);
      if (!studentEntity) {
        throw new NotFoundException({
          message: StudentsMessage.ERROR.NOT_FOUND,
        });
      }

      const studentClass = await this.studentsClassesRepository.findOne({
        where: {
          classId,
          studentId,
        },
      });
      if (studentClass) {
        throw new NotFoundException({
          message: StudentsClassesMessage.ERROR.ALREADY_EXISTS,
        });
      }

      const newStudentClass = this.studentsClassesRepository.create({
        classId,
        studentId,
      });
      return await this.studentsClassesRepository.insert(newStudentClass);
    } catch (error) {
      throw new InternalServerErrorException({
        message: StudentsClassesMessage.ERROR.CREATE,
      });
    }
  }

  /**
   * Deletes the association between a student and a class.
   *
   * @param classId - The unique identifier of the class.
   * @param studentId - The unique identifier of the student.
   * @throws {NotFoundException} If the class with the given `classId` does not exist.
   * @throws {NotFoundException} If the association between the student and the class does not exist.
   * @returns A promise that resolves when the association is successfully deleted.
   */
  async delete(classId: string, studentId: string) {
    try {
      const classEntity = await this.classesService.findOne(classId);
      if (!classEntity) {
        throw new NotFoundException({
          message: ClassesMessage.ERROR.NOT_FOUND,
        });
      }

      const studentClass = await this.studentsClassesRepository.findOne({
        where: {
          classId,
          studentId,
        },
      });
      if (!studentClass) {
        throw new NotFoundException({
          message: StudentsClassesMessage.ERROR.NOT_FOUND,
        });
      }

      return await this.studentsClassesRepository.delete(studentClass);
    } catch (error) {
      throw new InternalServerErrorException({
        message: StudentsClassesMessage.ERROR.DELETE,
      });
    }
  }
}
