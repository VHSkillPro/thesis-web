import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLecturerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fullname: string;
}
