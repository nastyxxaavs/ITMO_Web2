import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus, NotFoundException, Render, Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Status } from './entities/request.entity';

@Controller()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {
  }

  @Get('/request-add')
  @Render('general')
  showForm(@Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);
    const result = {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "request-add",
      titleContent: 'Добавить запрос',
      customStyle: '../styles/entity-add.css',
    };
    console.log('Render data:', result);
    return result
  }

  @Post('/request-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createRequestDto: CreateRequestDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    await this.requestsService.create(createRequestDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated,
    };
  }

  @Get('/requests')
  @Render('general')
  async findAll(@Req() req):Promise<{
    customStyle: string;
    titleContent: string;
    isAuthenticated: any;
    requests: {
      firmId: number | undefined;
      contactInfo: string;
      clientName: string;
      requestDate: Date;
      id: number;
      userId: number | undefined;
      teamMemberName: string | undefined;
      serviceRequested: string | undefined;
      status: Status
    }[];
    user: string | null;
    content: string;
    alertMessage?: string
  }> {
    const isAuthenticated = req.session.isAuthenticated;
    const requests = await this.requestsService.findAll();
    if (!requests) {
      return {
        isAuthenticated,
        user: isAuthenticated ? 'Anastasia' : null,
        requests,
        content: 'requests',
        titleContent: 'Список запросов',
        customStyle: '../styles/entities.css',
        alertMessage: "Запросы не найдены",};
    }
    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      requests,
      content: 'requests',
      titleContent: 'Список запросов',
      customStyle: '../styles/entities.css', };
  }

  @Get('/requests/:id')
  @Render('general')
  async findOne(@Param('id') id: number){
    const request = await this.requestsService.findOne(id);
    if (!request) {
      return {
        content: 'request',
        titleContent: 'Требуемый запрос',
        customStyle: '../styles/entity-info.css',
        alertMessage: "Запрос не найден",
      };
    }
    return {
      clientName: request.clientName,
      contactInfo: request.contactInfo,
      serviceRequested: request.serviceRequested,
      requestDate: request.requestDate,
      status: request.status,
      content: 'request',
      titleContent: 'Требуемый запрос',
      customStyle: '../styles/entity-info.css',
    };
  }

  @Get('/request-edit/:id')
  @Render('general')
  showEditForm(@Req() req, @Param('id') id: string){
    const isAuthenticated = req.session.isAuthenticated;
    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: 'request-edit',
      titleContent: 'Редактировать запрос',
      customStyle: '../styles/entity-edit.css',
    };
  }


  @Patch('/request-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto) {
    if (await this.requestsService.update(+id, updateRequestDto)) {
      return {
        statusCode: HttpStatus.OK,
      }
    }
    return {
      statusCode: HttpStatus.NOT_MODIFIED,
    }
  }

  @Get('/request-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.requestsService.remove(+id);
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