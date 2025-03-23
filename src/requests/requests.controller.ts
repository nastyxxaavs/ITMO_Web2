import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  ValidationPipe,
  HttpCode,
  HttpStatus, NotFoundException, Render,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ClientRequestDto } from './dto/request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('request-add')
  @Render('request-add')
  async showForm(){
    return {};
  }

  @Post()
  //@Redirect('/requests')
  @Render('request-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createRequestDto: CreateRequestDto) {
    await this.requestsService.create(createRequestDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  @Render('requests')
  async findAll():Promise< { requests: ClientRequestDto[] }> {
    const requests = await this.requestsService.findAll();
    if (!requests) {
      throw new NotFoundException(`Requests are not found`);
    }
    return { requests };
  }

  @Get(':id')
  @Render('request')
  async findOne(@Param('id') id: number){ //: Promise< { request: ClientRequestDto }> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return {
      clientName: request.clientName,
      contactInfo: request.contactInfo,
      serviceRequested: request.serviceRequestedId,
      requestDate: request.requestDate,
      status: request.status,
    };
  }

  @Patch(':id')
  //@Redirect('/requests/:id')
  @Render('request-edit')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto) {
    if( await this.requestsService.update(+id, updateRequestDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
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
