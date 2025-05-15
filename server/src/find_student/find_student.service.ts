import { BadRequestException, Injectable } from '@nestjs/common';
import * as pgvector from 'pgvector';
import { FindStudentDto } from './dto/find-student.dto';
import { connectionSource } from 'src/config/typeorm';
import { ClassesService } from 'src/classes/classes.service';
import ClassesMessage from 'src/classes/classes.message';

@Injectable()
export class FindStudentService {
  constructor(private classesService: ClassesService) {}

  /**
   * Finds the most similar student based on the provided embedding.
   *
   * This method initializes the database connection if necessary, then queries the database
   * for the student whose face embedding is closest to the provided embedding using vector similarity.
   * It calculates the cosine similarity between the provided embedding and the matched student's embedding,
   * attaches the similarity score to the result, and removes the raw embedding from the returned object.
   *
   * @param findStudentDto - Data transfer object containing the embedding to search for.
   * @returns The matched student's information with a similarity score, or `null` if no match is found.
   */
  async findStudent(findStudentDto: FindStudentDto) {
    if (connectionSource.isInitialized === false) {
      await connectionSource.initialize();
    }

    const items = await connectionSource.query(
      `SELECT "user".username, "user".fullname, "user".course, "user".class_name, "user".is_active, face.embedding
      FROM face INNER JOIN "user" ON "user".username = face.student_id
      ORDER BY face.embedding <-> $1
      LIMIT 1`,
      [pgvector.toSql(findStudentDto.embedding)],
    );

    if (items.length === 0) {
      return null;
    }

    const studentEmbedding: number[] = pgvector.fromSql(items[0].embedding);
    var similarity = require('compute-cosine-similarity');
    const s = similarity(findStudentDto.embedding, studentEmbedding);
    items[0].similarity = s;

    delete items[0].embedding;
    return items[0];
  }

  /**
   * Finds the most similar student in a class based on a provided embedding.
   *
   * This method retrieves the class entity by its ID and throws a BadRequestException if not found.
   * It ensures the database connection is initialized, then queries for students in the specified class,
   * ordering them by vector similarity to the provided embedding. The most similar student is returned
   * with their similarity score, or `null` if no students are found.
   *
   * @param classId - The ID of the class to search within.
   * @param findStudentDto - Data transfer object containing the embedding to compare against.
   * @returns The most similar student object with a similarity score, or `null` if no match is found.
   * @throws BadRequestException if the class does not exist.
   */
  async findStudentByClassId(classId: string, findStudentDto: FindStudentDto) {
    const classEntity = await this.classesService.findOne(classId);
    if (!classEntity) {
      throw new BadRequestException({
        message: ClassesMessage.ERROR.NOT_FOUND,
      });
    }

    if (connectionSource.isInitialized === false) {
      await connectionSource.initialize();
    }

    const items = await connectionSource.query(
      `SELECT "user".username, "user".fullname, "user".course, "user".class_name, "user".is_active, face.embedding
      FROM face INNER JOIN "user" ON "user".username = face.student_id
                INNER JOIN student_class as sc ON sc.student_id = face.student_id
      WHERE sc.class_id = $1
      ORDER BY face.embedding <-> $2
      LIMIT 1`,
      [classId, pgvector.toSql(findStudentDto.embedding)],
    );

    if (items.length === 0) {
      return null;
    }

    const studentEmbedding: number[] = pgvector.fromSql(items[0].embedding);
    var similarity = require('compute-cosine-similarity');
    const s = similarity(findStudentDto.embedding, studentEmbedding);
    items[0].similarity = s;
    delete items[0].embedding;
    return items[0];
  }
}
