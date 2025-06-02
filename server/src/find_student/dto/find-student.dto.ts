import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindStudentDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  embedding: number[];
}
