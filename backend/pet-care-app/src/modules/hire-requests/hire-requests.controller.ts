import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HireRequestsService } from './hire-requests.service';
import { CreateHireRequestDto } from './dto/create-hire-request.dto';
import { UpdateHireRequestDto } from './dto/update-hire-request.dto';

@Controller('hire-requests')
export class HireRequestsController {
  constructor(private readonly hireRequestsService: HireRequestsService) {}

  @Post()
  create(@Body() createHireRequestDto: CreateHireRequestDto) {
    return this.hireRequestsService.create(createHireRequestDto);
  }

  @Get()
  findAll() {
    return this.hireRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hireRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHireRequestDto: UpdateHireRequestDto) {
    return this.hireRequestsService.update(+id, updateHireRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hireRequestsService.remove(+id);
  }
}
