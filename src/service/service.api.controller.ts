import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceDto } from './dto/service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FirmService } from '../firm/firm.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirmDto } from '../firm/dto/firm.dto';
import { NotFoundResponse } from '../common/response';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/user.entity';

@ApiTags('service')
@Controller()
export class ServiceApiController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/api/services')
  @ApiResponse({
    status: 200,
    description: 'Services was found.',
    type: [ServiceDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Services not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{
    total: number;
    links: string | null;
    services: ServiceDto[];
    page: number;
  }> {
    const skip = (page - 1) * limit;
    const [services, total] = await this.serviceService.findAllWithPagination(
      skip,
      limit,
    );

    if (!services) {
      throw new NotFoundException('No services found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage =
      page > 1 ? `${host}/api/services?page=${page - 1}&limit=${limit}` : null;
    const nextPage =
      page < totalPages
        ? `${host}/api/services?page=${page + 1}&limit=${limit}`
        : null;

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/api/services/:id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The service ID' })
  @ApiResponse({
    status: 200,
    description: 'The service was found.',
    type: ServiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    type: NotFoundResponse,
  })
  async findOne(@Param('id') id: number): Promise<ServiceDto> {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/api/services/:id/firm')
  @ApiOperation({ summary: 'Get a service`s firm by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The service ID' })
  @ApiResponse({
    status: 200,
    description: 'The firm was found.',
    type: FirmDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Firm not found',
    type: NotFoundResponse,
  })
  async findFirmForService(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  }> {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const firmId = service.firmId;
    const firm = await this.firmService.findOne(firmId);
    if (!firm) {
      throw new NotFoundException(`No firm associated with service ID ${id}`);
    }
    return firm;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/api/service-add')
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({
    status: 201,
    description: 'The service has been successfully created.',
    type: ServiceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/api/service-edit/:id')
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiParam({ name: 'id', type: Number, description: 'The service ID' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully updated.',
    type: ServiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    type: NotFoundResponse,
  })
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


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/api/service-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing service' })
  @ApiParam({ name: 'id', type: Number, description: 'The service ID' })
  @ApiResponse({
    status: 204,
    description: 'The service has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    type: NotFoundResponse,
  })
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.serviceService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}
