import { Test, TestingModule } from '@nestjs/testing';
import { HireRequestsController } from './hire-requests.controller';
import { HireRequestsService } from './hire-requests.service';

describe('HireRequestsController', () => {
  let controller: HireRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HireRequestsController],
      providers: [HireRequestsService],
    }).compile();

    controller = module.get<HireRequestsController>(HireRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
