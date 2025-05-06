import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
