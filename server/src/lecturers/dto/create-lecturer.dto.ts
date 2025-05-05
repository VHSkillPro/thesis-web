import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TransformBoolean } from 'src/utils/transform';

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

  @IsNotEmpty()
  @TransformBoolean()
  @IsBoolean()
  isActive: boolean;
}
