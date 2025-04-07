import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ClientRequestDto } from './dto/request.dto';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';


@Controller()
export class RequestsApiController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('/api/requests')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
  ): Promise<{
    total: number;
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
    page: number
  }> {
    const skip = (page - 1) * limit;
    const [requests, total] = await this.requestsService.findAllWithPagination(
      skip,
      limit,
    );

    if (!requests) {
      throw new NotFoundException('No requests found');
    }

    return {
      requests,
      total,
      page,
    };
  }

  @Get('/api/requests/:id')
  async findOne(@Param('id') id: number): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  @Post('/api/request-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createRequestsDto: CreateRequestDto,
  ): Promise<ClientRequestEntity> {
    try {
      return await this.requestsService.create(createRequestsDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/request-edit/:id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateRequestDto: UpdateRequestDto,
  ): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }> {
    const updatedRequest = await this.requestsService.apiUpdate(
      id,
      updateRequestDto,
    );
    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return updatedRequest;
  }


  @Delete('/api/request-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.requestsService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
