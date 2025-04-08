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
  HttpStatus, NotFoundException, Render, Req, Sse, Res,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Status } from './entities/request.entity';
import { interval, map, mergeWith, Observable } from 'rxjs';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {
  }

  @Sse('request-events')
  sendEvents(@Res() res): Observable<MessageEvent> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    return interval(50000).pipe(
      map(() => ({ data: { type: 'heartbeat' } } as MessageEvent)),
      mergeWith(
        this.requestsService.getEventStream().pipe(
          map(data => ({ data } as MessageEvent))
        )
      ))
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
    this.requestsService.notifyRequestChange('Request added'); //SSE
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
      this.requestsService.notifyRequestChange('Request updated'); //SSE
      return {
        statusCode: HttpStatus.OK,
      }
    }
    this.requestsService.notifyRequestChange('Failed update');
    return {
      statusCode: HttpStatus.NOT_MODIFIED,
    }
  }

  @Get('/request-delete/:id')
  @Render('general')
  async showDeleteOpportunity(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "request-delete",
      titleContent: 'Удалить запрос',
      customStyle: '../styles/entity-edit.css',};
  }

  @Delete('/request-delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    if (await this.requestsService.remove(id)) {
      this.requestsService.notifyRequestChange('Request deleted'); //SSE
      return {
        statusCode: HttpStatus.OK,
      }
    }
    this.requestsService.notifyRequestChange('Failed delete');
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  // @Get('/request-delete/:id')
  // @HttpCode(HttpStatus.OK)
  // async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
  //   const isRemoved = await this.requestsService.remove(+id);
  //   if (isRemoved) {
  //     return {
  //       success: true,
  //       message: 'Contact deleted successfully'
  //     };
  //   } else {
  //     return {
  //       success: false,
  //       message: 'Contact not found or already deleted'
  //     };
  //   }
  // }
}