import { Injectable } from '@nestjs/common';
import { CreateHireRequestDto } from './dto/create-hire-request.dto';
import { UpdateHireRequestDto } from './dto/update-hire-request.dto';

@Injectable()
export class HireRequestsService {
  create(createHireRequestDto: CreateHireRequestDto) {
    return 'This action adds a new hireRequest';
  }

  findAll() {
    return `This action returns all hireRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hireRequest`;
  }

  update(id: number, updateHireRequestDto: UpdateHireRequestDto) {
    return `This action updates a #${id} hireRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} hireRequest`;
  }
}
