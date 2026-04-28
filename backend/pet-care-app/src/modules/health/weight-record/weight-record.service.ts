import { Injectable } from '@nestjs/common';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpdateWeightRecordDto } from './dto/update-weight-record.dto';

@Injectable()
export class WeightRecordService {
  create(createWeightRecordDto: CreateWeightRecordDto) {
    return 'This action adds a new weightRecord';
  }

  findAll() {
    return `This action returns all weightRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weightRecord`;
  }

  update(id: number, updateWeightRecordDto: UpdateWeightRecordDto) {
    return `This action updates a #${id} weightRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} weightRecord`;
  }
}
