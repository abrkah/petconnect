import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HireRequestsService } from './hire-requests.service';
import { HireRequestsController } from './hire-requests.controller';
import { HireRequest } from './entities/hire-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HireRequest])],
  controllers: [HireRequestsController],
  providers: [HireRequestsService],
  exports: [HireRequestsService],
})
export class HireRequestsModule {}
