import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { LecturersMessageError } from './lecturers.message';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { UsersFilterDto } from 'src/users/dto/user-filter.dto';
import { LecturersFilterDto } from './dto/lecturers-filter.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersSevice: UsersService,
  ) {}

  /**
   * Converts a `LecturersFilterDto` object into a `UsersFilterDto` object.
   *
   * This method maps the properties from the `LecturersFilterDto` to a new
   * `UsersFilterDto` instance and sets the `roleId` to `'lecturer'`.
   *
   * @param lecturersFilterDto - The DTO containing filter criteria specific to lecturers.
   * @returns A `UsersFilterDto` object with the mapped properties and a predefined `roleId`.
   */
  private convertToUsersFilterDto(lecturersFilterDto: LecturersFilterDto) {
    const usersFilterDto = new UsersFilterDto();

    usersFilterDto.username = lecturersFilterDto.username;
    usersFilterDto.fullname = lecturersFilterDto.fullname;
    usersFilterDto.isActive = lecturersFilterDto.isActive;
    usersFilterDto.page = lecturersFilterDto.page;
    usersFilterDto.limit = lecturersFilterDto.limit;
    usersFilterDto.roleId = 'lecturer';

    return usersFilterDto;
  }

  /**
   * Counts the number of lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - Data Transfer Object containing the filter criteria for lecturers.
   * @returns A promise that resolves to the count of lecturers matching the filter criteria.
   */
  async count(lecturersFilterDto: LecturersFilterDto) {
    return await this.usersSevice.count(
      this.convertToUsersFilterDto(lecturersFilterDto),
    );
  }

  /**
   * Retrieves a list of lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - Data Transfer Object containing the filter criteria for lecturers.
   * @returns A promise that resolves to an array of users matching the filter criteria.
   */
  async findAll(lecturersFilterDto: LecturersFilterDto) {
    const users = await this.usersSevice.findAll(
      this.convertToUsersFilterDto(lecturersFilterDto),
    );

    const lecturers = users.map((user) => {
      return {
        username: user.username,
        fullname: user.fullname,
        password: user.password,
        isActive: user.isActive,
      };
    });

    return lecturers;
  }

  /**
   * Retrieves a single lecturer by their associated username.
   *
   * @param username - The username of the lecturer to retrieve.
   * @returns A promise that resolves to the lecturer entity if found, or null if not found.
   */
  async findOne(username: string) {
    const lecturer = await this.usersRepository.findOne({
      where: { username },
      select: {
        username: true,
        fullname: true,
        password: true,
        isActive: true,
      },
    });
    return lecturer;
  }

  /**
   * Creates a new lecturer in the system.
   *
   * This method checks if a lecturer with the given username already exists.
   * If the lecturer exists, it throws a `BadRequestException` with an appropriate error message.
   * Otherwise, it hashes the provided password, creates a new lecturer entity,
   * and inserts it into the repository.
   *
   * @param createLecturerDto - The data transfer object containing the details of the lecturer to be created.
   * @returns A promise that resolves to the result of the insertion operation.
   * @throws {BadRequestException} If a lecturer with the given username already exists.
   */
  async create(createLecturerDto: CreateLecturerDto) {
    const lecturer = await this.usersSevice.findOne(createLecturerDto.username);
    if (lecturer) {
      throw new BadRequestException({
        message: LecturersMessageError.LECTURER_EXISTS,
      });
    }

    const hashedPassword = await bcrypt.hash(createLecturerDto.password, 10);
    const newLecturer = this.usersRepository.create({
      ...createLecturerDto,
      password: hashedPassword,
    });

    return await this.usersRepository.insert(newLecturer);
  }

  /**
   * Updates the details of a lecturer identified by their username.
   *
   * @param username - The username of the lecturer to update.
   * @param updateLecturerDto - An object containing the updated lecturer details.
   *   - `fullname` (optional): The new full name of the lecturer.
   *   - `password` (optional): The new password for the lecturer, which will be hashed before saving.
   *
   * @returns A promise that resolves to the updated lecturer entity.
   *
   * @throws {BadRequestException} If the lecturer with the given username is not found.
   */
  async update(username: string, updateLecturerDto: UpdateLecturerDto) {
    const lecturer = await this.findOne(username);
    if (!lecturer) {
      throw new BadRequestException({
        message: LecturersMessageError.LECTURER_NOT_FOUND,
      });
    }

    if (updateLecturerDto.fullname) {
      lecturer.fullname = updateLecturerDto.fullname;
    }

    if (updateLecturerDto.password) {
      const hashedPassword = await bcrypt.hash(updateLecturerDto.password, 10);
      lecturer.password = hashedPassword;
    }

    return await this.usersRepository.save(lecturer);
  }

  /**
   * Deletes a lecturer by their username.
   *
   * @param username - The username of the lecturer to be deleted.
   * @returns A promise that resolves to the result of the deletion operation.
   * @throws {BadRequestException} If the lecturer with the given username is not found.
   */
  async delete(username: string) {
    const lecturer = await this.findOne(username);
    if (!lecturer) {
      throw new BadRequestException({
        message: LecturersMessageError.LECTURER_NOT_FOUND,
      });
    }

    // TODO: Check if the lecturer is assigned to any courses before deleting

    return await this.usersRepository.delete({ username });
  }
}
