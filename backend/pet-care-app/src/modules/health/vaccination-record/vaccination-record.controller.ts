import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VaccinationRecordService } from './vaccination-record.service';
import { CreateVaccinationRecordDto } from './dto/create-vaccination-record.dto';
import { UpdateVaccinationRecordDto } from './dto/update-vaccination-record.dto';

@Controller('vaccination-record')
export class VaccinationRecordController {
  constructor(private readonly vaccinationRecordService: VaccinationRecordService) {}

  @Post()
  create(@Body() createVaccinationRecordDto: CreateVaccinationRecordDto) {
    return this.vaccinationRecordService.create(createVaccinationRecordDto);
  }

  @Get()
  findAll() {
    return this.vaccinationRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vaccinationRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVaccinationRecordDto: UpdateVaccinationRecordDto) {
    return this.vaccinationRecordService.update(+id, updateVaccinationRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaccinationRecordService.remove(+id);
  }
}
