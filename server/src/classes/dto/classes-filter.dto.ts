import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationFilterDto } from 'src/dto/filter.dto';

export class ClassesFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  lecturerId?: string;
}
