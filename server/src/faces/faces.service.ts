import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Face } from './faces.entity';
import { Repository } from 'typeorm';
import { createReadStream, unlink } from 'fs';
import { join } from 'path';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { StudentsService } from 'src/students/students.service';
import { StudentsMessageError } from 'src/students/students.message';
import { AxiosError } from 'axios';
import * as pgvector from 'pgvector';
import { FacesMessageError } from './faces.message';

@Injectable()
export class FacesService {
  constructor(
    @InjectRepository(Face) private facesRepository: Repository<Face>,
    private studentsService: StudentsService,
    private readonly httpService: HttpService,
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

  /**
   * Validates if a card image and a selfie image belong to the same person by comparing their similarity score.
   *
   * @param card - The relative file path to the card image.
   * @param selfie - The relative file path to the selfie image.
   * @param threshold - The minimum similarity score (between 0 and 1) required to consider the images a match.
   * @returns A promise that resolves to `true` if the similarity score meets or exceeds the threshold, otherwise `false`.
   *
   * @throws Throws a `BadRequestException` for invalid data or an `InternalServerErrorException` for unexpected errors.
   */
  async checkCardAndSelfie(card: string, selfie: string, threshold: number) {
    const cardPath = join(__dirname, '..', '..', card);
    const selfiePath = join(__dirname, '..', '..', selfie);

    const form = new FormData();
    form.append('image_1', createReadStream(cardPath));
    form.append('image_2', createReadStream(selfiePath));
    form.append('pipeline', 'retinaface+arcface');

    const response$ = this.httpService
      .post('http://face:5000/api/verification', form, {
        headers: {
          ...form.getHeaders(),
        },
      })
      .pipe(
        catchError((error: AxiosError) => {
          if (error.response?.status === 400) {
            const data = error.response.data;
            throw new BadRequestException({
              message: (data as { errors: { image_2: string } })['errors'][
                'image_2'
              ],
            });
          }

          throw new InternalServerErrorException({
            message: 'Service face bị lỗi',
          });
        }),
      );

    const response = await firstValueFrom(response$);
    return response.data.similarity >= threshold;
  }

  /**
   * Retrieves the facial embedding for a given selfie image by sending it to an external face recognition service.
   *
   * @param selfie - The uploaded selfie file, provided as an `Express.Multer.File` object.
   * @returns A promise that resolves to the facial embedding data as an array of numbers.
   *
   * @throws {BadRequestException} If the external service returns a 400 status with an error related to the image.
   * @throws {InternalServerErrorException} If the external service encounters an unexpected error.
   */
  async getEmbedding(selfie: Express.Multer.File) {
    const selfiePath = join(__dirname, '..', '..', selfie.path);

    const form = new FormData();
    form.append('image', createReadStream(selfiePath));
    form.append('pipeline', 'yunet+sface');

    const response$ = this.httpService
      .post('http://face:5000/api/get_single', form, {
        headers: {
          ...form.getHeaders(),
        },
      })
      .pipe(
        catchError((error: AxiosError) => {
          if (error.response?.status === 400) {
            const data = error.response.data;
            throw new BadRequestException({
              message: (data as { errors: { image: string } })['errors'][
                'image'
              ],
            });
          }

          throw new InternalServerErrorException({
            message: 'Service face bị lỗi',
          });
        }),
      );

    const response = await firstValueFrom(response$);
    return response.data.face.embedding;
  }

  /**
   * Creates a new face record for a student by verifying the match between the student's card and the provided selfie.
   *
   * @param username - The username of the student.
   * @param selfie - The selfie file uploaded by the student, provided as an `Express.Multer.File` object.
   * @returns A promise that resolves to the result of the face record insertion into the repository.
   * @throws {NotFoundException} If the student is not found or the student's card path is not available.
   * @throws {BadRequestException} If the student's card and selfie do not match based on the threshold.
   * @throws {Error} If any other error occurs during the process.
   */
  async create(username: string, selfie: Express.Multer.File) {
    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    if (!student.cardPath) {
      throw new NotFoundException({
        message: StudentsMessageError.STUDENT_CARD_NOT_FOUND,
      });
    }

    try {
      const threshold = 0.352;
      const isMatch = await this.checkCardAndSelfie(
        student.cardPath,
        selfie.path,
        threshold,
      );

      if (!isMatch) {
        unlink(selfie.path, (err) => {});
        throw new BadRequestException({
          message: StudentsMessageError.STUDENT_CARD_SELFIE_NOT_MATCH,
        });
      }

      const embedding = await this.getEmbedding(selfie);
      const face = this.facesRepository.create({
        imagePath: selfie.path,
        embedding: pgvector.toSql(embedding),
        studentId: username,
      });

      return await this.facesRepository.insert(face);
    } catch (error) {
      unlink(selfie.path, (err) => {});
      throw error;
    }
  }

  /**
   * Deletes a face record associated with a student and removes the corresponding image file from the filesystem.
   *
   * @param username - The username of the student whose face record is to be deleted.
   * @param id - The unique identifier of the face record to be deleted.
   * @throws {NotFoundException} If the student is not found or the face record does not exist.
   * @throws {InternalServerErrorException} If there is an error deleting the image file from the filesystem.
   */
  async delete(username: string, id: number) {
    const student = await this.studentsService.findOne(username);
    if (!student) {
      throw new NotFoundException({
        message: StudentsMessageError.STUDENT_NOT_FOUND,
      });
    }

    const face = await this.facesRepository.findOne({
      where: { id: id, studentId: username },
    });

    if (!face) {
      throw new NotFoundException({
        message: FacesMessageError.FACE_NOT_FOUND,
      });
    }

    try {
      const facePath = join(__dirname, '..', '..', face.imagePath);
      const result = await this.facesRepository.delete(id);
      if (
        result.affected !== null &&
        result.affected !== undefined &&
        result.affected > 0
      ) {
        unlink(facePath, (err) => {
          if (err) {
            throw new InternalServerErrorException({
              message: 'Xóa ảnh không thành công',
            });
          }
        });
      }
    } catch (error) {}
  }
}
