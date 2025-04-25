import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationFilterDto } from 'src/dto/filter.dto';
import { TransformBoolean } from 'src/utils/transform';

export class StudentsFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  course?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  className?: string;

  @IsOptional()
  @TransformBoolean()
  @IsBoolean()
  isActive?: boolean;
}
