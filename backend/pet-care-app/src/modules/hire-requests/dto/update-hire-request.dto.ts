import { PartialType } from '@nestjs/mapped-types';
import { CreateHireRequestDto } from './create-hire-request.dto';

export class UpdateHireRequestDto extends PartialType(CreateHireRequestDto) {}
