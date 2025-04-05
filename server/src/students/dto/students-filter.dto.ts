import { PickType } from '@nestjs/swagger';
import { UsersFilterDto } from 'src/users/dto/user-filter.dto';

export class StudentsFilterDto extends PickType(UsersFilterDto, [
  'username',
  'fullname',
  'course',
  'className',
  'isActive',
  'page',
  'limit',
] as const) {}
