import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from 'src/dto/filter.dto';
import { TransformBoolean } from 'src/utils/transform';

export class UsersFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @TransformBoolean()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @TransformBoolean()
  @IsBoolean()
  isSuperuser?: boolean;
}
