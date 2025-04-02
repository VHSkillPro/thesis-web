import { BadRequestException, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersFilterDto } from './dto/user-filter.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersMessage } from './users.message';
import * as bcrypt from 'bcrypt';

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

  /**
   * Creates a new user in the system.
   *
   * @param createUserDto - Data Transfer Object containing the details of the user to be created.
   * @returns A promise that resolves to the result of the user insertion operation.
   * @throws {BadRequestException} If a user with the given username already exists.
   */
  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    if (await this.findOne(username)) {
      throw new BadRequestException({ message: UsersMessage.USER_EXISTS });
    }

    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);

    const user = new User();
    user.username = username;
    user.password = hashPassword;
    user.isActive = true;
    user.isSuperuser = false;

    return this.usersRepository.insert(user);
  }

  /**
   * Deletes a user by their username.
   *
   * This method first checks if the user exists. If the user does not exist,
   * a `BadRequestException` is thrown with an appropriate error message.
   *
   * Additionally, if the user is a superuser, the deletion is not allowed,
   * and a `BadRequestException` is thrown to prevent the operation.
   *
   * Before performing the deletion, a TODO is noted to check for any
   * relationships with other entities that might need to be handled.
   *
   * @param username - The username of the user to be deleted.
   * @returns A promise that resolves to the result of the deletion operation.
   * @throws BadRequestException if the user does not exist or is a superuser.
   */
  async delete(username: string) {
    const user = await this.findOne(username);

    if (!user) {
      throw new BadRequestException({ message: UsersMessage.USER_NOT_FOUND });
    }

    if (user.isSuperuser) {
      throw new BadRequestException({
        message: UsersMessage.CANNOT_DELETE_SUPER,
      });
    }

    // TODO: Check relation with other entities before deleting

    return this.usersRepository.delete({ username });
  }
}
