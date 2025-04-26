import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Render,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceDto } from './dto/service.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/user.entity';

@ApiExcludeController()
@Controller()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/service-add')
  @Render('general')
  showContact(@Req() req) {
    return {
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: 'service-add',
      titleContent: 'Добавить сервис',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post('/service-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createServiceDto: CreateServiceDto,
    @Req() req,
  ) {
    await this.serviceService.create(createServiceDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/all-services')
  @Render('general')
  async findAll(): Promise<{
    customStyle: string;
    services: ServiceDto[];
    content: string;
    alertMessage?: string;
  }> {
    const services = await this.serviceService.findAll();
    if (!services) {
      return {
        services,
        content: 'all_services',
        customStyle: '../styles/entities.css',
        alertMessage: 'Сервисы не найдены',
      };
    }
    return {
      services,
      content: 'all_services',
      customStyle: '../styles/entities.css',
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/services/:id')
  @Render('general')
  async findOne(@Param('id') id: number) {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      return {
        content: 'service',
        customStyle: '../styles/entity-info.css',
        alertMessage: 'Сервис не найден',
      };
    }
    return {
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      content: 'service',
      customStyle: '../styles/entity-info.css',
    };
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('/service-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    return {
      id,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: 'service-edit',
      titleContent: 'Редактировать сервис',
      customStyle: '../styles/entity-edit.css',
    };
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('/service-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    if (await this.serviceService.update(id, updateServiceDto)) {
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('/service-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.serviceService.remove(+id);
    if (isRemoved) {
      return {
        success: true,
        message: 'Contact deleted successfully',
      };
    } else {
      return {
        success: false,
        message: 'Contact not found or already deleted',
      };
    }
  }
}
