import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLecturerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastname: string;
}
