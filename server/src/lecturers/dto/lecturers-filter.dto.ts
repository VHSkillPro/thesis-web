import { PickType } from '@nestjs/swagger';
import { UsersFilterDto } from '../../users/dto/user-filter.dto';

export class LecturersFilterDto extends PickType(UsersFilterDto, [
  'username',
  'fullname',
  'isActive',
  'page',
  'limit',
] as const) {}
