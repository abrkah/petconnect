import { PartialType } from '@nestjs/swagger';
import { CreateVaccinationRecordDto } from './create-vaccination-record.dto';

export class UpdateVaccinationRecordDto extends PartialType(CreateVaccinationRecordDto) {}
