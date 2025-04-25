import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { PaginationFilterDto } from 'src/dto/filter.dto';
import { TransformBoolean } from 'src/utils/transform';

export class UsersFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullname?: string;

  @IsOptional()
  @TransformBoolean()
  @IsBoolean()
  isSuperuser?: boolean;

  @IsOptional()
  @TransformBoolean()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^admin|lecturer|student$/, {
    message: "roleId must be one of 'admin', 'lecturer', or 'student'",
  })
  roleId?: string;
}
