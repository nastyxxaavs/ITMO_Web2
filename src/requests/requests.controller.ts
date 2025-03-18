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
  HttpStatus, NotFoundException,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UserDto } from '../user/dto/user.dto';
import { ClientRequestDto } from './dto/request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @Redirect('/requests')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createRequestDto: CreateRequestDto) {
    await this.requestsService.create(createRequestDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  async findAll():Promise<ClientRequestDto[]> {
    const requests = await this.requestsService.findAll();
    if (!requests) {
      throw new NotFoundException(`Requests are not found`);
    }
    return requests;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ClientRequestDto> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  @Patch(':id')
  @Redirect('/requests/:id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto) {
    if( await this.requestsService.update(+id, updateRequestDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  @Redirect('/requests')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    if (await this.requestsService.remove(+id)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
