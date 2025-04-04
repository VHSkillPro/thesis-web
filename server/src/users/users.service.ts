import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Builds a query builder to retrieve users based on the provided filter criteria.
   *
   * @param usersFilter - An object containing filter options for querying users:
   *   - `username` (optional): Filters users by a partial or full username (case-insensitive).
   *   - `fullname` (optional): Filters users by a partial or full name (case-insensitive).
   *   - `course` (optional): Filters users by their course (case-insensitive).
   *   - `className` (optional): Filters users by their class name (case-insensitive).
   *   - `isActive` (optional): Filters users by their active status.
   *   - `isSuperuser` (optional): Filters users by their superuser status.
   *   - `roleId` (optional): Filters users by their associated role ID.
   *
   * @returns A query builder instance with the applied filters.
   */
  private findAllQueryBuilder(usersFilter: UsersFilterDto) {
    const query = this.usersRepository.createQueryBuilder('users');
    const { username, isActive, isSuperuser, roleId } = usersFilter;

    if (username) {
      query.andWhere('users.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (usersFilter.fullname) {
      query.andWhere('users.fullname ILIKE :fullname', {
        fullname: `%${usersFilter.fullname}%`,
      });
    }

    if (usersFilter.course) {
      query.andWhere('users.course ILIKE :course', {
        course: `%${usersFilter.course}%`,
      });
    }

    if (usersFilter.className) {
      query.andWhere('users.className ILIKE :className', {
        className: `%${usersFilter.className}%`,
      });
    }

    if (isSuperuser !== undefined) {
      query.andWhere('users.isSuperuser = :isSuperuser', { isSuperuser });
    }

    if (isActive !== undefined) {
      query.andWhere('users.isActive = :isActive', { isActive });
    }

    if (roleId) {
      query.andWhere('users.roleId = :roleId', { roleId: roleId });
    }

    return query;
  }

  /**
   * Counts the total number of users that match the given filter criteria.
   *
   * @param usersFilter - An object containing filter options such as username, fullname, course, className, isActive, and isSuperuser.
   * @returns A promise that resolves to the total count of users matching the filter criteria.
   */
  async count(usersFilter: UsersFilterDto): Promise<number> {
    const query = this.findAllQueryBuilder(usersFilter);
    return await query.getCount();
  }

  /**
   * Retrieves a paginated list of users based on the provided filter criteria.
   *
   * @param usersFilter - An object containing filter options such as username, fullname, course, className, isActive, isSuperuser, page, and limit.
   * @returns A promise that resolves to an array of users matching the filter criteria.
   */
  async findAll(usersFilter: UsersFilterDto): Promise<User[]> {
    const query = this.findAllQueryBuilder(usersFilter);

    const { page, limit } = usersFilter;
    query.limit(usersFilter.limit);
    query.take((page - 1) * limit);

    return await query.getMany();
  }

  /**
   * Finds a single user by their username.
   *
   * @param username - The username of the user to retrieve.
   * @returns A promise that resolves to the user object if found, or `null` if no user exists with the given username.
   */
  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }
}
