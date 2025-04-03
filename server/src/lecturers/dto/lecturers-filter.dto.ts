import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationFilterDto } from 'src/dto/filter.dto';

export class LecturersFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name: string;
}
