// pricing-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/pricing-plan.entity'; 
import { PlanService } from './pricing.service.spec'; 
import { PlanController } from './pricing.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService], // Optional: if used in other modules
})
export class PricingPlanModule {}
