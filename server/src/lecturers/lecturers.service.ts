import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './lecturers.entity';
import { LecturersFilterDto } from './dto/lecturers-filter.dto';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UsersService } from 'src/users/users.service';
import { UsersMessage } from 'src/users/users.message';
import { LecturersMessage } from './lecturers.message';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private lecturersRepository: Repository<Lecturer>,
    private usersSevice: UsersService,
  ) {}

  /**
   * Constructs a query builder to retrieve lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - An object containing filter criteria for lecturers.
   *   - `username` (optional): A partial or full match for the lecturer's username.
   *   - `name` (optional): A partial or full match for the lecturer's full name,
   *     which is a concatenation of their last name and first name.
   *
   * @returns A query builder instance with the applied filters.
   */
  private findAllQueryBuilder(lecturersFilterDto: LecturersFilterDto) {
    const query = this.lecturersRepository.createQueryBuilder('lecturers');
    const { username, name } = lecturersFilterDto;

    if (username) {
      query.andWhere('lecturers.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (name) {
      query.andWhere(
        `CONCAT(lecturers.lastname, ' ', lecturers.firstname) ILIKE :name`,
        {
          name: `%${name}%`,
        },
      );
    }

    return query;
  }

  /**
   * Counts the number of lecturers that match the specified filter criteria.
   *
   * @param lecturersFilterDto - Data transfer object containing the filter criteria
   *                             for querying lecturers.
   * @returns A promise that resolves to the total count of lecturers matching
   *          the filter criteria.
   */
  async count(lecturersFilterDto: LecturersFilterDto) {
    const query = this.findAllQueryBuilder(lecturersFilterDto);
    return await query.getCount();
  }

  /**
   * Retrieves a list of lecturers based on the provided filter criteria.
   *
   * @param lecturersFilterDto - An object containing filter options for querying lecturers.
   *   - `username` (string): A partial or full match for the lecturer's username.
   *   - `name` (string): A partial or full match for the lecturer's full name.
   *   - `page` (number): The page number for pagination.
   *   - `limit` (number): The number of items to retrieve per page.
   *
   * @returns A promise that resolves to an array of lecturers matching the filter criteria.
   *
   * @throws Will throw an error if the query execution fails.
   */
  async findAll(lecturersFilterDto: LecturersFilterDto) {
    const query = this.findAllQueryBuilder(lecturersFilterDto);

    const { page, limit } = lecturersFilterDto;
    query.limit(lecturersFilterDto.limit);
    query.take((page - 1) * limit);

    return await query.getMany();
  }

  async findOne(username: string) {
    return await this.lecturersRepository.findOne({
      where: {
        user: {
          username,
        },
      },
    });
  }

  /**
   * Creates a new lecturer in the system.
   *
   * @param createLecturerDto - Data transfer object containing the details of the lecturer to be created.
   *   - `username` (string): The unique identifier of the lecturer, typically the username.
   *   - `firstname` (string): The first name of the lecturer.
   *   - `lastname` (string): The last name of the lecturer.
   *
   * @returns A promise that resolves to the result of the insertion operation.
   *
   * @throws {BadRequestException} If a lecturer with the given ID already exists or if the associated user is not found.
   */
  async create(createLecturerDto: CreateLecturerDto) {
    const lecturer = await this.findOne(createLecturerDto.username);
    if (lecturer) {
      throw new BadRequestException({
        message: LecturersMessage.LECTURER_EXISTS,
      });
    }

    const userRef = await this.usersSevice.findOne(createLecturerDto.username);
    if (!userRef) {
      throw new BadRequestException({
        message: UsersMessage.USER_NOT_FOUND,
      });
    }

    const newLecturer = this.lecturersRepository.create({
      firstname: createLecturerDto.firstname,
      lastname: createLecturerDto.lastname,
      user: userRef,
    });
    return await this.lecturersRepository.insert(newLecturer);
  }
}
