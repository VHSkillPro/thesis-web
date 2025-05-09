import { Repository } from 'typeorm';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersFilterDto } from './dto/user-filter.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import UsersMessage from './users.message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Constructs a query builder for retrieving users based on the provided filter criteria.
   *
   * @param usersFilter - An object containing the filter criteria for querying users.
   *   - `username` (optional): A partial or full username to search for (case-insensitive).
   *   - `fullname` (optional): A partial or full fullname to search for (case-insensitive).
   *   - `isActive` (optional): A boolean indicating whether to filter by active users.
   *   - `isSuperuser` (optional): A boolean indicating whether to filter by superusers.
   *   - `roleId` (optional): The ID of the role to filter users by.
   *
   * @returns A query builder instance configured with the specified filters.
   */
  private findAllQueryBuilder(usersFilter: UsersFilterDto) {
    const query = this.usersRepository.createQueryBuilder('user');
    const { username, fullname, isActive, isSuperuser, roleId } = usersFilter;

    if (username) {
      query.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (fullname) {
      query.andWhere('user.fullname ILIKE :fullname', {
        fullname: `%${fullname}%`,
      });
    }

    if (isSuperuser !== undefined) {
      query.andWhere('user.isSuperuser = :isSuperuser', { isSuperuser });
    }

    if (isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive });
    }

    if (roleId) {
      query.andWhere('user.roleId = :roleId', { roleId: roleId });
    }

    query.orderBy('user.username', 'ASC');
    return query;
  }

  /**
   * Counts the number of users that match the specified filter criteria.
   *
   * @param usersFilter - An object containing the filter criteria for querying users.
   * @returns A promise that resolves to the total count of users matching the filter.
   */
  async count(usersFilter: UsersFilterDto) {
    const query = this.findAllQueryBuilder(usersFilter);
    return await query.getCount();
  }

  /**
   * Retrieves a list of users based on the provided filter criteria.
   *
   * @param usersFilter - An object containing filtering options such as pagination and other criteria.
   * @returns A promise that resolves to an array of users matching the filter criteria.
   *
   * @remarks
   * - The method uses a query builder to construct the query dynamically based on the filter options.
   * - Pagination is applied using the `page` and `limit` properties from the `usersFilter` object.
   * - The `limit` specifies the maximum number of users to retrieve per page.
   * - The `page` determines the offset for the query, calculated as `(page - 1) * limit`.
   */
  async findAll(usersFilter: UsersFilterDto) {
    const query = this.findAllQueryBuilder(usersFilter);
    const { page, limit } = usersFilter;
    query.limit(limit).take((page - 1) * limit);
    return await query.getMany();
  }

  /**
   * Retrieves a single user by their username.
   *
   * @param username - The username of the user to find.
   * @returns A promise that resolves to the user object if found, or `null` if no user exists with the given username.
   */
  async findOne(username: string) {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  /**
   * Changes the password of a user.
   *
   * @param username - The username of the user whose password is to be changed.
   * @param formData - An object containing the old password and the new password.
   * @throws {NotFoundException} If the user with the given username is not found.
   * @throws {BadRequestException} If the provided old password does not match the user's current password.
   * @throws {InternalServerErrorException} If an unexpected error occurs during the password change process.
   * @returns A promise that resolves to the updated user entity after the password has been successfully changed.
   */
  async changePassword(username: string, formData: ChangePasswordDto) {
    try {
      const user = await this.findOne(username);
      if (!user) {
        throw new NotFoundException({
          message: UsersMessage.ERROR.NOT_FOUND,
        });
      }

      if (!(await bcrypt.compare(formData.oldPassword, user.password))) {
        throw new BadRequestException({
          message: UsersMessage.ERROR.WRONG_PASSWORD,
        });
      }

      user.password = await bcrypt.hash(formData.password, 10);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException({
        message: UsersMessage.ERROR.CHANGE_PASSWORD,
      });
    }
  }
}
