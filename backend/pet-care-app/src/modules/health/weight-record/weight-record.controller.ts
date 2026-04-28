import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeightRecordService } from './weight-record.service';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpdateWeightRecordDto } from './dto/update-weight-record.dto';

@Controller('weight-record')
export class WeightRecordController {
  constructor(private readonly weightRecordService: WeightRecordService) {}

  @Post()
  create(@Body() createWeightRecordDto: CreateWeightRecordDto) {
    return this.weightRecordService.create(createWeightRecordDto);
  }

  @Get()
  findAll() {
    return this.weightRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weightRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeightRecordDto: UpdateWeightRecordDto) {
    return this.weightRecordService.update(+id, updateWeightRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weightRecordService.remove(+id);
  }
}
