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
  ValidationPipe, NotFoundException, Render,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category } from './entities/service.entity';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  //@Redirect('/services')
  @Render('service-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createServiceDto: CreateServiceDto) {
    await this.serviceService.create(createServiceDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  @Render('services')
  async findAll():Promise<{
    services: {
      firmId: number;
      price: number;
      requestId: number;
      teamMemberNames: Promise<string[]>;
      userIds: number[];
      name: string;
      description: string;
      id: number;
      category: Category
    }[]
  }> {
    //return this.serviceService.findAll();
    const services = await this.serviceService.findAll();
    if (!services) {
      throw new NotFoundException(`Services are not found`);
    }
    return { services };
  }

  @Get(':id')
  @Render('service')
  async findOne(@Param('id') id: number){ //: Promise< { service: ServiceDto}> {
    //return this.serviceService.findOne(+id);
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return {
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
    };
  }

  @Patch(':id')
  //@Redirect('/services/:id')
  @Render('service-edit')
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
  //@Redirect('/services')
  @Render('services')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    //return this.serviceService.remove(+id);
    if (await this.serviceService.remove(+id)){
      const services = await this.serviceService.findAll();
      if (!services || services.length === 0) {
        throw new NotFoundException(`Services are not found`);
      }
      return { services,
        statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
