import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentsFilterDto } from './dto/students-filter.dto';
import { Student } from './students.entity';
import { removeFile } from 'src/utils/file';
import { Face } from '../faces/faces.entity';
import StudentsMessage from './students.message';
import { connectionSource } from 'src/config/typeorm';
import { UsersService } from '../users/users.service';
import { FacesService } from 'src/faces/faces.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentsRepository: Repository<Student>,
    private usersService: UsersService,
    private facesService: FacesService,
  ) {}

  /**
   * Constructs a query builder for retrieving students based on the provided filter criteria.
   *
   * @param studentsFilterDto - An object containing filter criteria for querying students.
   *   - `username` (optional): A partial or full username to filter students by (case-insensitive).
   *   - `fullname` (optional): A partial or full fullname to filter students by (case-insensitive).
   *   - `course` (optional): A partial or full course name to filter students by (case-insensitive).
   *   - `className` (optional): A partial or full class name to filter students by (case-insensitive).
   *   - `isActive` (optional): A boolean indicating whether to filter by active/inactive students.
   *
   * @returns A query builder instance configured with the specified filters.
   */
  private findAllQueryBuilder(studentsFilterDto: StudentsFilterDto) {
    const query = this.studentsRepository.createQueryBuilder('student');
    const { username, fullname, course, className, isActive } =
      studentsFilterDto;

    if (username) {
      query.andWhere('student.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (fullname) {
      query.andWhere('student.fullname ILIKE :fullname', {
        fullname: `%${fullname}%`,
      });
    }

    if (course) {
      query.andWhere('student.course ILIKE :course', {
        course: `%${course}%`,
      });
    }

    if (className) {
      query.andWhere('student.className ILIKE :className', {
        className: `%${className}%`,
      });
    }

    if (isActive !== undefined) {
      query.andWhere('student.isActive = :isActive', { isActive });
    }

    query.orderBy('student.username', 'ASC');
    return query;
  }

  /**
   * Counts the total number of students that match the given filter criteria.
   *
   * @param studentsFilterDto - An object containing the filter criteria for students.
   * @returns A promise that resolves to the total count of students matching the filter.
   */
  async count(studentsFilterDto: StudentsFilterDto) {
    const query = this.findAllQueryBuilder(studentsFilterDto);
    return await query.getCount();
  }

  /**
   * Retrieves a paginated list of students based on the provided filter criteria.
   *
   * @param studentsFilterDto - An object containing the filter criteria for students.
   * @returns A promise that resolves to an array of students matching the filter criteria.
   */
  async findAll(studentsFilterDto: StudentsFilterDto) {
    const query = this.findAllQueryBuilder(studentsFilterDto);

    const { page, limit } = studentsFilterDto;
    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);

    return await query.getMany();
  }

  /**
   * Retrieves a single student record based on the provided username.
   *
   * @param username - The username of the student to retrieve.
   * @returns A promise that resolves to the student entity if found, or `null` if no matching student exists.
   */
  async findOne(username: string) {
    const student = await this.studentsRepository.findOne({
      where: { username: username },
    });
    return student;
  }

  /**
   * Creates a new student record in the database.
   *
   * @param createStudentDto - Data Transfer Object containing the details of the student to be created.
   * @param card - The uploaded file representing the student's card, provided by Multer.
   * @returns A promise that resolves to the result of the insertion operation.
   * @throws {BadRequestException} If a student with the given username already exists.
   */
  async create(createStudentDto: CreateStudentDto, card: Express.Multer.File) {
    try {
      const user = await this.usersService.findOne(createStudentDto.username);
      if (user) {
        throw new BadRequestException({
          message: StudentsMessage.ERROR.ALREADY_EXISTS,
        });
      }

      const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
      const newStudent = this.studentsRepository.create({
        ...createStudentDto,
        password: hashedPassword,
        cardPath: card.path,
      });

      return await this.studentsRepository.insert(newStudent);
    } catch (error) {
      removeFile(card.path);

      if (error instanceof HttpException) {
        throw error; // Rethrow the BadRequestException
      }

      console.log(error);
      throw new InternalServerErrorException({
        message: StudentsMessage.ERROR.CREATE,
      });
    }
  }

  /**
   * Updates a student's information, including optional fields such as password and card file.
   *
   * @param username - The username of the student to update.
   * @param updateStudentDto - An optional object containing the updated student details.
   * @param card - An optional file object representing the student's card.
   *
   * @returns The updated student entity after saving to the repository.
   *
   * @throws {NotFoundException} If the student with the given username is not found.
   */
  async update(
    username: string,
    updateStudentDto?: UpdateStudentDto,
    card?: Express.Multer.File,
  ) {
    try {
      const student = await this.findOne(username);
      if (!student) {
        throw new NotFoundException({
          message: StudentsMessage.ERROR.NOT_FOUND,
        });
      }

      const newStudent = await this.studentsRepository.create({
        ...student,
        ...updateStudentDto,
      });

      if (updateStudentDto?.password) {
        const hashedPassword = await bcrypt.hash(updateStudentDto.password, 10);
        newStudent.password = hashedPassword;
      }

      if (card) {
        if (newStudent.cardPath) {
          removeFile(newStudent.cardPath);
        }

        // Remove all faces associated with the student
        const faces = await this.facesService.findAll(username);
        for (const face of faces) {
          await this.facesService.delete(username, face.id);
        }

        newStudent.cardPath = card.path;
      }

      return await this.studentsRepository.save(newStudent);
    } catch (error) {
      if (card) {
        removeFile(card.path);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException({
        message: StudentsMessage.ERROR.UPDATE,
      });
    }
  }

  /**
   * Deletes a student and their associated data from the database.
   *
   * @param username - The username of the student to be deleted.
   * @throws {NotFoundException} If the student with the given username is not found.
   *
   * This method performs the following actions within a database transaction:
   * - Deletes the student record from the database.
   * - Deletes all associated face records linked to the student.
   * - Deletes the student's card file from the filesystem, if it exists.
   *
   * Note: The deletion of the associated student of a class is currently not implemented (TODO).
   */
  async delete(username: string) {
    try {
      const student = await this.findOne(username);
      if (!student) {
        throw new NotFoundException({
          message: StudentsMessage.ERROR.NOT_FOUND,
        });
      }

      if (!connectionSource.isInitialized) {
        await connectionSource.initialize();
      }

      return await connectionSource.transaction(async (manager) => {
        const cardPath =
          student.cardPath !== undefined
            ? join(__dirname, '..', '..', student.cardPath)
            : undefined;

        // Delete the student
        await manager.delete(Student, {
          username: username,
        });

        // Delete the associated faces
        await manager.delete(Face, {
          studentId: student.id,
        });

        // Delete the card file if it exists
        if (cardPath) {
          removeFile(cardPath);
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Rethrow the NotFoundException
      }

      console.log(error);
      throw new InternalServerErrorException({
        message: StudentsMessage.ERROR.DELETE,
      });
    }
  }
}
