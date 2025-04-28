import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Render,
  Req,
  Res,
  Sse,
  ValidationPipe,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Status } from './entities/request.entity';
import { interval, map, mergeWith, Observable } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess, VerifySession, Session as STSession } from 'supertokens-nestjs';

@ApiExcludeController()
@Controller()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Sse('request-events')
  @VerifySession()
  sendEvents(@Res() res, @STSession() session): Observable<MessageEvent> {
    const payload = session.getAccessTokenPayload();
    const isAuthenticated = payload?.isAuthenticated;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log(`User is authenticated: ${isAuthenticated}`);

    return interval(50000).pipe(
      map(() => ({ data: { type: 'heartbeat' } }) as MessageEvent),
      mergeWith(
        this.requestsService
          .getEventStream()
          .pipe(map((data) => ({ data }) as MessageEvent)),
      ),
    );
  }

  @PublicAccess()
  @VerifySession()
  @Get('/request-add')
  @Render('general')
  showForm(@STSession() session: any) {
    const payload = session.getAccessTokenPayload();
    const result = {
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'request-add',
      titleContent: 'Добавить запрос',
      customStyle: '../styles/entity-add.css',
    };
    console.log('Render data:', result);
    return result;
  }

  @PublicAccess()
  @VerifySession()
  @Post('/request-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createRequestDto: CreateRequestDto,
    @STSession() session: any,
  ) {
    const payload = session.getAccessTokenPayload();
    await this.requestsService.create(createRequestDto);
    this.requestsService.notifyRequestChange('Request added'); //SSE
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
    };
  }

  @PublicAccess()
  @VerifySession()
  @Get('/requests')
  @Render('general')
  async findAll(@STSession() session: any): Promise<{
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
      status: Status;
    }[];
    user: string | null;
    content: string;
    alertMessage?: string;
  }> {
    const payload = session.getAccessTokenPayload();
    const requests = await this.requestsService.findAll();
    if (!requests) {
      return {
        isAuthenticated: payload.isAuthenticated,
        user: payload.username,
        requests,
        content: 'requests',
        titleContent: 'Список запросов',
        customStyle: '../styles/entities.css',
        alertMessage: 'Запросы не найдены',
      };
    }
    return {
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      requests,
      content: 'requests',
      titleContent: 'Список запросов',
      customStyle: '../styles/entities.css',
    };
  }

  @PublicAccess()
  @Get('/requests/:id')
  @Render('general')
  async findOne(@Param('id') id: number) {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      return {
        content: 'request',
        titleContent: 'Требуемый запрос',
        customStyle: '../styles/entity-info.css',
        alertMessage: 'Запрос не найден',
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

  @PublicAccess()
  @VerifySession()
  @Get('/request-edit/:id')
  @Render('general')
  showEditForm(@STSession() session: any, @Param('id') id: string) {
    const payload = session.getAccessTokenPayload();
    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'request-edit',
      titleContent: 'Редактировать запрос',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @PublicAccess()
  @Patch('/request-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    if (await this.requestsService.update(+id, updateRequestDto)) {
      this.requestsService.notifyRequestChange('Request updated'); //SSE
      return {
        statusCode: HttpStatus.OK,
      };
    }
    this.requestsService.notifyRequestChange('Failed update');
    return {
      statusCode: HttpStatus.NOT_MODIFIED,
    };
  }

  @PublicAccess()
  @VerifySession()
  @Get('/request-delete/:id')
  @Render('general')
  async showDeleteOpportunity(@STSession() session: any, @Param('id') id: string) {
    const payload = session.getAccessTokenPayload();
    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'request-delete',
      titleContent: 'Удалить запрос',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @PublicAccess()
  @Delete('/request-delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    if (await this.requestsService.remove(id)) {
      this.requestsService.notifyRequestChange('Request deleted'); //SSE
      return {
        statusCode: HttpStatus.OK,
      };
    }
    this.requestsService.notifyRequestChange('Failed delete');
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}