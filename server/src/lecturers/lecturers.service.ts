import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import LecturersMessage from './lecturers.message';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { LecturersFilterDto } from './dto/lecturers-filter.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Lecturer } from './lecturers.entity';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private lecturersRepositoty: Repository<Lecturer>,
    private usersSevice: UsersService,
  ) {}

  /**
   * Constructs a query builder to retrieve lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - An object containing the filter criteria for querying lecturers.
   *   - `username` (optional): A partial or full username to filter lecturers by.
   *   - `fullname` (optional): A partial or full fullname to filter lecturers by.
   *   - `isActive` (optional): A boolean indicating whether to filter by active or inactive lecturers.
   *
   * @returns A query builder instance configured with the specified filters.
   */
  private findAllQueryBuilder(lecturersFilterDto: LecturersFilterDto) {
    const query = this.lecturersRepositoty.createQueryBuilder('lecturer');
    const { username, fullname, isActive } = lecturersFilterDto;

    if (username) {
      query.andWhere('lecturer.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (fullname) {
      query.andWhere('lecturer.fullname ILIKE :fullname', {
        fullname: `%${fullname}%`,
      });
    }

    if (isActive !== undefined) {
      query.andWhere('lecturer.isActive = :isActive', { isActive });
    }

    query.orderBy('lecturer.username', 'DESC');
    return query;
  }

  /**
   * Counts the number of lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - Data Transfer Object containing the filter criteria for lecturers.
   * @returns A promise that resolves to the count of lecturers matching the filter criteria.
   */
  async count(lecturersFilterDto: LecturersFilterDto) {
    const query = this.findAllQueryBuilder(lecturersFilterDto);
    return await query.getCount();
  }

  /**
   * Retrieves a list of lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - Data Transfer Object containing the filter criteria for lecturers.
   * @returns A promise that resolves to an array of users matching the filter criteria.
   */
  async findAll(lecturersFilterDto: LecturersFilterDto) {
    const query = this.findAllQueryBuilder(lecturersFilterDto);
    const { page, limit } = lecturersFilterDto;
    query.skip((page - 1) * limit).take(limit);
    return await query.getMany();
  }

  /**
   * Retrieves a single lecturer by their associated username.
   *
   * @param username - The username of the lecturer to retrieve.
   * @returns A promise that resolves to the lecturer entity if found, or null if not found.
   */
  async findOne(username: string) {
    return await this.lecturersRepositoty.findOne({
      where: { username },
    });
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
    try {
      const lecturer = await this.usersSevice.findOne(
        createLecturerDto.username,
      );
      if (lecturer) {
        throw new BadRequestException({
          message: LecturersMessage.ERROR.ALREADY_EXISTS,
        });
      }

      const hashedPassword = await bcrypt.hash(createLecturerDto.password, 10);
      const newLecturer = this.lecturersRepositoty.create({
        ...createLecturerDto,
        password: hashedPassword,
      });

      return await this.lecturersRepositoty.insert(newLecturer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: LecturersMessage.ERROR.CREATE,
      });
    }
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
    try {
      const lecturer = await this.findOne(username);
      if (!lecturer) {
        throw new NotFoundException({
          message: LecturersMessage.ERROR.NOT_FOUND,
        });
      }

      if (updateLecturerDto.fullname) {
        lecturer.fullname = updateLecturerDto.fullname;
      }

      if (updateLecturerDto.password) {
        const hashedPassword = await bcrypt.hash(
          updateLecturerDto.password,
          10,
        );
        lecturer.password = hashedPassword;
      }

      if (updateLecturerDto.isActive !== undefined) {
        lecturer.isActive = updateLecturerDto.isActive;
      }

      return await this.lecturersRepositoty.save(lecturer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: LecturersMessage.ERROR.UPDATE,
      });
    }
  }

  /**
   * Deletes a lecturer by their username.
   *
   * @param username - The username of the lecturer to be deleted.
   * @returns A promise that resolves to the result of the deletion operation.
   * @throws {NotFoundException} If the lecturer with the given username is not found.
   * @throws {BadRequestException} If an error occurs during the deletion process.
   */
  async delete(username: string) {
    try {
      const lecturer = await this.findOne(username);
      if (!lecturer) {
        throw new NotFoundException({
          message: LecturersMessage.ERROR.NOT_FOUND,
        });
      }

      return await this.lecturersRepositoty.delete({ username });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: LecturersMessage.ERROR.DELETE,
      });
    }
  }
}
