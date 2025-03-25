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
  constructor(private readonly requestsService: RequestsService) {}

  @Get('/request-add')
  @Render('general')
  showForm(@Req() req){
    const isAuthenticated = req.session.isAuthenticated;
    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: 'request-add',
      titleContent: 'Добавить запрос',
      customStyle: 'styles/entities/request-add.css',
    };
  }

  @Post()
  @Render('general')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createRequestDto: CreateRequestDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
      return { statusCode: HttpStatus.UNAUTHORIZED, content: 'unauthorized' };
    }
    await this.requestsService.create(createRequestDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: 'request-add',
      titleContent: 'Запрос добавлен',
      customStyle: 'styles/entities/request-add.css',
    };
  }

  @Get('/requests')
  @Render('general')
  async findAll(@Req() req):Promise<{
    customStyle: string;
    titleContent: string;
    isAuthenticated: any;
    requests: {
      firmId: number;
      contactInfo: string;
      clientName: string;
      requestDate: Date;
      id: number;
      userId: number;
      teamMemberName: string;
      serviceRequested: string;
      status: Status
    }[];
    user: string | null;
    content: string
  }> {
    const isAuthenticated = req.session.isAuthenticated;
    const requests = await this.requestsService.findAll();
    if (!requests) {
      throw new NotFoundException(`Requests are not found`);
    }
    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      requests,
      content: 'requests',
      titleContent: 'Список запросов',
      customStyle: 'styles/entities/requests.css', };
  }

  @Get('/request:id')
  @Render('general')
  async findOne(@Param('id') id: number){ //: Promise< { request: ClientRequestDto }> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return {
      clientName: request.clientName,
      contactInfo: request.contactInfo,
      serviceRequested: request.serviceRequested,
      requestDate: request.requestDate,
      status: request.status,
      content: 'request',
      titleContent: 'Требуемый запрос',
      customStyle: 'styles/entities/request.css',
    };
  }

  // @Get('/request-edit')
  // @Render('general')
  // showEditForm(@Req() req){
  //   const isAuthenticated = req.session.isAuthenticated;
  //   return {
  //     isAuthenticated,
  //     user: isAuthenticated ? 'Anastasia' : null,
  //     content: 'request-edit',
  //     titleContent: 'Добавить запрос',
  //     customStyle: 'styles/entities/request-edit.css',
  //   };
  // }


  @Patch('/request-edit:id')
  @Render('general')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto) {
    if( await this.requestsService.update(+id, updateRequestDto)){
      return { statusCode: HttpStatus.OK,
        content: 'request-edit',
        titleContent: 'Редактирование запроса',
        customStyle: 'styles/entities/request-edit.css',};
    }
    return { statusCode: HttpStatus.NOT_MODIFIED,
      content: 'request-edit',
      titleContent: 'Редактирование запроса',
      customStyle: 'styles/entities/request-edit.css'};
  }

  @Delete('/request:id')
  //@Redirect('/requests')
  @Render('requests')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    if (await this.requestsService.remove(+id)){
      const requests = await this.requestsService.findAll();
      if (!requests || requests.length === 0) {
        throw new NotFoundException(`Requests are not found`);
      }
      return { requests,
        statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
