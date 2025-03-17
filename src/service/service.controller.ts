import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Redirect('/services')
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  @Redirect('/services/:id')
  async update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @Redirect('/services')
  async remove(@Param('id') id: number) {
    return this.serviceService.remove(+id);
  }
}
