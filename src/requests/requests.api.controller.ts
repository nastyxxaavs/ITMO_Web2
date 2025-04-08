import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
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
import { FirmService } from '../firm/firm.service';


@Controller()
export class RequestsApiController {
  constructor(private readonly requestsService: RequestsService, private readonly firmService: FirmService) {}

  @Get('/api/requests')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{
    total: number;
    links: string | null;
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

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/requests?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/requests?page=${page + 1}&limit=${limit}` : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      requests,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
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


  @Get('/api/requests/:id/firm')
  async findFirmForRequest(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    const firmId = request.firmId;
    const firm = await this.firmService.findOne(firmId);
    if (!firm) {
      throw new NotFoundException(`No firm associated with request ID ${id}`);
    }
    return firm;
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
