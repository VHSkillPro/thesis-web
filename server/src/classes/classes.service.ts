import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './classes.entity';
import { Repository } from 'typeorm';
import { ClassesFilterDto } from './dto/classes-filter.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classesRepository: Repository<Class>,
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
}
