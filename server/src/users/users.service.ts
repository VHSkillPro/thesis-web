import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
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
   * Builds a `where` object based on the provided user filter criteria.
   * This object is used to construct query conditions for filtering users.
   *
   * @param usersFilter - An object containing filter criteria for users.
   *   - `username` (optional): A string to match usernames containing the given value.
   *   - `isActive` (optional): A boolean indicating whether to filter by active users.
   *   - `isSuperuser` (optional): A boolean indicating whether to filter by superusers.
   *
   * @returns An object representing the `where` conditions for querying users.
   */
  private whereBuilder(usersFilter: UsersFilterDto) {
    const where = {};

    if (usersFilter.username) {
      where['username'] = Like(`%${usersFilter.username}%`);
    }

    if (usersFilter.isActive !== undefined) {
      where['isActive'] = usersFilter.isActive;
    }

    if (usersFilter.isSuperuser !== undefined) {
      where['isSuperuser'] = usersFilter.isSuperuser;
    }

    return where;
  }

  /**
   * Counts the number of users matching the provided filter criteria.
   *
   * @param usersFilter - An object containing filter options such as username, isActive, and isSuperuser.
   * @returns A promise that resolves to the count of users matching the filter criteria.
   */
  async count(usersFilter: UsersFilterDto): Promise<number> {
    return this.usersRepository.count({
      where: this.whereBuilder(usersFilter),
    });
  }

  /**
   * Retrieves a list of users based on the provided filter criteria.
   *
   * @param usersFilter - An object containing filter options such as username, isActive, isSuperuser, page, and limit.
   * @returns A promise that resolves to an array of users matching the filter criteria.
   */
  async findAll(usersFilter: UsersFilterDto): Promise<User[]> {
    return this.usersRepository.find({
      where: this.whereBuilder(usersFilter),
      skip: (usersFilter.page - 1) * usersFilter.limit,
      take: usersFilter.limit,
    });
  }

  /**
   * Retrieves a single user by their username.
   *
   * @param username - The username of the user to find.
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
