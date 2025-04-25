import { CreateClassDto } from './create-class.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateClassDto extends PartialType(
  OmitType(CreateClassDto, ['id'] as const),
) {}
