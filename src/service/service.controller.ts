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
  ValidationPipe, NotFoundException, Render, Req,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category } from './entities/service.entity';
import { ServiceDto } from './dto/service.dto';

@Controller()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('/service-add')
  @Render('general')
  showContact(@Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "service-add",
      titleContent: 'Добавить сервис',
      customStyle: '../styles/entity-add.css',
    };
  }

  @Post('/service-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createServiceDto: CreateServiceDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
      return { statusCode: HttpStatus.UNAUTHORIZED, content: 'unauthorized' };
    }

    await this.serviceService.create(createServiceDto);
    return {
      statusCode: HttpStatus.CREATED,
    isAuthenticated,
    };
  }

  @Get('/all-services')
  @Render('general')
  async findAll():Promise<{ customStyle: string; services: ServiceDto[]; content: string; alertMessage?: string }> {
    const services = await this.serviceService.findAll();
    if (!services) {
      return { services,
        content: "all_services",
        customStyle: '../styles/entities.css',
        alertMessage: "Сервисы не найдены",};
    }
    return { services,
      content: "all_services",
      customStyle: '../styles/entities.css'};
  }

  @Get('/services/:id')
  @Render('general')
  async findOne(@Param('id') id: number){
    const service = await this.serviceService.findOne(id);
    if (!service) {
      return {
        content: "service",
        customStyle: '../styles/entity-info.css',
        alertMessage: "Сервис не найден",
      };
    }
    return {
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      content: "service",
      customStyle: '../styles/entity-info.css',
    };
  }


  @Get('/service-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "service-edit",
      titleContent: 'Редактировать сервис',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @Patch('/service-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    if( await this.serviceService.update(id, updateServiceDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Get('/service-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.serviceService.remove(+id);
    if (isRemoved) {
      return {
        success: true,
        message: 'Contact deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Contact not found or already deleted'
      };
    }
  }
}
