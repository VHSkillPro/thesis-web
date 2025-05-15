import { Face } from 'src/faces/faces.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as pgvector from 'pgvector';
import { FindStudentDto } from './dto/find-student.dto';
import { connectionSource } from 'src/config/typeorm';

// interface;

@Injectable()
export class FindStudentService {
  constructor(
    @InjectRepository(Face) private facesRepository: Repository<Face>,
  ) {}

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
}
