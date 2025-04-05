import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { StudentsFilterDto } from './dto/students-filter.dto';
import { UsersFilterDto } from 'src/users/dto/user-filter.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentsMessageError } from './students.message';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  /**
   * Converts a `StudentsFilterDto` object into a `UsersFilterDto` object.
   *
   * This method maps the properties of the provided `StudentsFilterDto` to a new
   * `UsersFilterDto` instance, while also setting the `roleId` property to `'student'`.
   *
   * @param studentsFilterDto - The DTO containing filter criteria specific to students.
   * @returns A `UsersFilterDto` object with the mapped properties and a predefined `roleId`.
   */
  private convertToUsersFilterDto(studentsFilterDto: StudentsFilterDto) {
    const usersFilterDto = new UsersFilterDto();

    usersFilterDto.username = studentsFilterDto.username;
    usersFilterDto.fullname = studentsFilterDto.fullname;
    usersFilterDto.course = studentsFilterDto.course;
    usersFilterDto.className = studentsFilterDto.className;
    usersFilterDto.isActive = studentsFilterDto.isActive;
    usersFilterDto.page = studentsFilterDto.page;
    usersFilterDto.limit = studentsFilterDto.limit;
    usersFilterDto.roleId = 'student';

    return usersFilterDto;
  }

  /**
   * Counts the number of users that match the given student filter criteria.
   *
   * @param studentsFilterDto - The filter criteria for selecting students.
   * @returns A promise that resolves to the count of users matching the filter criteria.
   */
  async count(studentsFilterDto: StudentsFilterDto) {
    return await this.usersService.count(
      this.convertToUsersFilterDto(studentsFilterDto),
    );
  }

  /**
   * Retrieves a list of students based on the provided filter criteria.
   *
   * @param studentsFilterDto - An object containing the filter criteria for retrieving students.
   * @returns A promise that resolves to an array of student objects, each containing:
   * - `username`: The username of the student.
   * - `password`: The password of the student.
   * - `fullname`: The full name of the student.
   * - `course`: The course the student is enrolled in.
   * - `className`: The class name the student belongs to.
   * - `isActive`: A boolean indicating whether the student is active.
   * - `cardPath`: The path to the student's card.
   */
  async findAll(studentsFilterDto: StudentsFilterDto) {
    const users = await this.usersService.findAll(
      this.convertToUsersFilterDto(studentsFilterDto),
    );

    const students = users.map((user) => {
      return {
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        course: user.course,
        className: user.className,
        isActive: user.isActive,
        cardPath: user.cardPath,
      };
    });

    return students;
  }

  /**
   * Retrieves a single student user by their username.
   *
   * @param username - The username of the student to retrieve.
   * @returns A promise that resolves to the student user object if found,
   *          or `null` if no matching user is found.
   *
   * The returned user object includes the following fields:
   * - `username`: The username of the student.
   * - `password`: The hashed password of the student.
   * - `fullname`: The full name of the student.
   * - `course`: The course the student is enrolled in.
   * - `className`: The class name associated with the student.
   * - `isActive`: A boolean indicating whether the student is active.
   * - `cardPath`: The file path to the student's card.
   *
   * Note: This method filters users by the role ID of 'student'.
   */
  async findOne(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
        roleId: 'student',
      },
      select: {
        username: true,
        password: true,
        fullname: true,
        course: true,
        className: true,
        isActive: true,
        cardPath: true,
      },
    });
    return user;
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
    const student = await this.usersService.findOne(createStudentDto.username);
    if (student) {
      unlink(card.path, (err) => {});
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_EXISTS,
      });
    }

    // TODO: extract face embedding from card

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    const newStudent = this.usersRepository.create({
      username: createStudentDto.username,
      password: hashedPassword,
      fullname: createStudentDto.fullname,
      course: createStudentDto.course,
      className: createStudentDto.className,
      isActive: true,
      cardPath: card.path,
      roleId: 'student',
    });

    return await this.usersRepository.insert(newStudent);
  }

  /**
   * Updates a student's information based on the provided username and update data.
   * Optionally updates the student's card file if provided.
   *
   * @param username - The username of the student to update.
   * @param updateStudentDto - An object containing the updated student data.
   * @param card - (Optional) A file object representing the new card to associate with the student.
   *
   * @throws {BadRequestException} If the student with the given username is not found.
   *
   * @returns A promise that resolves to the updated student entity.
   */
  async update(
    username: string,
    updateStudentDto?: UpdateStudentDto,
    card?: Express.Multer.File,
  ) {
    const student = await this.findOne(username);
    if (!student) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    if (updateStudentDto?.password) {
      const hashedPassword = await bcrypt.hash(updateStudentDto.password, 10);
      updateStudentDto.password = hashedPassword;
    }

    const updatedStudent = this.usersRepository.create({
      ...student,
      ...updateStudentDto,
    });

    if (card) {
      // TODO: extract face embedding from card
      updatedStudent.cardPath = card.path;
      if (student.cardPath) {
        unlink(student.cardPath, (err) => {
          console.log('Error deleting file:', err);
        });
      }
    }

    return await this.usersRepository.save(updatedStudent);
  }

  /**
   * Deletes a student record based on the provided username.
   *
   * @param username - The username of the student to be deleted.
   * @returns A promise resolving to the result of the delete operation.
   * @throws {BadRequestException} If the student with the given username is not found.
   */
  async delete(username: string) {
    const student = await this.findOne(username);
    if (!student) {
      throw new BadRequestException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    // TODO: Check if student is assigned to any classes
    // TODO: Check if student have face embedding in the database

    return await this.usersRepository.delete({
      username: username,
      roleId: 'student',
    });
  }
}
