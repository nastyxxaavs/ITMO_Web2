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
  async findAll():Promise<{
    customStyle: string;
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
    }[];
    content: string
  }> {
    const services = await this.serviceService.findAll();
    if (!services) {
      throw new NotFoundException(`Services are not found`);
    }
    return { services,
      content: "all_services",
      customStyle: '../styles/entities.css'};
  }

  // @Get(':id')
  // @Render('service')
  // async findOne(@Param('id') id: number){ //: Promise< { service: ServiceDto}> {
  //   //return this.serviceService.findOne(+id);
  //   const service = await this.serviceService.findOne(id);
  //   if (!service) {
  //     throw new NotFoundException(`Service with ID ${id} not found`);
  //   }
  //   return {
  //     name: service.name,
  //     description: service.description,
  //     category: service.category,
  //     price: service.price,
  //   };
  // }
  //
  // @Patch(':id')
  // //@Redirect('/services/:id')
  // @Render('service-edit')
  // @HttpCode(HttpStatus.OK)
  // @HttpCode(HttpStatus.NOT_MODIFIED)
  // async update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
  //   //return this.serviceService.update(+id, updateServiceDto);
  //   if( await this.serviceService.update(+id, updateServiceDto)){
  //     return { statusCode: HttpStatus.OK };
  //   }
  //   return { statusCode: HttpStatus.NOT_MODIFIED };
  // }
  //
  // @Delete(':id')
  // //@Redirect('/services')
  // @Render('services')
  // @HttpCode(HttpStatus.OK)
  // @HttpCode(HttpStatus.NOT_MODIFIED)
  // async remove(@Param('id') id: number) {
  //   //return this.serviceService.remove(+id);
  //   if (await this.serviceService.remove(+id)){
  //     const services = await this.serviceService.findAll();
  //     if (!services || services.length === 0) {
  //       throw new NotFoundException(`Services are not found`);
  //     }
  //     return { services,
  //       statusCode: HttpStatus.OK };
  //   }
  //   return { statusCode: HttpStatus.NOT_MODIFIED };
  // }
}
