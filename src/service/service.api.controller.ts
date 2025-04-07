import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceDto } from './dto/service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';


@Controller()
export class ServiceApiController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('/api/services')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{ total: number; links: string | null; services: ServiceDto[]; page: number }> {
    const skip = (page - 1) * limit;
    const [services, total] = await this.serviceService.findAllWithPagination(
      skip,
      limit,
    );

    if (!services) {
      throw new NotFoundException('No services found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/services?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/services?page=${page + 1}&limit=${limit}` : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      services,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
    };
  }


  @Get('/api/services/:id')
  async findOne(@Param('id') id: number): Promise<ServiceDto> {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @Post('/api/service-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createServiceDto: CreateServiceDto,
  ): Promise<ServiceDto> {
    try {
      return await this.serviceService.create(createServiceDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/service-edit/:id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceDto> {
    const updatedService = await this.serviceService.apiUpdate(
      id,
      updateServiceDto,
    );
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  }


  @Delete('/api/service-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.serviceService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}
