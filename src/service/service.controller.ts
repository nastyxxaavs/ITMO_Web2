import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UserDto } from '../user/dto/user.dto';
import { ServiceDto } from './dto/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Redirect('/services')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createServiceDto: CreateServiceDto) {
    await this.serviceService.create(createServiceDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  async findAll():Promise<ServiceDto[]> {
    //return this.serviceService.findAll();
    const services = await this.serviceService.findAll();
    if (!services) {
      throw new NotFoundException(`Services are not found`);
    }
    return services;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ServiceDto> {
    //return this.serviceService.findOne(+id);
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @Patch(':id')
  @Redirect('/services/:id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    //return this.serviceService.update(+id, updateServiceDto);
    if( await this.serviceService.update(+id, updateServiceDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  @Redirect('/services')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    //return this.serviceService.remove(+id);
    if (await this.serviceService.remove(+id)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
