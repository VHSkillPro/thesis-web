import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TransformBoolean } from 'src/utils/transform';

export class CreateStudentDto {
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

  @IsNotEmpty()
  @TransformBoolean()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  course: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  className: string;
}
