import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Face } from './faces.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacesService {
  constructor(
    @InjectRepository(Face) private facesRepository: Repository<Face>,
  ) {}

  /**
   * Retrieves all face entities associated with a specific student's username.
   *
   * @param username - The username of the student whose face entities are to be retrieved.
   * @returns A promise that resolves to an array of face entities matching the specified username. If no entities are found, it returns an empty array.
   */
  async findAll(username: string) {
    return await this.facesRepository
      .createQueryBuilder('face')
      .where('face.student_id = :username', { username })
      .getMany();
  }

  /**
   * Retrieves a single face entity from the repository based on the provided ID.
   *
   * @param id - The unique identifier of the face entity to retrieve.
   * @returns A promise that resolves to the face entity if found, or `null` if not found.
   */
  async findOne(id: number) {
    // Using a simpler 'where' clause to filter by the face entity's ID
    return await this.facesRepository.findOne({
      where: { id },
    });
  }
}
