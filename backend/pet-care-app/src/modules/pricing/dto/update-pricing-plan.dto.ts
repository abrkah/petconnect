// update-plan.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-pricing-plan.dto'; 

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
