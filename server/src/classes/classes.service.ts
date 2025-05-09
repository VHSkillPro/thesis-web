import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './classes.entity';
import { Repository } from 'typeorm';
import { ClassesFilterDto } from './dto/classes-filter.dto';
import { CreateClassDto } from './dto/create-class.dto';
import ClassesMessage from './classes.message';
import { UpdateClassDto } from './dto/update-class.dto';
import { LecturersService } from 'src/lecturers/lecturers.service';
import LecturersMessage from 'src/lecturers/lecturers.message';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classesRepository: Repository<Class>,
    private lecturersService: LecturersService,
  ) {}

  /**
   * Builds a query to retrieve all classes based on the provided filter criteria.
   *
   * @param classesFilter - An object containing filter criteria for querying classes.
   *   - `id` (optional): A partial or full ID of the class to filter by.
   *   - `name` (optional): A partial or full name of the class to filter by.
   *   - `lecturerId` (optional): A partial or full lecturer ID to filter by.
   *
   * @returns A query builder instance configured with the specified filter conditions.
   */
  private findAllQueryBuilder(classesFilter: ClassesFilterDto) {
    const query = this.classesRepository.createQueryBuilder('classes');
    const { id, name, lecturerId } = classesFilter;

    if (id) {
      query.andWhere('classes.id ILIKE :id', {
        id: `%${id}%`,
      });
    }

    if (name) {
      query.andWhere('classes.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    if (lecturerId) {
      query.andWhere('classes.lecturerId ILIKE :lecturerId', {
        lecturerId: `%${lecturerId}%`,
      });
    }

    query.orderBy('classes.lecturerId', 'ASC');
    return query;
  }

  /**
   * Counts the total number of classes that match the given filter criteria.
   *
   * @param classesFilter - An object containing the filter criteria for querying classes.
   * @returns A promise that resolves to the total count of matching classes.
   */
  async count(classesFilter: ClassesFilterDto) {
    const query = this.findAllQueryBuilder(classesFilter);
    return await query.getCount();
  }

  /**
   * Retrieves a paginated list of classes based on the provided filter criteria.
   *
   * @param classesFilter - An object containing filter criteria for querying classes.
   *   - `page`: The page number for pagination (1-based index).
   *   - `limit`: The maximum number of items to retrieve per page.
   * @returns A promise that resolves to an array of classes matching the filter criteria.
   */
  async findAll(classesFilter: ClassesFilterDto) {
    const query = this.findAllQueryBuilder(classesFilter);

    const { page, limit } = classesFilter;
    query.limit(limit);
    query.take((page - 1) * limit);

    return await query.getMany();
  }

  /**
   * Retrieves a single class entity by its unique identifier.
   *
   * @param id - The unique identifier of the class to retrieve.
   * @returns A promise that resolves to the class entity if found, or `null` if not found.
   */
  async findOne(id: string) {
    return await this.classesRepository.findOne({
      where: { id },
    });
  }

  /**
   * Creates a new class entry in the repository.
   *
   * @param classData - The data required to create a new class, adhering to the `CreateClassDto` structure.
   * @returns A promise that resolves to the result of the insertion operation.
   */
  async create(classData: CreateClassDto) {
    try {
      const newClass = this.classesRepository.create(classData);
      return await this.classesRepository.insert(newClass);
    } catch (error) {
      throw new InternalServerErrorException({
        message: ClassesMessage.ERROR.CREATE,
      });
    }
  }

  /**
   * Updates an existing class with the provided data.
   *
   * @param id - The unique identifier of the class to update.
   * @param classData - An object containing the updated class data.
   *   - `name` (optional): The new name of the class.
   *   - `lecturerId` (optional): The ID of the lecturer to associate with the class.
   *
   * @throws {BadRequestException} If the class with the given ID is not found.
   * @throws {BadRequestException} If the provided lecturer ID does not correspond to an existing lecturer.
   *
   * @returns A promise that resolves to the updated class entity.
   */
  async update(id: string, classData: UpdateClassDto) {
    try {
      const classToUpdate = await this.findOne(id);
      if (!classToUpdate) {
        throw new NotFoundException({
          message: ClassesMessage.ERROR.NOT_FOUND,
        });
      }

      // Update name if provided
      if (classData?.name) {
        classToUpdate.name = classData.name;
      }

      // Update lecturerId if provided
      if (classData?.lecturerId) {
        const lecturer = await this.lecturersService.findOne(
          classData.lecturerId,
        );
        if (!lecturer) {
          throw new BadRequestException({
            message: LecturersMessage.ERROR.NOT_FOUND,
          });
        }

        classToUpdate.lecturerId = classData.lecturerId;
      }

      return await this.classesRepository.update(id, classToUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: ClassesMessage.ERROR.UPDATE,
      });
    }
  }

  /**
   * Deletes a class by its unique identifier.
   *
   * This method first checks if the class exists by attempting to retrieve it.
   * If the class is not found, a `BadRequestException` is thrown with an appropriate error message.
   *
   * TODO: Implement logic to delete all students enrolled in the class before deleting the class itself.
   *
   * @param id - The unique identifier of the class to be deleted.
   * @returns A promise that resolves to the result of the deletion operation.
   * @throws BadRequestException if the class with the given ID is not found.
   */
  async delete(id: string) {
    try {
      const classToDelete = await this.findOne(id);
      if (!classToDelete) {
        throw new NotFoundException({
          message: ClassesMessage.ERROR.NOT_FOUND,
        });
      }

      return await this.classesRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: ClassesMessage.ERROR.DELETE,
      });
    }
  }
}
