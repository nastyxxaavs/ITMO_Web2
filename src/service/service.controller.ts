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
import { PublicAccess, SuperTokensAuthGuard, VerifySession, Session as STSession } from 'supertokens-nestjs';
import { Request } from 'express';
import Session from 'supertokens-node/recipe/session';




@ApiExcludeController()
@Controller()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/service-add')
  @Render('general')
  async showContact(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'service-add',
      titleContent: 'Добавить сервис',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Post('/service-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createServiceDto: CreateServiceDto,
    @STSession() session: any,
  ) {
    const payload = session.getAccessTokenPayload();
    await this.serviceService.create(createServiceDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
    };
  }

  @PublicAccess()
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

  @PublicAccess()
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


  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/service-edit/:id')
  @Render('general')
  async showContactEdit(@Req() req: Request, @Param('id') id: string) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'service-edit',
      titleContent: 'Редактировать сервис',
      customStyle: '../styles/entity-edit.css',
    };
  }


  @UseGuards(SuperTokensAuthGuard)
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

  @UseGuards(SuperTokensAuthGuard)
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
